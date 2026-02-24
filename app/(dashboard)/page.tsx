"use client"

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    Target, Clock, RotateCcw,
    CheckCircle2, Flame, Activity, Zap
} from "lucide-react";
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

        const today = new Date();
        const dateKey = today.toISOString().split('T')[0];
        const dayStr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][today.getDay()];

        // Count today's checked habits (Support both dateKey and fallback for dayStr during transition)
        const checkedToday = initialHabits.filter(h => habitsData[`${h.label}-${dateKey}`] || habitsData[`${h.label}-${dayStr}`]).length;

        let totalChecked = 0;
        Object.values(habitsData).forEach(v => { if (v) totalChecked++; });
        const totalSlots = initialHabits.length * 7 * weekCount; // Approximate total slots since start
        const streakPct = totalSlots > 0 ? Math.round((totalChecked / (initialHabits.length * 7 * 12)) * 100) : 0; // Relative to the 12-week target

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
    }, [weekCount]);

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

                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="space-y-8 flex-1">
                            <div className="flex items-center gap-6">
                                <div className="space-y-2">
                                    <h2 className="text-5xl md:text-7xl font-bebas tracking-tight text-white leading-none">
                                        Emmanuel <span className="text-gold">OS</span>
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <p className="font-mono text-[10px] md:text-sm uppercase tracking-[0.4em] text-gold/60">
                                            System Nexus • Integration v4.0
                                        </p>
                                        <div className="h-1 w-1 rounded-full bg-gold/40" />
                                        <span className="font-bebas text-xl text-gold tracking-widest bg-gold/5 px-3 py-1 rounded-2xl border border-gold/10 shadow-lg shadow-gold/5">
                                            {identity} STATE
                                        </span>
                                    </div>
                                </div>
                                <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent flex-1 hidden xl:block" />
                            </div>

                            <div className="flex flex-wrap items-center gap-8">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green animate-pulse shadow-[0_0_12px_rgba(74,222,128,0.5)]" />
                                        <span className="font-bebas text-3xl tracking-widest uppercase">Active Growth Phase</span>
                                    </div>
                                    <p className="font-mono text-[11px] text-text-dim uppercase tracking-widest opacity-60">
                                        Plan Week {weekCount} • Status: Peak Operational Efficiency
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={resetPlan}
                                className="group flex items-center gap-3 px-5 py-3 bg-bg-surface border border-border rounded-2xl hover:border-gold/30 hover:bg-gold/5 transition-all shadow-sm active:scale-95"
                                title="Reset Plan"
                            >
                                <RotateCcw className="w-4 h-4 text-text-muted group-hover:text-gold transition-colors" />
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted group-hover:text-gold font-bold">Restart System</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-7xl md:text-9xl font-bebas leading-[0.85] tracking-tight max-w-3xl"
                    >
                        Build in <span className="text-gold">silence.</span><br />
                        Let <span className="text-gold">Success</span> noise.
                    </motion.h1>

                    {/* Daily rotating quote */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="font-serif italic text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed opacity-90"
                    >
                        &quot;{quote}&quot;
                    </motion.p>

                    {/* Birthday Countdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="flex items-center gap-4 flex-wrap bg-bg-surface/30 backdrop-blur-md border border-border/50 p-4 rounded-[2rem] w-fit"
                    >
                        <Clock className="w-4 h-4 text-gold shrink-0" />
                        <span className="font-mono text-[11px] uppercase tracking-widest text-text-dim">Age 18 Ascension:</span>
                        {[
                            { val: countdown.days, label: "DAYS" },
                            { val: countdown.hours, label: "HRS" },
                            { val: countdown.mins, label: "MINS" },
                        ].map(({ val, label }) => (
                            <div key={label} className="flex flex-col items-center">
                                <span className="font-bebas text-3xl text-gold leading-none">
                                    {val}
                                </span>
                                <span className="font-mono text-[8px] text-text-dim tracking-tighter">{label}</span>
                            </div>
                        ))}
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
                    { label: "Habits Today", value: stats.habits, icon: CheckCircle2, color: "text-gold", action: null },
                    { label: "Burnout Risk", value: burnout.indicator, icon: Activity, color: burnout.indicator === 'Red' ? "text-red" : "text-green", action: null },
                    { label: "Identity State", value: identity, icon: Zap, color: "text-gold", action: null },
                    {
                        label: "Energy Level",
                        value: energy.toUpperCase(),
                        icon: Flame,
                        color: energy === 'high' ? "text-red" : energy === 'low' ? "text-blue" : "text-gold",
                        action: () => {
                            const levels = ['low', 'medium', 'high'];
                            const next = levels[(levels.indexOf(energy) + 1) % levels.length];
                            setEnergy(next);
                            localStorage.setItem("emmanuel_energy_level", next);
                            window.dispatchEvent(new CustomEvent("sync:now"));
                        }
                    },
                    { label: "Execution Rank", value: "ELITE", icon: Target, color: "text-green", action: null },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        onClick={stat.action || undefined}
                        className={cn(
                            "bg-bg-surface border border-border p-6 rounded-[2rem] flex flex-col justify-between group hover:border-gold/30 hover:bg-bg-surface shadow-sm transition-all cursor-default relative overflow-hidden",
                            stat.action && "cursor-pointer hover:shadow-lg hover:shadow-gold/5 active:scale-95"
                        )}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <stat.icon className="w-16 h-16" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon className={cn("w-5 h-5", stat.color)} />
                                <span className="font-bebas text-3xl transition-transform group-hover:scale-105">{stat.value}</span>
                            </div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-dim flex items-center justify-between opacity-60">
                                {stat.label}
                                {stat.action && <span className="text-[9px] text-gold font-bold tracking-tighter bg-gold/10 px-1.5 rounded-sm">ADAPTIVE</span>}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Pillars Grid - Hidden on Mobile to prioritize action */}
            <section className="hidden md:block">
                <div className="flex items-center gap-6 mb-12">
                    <h2 className="text-4xl font-bebas tracking-widest text-text">The <span className="text-gold">Nexus</span> Pillars</h2>
                    <div className="h-px bg-border/50 flex-1" />
                    <span className="font-mono text-[10px] uppercase text-gold/60 tracking-[0.3em]">Mastery Distribution</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                "bg-bg-surface border border-border p-8 rounded-[2.5rem] hover:shadow-xl hover:shadow-gold/5 transition-all group relative overflow-hidden",
                                `border-t-4 border-t-${pillar.color}`
                            )}
                        >
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bebas mb-2 group-hover:text-gold transition-colors tracking-wide">{pillar.title}</h3>
                                <p className="font-serif italic text-base text-text-muted mb-6 opacity-80">{pillar.subtitle}</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="font-mono text-[9px] uppercase tracking-widest text-text-dim">XP Investment</span>
                                        <span className="font-bebas text-xl text-gold">{Math.round(pillarProgress[i])}%</span>
                                    </div>
                                    <div className="h-2 bg-bg-muted/50 rounded-full overflow-hidden border border-border/30">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pillarProgress[i]}%` }}
                                            transition={{ duration: 1.5, delay: 1, ease: "circOut" }}
                                            className={cn("h-full shadow-[0_0_15px_rgba(255,255,255,0.1)]", `bg-${pillar.color}`)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Quote Block */}
            <section className="bg-bg-surface border border-border p-16 rounded-[3rem] text-center relative overflow-hidden group shadow-sm">
                <div className="absolute inset-0 bg-gold/5 blur-[100px] rounded-full -translate-y-1/2 scale-150 group-hover:scale-110 transition-all duration-1000" />
                <div className="relative z-10 space-y-8">
                    <div className="flex justify-center">
                        <Flame className="w-10 h-10 text-gold opacity-40 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="font-serif italic text-3xl md:text-5xl text-text-dim max-w-4xl mx-auto leading-[1.3] group-hover:text-text transition-colors">
                        &quot;They&apos;ll see the physique, the grades, the confidence, the presence. They&apos;ll never see the 3AM.&quot;
                    </p>
                    <div className="space-y-2">
                        <p className="font-mono text-[11px] tracking-[0.5em] uppercase text-gold font-bold">
                            Emmanuel Peter
                        </p>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted opacity-40">
                            Forge in silence.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
