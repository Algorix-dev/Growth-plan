"use client";

import { useState, useEffect } from "react";
import {
    Dumbbell,
    Flame,
    Zap,
    CheckCircle2,
    RotateCcw,
    Clock,
    Plus,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { awardXP } from "@/components/shared/ForgeLevelBadge";
import { WorkoutTimer } from "@/components/shared/WorkoutTimer";
import { MONTH_1, MONTH_2, MONTH_3, UNIVERSAL_COMPONENTS, WorkoutDay, WorkoutBlock, WorkoutExercise } from "@/lib/workout-data";

interface WorkoutLog {
    exerciseId: string;
    date: string;
    completed: boolean;
    month?: number;
    week?: number;
}

export default function WorkoutPage() {
    // State management
    const [month, setMonth] = useState(1);
    const [energyLevel, setEnergyLevel] = useState<"low" | "medium" | "high">("medium");
    const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
    const [activeSection, setActiveSection] = useState<"warmup" | "main" | "cooldown">("main");

    // Timer State
    const [timerState, setTimerState] = useState({
        isOpen: false,
        seconds: 60,
        title: ""
    });

    const openTimer = (seconds: number, title: string) => {
        setTimerState({ isOpen: true, seconds, title });
    };

    // Load completion state from storage (synced via SyncBridge)
    const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);

    useEffect(() => {
        const loadLogs = () => {
            const savedLogs = JSON.parse(localStorage.getItem("emmanuel_workout_logs") || "[]");
            setWorkoutLogs(savedLogs);
        };

        loadLogs();

        // Listen for sync completions and storage changes (multi-tab)
        window.addEventListener("sync:success", loadLogs);
        window.addEventListener("storage", loadLogs);
        return () => {
            window.removeEventListener("sync:success", loadLogs);
            window.removeEventListener("storage", loadLogs);
        };
    }, []);

    const activeMonthData = month === 1 ? MONTH_1 : month === 2 ? MONTH_2 : MONTH_3;
    const rawDay = activeMonthData.days[selectedDayIndex];

    // --- Energy Modulation Engine ---
    const applyEnergyModulation = (day: WorkoutDay): WorkoutDay => {
        if (energyLevel === "medium") return day;

        const modulatedDay = { ...day };
        modulatedDay.blocks = day.blocks.map((block: WorkoutBlock) => {
            // LOW ENERGY MODS
            if (energyLevel === "low") {
                // Remove Sprint & Accessory blocks
                if (block.type === "explosive" || block.type === "sport") return null;

                return {
                    ...block,
                    rounds: Math.max(1, Math.floor((block.rounds || 1) * 0.7)),
                    exercises: block.exercises.map((ex: WorkoutExercise) => ({
                        ...ex,
                        reps: typeof ex.reps === "number" ? Math.max(1, Math.floor(ex.reps * 0.8)) : ex.reps,
                        duration_seconds: ex.duration_seconds ? Math.max(5, Math.floor(Number(ex.duration_seconds) * 0.8)) : ex.duration_seconds,
                        rest_after: ex.rest_after ? `${Math.ceil(parseInt(ex.rest_after) * 1.3)}s` : ex.rest_after
                    }))
                } as WorkoutBlock;
            }

            // HIGH ENERGY MODS
            if (energyLevel === "high") {
                return {
                    ...block,
                    rounds: Math.min(6, (block.rounds || 1) + 1),
                    exercises: block.exercises.map((ex: WorkoutExercise) => ({
                        ...ex,
                        reps: typeof ex.reps === "number" ? ex.reps + 2 : ex.reps,
                        duration_seconds: ex.duration_seconds ? Number(ex.duration_seconds) + 10 : ex.duration_seconds,
                        rest_after: ex.rest_after ? `${Math.max(15, Math.floor(parseInt(ex.rest_after) * 0.85))}s` : ex.rest_after
                    }))
                } as WorkoutBlock;
            }
            return block;
        }).filter((b): b is WorkoutBlock => b !== null);

        return modulatedDay;
    };

    const activeDay = applyEnergyModulation(rawDay);

    const toggleExercise = (exerciseId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const newLogs = [...workoutLogs];
        const idx = newLogs.findIndex((l: WorkoutLog) => l.exerciseId === exerciseId && l.date === today);

        if (idx >= 0) {
            newLogs.splice(idx, 1);
        } else {
            newLogs.push({
                exerciseId,
                date: today,
                completed: true,
                month,
                week: 1 // Default to week 1 for now
            });
            awardXP(15, "Athletics");
        }

        setWorkoutLogs(newLogs);
        localStorage.setItem("emmanuel_workout_logs", JSON.stringify(newLogs));
        window.dispatchEvent(new CustomEvent("sync:now"));
    };

    const isCompleted = (id: string) => {
        const today = new Date().toISOString().split('T')[0];
        return workoutLogs.some(l => l.exerciseId === id && l.date === today);
    };

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-32">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Dumbbell className="w-5 h-5 text-gold" />
                        <span className="font-mono text-[10px] text-gold uppercase tracking-[0.3em]">Warrior Forge Curriculum</span>
                    </div>
                    <h1 className="font-bebas text-5xl md:text-6xl text-text tracking-tight">Active <span className="text-gold">Training</span></h1>
                    <p className="font-mono text-[10px] text-text-dim mt-2 tracking-widest uppercase opacity-60">Unified Adaptive Architecture • v2.0</p>
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
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {activeMonthData.days.map((day, idx) => (
                    <button
                        key={day.day}
                        onClick={() => setSelectedDayIndex(idx)}
                        className={cn(
                            "flex-shrink-0 w-24 p-4 rounded-3xl border transition-all flex flex-col items-center gap-2",
                            selectedDayIndex === idx
                                ? "bg-gold/10 border-gold/40 shadow-lg shadow-gold/5"
                                : "bg-bg-surface border-border hover:border-border-2"
                        )}
                    >
                        <span className={cn("text-[10px] font-mono tracking-widest uppercase", selectedDayIndex === idx ? "text-gold font-bold" : "text-text-dim")}>
                            {days[idx]}
                        </span>
                        <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: day.color }} />
                    </button>
                ))}
            </div>

            {/* Active Session View */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar (Modules) */}
                <div className="lg:col-span-1 space-y-4">
                    <ModuleButton
                        label="Warm-Up"
                        icon={<Flame className="w-4 h-4" />}
                        active={activeSection === "warmup"}
                        onClick={() => setActiveSection("warmup")}
                    />
                    <ModuleButton
                        label="Main Session"
                        icon={<Zap className="w-4 h-4" />}
                        active={activeSection === "main"}
                        onClick={() => setActiveSection("main")}
                        subLabel={activeDay.theme}
                    />
                    <ModuleButton
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
                                    isCompleted={isCompleted}
                                    onToggle={toggleExercise}
                                    onOpenTimer={openTimer}
                                />
                            )}

                            {activeSection === "main" && activeDay.blocks.map((block: WorkoutBlock) => (
                                <BlockView
                                    key={block.id}
                                    title={block.name}
                                    rounds={block.rounds || 0}
                                    exercises={block.exercises}
                                    isCompleted={isCompleted}
                                    onToggle={toggleExercise}
                                    onOpenTimer={openTimer}
                                    note={block.note}
                                />
                            ))}

                            {activeSection === "cooldown" && (
                                <BlockView
                                    title="Recovery + Flexibility"
                                    exercises={UNIVERSAL_COMPONENTS.cool_down.exercises}
                                    isCompleted={isCompleted}
                                    onToggle={toggleExercise}
                                    onOpenTimer={openTimer}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Global Timer Overlay */}
            <WorkoutTimer
                isOpen={timerState.isOpen}
                onClose={() => setTimerState(prev => ({ ...prev, isOpen: false }))}
                initialSeconds={timerState.seconds}
                title={timerState.title}
            />
        </div>
    );
}

