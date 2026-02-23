"use client";

import { useState, useEffect } from "react";
import {
    Dumbbell,
    Flame,
    Zap,
    CheckCircle2,
    Clock,
    RotateCcw,
    ChevronRight,
    Plus,
    Minus,
    Trophy,
    Info,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { awardXP } from "@/components/shared/ForgeLevelBadge";
import {
    MONTH_1,
    MONTH_2,
    MONTH_3,
    UNIVERSAL_COMPONENTS,
    WORKOUT_PLAN_METADATA
} from "@/lib/workout-data";

export default function WorkoutPage() {
    // State management
    const [month, setMonth] = useState(1);
    const [energyLevel, setEnergyLevel] = useState<"low" | "medium" | "high">("medium");
    const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
    const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
    const [activeSection, setActiveSection] = useState<"warmup" | "main" | "cooldown">("main");

    const activeMonthData = month === 1 ? MONTH_1 : month === 2 ? MONTH_2 : MONTH_3;
    const activeDay = activeMonthData.days[selectedDayIndex];

    const toggleExercise = (id: string, xpType: string = "Athletics") => {
        setCompletedExercises(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
                awardXP(15, xpType as any);
            }
            return next;
        });
    };

    const getAdaptiveRounds = (baseRounds: number) => {
        if (energyLevel === "low") return baseRounds;
        if (energyLevel === "medium") return baseRounds + 1;
        return baseRounds + 2;
    };

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-32">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-5 h-5 text-gold" />
                        <span className="font-mono text-[10px] text-gold uppercase tracking-[0.2em]">Phase 8: Warrior Forge</span>
                    </div>
                    <h1 className="font-bebas text-5xl text-gold tracking-tight lowercase">Adaptive Training</h1>
                    <p className="font-mono text-xs text-text-dim mt-1">Unified Block Architecture · v2.0</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    {/* Month Picker */}
                    <div className="flex bg-bg-surface border border-border p-1 rounded-xl shadow-sm">
                        {[1, 2, 3].map(m => (
                            <button
                                key={m}
                                onClick={() => setMonth(m)}
                                className={cn(
                                    "px-4 py-2 rounded-lg font-mono text-[10px] tracking-widest uppercase transition-all",
                                    month === m ? "bg-gold text-bg-dark font-bold" : "text-text-dim hover:text-text"
                                )}
                            >
                                Month {m}
                            </button>
                        ))}
                    </div>

                    {/* Energy Selector */}
                    <div className="flex items-center gap-2 bg-bg-dark/50 p-1 rounded-full border border-border/40">
                        {(["low", "medium", "high"] as const).map(level => (
                            <button
                                key={level}
                                onClick={() => setEnergyLevel(level)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-tighter transition-all",
                                    energyLevel === level
                                        ? "bg-gold/20 text-gold border border-gold/30"
                                        : "text-text-dim hover:text-text-muted"
                                )}
                            >
                                {level}
                            </button>
                        ))}
                        <span className="px-2 text-[8px] font-mono text-text-dim border-l border-border/50 ml-1">Energy Level</span>
                    </div>
                </div>
            </header>

            {/* Day Selection Bar */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {activeMonthData.days.map((day, idx) => (
                    <button
                        key={day.day}
                        onClick={() => setSelectedDayIndex(idx)}
                        className={cn(
                            "flex-shrink-0 w-24 p-3 rounded-2xl border transition-all flex flex-col items-center gap-1",
                            selectedDayIndex === idx
                                ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                                : "bg-bg-surface border-border hover:border-gold/30"
                        )}
                    >
                        <span className={cn("text-[10px] font-bold uppercase", selectedDayIndex === idx ? "text-gold" : "text-text-dim")}>
                            {days[idx]}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: day.color }} />
                    </button>
                ))}
            </div>

            {/* Active Session View */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar (Modules) */}
                <div className="lg:col-span-1 space-y-4">
                    <ModuleButton
                        id="warmup"
                        label="Warm-Up"
                        icon={<Flame className="w-4 h-4" />}
                        active={activeSection === "warmup"}
                        onClick={() => setActiveSection("warmup")}
                    />
                    <ModuleButton
                        id="main"
                        label="Main Session"
                        icon={<Zap className="w-4 h-4" />}
                        active={activeSection === "main"}
                        onClick={() => setActiveSection("main")}
                        subLabel={activeDay.theme}
                    />
                    <ModuleButton
                        id="cooldown"
                        label="Cool-Down"
                        icon={<RotateCcw className="w-4 h-4" />}
                        active={activeSection === "cooldown"}
                        onClick={() => setActiveSection("cooldown")}
                    />

                    {/* Session Stats */}
                    <div className="p-6 bg-bg-surface border border-border rounded-3xl space-y-6 mt-8">
                        <div>
                            <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-1">Time Investment</p>
                            <p className="text-xl font-bebas text-text">{activeDay.estimated_duration}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-2">XP Potentials</p>
                            <div className="flex gap-2 flex-wrap">
                                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] font-mono border border-blue-500/20">Athletics +150</span>
                                <span className="px-2 py-0.5 rounded bg-gold/10 text-gold text-[8px] font-mono border border-gold/20">Discipline +50</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exercises Feed */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeSection}-${selectedDayIndex}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {activeSection === "warmup" && (
                                <BlockView
                                    title="Joint Mobility + Activation"
                                    exercises={UNIVERSAL_COMPONENTS.warm_up.exercises}
                                    completedExercises={completedExercises}
                                    onToggle={toggleExercise}
                                />
                            )}

                            {activeSection === "main" && activeDay.blocks.map((block: any) => (
                                <BlockView
                                    key={block.id}
                                    title={block.name}
                                    type={block.type as any}
                                    rounds={getAdaptiveRounds(block.rounds || 0)}
                                    exercises={block.exercises}
                                    completedExercises={completedExercises}
                                    onToggle={toggleExercise}
                                    note={block.note}
                                />
                            ))}

                            {activeSection === "cooldown" && (
                                <BlockView
                                    title="Recovery + Flexibility"
                                    exercises={UNIVERSAL_COMPONENTS.cool_down.exercises}
                                    completedExercises={completedExercises}
                                    onToggle={toggleExercise}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function ModuleButton({ label, icon, active, onClick, subLabel }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full p-4 rounded-3xl border transition-all text-left flex items-center gap-4 group",
                active
                    ? "bg-bg-surface border-gold/40 shadow-lg shadow-gold/5"
                    : "bg-bg-surface/50 border-border opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                active ? "bg-gold text-bg-dark" : "bg-bg-elevated text-text-dim group-hover:text-gold"
            )}>
                {icon}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className={cn("text-xs font-mono uppercase tracking-wider", active ? "text-gold font-bold" : "text-text-muted")}>{label}</p>
                {subLabel && <p className="text-[9px] font-mono text-text-dim truncate lowercase tracking-tighter">{subLabel}</p>}
            </div>
            {active && <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,1)]" />}
        </button>
    );
}

