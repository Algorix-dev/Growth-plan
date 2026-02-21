"use client"

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    BookOpen,
    TrendingUp,
    Target,
    Flame
} from "lucide-react";

import { initialGoals, initialCourses, initialHabits, Goal, Course } from "@/lib/data";

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

    useEffect(() => {
        // --- Start Date ---
        const savedStart = localStorage.getItem("emmanuel_start_date");
        if (savedStart) setStartDate(savedStart);

        // --- Habits & Streak ---
        const savedHabits = localStorage.getItem("emmanuel_habits");
        const habitsData = savedHabits ? JSON.parse(savedHabits) : {};

        const today = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()];
        const checkedToday = Object.keys(habitsData).filter(k => k.endsWith(`-${today}`) && habitsData[k]).length;

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

        // --- Goals & Pillars ---
        const savedGoals = localStorage.getItem("emmanuel_goals");
        const activeGoals: Goal[] = savedGoals ? JSON.parse(savedGoals) : initialGoals;

        let total = 0;
        let done = 0;
        const goalPcts: Record<string, number> = {};

        activeGoals.forEach((g: Goal) => {
            const gTotal = g.phases.length;
            const gDone = g.phases.filter((p) => p.done).length;
            const gPct = gTotal > 0 ? Math.round((gDone / gTotal) * 100) : 0;

            total += gTotal;
            done += gDone;
            goalPcts[g.id] = gPct;
        });

        const pProgs = [
            goalPcts["g2"] || 0, // Technical Power
            goalPcts["g1"] || 0, // Mathematical Maturity
            goalPcts["g3"] || 0, // Financial Intelligence
            goalPcts["g4"] || 0, // Athletic Discipline
            goalPcts["g5"] || 0, // Social Composure
            goalPcts["g6"] || 0, // Spiritual Alignment
        ];

        setPillarProgress(pProgs);
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        setStats(prev => ({ ...prev, goals: `${pct}%` }));

        // --- Courses ---
        const savedCourses = localStorage.getItem("emmanuel_courses");
        const activeCourses: Course[] = savedCourses ? JSON.parse(savedCourses) : initialCourses;

        let cTotal = 0;
        let cDone = 0;
        activeCourses.forEach((c: Course) => {
            cTotal += c.topics.length;
            cDone += c.topics.filter((t) => t.completed).length;
        });
        setStats(prev => ({ ...prev, topics: `${cDone} / ${cTotal}` }));
    }, []);

    const startPlan = () => {
        const now = new Date().toISOString();
        localStorage.setItem("emmanuel_start_date", now);
        setStartDate(now);
        window.location.reload(); // Refresh to update all relative dates
    };

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-12 border-b border-border">
                <div className="absolute top-0 right-0 font-bebas text-[15rem] leading-none text-gold/5 pointer-events-none select-none hidden md:block">
                    EP
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-6">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold"
                            >
                                Emmanuel Peter · 200L · Nigeria · Forging Phase
                            </motion.p>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-8xl font-bebas leading-[0.9] tracking-tight"
                            >
                                Build in the <span className="text-gold">dark.</span><br />
                                Shine in the <span className="text-gold">light.</span>
                            </motion.h1>
                        </div>

                        {!startDate && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={startPlan}
                                className="px-8 py-4 bg-gold text-bg-dark font-bebas text-2xl tracking-widest rounded-sm hover:bg-gold-light transition-all active:scale-95 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                            >
                                START GROWTH PLAN
                            </motion.button>
                        )}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="font-serif italic text-lg text-text-muted max-w-lg leading-relaxed"
                    >
                        &quot;3AM while the world sleeps. First class while others cram. Composed while others perform. Nobody sees the work. Everyone sees the result.&quot;
                    </motion.p>

                    <div className="flex flex-wrap gap-2">
                        {["3AM Wake", "9 Courses", "First Class Target", "Programming Mastery", "Trading Independence"].map((chip) => (
                            <span key={chip} className="px-3 py-1 bg-bg-surface border border-border-2 rounded-sm font-mono text-[9px] uppercase tracking-widest text-text-muted">
                                {chip}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                    { label: "Habits Today", value: stats.habits, icon: CheckCircle2, color: "text-gold" },
                    { label: "Weekly Streak", value: stats.streak, icon: Flame, color: "text-red" },
                    { label: "Topics Self-Studied", value: stats.topics, icon: BookOpen, color: "text-blue" },
                    { label: "Trades Logged", value: stats.trades, icon: TrendingUp, color: "text-purple" },
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

            {/* Pillars Grid */}
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bebas tracking-wider">The 6 Pillars</h2>
                    <div className="h-px bg-border flex-1" />
                    <span className="font-mono text-[10px] uppercase text-text-dim tracking-widest">Growth Arc</span>
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
