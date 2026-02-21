"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, BookOpen, Flame, Target, TrendingUp, FileText, Save } from "lucide-react";
import { initialHabits, initialGoals, initialCourses } from "@/lib/data";

function getWeekDates() {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // This Monday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(monday)} – ${fmt(sunday)}`;
}

export default function WeeklyReviewPage() {
    const [loaded, setLoaded] = useState(false);
    const [weekStats, setWeekStats] = useState({
        habitRate: 0,
        topicsStudied: 0,
        tradesLogged: 0,
        goalProgress: 0,
    });
    const [answers, setAnswers] = useState({
        bestWin: "",
        failedItems: "",
        nonNegotiable: "",
        weekRating: "7",
        reflection: "",
    });
    const [saved, setSaved] = useState(false);
    const weekRange = getWeekDates();

    useEffect(() => {
        // Load current week stats
        const savedHabits = localStorage.getItem("emmanuel_habits");
        const habitsData = savedHabits ? JSON.parse(savedHabits) : {};
        const totalSlots = initialHabits.length * 7;
        const totalChecked = Object.values(habitsData).filter(Boolean).length;
        const habitRate = totalSlots > 0 ? Math.round((totalChecked / totalSlots) * 100) : 0;

        const savedCourses = localStorage.getItem("emmanuel_courses");
        const courses = savedCourses ? JSON.parse(savedCourses) : initialCourses;
        const topicsStudied = courses.reduce((a: number, c: typeof initialCourses[0]) =>
            a + c.topics.filter((t) => t.completed).length, 0);

        const savedTrades = localStorage.getItem("emmanuel_trades");
        const tradesLogged = savedTrades ? JSON.parse(savedTrades).length : 0;

        const savedGoals = localStorage.getItem("emmanuel_goals");
        const goals = savedGoals ? JSON.parse(savedGoals) : initialGoals;
        const goalProgress = goals.length > 0
            ? Math.round(goals.reduce((acc: number, g: typeof initialGoals[0]) =>
                acc + (g.phases.filter((p) => p.done).length / g.phases.length), 0) / goals.length * 100)
            : 0;

        setWeekStats({ habitRate, topicsStudied, tradesLogged, goalProgress });

        // Load saved review answers
        const savedReview = localStorage.getItem(`emmanuel_review_${weekRange}`);
        if (savedReview) setAnswers(JSON.parse(savedReview));

        setLoaded(true);
    }, [weekRange]);

    const saveReview = () => {
        localStorage.setItem(`emmanuel_review_${weekRange}`, JSON.stringify(answers));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const statCards = [
        { label: "Habit Completion", value: `${weekStats.habitRate}%`, icon: Flame, color: "text-gold", good: weekStats.habitRate >= 80 },
        { label: "Topics Studied", value: weekStats.topicsStudied.toString(), icon: BookOpen, color: "text-blue", good: weekStats.topicsStudied > 5 },
        { label: "Trades Logged", value: weekStats.tradesLogged.toString(), icon: TrendingUp, color: "text-purple", good: weekStats.tradesLogged > 0 },
        { label: "Goal Progress", value: `${weekStats.goalProgress}%`, icon: Target, color: "text-green", good: weekStats.goalProgress > 0 },
    ];

    const questions = [
        { key: "bestWin" as const, label: "Best win this week", placeholder: "What did you accomplish that you're most proud of?", rows: 2 },
        { key: "failedItems" as const, label: "What did you fail to execute on?", placeholder: "Be brutally honest. No excuses, just data.", rows: 2 },
        { key: "nonNegotiable" as const, label: "Non-negotiable for next week", placeholder: "What ONE thing must happen next week no matter what?", rows: 2 },
        { key: "reflection" as const, label: "Full reflection", placeholder: "Extended thoughts, patterns noticed, what to change...", rows: 5 },
    ];

    return (
        <div className="space-y-10">
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bebas tracking-wider">Weekly Review</h1>
                    <div className="h-px bg-border flex-1" />
                    <span className="font-mono text-[10px] uppercase text-text-dim tracking-widest">{weekRange}</span>
                </div>
                <p className="font-serif italic text-text-muted text-base max-w-xl leading-relaxed">
                    &quot;What gets reviewed, gets improved. What gets ignored, degrades. Sunday accounting.&quot;
                </p>
            </header>

            {/* Week Stats Snapshot */}
            {loaded && (
                <section>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim mb-4">Week Snapshot</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {statCards.map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className={cn(
                                    "bg-bg-surface border p-4 rounded-xl",
                                    s.good ? "border-border" : "border-red/30"
                                )}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <s.icon className={cn("w-4 h-4", s.color)} />
                                    {!s.good && <span className="text-red font-mono text-[8px] uppercase">⚠ Low</span>}
                                </div>
                                <p className="font-bebas text-2xl">{s.value}</p>
                                <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Week Rating */}
            <section className="space-y-3">
                <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim">Rate This Week (1–10)</p>
                <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            onClick={() => setAnswers(p => ({ ...p, weekRating: n.toString() }))}
                            className={cn(
                                "w-10 h-10 rounded-lg font-bebas text-lg border transition-all",
                                answers.weekRating === n.toString()
                                    ? "bg-gold text-bg-dark border-gold"
                                    : "bg-bg-surface border-border text-text-muted hover:border-border-2"
                            )}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </section>

            {/* Reflection Questions */}
            <section className="space-y-6">
                <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim">Accountability Questions</p>
                <div className="space-y-6">
                    {questions.map((q) => (
                        <div key={q.key} className="space-y-2">
                            <label className="font-mono text-[10px] uppercase tracking-widest text-text flex items-center gap-2">
                                <FileText className="w-3 h-3 text-gold" />
                                {q.label}
                            </label>
                            <textarea
                                value={answers[q.key]}
                                onChange={(e) => setAnswers(p => ({ ...p, [q.key]: e.target.value }))}
                                placeholder={q.placeholder}
                                rows={q.rows}
                                className="w-full bg-bg-surface border border-border rounded-lg p-4 font-mono text-sm text-text placeholder:text-text-dim resize-none focus:outline-none focus:ring-1 focus:ring-gold/40 focus:border-gold/40 transition-all"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Save */}
            <div className="flex items-center gap-4 pb-8">
                <button
                    onClick={saveReview}
                    className="flex items-center gap-2 px-8 py-3 bg-gold text-bg-dark font-bebas text-lg tracking-widest rounded-sm hover:brightness-110 transition-all active:scale-95"
                >
                    <Save className="w-4 h-4" />
                    {saved ? "SAVED ✓" : "SAVE REVIEW"}
                </button>
                <span className="font-mono text-[9px] text-text-dim uppercase tracking-widest">
                    Saved locally · {weekRange}
                </span>
            </div>
        </div>
    );
}
