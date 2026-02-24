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
import StreakHeatmap from "@/components/habits/StreakHeatmap";
import { awardXP } from "@/components/shared/ForgeLevelBadge";

import { initialHabits } from "@/lib/data";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function HabitsPage() {
    const [habits] = useState(initialHabits);
    const [week, setWeek] = useState(1);
    const [dateRange, setDateRange] = useState("");
    const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
    const [weekDates, setWeekDates] = useState<Date[]>([]);

    // Load from localStorage & Calculate Week
    useEffect(() => {
        const saved = localStorage.getItem("emmanuel_habits");
        if (saved) setCheckedState(JSON.parse(saved));

        const savedStart = localStorage.getItem("emmanuel_start_date");
        if (savedStart) {
            const startStr = savedStart;
            const start = new Date(startStr);
            const now = new Date();

            // Calculate current week number
            const diffTime = Math.abs(now.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const currentWeek = Math.max(1, Math.ceil(diffDays / 7));

            // If it's the first visit, default to the CURRENT week
            // But we let the state handle the 'active' week view
            if (week === 1 && currentWeek > 1) {
                // setWeek(currentWeek); // Optional: default to latest week
            }
        }
    }, []);

    // Update Date Range whenever week changes
    useEffect(() => {
        const savedStart = localStorage.getItem("emmanuel_start_date");
        if (!savedStart) {
            setDateRange("Plan not started");
            return;
        }

        const start = new Date(savedStart);
        // Normalize start to the beginning of its week (Monday)
        const dayOfStart = start.getDay(); // 0 is Sun, 1 is Mon...
        const diffToMon = (dayOfStart === 0 ? -6 : 1 - dayOfStart);
        const startOfPlanWeek = new Date(start);
        startOfPlanWeek.setDate(start.getDate() + diffToMon);

        const weekStart = new Date(startOfPlanWeek);
        weekStart.setDate(startOfPlanWeek.getDate() + (week - 1) * 7);

        const currentWeekDates: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            currentWeekDates.push(d);
        }
        setWeekDates(currentWeekDates);

        const format = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        setDateRange(`${format(currentWeekDates[0])} – ${format(currentWeekDates[6])}`);
    }, [week]);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("emmanuel_habits", JSON.stringify(checkedState));
    }, [checkedState]);

    const toggleHabit = (habitLabel: string, date: Date) => {
        const dateKey = date.toISOString().split('T')[0];
        const key = `${habitLabel}-${dateKey}`;

        setCheckedState(prev => {
            const isTicking = !prev[key];
            const next = { ...prev, [key]: isTicking };

            // 🏆 Award XP for individual habit check
            if (isTicking) {
                awardXP(10);

                // Check if all habits for this specific date are now complete (Bonus XP)
                const allForDay = initialHabits.every(h => next[`${h.label}-${dateKey}`]);
                if (allForDay) {
                    awardXP(50); // Daily Completion Bonus
                }
            }

            // Auto-start: record plan start date on first ever habit tick
            if (isTicking && !localStorage.getItem("emmanuel_start_date")) {
                const now = new Date();
                localStorage.setItem("emmanuel_start_date", now.toISOString());
                // Force a re-render of date range by resetting week 1 logic
                setWeek(1);
            }

            // ⚡ Trigger immediate sync
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent("sync:now"));
            }, 100);

            return next;
        });
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
                        <p className="font-bebas text-xl uppercase">Week {week}</p>
                        <p className="font-mono text-[9px] uppercase text-text-dim tracking-widest">{dateRange}</p>
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
                                {days.map((day, idx) => {
                                    const dateObj = weekDates[idx];
                                    return (
                                        <th key={day} className="p-4 text-center border-b border-border w-16">
                                            <p className="font-bebas text-sm tracking-widest text-text-muted">{day}</p>
                                            <p className="font-mono text-[8px] text-text-dim opacity-60">
                                                {dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                                            </p>
                                        </th>
                                    );
                                })}
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
                                        {days.map((day, dIdx) => {
                                            const dateObj = weekDates[dIdx];
                                            const dateKey = dateObj ? dateObj.toISOString().split('T')[0] : null;

                                            let isChecked = false;
                                            if (dateKey && checkedState[`${habit.label}-${dateKey}`]) {
                                                isChecked = true;
                                            } else if (week === 1 && !dateKey) { // Should not happen with weekDates, but for safety
                                                isChecked = !!checkedState[`${habit.label}-${day}`];
                                            } else if (week === 1 && dateKey) {
                                                // If dateKey is not checked, check if the abstract day was checked
                                                isChecked = !!checkedState[`${habit.label}-${day}`];
                                            }

                                            return (
                                                <td key={day} className="p-4 text-center border-b border-border/50">
                                                    <Checkbox
                                                        checked={isChecked}
                                                        disabled={!dateKey}
                                                        onCheckedChange={() => dateObj && toggleHabit(habit.label, dateObj)}
                                                        className={cn(
                                                            "w-5 h-5 transition-transform active:scale-95",
                                                            habit.color.split(' ')[0]
                                                        )}
                                                    />
                                                </td>
                                            );
                                        })}
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

            <StreakHeatmap checkedState={checkedState} totalHabits={habits.length} />

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(() => {
                    let totalChecks = 0;
                    const catScores: Record<string, { total: number, checked: number }> = {};
                    const habitScores: { label: string, pct: number }[] = [];

                    habits.forEach(h => {
                        let hChecks = 0;
                        weekDates.forEach(date => {
                            const dk = date.toISOString().split('T')[0];
                            if (checkedState[`${h.label}-${dk}`]) hChecks++;
                            // Fallback for old abstract days if viewing Week 1
                            else if (week === 1) {
                                const dName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
                                if (checkedState[`${h.label}-${dName}`]) hChecks++;
                            }
                        });
                        totalChecks += hChecks;
                        habitScores.push({ label: h.label, pct: Math.round((hChecks / 7) * 100) });

                        if (!catScores[h.category]) catScores[h.category] = { total: 0, checked: 0 };
                        catScores[h.category].total += 7;
                        catScores[h.category].checked += hChecks;
                    });

                    const overallPct = habits.length > 0 ? Math.round((totalChecks / (habits.length * 7)) * 100) : 0;

                    const sortedHabits = [...habitScores].sort((a, b) => b.pct - a.pct);
                    const bestHabit = sortedHabits[0];
                    const worstHabit = [...habitScores].sort((a, b) => a.pct - b.pct)[0];

                    const sortedCats = Object.entries(catScores).map(([name, s]) => ({
                        name,
                        pct: Math.round((s.checked / s.total) * 100)
                    })).sort((a, b) => b.pct - a.pct);
                    const bestCat = sortedCats[0];

                    return [
                        { label: "Overall Completion", val: `${overallPct}%`, icon: TrendingUp, color: "text-blue" },
                        { label: "Pillar Performance", val: bestCat ? `${bestCat.name} (${bestCat.pct}%)` : "N/A", icon: Award, color: "text-gold" },
                        { label: "Best Habit", val: bestHabit ? `${bestHabit.label} (${bestHabit.pct}%)` : "N/A", icon: Flame, color: "text-red" },
                        { label: "Critical Gaps", val: worstHabit ? `${worstHabit.label} (${worstHabit.pct}%)` : "N/A", icon: AlertTriangle, color: "text-orange" },
                    ].map(stat => (
                        <div key={stat.label} className="bg-bg-surface border border-border p-6 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                                <stat.icon className={cn("w-5 h-5", stat.color)} />
                                <span className="font-bebas text-2xl">{stat.val}</span>
                            </div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">{stat.label}</p>
                        </div>
                    ));
                })()}
            </section>
        </div>
    );
}
