"use client";

import { useState } from "react";
import {
    Sword,
    Flame,
    Target,
    Shield,
    Zap,
    ChevronRight,
    Trophy,
    RotateCcw,
    CheckCircle2,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { awardXP } from "@/components/shared/ForgeLevelBadge";

const CURRICULUM = [
    {
        month: 1,
        title: "Fundamentals",
        focus: "Stance, Movement & Basic Strikes",
        techniques: ["Orthodox Stance", "Footwork (Step/Circle)", "Jab (1)", "Cross (2)", "The Muay Thai Teep", "Basic Roundhouse Kick (Pivot)"],
        daily_drill: "1-2 Combination (200 reps)"
    },
    {
        month: 2,
        title: "Building Flow",
        focus: "Combinations & Basic Defense",
        techniques: ["Jab-Cross-Low Kick", "Teep-Cross-Kick", "Left Hook (3)", "Parry & Block", "Basic Check (Shin)", "Clinch Entry"],
        daily_drill: "Check-Counter Drill (100 reps)"
    },
    {
        month: 3,
        title: "Warrior Physique",
        focus: "Advanced Strikes & Explosiveness",
        techniques: ["Head Kicks", "Speed Elbows", "Diagonal Elbows (12-6)", "Knees from Clinch", "Angled Movement", "Faked Teep"],
        daily_drill: "Shadowboxing Flow (4 Rounds)"
    },
    {
        month: 4,
        title: "Mastery Entry",
        focus: "Gym Readiness & Wrestling Basics",
        techniques: ["Live Sparring Flow", "Sprawl (Takedown Defense)", "Clinch Control", "Standing Up in Base", "Counter Timing"],
        daily_drill: "Gym Prep / Live Drills"
    }
];

export default function MartialArtsPage() {
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [drillCount, setDrillCount] = useState(0);
    const [isLogging, setIsLogging] = useState(false);

    const activeMonthData = CURRICULUM.find(c => c.month === selectedMonth)!;

    const logDrills = (reps: number) => {
        setIsLogging(true);
        setTimeout(() => {
            setDrillCount(prev => prev + reps);
            awardXP(reps > 100 ? 50 : 20, "Athletics");
            setIsLogging(false);
        }, 600);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sword className="w-5 h-5 text-gold" />
                        <span className="font-mono text-[10px] text-gold uppercase tracking-[0.2em]">The Warrior Path</span>
                    </div>
                    <h1 className="font-bebas text-5xl text-gold tracking-tight lowercase">Martial Curriculum</h1>
                </div>

                <div className="flex bg-bg-surface border border-border p-1 rounded-xl">
                    {CURRICULUM.map((c) => (
                        <button
                            key={c.month}
                            onClick={() => setSelectedMonth(c.month)}
                            className={cn(
                                "px-4 py-2 rounded-lg font-mono text-[10px] uppercase transition-all",
                                selectedMonth === c.month
                                    ? "bg-gold text-bg-dark font-bold shadow-lg shadow-gold/10"
                                    : "text-text-dim hover:text-text"
                            )}
                        >
                            Month {c.month}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Curriculum Display */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedMonth}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-bg-surface border border-border rounded-3xl p-8 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="font-bebas text-9xl text-gold leading-none">{selectedMonth}</span>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div>
                                    <h2 className="font-bebas text-3xl text-text tracking-wide mb-1 uppercase">{activeMonthData.title}</h2>
                                    <p className="text-gold font-mono text-xs tracking-wider">{activeMonthData.focus}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    {activeMonthData.techniques.map((tech, i) => (
                                        <div
                                            key={tech}
                                            className="flex items-center gap-3 p-3 bg-bg-elevated border border-border/50 rounded-2xl hover:border-gold/30 transition-all"
                                        >
                                            <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center font-mono text-[10px] text-gold">
                                                {i + 1}
                                            </div>
                                            <span className="text-xs text-text-dim font-medium tracking-tight">{tech}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-border/50">
                                    <h3 className="font-mono text-[9px] uppercase tracking-widest text-text-dim mb-3">Daily Focus Drill</h3>
                                    <div className="flex items-center justify-between p-4 bg-gold/5 border border-gold/10 rounded-2xl">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                                                <Target className="w-5 h-5 text-gold" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-text-muted font-bold">{activeMonthData.daily_drill}</p>
                                                <p className="text-[10px] text-text-dim font-mono tracking-tight uppercase">Perfect form over speed</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-[1px] bg-gold/20 mr-4" />
                                        <div className="text-right">
                                            <p className="font-bebas text-2xl text-gold leading-none">10,000</p>
                                            <p className="text-[8px] font-mono text-text-dim uppercase">Total Target</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Aura Philosophy Section */}
                    <div className="bg-bg-dark border border-border/40 rounded-3xl p-8 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />
                        <div className="relative z-10 space-y-4">
                            <h3 className="font-bebas text-xl text-text-dim flex items-center gap-2 uppercase tracking-widest">
                                <Flame className="w-4 h-4 text-gold" /> The Warrior Aura
                            </h3>
                            <p className="text-sm text-text-dim leading-relaxed italic border-l-2 border-gold/20 pl-4 py-1">
                                &quot;The composure comes from having been hit and continuing. From knowing you can handle physical confrontation. That knowing changes how you carry yourself before you speak.&quot;
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                                <AuraStat icon={<Zap />} label="Composure" />
                                <AuraStat icon={<Shield />} label="Readiness" />
                                <AuraStat icon={<Trophy />} label="Discipline" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tracking Column */}
                <div className="space-y-6">
                    <div className="bg-bg-surface border border-border rounded-3xl p-6 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bebas text-lg text-text shadow-sm uppercase tracking-wider">Drill Tracker</h4>
                            <div className="flex items-center gap-1 text-gold">
                                <Activity className="w-3 h-3" />
                                <span className="font-mono text-[10px] tracking-widest">ACTIVE</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center py-8 bg-bg-elevated rounded-2xl border border-border/50">
                            <span className="font-bebas text-7xl text-gold leading-none">{drillCount}</span>
                            <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest mt-2">Daily Reps</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => logDrills(50)}
                                disabled={isLogging}
                                className="py-4 bg-bg-elevated border border-border rounded-xl font-bebas text-xl text-text hover:border-gold/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {isLogging ? <RotateCcw className="w-4 h-4 animate-spin text-gold" /> : "+50"}
                            </button>
                            <button
                                onClick={() => logDrills(200)}
                                disabled={isLogging}
                                className="py-4 bg-gold text-bg-dark rounded-xl font-bebas text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-gold/20"
                            >
                                {isLogging ? <RotateCcw className="w-4 h-4 animate-spin" /> : "+200"}
                            </button>
                        </div>

                        <p className="text-[10px] text-text-dim text-center font-mono uppercase tracking-tighter leading-relaxed pt-2 px-2">
                            Logging 200+ reps awards <span className="text-gold font-bold">50 XP</span> to Athletic Pillar.
                        </p>
                    </div>

                    <div className="bg-bg-surface border border-border rounded-3xl p-6">
                        <h4 className="font-bebas text-lg text-text-muted mb-4 uppercase tracking-widest">Rank Progression</h4>
                        <div className="space-y-4">
                            <RankStep rank="White" isActive={true} current />
                            <RankStep rank="Blue" />
                            <RankStep rank="Purple" />
                            <RankStep rank="Brown" />
                            <RankStep rank="Black" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AuraStat({ icon, label }: any) {
    return (
        <div className="flex items-center gap-2 bg-bg-surface border border-border/50 p-3 rounded-xl">
            <div className="text-gold w-3 h-3">{icon}</div>
            <span className="text-[9px] font-mono text-text-dim uppercase tracking-wider">{label}</span>
        </div>
    );
}

function RankStep({ rank, isActive, current }: any) {
    return (
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all",
            isActive ? "bg-bg-elevated border-gold/30 shadow-md" : "opacity-40 border-border"
        )}>
            <div className={cn(
                "w-1.5 h-6 rounded-full",
                rank === "White" ? "bg-white" :
                    rank === "Blue" ? "bg-blue-500" :
                        rank === "Purple" ? "bg-purple-500" :
                            rank === "Brown" ? "bg-orange-800" : "bg-gold"
            )} />
            <div className="flex-1">
                <p className={cn("font-mono text-[10px] uppercase tracking-[0.2em]", isActive ? "text-text" : "text-text-dim")}>
                    {rank} Belt
                </p>
                {current && <p className="text-[8px] font-mono text-gold lowercase">Active Focus</p>}
            </div>
            {isActive && !current && <CheckCircle2 className="w-4 h-4 text-gold" />}
            {current && <ChevronRight className="w-4 h-4 text-gold animate-pulse" />}
        </div>
    );
}
