"use client";

import { useState, useEffect } from "react";
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
        techniques: [
            { id: "m1t1", title: "Orthodox Stance" },
            { id: "m1t2", title: "Footwork (Step/Circle)" },
            { id: "m1t3", title: "Jab (1)" },
            { id: "m1t4", title: "Cross (2)" },
            { id: "m1t5", title: "Jab-Cross (1-2)" },
            { id: "m1t6", title: "Muay Thai Roundhouse Kick (Shin Contact)" },
            { id: "m1t7", title: "Teep (Push Kick)" }
        ],
        daily_drill: "1-2 Combination (200 reps)"
    },
    {
        month: 2,
        title: "Building Flow",
        focus: "Combinations & Basic Defense",
        techniques: [
            { id: "m2t1", title: "Jab-Cross-Low Kick" },
            { id: "m2t2", title: "Teep-Cross-Kick" },
            { id: "m2t3", title: "Jab-Cross-Left Hook (1-2-3)" },
            { id: "m2t4", title: "The 4 Pillars of Defence (Parry/Bob/Check)" },
            { id: "m2t5", title: "Clinch Entry & Posture Control" },
            { id: "m2t6", title: "Knee Strikes from Clinch" }
        ],
        daily_drill: "Check-Counter Drill (100 reps)"
    },
    {
        month: 3,
        title: "Warrior Physique",
        focus: "Advanced Strikes & Explosiveness",
        techniques: [
            { id: "m3t1", title: "High Roundhouse Kick (Shoulder Height)" },
            { id: "m3t2", title: "Horizontal Elbow Strikes" },
            { id: "m3t3", title: "Diagonal Elbow (12-6) Cuts" },
            { id: "m3t4", title: "Fluid Shadowboxing Flow" },
            { id: "m3t5", title: "Rhythm and Pace Variation" }
        ],
        daily_drill: "Shadowboxing Flow (4 Rounds)"
    },
    {
        month: 4,
        title: "Mastery Entry",
        focus: "Gym Readiness & Wrestling Basics",
        techniques: [
            { id: "m4t1", title: "Gym/Sparring Readiness" },
            { id: "m4t2", title: "Sprawl (Takedown Defence)" },
            { id: "m4t3", title: "Clinch Control (Inside Position)" },
            { id: "m4t4", title: "Arm Drag Transitions" },
            { id: "m4t5", title: "Standing Up in Base" }
        ],
        daily_drill: "Gym Prep / Live Drills"
    }
];

export default function MartialArtsPage() {
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [drillCount, setDrillCount] = useState(0);
    const [isLogging, setIsLogging] = useState(false);
    const [energy, setEnergy] = useState<string>("medium");
    const [checkedTechs, setCheckedTechs] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const savedEnergy = localStorage.getItem("emmanuel_energy_level") || "medium";
        setEnergy(savedEnergy);
        const savedTechs = localStorage.getItem("emmanuel_martial_checked");
        if (savedTechs) setCheckedTechs(JSON.parse(savedTechs));
    }, []);

    useEffect(() => {
        localStorage.setItem("emmanuel_martial_checked", JSON.stringify(checkedTechs));
    }, [checkedTechs]);

    const activeMonthData = CURRICULUM.find(c => c.month === selectedMonth)!;

    const toggleTech = (id: string) => {
        setCheckedTechs(prev => ({ ...prev, [id]: !prev[id] }));
        if (!checkedTechs[id]) awardXP(5, "Athletics");
    };

    const getAdaptiveTarget = (base: string) => {
        const num = parseInt(base.match(/\d+/)?.[0] || "0");
        const suffix = base.replace(/\d+/, "").trim();

        if (energy === "low") {
            return `${Math.ceil(num * 0.7)} ${suffix} (Recovery Scale)`;
        } else if (energy === "high") {
            return `${Math.ceil(num * 1.5)} ${suffix} (Elite Mode)`;
        }
        return base;
    };

    const logDrills = (reps: number) => {
        setIsLogging(true);
        setTimeout(() => {
            setDrillCount(prev => prev + reps);
            // Dynamic XP based on intensity
            const xpAmount = energy === "high" ? 75 : energy === "low" ? 30 : 50;
            awardXP(reps > 100 ? xpAmount : 20, "Athletics");
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
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity" aria-hidden="true">
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
                                            key={tech.id}
                                            onClick={() => toggleTech(tech.id)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 bg-bg-elevated border rounded-2xl transition-all cursor-pointer group/item",
                                                checkedTechs[tech.id] ? "border-green/30 bg-green/5" : "border-border/50 hover:border-gold/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[10px] transition-colors",
                                                checkedTechs[tech.id] ? "bg-green/20 text-green" : "bg-gold/10 text-gold"
                                            )}>
                                                {checkedTechs[tech.id] ? <CheckCircle2 className="w-3 h-3" /> : (i + 1)}
                                            </div>
                                            <span className={cn(
                                                "text-xs font-medium tracking-tight transition-all",
                                                checkedTechs[tech.id] ? "text-text line-through opacity-50" : "text-text-dim"
                                            )}>
                                                {tech.title}
                                            </span>
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
                                                <p className="text-sm text-text-muted font-bold">{getAdaptiveTarget(activeMonthData.daily_drill)}</p>
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
                                <span className="font-mono text-[10px] tracking-widest uppercase">
                                    {energy === "high" ? "Elite Intensity" : energy === "low" ? "Recovery Mode" : "Standard"}
                                </span>
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

interface AuraStatProps {
    icon: React.ReactNode;
    label: string;
}

function AuraStat({ icon, label }: AuraStatProps) {
    return (
        <div className="flex items-center gap-2 bg-bg-surface border border-border/50 p-3 rounded-xl">
            <div className="text-gold w-3 h-3">{icon}</div>
            <span className="text-[9px] font-mono text-text-dim uppercase tracking-wider">{label}</span>
        </div>
    );
}

interface RankStepProps {
    rank: string;
    isActive?: boolean;
    current?: boolean;
}

function RankStep({ rank, isActive, current }: RankStepProps) {
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
