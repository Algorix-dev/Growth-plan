"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { awardXP } from "@/components/shared/ForgeLevelBadge";

interface Exercise {
    id: string;
    name: string;
    sets?: number;
    reps?: string;
    duration?: string;
    difficulty?: number;
}

interface TrainingBlock {
    id: string;
    type: "strength" | "core" | "skill" | "mobility" | "circuit";
    title: string;
    rounds?: number;
    exercises: Exercise[];
}

export default function WorkoutPage() {
    const [energy, setEnergy] = useState<"low" | "medium" | "high">("medium");

    // Data Structure following the v2 Master Directive logic
    const MOCK_PUSH_BLOCKS: TrainingBlock[] = [
        {
            id: "1",
            type: "strength",
            title: "Foundation Push",
            exercises: [
                { id: "e1", name: "Incline DB Press", sets: 3, reps: "8-12" },
                { id: "e2", name: "Weighted Dips", sets: 3, reps: "10" }
            ]
        },
        {
            id: "2",
            type: "circuit",
            title: "Explosive Finisher",
            rounds: 4,
            exercises: [
                { id: "e3", name: "Shadow Boxing", duration: "3:00" },
                { id: "e4", name: "Burpees", reps: "15" }
            ]
        }
    ];

    // Adaptive rounds (e.g. -1 if energy is low)
    const getAdjustedRounds = (rounds?: number) => {
        if (!rounds) return undefined;
        if (energy === "low") return Math.max(1, rounds - 1);
        if (energy === "high") return rounds + 1;
        return rounds;
    };

    const completeBlock = () => {
        awardXP(50, "Athletics");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
            {/* Header & Energy Check */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-bebas text-4xl text-gold tracking-tight">Warrior Forge</h1>
                    <p className="font-mono text-[10px] text-text-dim uppercase tracking-widest">Physical Pillar Execution</p>
                </div>

                <div className="flex items-center gap-2 p-1 bg-bg-surface border border-border rounded-xl">
                    {(["low", "medium", "high"] as const).map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setEnergy(lvl)}
                            className={cn(
                                "px-4 py-1.5 rounded-lg font-mono text-[10px] transition-all",
                                energy === lvl ? "bg-gold text-bg-dark font-bold shadow-lg" : "text-text-dim hover:text-text-muted"
                            )}
                        >
                            {lvl.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Adaptive Message */}
            {energy !== "medium" && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gold/10 border border-gold/20 rounded-xl flex items-center gap-3"
                >
                    <Zap className="w-4 h-4 text-gold" />
                    <p className="text-xs text-gold font-mono">
                        {energy === "low" ? "Adaptive Mode: Reducing volume by -1 round to prevent burnout." : "High Intensity Detected: Increasing volume for peak gains."}
                    </p>
                </motion.div>
            )}

            {/* Workout Blocks */}
            <div className="space-y-6">
                {MOCK_PUSH_BLOCKS.map((block) => (
                    <div key={block.id} className="bg-bg-surface border border-border rounded-2xl overflow-hidden group">
                        <div className="p-5 border-b border-border/50 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-gold" />
                                </div>
                                <div>
                                    <h3 className="font-bebas text-xl text-text-muted">{block.title}</h3>
                                    <p className="font-mono text-[9px] text-text-dim uppercase">
                                        {block.type} {block.rounds && `· ${getAdjustedRounds(block.rounds)} Rounds`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => completeBlock()}
                                className="px-4 py-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-lg text-gold font-mono text-[10px] transition-all"
                            >
                                COMMIT
                            </button>
                        </div>

                        <div className="divide-y divide-border/30">
                            {block.exercises.map((ex) => (
                                <div key={ex.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01]">
                                    <span className="text-sm text-text-muted font-medium">{ex.name}</span>
                                    <div className="flex items-center gap-4">
                                        {ex.sets !== undefined && (
                                            <div className="text-right">
                                                <p className="font-mono text-[9px] text-text-dim uppercase">Sets</p>
                                                <p className="text-gold font-bold">{ex.sets}</p>
                                            </div>
                                        )}
                                        {ex.reps && (
                                            <div className="text-right w-16">
                                                <p className="font-mono text-[9px] text-text-dim uppercase">Reps</p>
                                                <p className="text-gold font-bold">{ex.reps}</p>
                                            </div>
                                        )}
                                        {ex.duration && (
                                            <div className="text-right">
                                                <p className="font-mono text-[9px] text-text-dim uppercase">Time</p>
                                                <p className="text-gold font-bold">{ex.duration}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
