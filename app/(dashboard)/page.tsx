"use client"

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    Target, Clock, RotateCcw,
    CheckCircle2, Flame, Activity, Zap
} from "lucide-react";
import { ForgeLevelBadge } from "@/components/shared/ForgeLevelBadge";
import { initialHabits, scheduleData, days, ScheduleBlock } from "@/lib/data";
import { calculateIdentityState, calculateBurnoutRisk, DailyIdentity } from "@/lib/v2-logic";

// Daily rotating quotes
const QUOTES = [
    "3AM while the world sleeps. First class while others cram. Composed while others perform. Nobody sees the work. Everyone sees the result.",
    "The man who wakes at 3AM owns the day before it begins. Every rep competes with comfort. Choose the rep.",
    "Discipline is choosing what you want most over what you want now. First class. Every day.",
    "You are one decision away from a completely different life. Make the decision. Every morning.",
    "The forge doesn't care how you feel. Show up. Get shaped. That is the path.",
    "Silence is the weapon of the man who is building. Let the result speak first.",
    "Hunger beats talent. Talent beats skill. Skill beats luck. Hunger beats everything.",
];
function getDailyQuote() {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const day = Math.floor((Date.now() - start.getTime()) / 86400000);
    return QUOTES[day % QUOTES.length];
}

// Current Schedule Block Calculator
function getCurrentScheduleBlock(): ScheduleBlock | null {
    const now = new Date();
    const adjustedDayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const currentDayStr = days[adjustedDayIndex];
    const daySchedule = scheduleData[currentDayStr];
    if (!daySchedule) return null;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < daySchedule.blocks.length; i++) {
        const b = daySchedule.blocks[i];

        const isPM = b.time.includes("PM");
        const isAM = b.time.includes("AM");
        const [hStr, mStr] = b.time.replace("AM", "").replace("PM", "").split(":");
        let h = parseInt(hStr);
        const m = parseInt(mStr || "0");

        if (isPM && h !== 12) h += 12;
        if (isAM && h === 12) h = 0;

        const startMins = h * 60 + m;

        let durMins = 0;
        if (b.dur.endsWith("m")) durMins = parseInt(b.dur.replace("m", ""));
        else if (b.dur.endsWith("h")) durMins = parseInt(b.dur.replace("h", "")) * 60;

        const endMins = startMins + durMins;

        if (currentMinutes >= startMins && currentMinutes < endMins) {
            return b;
        }
    }
    return null;
}

// 18th Birthday countdown — update BIRTHDAY to your real date
const BIRTHDAY = new Date("2008-05-27T00:00:00");
function getBirthdayCountdown() {
    const now = new Date();
    const eighteenth = new Date(BIRTHDAY);
    eighteenth.setFullYear(BIRTHDAY.getFullYear() + 18);
    if (eighteenth <= now) eighteenth.setFullYear(eighteenth.getFullYear() + 1);
    const diff = eighteenth.getTime() - now.getTime();
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
    };
}

