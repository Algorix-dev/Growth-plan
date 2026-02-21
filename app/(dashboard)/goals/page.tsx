"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Target,
    ChevronRight,
    Droplets,
    Zap,
    CheckCircle2,
    TrendingUp,
    Award
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

const initialGoals = [
    {
        id: "g1", icon: '🎓', title: 'FIRST-CLASS GRADES', color: 'blue', tagline: 'Lectures are revision.',
        phases: [
            { id: "p1", t: 'Self-study every course before lectures', d: 'Use YouTube, slides, textbooks.', o: 1, done: true },
            { id: "p2", t: 'Cornell note system + 24hr review', d: 'Double retention.', o: 2, done: true },
            { id: "p3", t: 'Anki spaced repetition — daily', d: '15 cards every 3AM session.', o: 3, done: false },
        ]
    },
    {
        id: "g2", icon: '💻', title: 'PROGRAMMING MASTERY', color: 'purple', tagline: 'Engineering systems that work.',
        phases: [
            { id: "p4", t: 'OOP mastery — 3 complete projects', d: 'Bank, Student Manager, CLI Inventor.', o: 1, done: true },
            { id: "p5", t: 'Data structures & algorithms', d: 'One structure per week.', o: 2, done: false },
        ]
    },
    {
        id: "g3", icon: '📈', title: 'TRADING INDEPENDENCE', color: 'red', tagline: 'Logic over emotion.',
        phases: [
            { id: "p6", t: 'Market structure mastery', d: 'Mark HH/HL on 3 pairs daily.', o: 1, done: true },
            { id: "p7", t: 'BOS identification', d: 'Log 20 examples of real BOS.', o: 2, done: false },
        ]
    },
];

export default function GoalsPage() {
    const [goals, setGoals] = useState(initialGoals);

    const togglePhase = (goalId: string, phaseId: string) => {
        setGoals(prev => prev.map(g => {
            if (g.id !== goalId) return g;
            return {
                ...g,
                phases: g.phases.map(p => p.id === phaseId ? { ...p, done: !p.done } : p)
            }
        }));
    };

    return (
        <div className="space-y-8">
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bebas tracking-wider">Strategic Mission</h1>
                    <div className="h-px bg-border flex-1" />
                    <span className="font-mono text-[10px] uppercase text-text-dim tracking-widest">Phase: Forging</span>
                </div>
                <p className="font-serif italic text-text-muted text-lg max-w-xl leading-relaxed">
                    "Goals are declarations of intent. Phases are the blueprints. Execution is the only currency that matters."
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
                        </motion.div>
                    );
                })}
            </div>

            <div className="bg-bg-surface border border-border p-8 rounded-2xl flex flex-col md:flex-row items-center gap-12">
                <div className="text-center md:text-left space-y-2 flex-1">
                    <h4 className="font-bebas text-3xl tracking-wide">Macro Vision</h4>
                    <p className="font-serif italic text-text-muted max-w-md">"The Forge is where the metal is hardened. These goals are the shape of the sword."</p>
                </div>
                <div className="flex gap-8">
                    <div className="text-center">
                        <p className="font-bebas text-4xl text-gold">42%</p>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim">Overall Completion</p>
                    </div>
                    <div className="text-center border-l border-border pl-8">
                        <p className="font-bebas text-4xl text-blue">2</p>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim">Missions Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