interface ModuleButtonProps {
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
    subLabel?: string;
}

function ModuleButton({ label, icon, active, onClick, subLabel }: ModuleButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full p-5 rounded-[2rem] border transition-all text-left flex items-center gap-5 group",
                active
                    ? "bg-bg-surface border-gold/30 shadow-xl shadow-gold/5"
                    : "bg-bg-surface/40 border-border/50 opacity-60 hover:opacity-100 hover:border-border-2"
            )}
        >
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                active ? "bg-gold text-bg-dark shadow-[0_0_15px_rgba(201,150,46,0.2)]" : "bg-bg-muted text-text-dim group-hover:text-gold"
            )}>
                {icon}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className={cn("text-[11px] font-mono uppercase tracking-[0.2em]", active ? "text-gold font-bold" : "text-text-muted opacity-60")}>{label}</p>
                {subLabel && <p className="text-[10px] font-mono text-text-dim truncate mt-0.5 opacity-80">{subLabel}</p>}
            </div>
            {active && <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(201,150,46,0.8)]" />}
        </button>
    );
}

interface BlockViewProps {
    title: string;
    exercises: WorkoutExercise[];
    isCompleted: (id: string) => boolean;
    onToggle: (id: string) => void;
    onOpenTimer: (seconds: number, title: string) => void;
    rounds?: number;
    type?: string;
    note?: string;
}