function BlockView({ title, exercises, completedExercises, onToggle, rounds, type, note }: any) {
    return (
        <div className="bg-bg-surface border border-border rounded-[2.5rem] overflow-hidden">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div>
                    <h3 className="font-bebas text-2xl text-text tracking-wide">{title}</h3>
                    {note && <p className="text-[10px] font-mono text-text-dim uppercase mt-1">{note}</p>}
                </div>
                {rounds > 0 && (
                    <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 px-3 py-1.5 rounded-full">
                        <Flame className="w-3.5 h-3.5 text-gold" />
                        <span className="font-bebas text-xl text-gold">{rounds} <span className="text-[10px] font-mono uppercase tracking-widest ml-1">Rounds</span></span>
                    </div>
                )}
            </div>

            <div className="divide-y divide-border/30">
                {exercises.map((ex: any, idx: number) => {
                    const id = ex.id || `gen-${title}-${idx}`;
                    const isCompleted = completedExercises.has(id);
                    return (
                        <div key={id} className="p-6 hover:bg-white/[0.01] transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                    <h4 className={cn("font-medium transition-all", isCompleted ? "text-text-dim line-through" : "text-text")}>
                                        {ex.name}
                                    </h4>
                                    <div className="flex gap-4 items-center">
                                        {ex.sets && <span className="text-[10px] font-mono text-gold bg-gold/5 px-2 py-0.5 rounded uppercase tracking-tighter">Sets: {ex.sets}</span>}
                                        {ex.reps && <span className="text-[10px] font-mono text-text-dim uppercase tracking-tighter">Reps: {ex.reps}</span>}
                                        {ex.duration && <span className="text-[10px] font-mono text-text-dim uppercase tracking-tighter">Target: {ex.duration}</span>}
                                        {ex.duration_seconds && <span className="text-[10px] font-mono text-text-dim uppercase tracking-tighter">{ex.duration_seconds}s</span>}
                                    </div>
                                    <p className="text-xs text-text-muted leading-relaxed mt-2 opacity-80">{ex.how}</p>
                                    {ex.tip && (
                                        <div className="flex items-center gap-2 mt-3 p-2 bg-blue-500/5 rounded-lg border border-blue-500/10">
                                            <Info className="w-3 h-3 text-blue-400" />
                                            <p className="text-[10px] text-blue-400/80 italic font-mono lowercase">{ex.tip}</p>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => onToggle(id)}
                                    className={cn(
                                        "w-12 h-12 rounded-2xl border transition-all flex items-center justify-center shrink-0",
                                        isCompleted
                                            ? "bg-gold border-gold text-bg-dark shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                                            : "border-border hover:border-gold/50 text-text-dim"
                                    )}
                                >
                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Plus className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