export default function OverviewPage() {
    const [stats, setStats] = useState({
        habits: "0 / 13",
        streak: "0%",
        topics: "0 / 41",
        trades: "0",
        goals: "0%"
    });

    const [pillarProgress, setPillarProgress] = useState([0, 0, 0, 0, 0, 0]);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [weekCount, setWeekCount] = useState(0);
    const [countdown, setCountdown] = useState(getBirthdayCountdown());
    const [quote] = useState(getDailyQuote());
    const [currentBlock, setCurrentBlock] = useState<ScheduleBlock | null>(null);
    const [identity, setIdentity] = useState<DailyIdentity>("Builder");
    const [burnout, setBurnout] = useState({ score: 0, indicator: "Green" });
    const [energy, setEnergy] = useState("medium");

    useEffect(() => {
        // Run once on mount to avoid hydration mismatch
        setCurrentBlock(getCurrentScheduleBlock());
        const id = setInterval(() => setCurrentBlock(getCurrentScheduleBlock()), 60000);
        return () => clearInterval(id);
    }, []);

    // Tick the birthday countdown every minute
    useEffect(() => {
        const id = setInterval(() => setCountdown(getBirthdayCountdown()), 60000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        // --- Start Date ---
        const savedStart = localStorage.getItem("emmanuel_start_date");
        if (savedStart) {
            setStartDate(savedStart);
            const start = new Date(savedStart);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setWeekCount(Math.max(1, Math.ceil(diffDays / 7)));
        }

        // --- Habits & Streak ---
        const savedHabits = localStorage.getItem("emmanuel_habits");
        const habitsData = savedHabits ? JSON.parse(savedHabits) : {};

        const todayStr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()];
        const checkedToday = Object.keys(habitsData).filter(k => k.endsWith(`-${todayStr}`) && habitsData[k]).length;

        let totalChecked = 0;
        Object.values(habitsData).forEach(v => { if (v) totalChecked++; });
        const totalSlots = initialHabits.length * 7;
        const streakPct = totalSlots > 0 ? Math.round((totalChecked / totalSlots) * 100) : 0;

        setStats(prev => ({
            ...prev,
            habits: `${checkedToday} / ${initialHabits.length}`,
            streak: `${streakPct}%`
        }));

        // --- Trades ---
        const savedTrades = localStorage.getItem("emmanuel_trades");
        if (savedTrades) {
            const trades = JSON.parse(savedTrades);
            setStats(prev => ({ ...prev, trades: trades.length.toString() }));
        }

        // --- v2: Pillar XP & Identity ---
        const pillarXpMap: Record<string, number> = {
            Technical: parseInt(localStorage.getItem("emmanuel_pillar_Technical") || "0"),
            Math: parseInt(localStorage.getItem("emmanuel_pillar_Math") || "0"),
            Finance: parseInt(localStorage.getItem("emmanuel_pillar_Finance") || "0"),
            Athletics: parseInt(localStorage.getItem("emmanuel_pillar_Athletics") || "0"),
            Social: parseInt(localStorage.getItem("emmanuel_pillar_Social") || "0"),
            Spirit: parseInt(localStorage.getItem("emmanuel_pillar_Spirit") || "0"),
        };
        const idState = calculateIdentityState(pillarXpMap);
        setIdentity(idState);

        const pProgs = Object.values(pillarXpMap).map(xp => Math.min(100, (xp / 1000) * 100)); // Normalized to 1000XP for display
        setPillarProgress(pProgs);

        const currentEnergy = localStorage.getItem("emmanuel_energy_level") || "medium";
        setEnergy(currentEnergy);

        const risk = calculateBurnoutRisk({
            missedAnchors: 0,
            lowEnergyDays: currentEnergy === 'low' ? 1 : 0,
            avgFatigue: 2,
            consecutiveFailures: 0
        });
        setBurnout(risk);
    }, []);

    const resetPlan = useCallback(() => {
        if (confirm("Restart your Growth Plan? Week 1 will begin from today.")) {
            const now = new Date().toISOString();
            localStorage.setItem("emmanuel_start_date", now);
            setStartDate(now);
            setWeekCount(1);
        }
    }, []);

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-12 border-b border-border">
                {/* Decorative background — desktop only, behind content */}
                <div className="absolute top-0 right-0 font-bebas text-[15rem] leading-none text-gold/5 pointer-events-none select-none hidden md:block" aria-hidden>
                    EP
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-6 flex-1">
                            <div className="flex items-center gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-4xl md:text-6xl font-bebas tracking-wider text-white">
                                        Emmanuel <span className="text-gold">OS</span>
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold/60">
                                            System v4.0 • Deep Integration
                                        </p>
                                        <span className="text-gold/40">|</span>
                                        <span className="font-bebas text-lg text-gold/90 tracking-widest bg-gold/5 px-2 py-0.5 rounded border border-gold/10">
                                            {identity} ACTIVE
                                        </span>
                                    </div>
                                </div>
                                <div className="h-px bg-gradient-to-r from-gold/50 to-transparent flex-1 hidden md:block" />
                            </div>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
                                        <span className="font-bebas text-2xl tracking-wide">Active Growth Plan</span>
                                    </div>
                                    <p className="font-mono text-[10px] text-text-dim uppercase tracking-widest">
                                        Week {weekCount} Status: Operational
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={resetPlan}
                                className="group flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border rounded-lg hover:border-gold/40 hover:bg-gold/5 transition-all"
                                title="Reset Plan"
                            >
                                <RotateCcw className="w-4 h-4 text-text-dim group-hover:text-gold transition-colors" />
                                <span className="font-mono text-[10px] uppercase tracking-widest text-text-dim group-hover:text-gold">Restart</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-bebas leading-[0.9] tracking-tight max-w-2xl"
                    >
                        Build in the <span className="text-gold">dark.</span><br />
                        Shine in the <span className="text-gold">light.</span>
                    </motion.h1>

                    {/* Daily rotating quote */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="font-serif italic text-base text-text-muted max-w-xl leading-relaxed"
                    >
                        &quot;{quote}&quot;
                    </motion.p>

                    {/* Birthday Countdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="flex items-center gap-2 flex-wrap"
                    >
                        <Clock className="w-3 h-3 text-gold shrink-0" />
                        <span className="font-mono text-[9px] uppercase tracking-widest text-text-dim">18th Birthday:</span>
                        {[
                            { val: countdown.days, label: "d" },
                            { val: countdown.hours, label: "h" },
                            { val: countdown.mins, label: "m" },
                        ].map(({ val, label }) => (
                            <span key={label} className="font-bebas text-xl text-gold leading-none">
                                {val}<span className="font-mono text-[8px] text-text-dim ml-0.5">{label}</span>
                            </span>
                        ))}
                        <span className="font-mono text-[9px] text-text-dim tracking-widest">remaining</span>
                    </motion.div>

                    <div className="flex flex-wrap gap-2">
                        {["3AM Wake", "9 Courses", "First Class Target", "Programming Mastery", "Trading Independence"].map((chip) => (
                            <span key={chip} className="px-3 py-1 bg-bg-surface border border-border-2 rounded-sm font-mono text-[9px] uppercase tracking-widest text-text-muted">
                                {chip}
                            </span>
                        ))}
                    </div>

                    {/* What's Now — Mobile Only Execution Banner */}
                    {currentBlock && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="md:hidden bg-gold/10 border border-gold/30 rounded-xl p-4 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 flex items-start gap-4">
                                <span className="font-serif text-3xl">{currentBlock.emoji}</span>
                                <div>
                                    <h4 className="font-mono text-[9px] uppercase tracking-widest text-gold mb-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,1)]" />
                                        Current Execution block
                                    </h4>
                                    <p className="font-bebas text-2xl leading-tight mb-1">{currentBlock.title}</p>
                                    <p className="font-mono text-[10px] text-text-muted opacity-80">{currentBlock.time} • {currentBlock.dur} duration</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Plan status — no big button, auto-starts on first habit tick */}
                    <div className="flex items-center gap-3">
                        {startDate ? (
                            <>
                                <span className="font-mono text-[9px] uppercase tracking-widest text-green">● Growth Plan Active</span>
                                <span className="text-border">|</span>
                                <button onClick={resetPlan} className="font-mono text-[9px] uppercase tracking-widest text-text-dim hover:text-red transition-colors">
                                    Restart
                                </button>
                            </>
                        ) : (
                            <span className="font-mono text-[9px] uppercase tracking-widest text-text-dim">
                                Check your first habit to begin week tracking →
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                    { label: "Habits Today", value: stats.habits, icon: CheckCircle2, color: "text-gold" },
                    { label: "Burnout Risk", value: burnout.indicator, icon: Activity, color: burnout.indicator === 'Red' ? "text-red" : "text-green" },
                    { label: "Identity State", value: identity, icon: Zap, color: "text-gold" },
                    { label: "Energy Level", value: energy.toUpperCase(), icon: Flame, color: "text-red" },
                    { label: "Goals Progress", value: stats.goals, icon: Target, color: "text-green" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="bg-bg-surface border border-border p-4 rounded-xl flex flex-col justify-between group hover:border-border-2 transition-all cursor-default"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={cn("w-4 h-4", stat.color)} />
                            <span className="font-bebas text-2xl group-hover:scale-110 transition-transform">{stat.value}</span>
                        </div>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-text-dim">{stat.label}</p>
                    </motion.div>
                ))}
            </section>

            {/* Pillars Grid - Hidden on Mobile to prioritize action */}
            <section className="hidden md:block">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bebas tracking-wider text-white">The 6 Pillars</h2>
                    <div className="h-px bg-border flex-1" />
                    <span className="font-mono text-[10px] uppercase text-gold tracking-widest">XP Investment Chart</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "Technical Power", subtitle: "Architecture & Logic", color: "purple" },
                        { title: "Mathematical Maturity", subtitle: "Problem Solving", color: "blue" },
                        { title: "Financial Intelligence", subtitle: "Market Edge", color: "red" },
                        { title: "Athletic Discipline", subtitle: "Physical Order", color: "green" },
                        { title: "Social Composure", subtitle: "Impact & Aura", color: "teal" },
                        { title: "Spiritual Alignment", subtitle: "Core Meaning", color: "gold" },
                    ].map((pillar, i) => (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                            className={cn(
                                "bg-bg-surface border border-border p-6 rounded-xl hover:-translate-y-1 transition-all group",
                                `border-t-2 border-t-${pillar.color}`
                            )}
                        >
                            <h3 className="text-xl font-bebas mb-1 group-hover:text-gold transition-colors">{pillar.title}</h3>
                            <p className="font-serif italic text-sm text-text-muted mb-4">{pillar.subtitle}</p>
                            <div className="h-1 bg-bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pillarProgress[i]}%` }}
                                    transition={{ duration: 1, delay: 1 }}
                                    className={cn("h-full", `bg-${pillar.color}`)}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Quote Block */}
            <section className="bg-gold-dim border border-gold/20 p-12 rounded-2xl text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full -translate-y-1/2 scale-150 group-hover:scale-110 transition-all duration-1000" />
                <div className="relative z-10 space-y-4">
                    <p className="font-serif italic text-2xl md:text-3xl text-gold-light max-w-2xl mx-auto leading-relaxed">
                        &quot;They&apos;ll see the physique, the grades, the confidence, the presence. They&apos;ll never see the 3AM.&quot;
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold/60">
                        Emmanuel Peter · Forge in silence.
                    </p>
                </div>
            </section>
        </div>
    );
}
