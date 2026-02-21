"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    ChevronRight,
    CheckCircle2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

const initialGoals = [
    {
        id: "g1", icon: '🎓', title: 'FIRST-CLASS GRADES', color: 'blue',
        tagline: 'Lectures are revision. You already know it when you walk in.',
        phases: [
            { id: "p1", t: 'Self-study every course before lectures', d: 'Use YouTube, slides, textbooks. Know 70% before entering.', o: 1, done: true },
            { id: "p2", t: 'Cornell note system + 24hr review', d: 'Rewrite in Cornell format — cue column, notes, summary.', o: 2, done: true },
            { id: "p3", t: 'Anki spaced repetition — daily', d: '15 cards every 3AM session. Build a deck for each course.', o: 3, done: false },
            { id: "p4", t: 'Past questions — every course', d: 'Collect papers, do them timed. Map the question patterns.', o: 4, done: false },
            { id: "p5", t: 'Teach-back method', d: 'Explain it aloud. If you can\'t explain it simply, you don\'t know it.', o: 5, done: false },
        ]
    },
    {
        id: "g2", icon: '💻', title: 'PROGRAMMING MASTERY', color: 'purple',
        tagline: 'Not just writing code. Engineering systems that actually work.',
        phases: [
            { id: "p6", t: 'OOP mastery — 3 complete projects', d: 'Bank, Student Manager, CLI Inventory tool. Pure OOP.', o: 1, done: true },
            { id: "p7", t: 'Data structures & algorithms', d: 'Arrays to HashMaps. One structure per week. LeetCode Easy.', o: 2, done: false },
            { id: "p8", t: 'LeetCode daily streak', d: '3:30AM: one problem every day. Learn the pattern.', o: 3, done: false },
            { id: "p9", t: 'One real project per month', d: 'Solve a real problem. Push to GitHub with clean README.', o: 4, done: false },
            { id: "p10", t: 'System design thinking', d: 'Architect before coding. Draw classes and relationships.', o: 5, done: false },
        ]
    },
    {
        id: "g3", icon: '📈', title: 'TRADING & FINANCIAL INDEPENDENCE', color: 'red',
        tagline: 'Logic over emotion. Structured execution. Wealth through discipline.',
        phases: [
            { id: "p11", t: 'Market structure identification', d: 'Mark HH/HL/LH/LL on 3 pairs daily for 30 days.', o: 1, done: true },
            { id: "p12", t: 'BOS identification mastery', d: 'Identify real Break of Structure vs fakeouts. Log 20 examples.', o: 2, done: false },
            { id: "p13", t: 'Multi-timeframe analysis system', d: 'Weekly → Daily → 4H → 1H. Top-down execution only.', o: 3, done: false },
            { id: "p14", t: 'Risk management — 1% rule', d: 'Max 1-2% risk per trade. R:R minimum 1:2. Journal everything.', o: 4, done: false },
            { id: "p15", t: '90-day demo discipline → live', d: '60%+ win rate × 90 days = permission to go live.', o: 5, done: false },
        ]
    },
    {
        id: "g4", icon: '🏋️', title: 'ATHLETIC & PHYSIQUE EVOLUTION', color: 'green',
        tagline: 'Athletic. Defined. Flexible. Your body reflects your discipline.',
        phases: [
            { id: "p16", t: 'Calisthenics — 3x/week structured', d: 'Push, Pull, Circuit. Track reps every session.', o: 1, done: true },
            { id: "p17", t: 'Daily flexibility — 10 minutes', d: 'Focus on hamstrings/hips/spine. Goal: touch toes in 6 weeks.', o: 2, done: false },
            { id: "p18", t: 'Basketball IQ + defensive discipline', d: 'Film games. Fix one defensive weakness per week.', o: 3, done: false },
            { id: "p19", t: 'Nutrition — fuel the machine', d: 'Protein every meal. 3L water daily. Sleep = growth.', o: 4, done: false },
            { id: "p20", t: '6-month physique target', d: 'Athletic V-taper. Milestones: 30 push-ups, 10 pull-ups.', o: 5, done: false },
        ]
    },
    {
        id: "g5", icon: '🤝', title: 'SOCIAL COMPOSURE & CONFIDENCE', color: 'cyan',
        tagline: 'Quiet capability. The room feels you before you speak.',
        phases: [
            { id: "p21", t: 'The pause — 2s before reacting', d: 'Pause everywhere. Practiced composure in every interaction.', o: 1, done: true },
            { id: "p22", t: 'Speaking to girls — confident/natural', d: 'Genuine curiosity. Eye contact. Respond slowly.', o: 2, done: false },
            { id: "p23", t: 'Boundary setting — calm and firm', d: 'Calmly state boundaries without explanation. Hold them.', o: 3, done: false },
            { id: "p24", t: 'Presence — speak less, mean more', d: 'Cut word count by half. Comfort in silence = respect.', o: 4, done: false },
            { id: "p25", t: 'Manipulation detection', d: 'Study guilt tripping, DARVO. Never use them. Influence ethically.', o: 5, done: false },
        ]
    },
    {
        id: "g6", icon: '✨', title: 'SPIRITUAL ALIGNMENT', color: 'gold',
        tagline: 'Not ritual. Anchor. Discipline flows from here.',
        phases: [
            { id: "p26", t: 'Manna app — 3AM daily', d: 'First action of the day. sets the tone. No exceptions.', o: 1, done: true },
            { id: "p27", t: 'Specific prayer — name your goals', d: 'Specific faith attracts specific results. Name the mission.', o: 2, done: false },
            { id: "p28", t: 'Consistency over intensity', d: 'Daily show-up beats sporadic intensity. One Verse. One Minute.', o: 3, done: false },
            { id: "p29", t: 'Weekly alignment audit — Sunday', d: 'Are my actions matching my values? Honest assessment.', o: 4, done: false },
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
