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
        const loadTechs = () => {
            const savedEnergy = localStorage.getItem("emmanuel_energy_level") || "medium";
            setEnergy(savedEnergy);
            const savedTechs = localStorage.getItem("emmanuel_martial_checked");
            if (savedTechs) setCheckedTechs(JSON.parse(savedTechs));
        };

        loadTechs();
        window.addEventListener("sync:success", loadTechs);
        window.addEventListener("storage", loadTechs);
        return () => {
            window.removeEventListener("sync:success", loadTechs);
            window.removeEventListener("storage", loadTechs);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem("emmanuel_martial_checked", JSON.stringify(checkedTechs));
    }, [checkedTechs]);

    const activeMonthData = CURRICULUM.find(c => c.month === selectedMonth)!;

    const toggleTech = (techniqueId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const newTechs = { ...checkedTechs, [techniqueId]: !checkedTechs[techniqueId] };
        setCheckedTechs(newTechs);

        // Sync to v2 DB structure
        interface MALog {
            techniqueId: string;
            date: string;
            completed: boolean;
        }
        const maLogs: MALog[] = JSON.parse(localStorage.getItem("emmanuel_ma_logs") || "[]");
        const idx = maLogs.findIndex((l: MALog) => l.techniqueId === techniqueId && l.date === today);
        if (idx >= 0) {
            maLogs.splice(idx, 1);
        } else {
            maLogs.push({ techniqueId, date: today, completed: true });
            awardXP(5, "Athletics");
        }
        localStorage.setItem("emmanuel_ma_logs", JSON.stringify(maLogs));
        window.dispatchEvent(new CustomEvent("sync:now"));
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
        if (drillCount + reps < 0) return;
        setIsLogging(true);
        setTimeout(() => {
            const newCount = drillCount + reps;
            setDrillCount(newCount);
            // Save to local for dashboard sync
            localStorage.setItem("emmanuel_martial_drills_today", newCount.toString());

            // Dynamic XP based on intensity (only for positive additions)
            if (reps > 0) {
                const xpAmount = energy === "high" ? 75 : energy === "low" ? 30 : 50;
                awardXP(reps > 100 ? xpAmount : 20, "Athletics");
            }
            setIsLogging(false);
            window.dispatchEvent(new CustomEvent("sync:now"));
        }, 300);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Sword className="w-5 h-5 text-gold" />
                        <span className="font-mono text-[10px] text-gold uppercase tracking-[0.3em] opacity-80">Manual of Arms & Strategy</span>
                    </div>
                    <h1 className="font-bebas text-5xl md:text-6xl text-text tracking-tight lowercase">Martial <span className="text-gold">Curriculum</span></h1>
                </div>

                <div className="flex bg-bg-surface border border-border p-1 rounded-2xl shadow-sm -mx-4 px-4 md:mx-0 md:px-1">
                    {CURRICULUM.map((c) => (
                        <button
                            key={c.month}
                            onClick={() => setSelectedMonth(c.month)}
                            className={cn(
                                "flex-1 px-4 py-3 rounded-xl font-mono text-[10px] uppercase transition-all tracking-widest",
                                selectedMonth === c.month
                                    ? "bg-gold text-bg-dark font-bold shadow-xl shadow-gold/10"
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
                                                "flex items-center gap-4 p-5 bg-bg-surface/50 border rounded-[2rem] transition-all cursor-pointer group/item",
                                                checkedTechs[tech.id] ? "border-green/30 bg-green/5" : "border-border/50 hover:border-gold/30 hover:bg-bg-surface"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-xl flex items-center justify-center font-mono text-[11px] transition-colors shrink-0",
                                                checkedTechs[tech.id] ? "bg-green text-bg-dark" : "bg-gold/10 text-gold"
                                            )}>
                                                {checkedTechs[tech.id] ? <CheckCircle2 className="w-4 h-4" /> : (i + 1)}
                                            </div>
                                            <span className={cn(
                                                "text-[13px] font-medium tracking-tight transition-all",
                                                checkedTechs[tech.id] ? "text-text line-through opacity-40" : "text-text"
                                            )}>
                                                {tech.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-border/50">
                                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-4 px-2 opacity-60">Daily Focus Drill</h3>
                                    <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-gold/5 border border-gold/10 rounded-[2.5rem] gap-6">
                                        <div className="flex gap-5 items-center w-full">
                                            <div className="w-14 h-14 rounded-3xl bg-gold/10 flex items-center justify-center shrink-0 shadow-lg shadow-gold/5">
                                                <Target className="w-7 h-7 text-gold" />
                                            </div>
                                            <div>
                                                <p className="text-base text-text font-bold leading-tight">{getAdaptiveTarget(activeMonthData.daily_drill)}</p>
                                                <p className="text-[10px] text-text-muted font-mono tracking-tight uppercase mt-1 opacity-80">Precision & Intention over Speed</p>
                                            </div>
                                        </div>
                                        <div className="hidden md:block h-10 w-[1px] bg-gold/20" />
                                        <div className="text-center md:text-right w-full md:w-auto flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-gold/10 pt-4 md:pt-0">
                                            <div>
                                                <p className="font-bebas text-3xl text-gold leading-none">10,000</p>
                                                <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest">Total Reps Target</p>
                                            </div>
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
                    <div className="bg-bg-surface border border-border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bebas text-xl text-text uppercase tracking-widest">Drill Progress</h4>
                            <div className="flex items-center gap-2 text-gold px-3 py-1 bg-gold/10 rounded-full border border-gold/20">
                                <Activity className="w-3.5 h-3.5" />
                                <span className="font-mono text-[10px] tracking-widest uppercase font-bold">
                                    {energy === "high" ? "Elite" : energy === "low" ? "Recov" : "Std"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center py-8 bg-bg-surface/40 rounded-[2rem] border border-border/50 relative overflow-hidden group/drill">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gold/10" />
                            <input
                                type="number"
                                value={drillCount}
                                onChange={(e) => setDrillCount(Math.max(0, parseInt(e.target.value) || 0))}
                                className="font-bebas text-8xl text-text bg-transparent text-center w-full focus:outline-none focus:text-gold transition-colors"
                            />
                            <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest mt-2 opacity-60">Reps Banked Today</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => logDrills(50)}
                                    disabled={isLogging}
                                    className="py-5 bg-bg-surface border border-border rounded-3xl font-bebas text-2xl text-text hover:border-gold/40 active:scale-95 transition-all flex items-center justify-center group"
                                >
                                    {isLogging ? <RotateCcw className="w-4 h-4 animate-spin text-gold" /> : <span className="group-hover:text-gold transition-colors">+50</span>}
                                </button>
                                <button
                                    onClick={() => logDrills(-50)}
                                    disabled={isLogging || drillCount < 50}
                                    className="py-3 bg-red/5 border border-red/20 rounded-2xl font-bebas text-sm text-red/60 hover:bg-red/10 active:scale-95 transition-all tracking-wider"
                                >
                                    -50
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => logDrills(200)}
                                    disabled={isLogging}
                                    className="py-5 bg-gold text-bg-dark rounded-3xl font-bebas text-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center shadow-xl shadow-gold/20"
                                >
                                    {isLogging ? <RotateCcw className="w-4 h-4 animate-spin" /> : "+200"}
                                </button>
                                <button
                                    onClick={() => logDrills(-200)}
                                    disabled={isLogging || drillCount < 200}
                                    className="py-3 bg-red/5 border border-red/20 rounded-2xl font-bebas text-sm text-red/60 hover:bg-red/10 active:scale-95 transition-all tracking-wider"
                                >
                                    -200
                                </button>
                            </div>
                        </div>

                        <p className="text-[10px] text-text-dim text-center font-mono uppercase tracking-tight leading-relaxed pt-2 opacity-60">
                            Drilling builds the <span className="text-gold opacity-100">subconscious weapon</span>.
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
