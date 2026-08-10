"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    ChevronRight,
    CheckCircle2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

import { initialGoals, Goal } from "@/lib/data";

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>(initialGoals);

    useEffect(() => {
        const saved = localStorage.getItem("emmanuel_goals");
        if (saved) setGoals(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("emmanuel_goals", JSON.stringify(goals));
    }, [goals]);

    const togglePhase = (goalId: string, phaseId: string) => {
        setGoals(prev => prev.map(g => {
            if (g.id !== goalId) return g;
            return {
                ...g,
                phases: g.phases.map(p => p.id === phaseId ? { ...p, done: !p.done } : p)
            }
        }));
    };

    const overallPct = goals.length > 0
        ? Math.round(goals.reduce((acc, g) => acc + (g.phases.filter(p => p.done).length / g.phases.length), 0) / goals.length * 100)
        : 0;

    const activeMissions = goals.filter(g => {
        const done = g.phases.filter(p => p.done).length;
        return done > 0 && done < g.phases.length;
    }).length;

    return (
        <div className="space-y-8">
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bebas tracking-wider">Strategic Mission</h1>
                    <div className="h-px bg-border flex-1" />
                    <span className="font-mono text-[10px] uppercase text-text-dim tracking-widest">Phase: Forging</span>
                </div>
                <p className="font-serif italic text-text-muted text-lg max-w-xl leading-relaxed">
                    &quot;Goals are declarations of intent. Phases are the blueprints. Execution is the only currency that matters.&quot;
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {goals.map((goal, i) => {
                    const completed = goal.phases.filter(p => p.done).length;
                    const total = goal.phases.length;
                    const pct = Math.round((completed / total) * 100);

                    return (
                        <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-bg-surface border border-border rounded-2xl overflow-hidden flex flex-col group hover:border-border-2 transition-all"
                        >
                            <div className="p-8 space-y-6 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{goal.icon}</span>
                                            <h3 className="text-2xl font-bebas tracking-wide">{goal.title}</h3>
                                        </div>
                                        <p className="font-serif italic text-sm text-text-muted leading-relaxed">{goal.tagline}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bebas text-3xl text-gold">{pct}%</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-text-dim">
                                        <span>Phase Completion</span>
                                        <span>{completed} / {total} milestones</span>
                                    </div>
                                    <Progress value={pct} className={cn("h-1.5 bg-bg-muted")} />
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border/50">
                                    {goal.phases.map((phase) => (
                                        <div
                                            key={phase.id}
                                            className={cn(
                                                "group/phase p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden",
                                                phase.done ? "bg-bg-elevated/20 border-border/40" : "bg-bg-base border-border-2 hover:border-border"
                                            )}
                                            onClick={() => togglePhase(goal.id, phase.id)}
                                        >
                                            <div className="flex items-start gap-4 z-10 relative">
                                                <Checkbox
                                                    checked={phase.done}
                                                    onCheckedChange={() => togglePhase(goal.id, phase.id)}
                                                    className="mt-1 border-border-2 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                                                />
                                                <div className="space-y-1">
                                                    <h4 className={cn("font-mono text-xs font-bold uppercase tracking-tight", phase.done ? "text-text-muted line-through" : "text-text")}>
                                                        {phase.t}
                                                    </h4>
                                                    <p className="font-mono text-[10px] text-text-dim leading-relaxed">{phase.d}</p>
                                                </div>
                                            </div>
                                            {phase.done && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/20">
                                                    <CheckCircle2 className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-bg-elevated/50 p-4 flex items-center justify-between border-t border-border group-hover:bg-bg-elevated transition-colors">
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-dim">Mission Objective</span>
                                <ChevronRight className="w-4 h-4 text-text-dim group-hover:text-gold transition-colors" />
                            </div>

                            {/* Confetti burst when goal hits 100% */}
                            <AnimatePresence>
                                {pct === 100 && (
                                    <motion.div
                                        key="confetti"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 pointer-events-none flex items-center justify-center rounded-2xl overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gold/5" />
                                        {[...Array(16)].map((_, k) => (
                                            <motion.div
                                                key={k}
                                                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                                animate={{
                                                    opacity: 0,
                                                    x: Math.cos((k / 16) * Math.PI * 2) * 120,
                                                    y: Math.sin((k / 16) * Math.PI * 2) * 120,
                                                    scale: 0,
                                                }}
                                                transition={{ duration: 1.2, delay: k * 0.03, ease: "easeOut" }}
                                                className="absolute w-2 h-2 rounded-full"
                                                style={{ backgroundColor: k % 2 === 0 ? "#D4AF37" : "#fff" }}
                                            />
                                        ))}
                                        <motion.span
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="font-bebas text-5xl text-gold z-10"
                                        >
                                            DONE
                                        </motion.span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <div className="bg-bg-surface border border-border p-8 rounded-2xl flex flex-col md:flex-row items-center gap-12">
                <div className="text-center md:text-left space-y-2 flex-1">
                    <h4 className="font-bebas text-3xl tracking-wide">Macro Vision</h4>
                    <p className="font-serif italic text-text-muted max-w-md">&quot;The Forge is where the metal is hardened. These goals are the shape of the sword.&quot;</p>
                </div>
                <div className="flex gap-8">
                    <div className="text-center">
                        <p className="font-bebas text-4xl text-gold">
                            {overallPct}%
                        </p>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim">Overall Completion</p>
                    </div>
                    <div className="text-center border-l border-border pl-8">
                        <p className="font-bebas text-4xl text-blue">
                            {activeMissions}
                        </p>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim">Missions Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