function BlockView({ title, exercises, isCompleted, onToggle, onOpenTimer, rounds = 0, note }: BlockViewProps) {
    return (
        <div className="bg-bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-8 border-b border-border/50 bg-bg-surface/50 flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="font-bebas text-3xl text-text tracking-wide">{title}</h3>
                    {note && <p className="font-mono text-[9px] text-text-muted uppercase tracking-[0.15em] opacity-60">{note}</p>}
                </div>
                {rounds > 0 && (
                    <div className="flex items-center gap-2 bg-gold/5 border border-gold/20 px-4 py-2 rounded-2xl">
                        <Flame className="w-4 h-4 text-gold" />
                        <span className="font-bebas text-2xl text-gold">{rounds} <span className="text-[10px] font-mono uppercase tracking-widest ml-1 opacity-70">Rounds</span></span>
                    </div>
                )}
            </div>

            <div className="divide-y divide-border/30">
                {exercises.map((ex: WorkoutExercise, idx: number) => {
                    const id = ex.id || `gen-${title}-${idx}`;
                    const completed = isCompleted(id);
                    return (
                        <div key={id} className="p-8 hover:bg-white/[0.01] transition-colors group/ex">
                            <div className="flex items-start justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="space-y-1">
                                        <h4 className={cn("text-lg font-medium transition-all", completed ? "text-text-dim line-through" : "text-text")}>
                                            {ex.name}
                                        </h4>
                                        <div className="flex flex-wrap gap-4 items-center">
                                            {ex.sets && <span className="text-[10px] font-mono text-gold bg-gold/5 px-2 py-0.5 rounded border border-gold/10 uppercase tracking-tighter">Sets: {ex.sets}</span>}
                                            {ex.reps && <span className="text-[10px] font-mono text-text-dim uppercase tracking-tighter">Reps: {ex.reps}</span>}
                                            {ex.duration && <span className="text-[10px] font-mono text-text-dim uppercase tracking-tighter">Target: {ex.duration}</span>}
                                            {(ex.duration_seconds) && (
                                                <button
                                                    onClick={() => onOpenTimer(Number(ex.duration_seconds), ex.name)}
                                                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gold/5 border border-gold/20 text-gold text-[10px] font-mono hover:bg-gold/10 transition-colors"
                                                >
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {ex.duration_seconds}s
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-muted leading-relaxed opacity-70 group-hover/ex:opacity-90 transition-opacity">{ex.how}</p>
                                    {ex.tip && (
                                        <div className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-blue-400/80 italic font-medium leading-tight">{ex.tip}</p>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => onToggle(id)}
                                    className={cn(
                                        "w-14 h-14 rounded-3xl border transition-all flex items-center justify-center shrink-0 active:scale-90",
                                        completed
                                            ? "bg-gold border-gold text-bg-dark shadow-lg shadow-gold/20"
                                            : "bg-bg-elevated/50 border-border hover:border-gold/30 text-text-dim"
                                    )}
                                >
                                    {completed ? <CheckCircle2 className="w-7 h-7" /> : <Plus className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
