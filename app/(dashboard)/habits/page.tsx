"use client"

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Flame,
    Award,
    TrendingUp,
    AlertTriangle
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const habits = [
    { label: '3AM Wake-up', category: 'Foundation', color: 'border-gold text-gold' },
    { label: 'Manna Devotion', category: 'Spiritual', color: 'border-gold text-gold' },
    { label: 'Morning Prayer', category: 'Spiritual', color: 'border-gold text-gold' },
    { label: 'Academic Self-Study (2+ hrs)', category: 'Grades', color: 'border-blue text-blue' },
    { label: 'LeetCode / Coding Session', category: 'Programming', color: 'border-purple text-purple' },
    { label: 'Calisthenics Training', category: 'Physical', color: 'border-green text-green' },
    { label: 'Flexibility / Stretching', category: 'Physical', color: 'border-green text-green' },
    { label: 'Trading Chart Study', category: 'Trading', color: 'border-red text-red' },
    { label: 'Trade Journal Updated', category: 'Trading', color: 'border-red text-red' },
    { label: 'Grooming & Style Check', category: 'Identity', color: 'border-pink text-pink' },
    { label: 'Posture Check (hourly)', category: 'Identity', color: 'border-pink text-pink' },
    { label: 'Daily Review Written', category: 'Discipline', color: 'border-gold-light text-gold-light' },
    { label: '9PM Sleep — no exceptions', category: 'Foundation', color: 'border-gold text-gold' },
];

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function HabitsPage() {
    const [week, setWeek] = useState(12);
    const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("emmanuel_habits");
        if (saved) setCheckedState(JSON.parse(saved));
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("emmanuel_habits", JSON.stringify(checkedState));
    }, [checkedState]);

    const toggleHabit = (habitLabel: string, day: string) => {
        const key = `${habitLabel}-${day}`;
        setCheckedState(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bebas tracking-wider">Habit Tracker</h1>
                        <div className="h-px bg-border flex-1" />
                    </div>
                    <div className="bg-bg-surface border border-border border-l-4 border-l-gold p-4 rounded-lg">
                        <p className="font-serif italic text-sm text-text-muted leading-relaxed">
                            <strong>The rule:</strong> Every habit below is non-negotiable. Check it off each day you complete it.
                            Anything below 80% gets an audit in the journal. <span className="text-gold font-bold">No excuses — just data.</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-bg-surface border border-border p-2 rounded-lg">
                    <button
                        onClick={() => setWeek(w => Math.max(1, w - 1))}
                        className="p-2 hover:bg-bg-elevated rounded transition-colors text-text-muted"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="px-4 text-center min-w-[120px]">
                        <p className="font-bebas text-xl">WEEK {week}</p>
                        <p className="font-mono text-[9px] uppercase text-text-dim">Feb 17 – Feb 23</p>
                    </div>
                    <button
                        onClick={() => setWeek(w => w + 1)}
                        className="p-2 hover:bg-bg-elevated rounded transition-colors text-text-muted"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <section className="bg-bg-surface border border-border rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-bg-elevated/50">
                                <th className="p-4 text-left font-mono text-[10px] uppercase tracking-widest text-text-dim border-b border-border min-w-[200px]">Habit</th>
                                {days.map(day => (
                                    <th key={day} className="p-4 text-center font-bebas text-sm tracking-widest text-text-muted border-b border-border w-16">
                                        {day}
                                    </th>
                                ))}
                                <th className="p-4 text-center font-bebas text-sm tracking-widest text-gold border-b border-border w-16">🔥</th>
                                <th className="p-4 text-center font-bebas text-sm tracking-widest text-text-dim border-b border-border w-16">%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit) => {
                                let count = 0;
                                days.forEach(day => { if (checkedState[`${habit.label}-${day}`]) count++; });
                                const pct = Math.round((count / 7) * 100);
                                const isGreat = pct >= 80;
                                const isBad = pct < 50 && count > 0;

                                return (
                                    <tr key={habit.label} className="group hover:bg-bg-elevated/30 transition-colors">
                                        <td className="p-4 border-b border-border/50">
                                            <p className="font-mono text-xs font-semibold uppercase">{habit.label}</p>
                                            <p className="font-mono text-[9px] text-text-dim uppercase tracking-wider">{habit.category}</p>
                                        </td>
                                        {days.map(day => (
                                            <td key={day} className="p-4 text-center border-b border-border/50">
                                                <Checkbox
                                                    checked={checkedState[`${habit.label}-${day}`]}
                                                    onCheckedChange={() => toggleHabit(habit.label, day)}
                                                    className={cn(
                                                        "w-5 h-5 transition-transform active:scale-95",
                                                        habit.color.split(' ')[0] // Uses border color for checkbox
                                                    )}
                                                />
                                            </td>
                                        ))}
                                        <td className={cn("p-4 text-center border-b border-border/50 font-bebas text-lg", isGreat ? "text-green" : isBad ? "text-red" : "text-text")}>
                                            {count}
                                        </td>
                                        <td className={cn("p-4 text-center border-b border-border/50 font-mono text-[10px]", isGreat ? "text-green" : isBad ? "text-red" : "text-text-dim")}>
                                            {pct}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Overall Completion", val: "68%", icon: TrendingUp, color: "text-blue" },
                    { label: "Pillar Performance", val: "Academic (92%)", icon: Award, color: "text-gold" },
                    { label: "Best Streak", val: "3AM Wake (14d)", icon: Flame, color: "text-red" },
                    { label: "Critical Gaps", val: "Posture (32%)", icon: AlertTriangle, color: "text-orange" },
                ].map(stat => (
                    <div key={stat.label} className="bg-bg-surface border border-border p-6 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <stat.icon className={cn("w-5 h-5", stat.color)} />
                            <span className="font-bebas text-2xl">{stat.val}</span>
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">{stat.label}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
