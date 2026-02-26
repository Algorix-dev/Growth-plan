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
        const loadHabits = () => {
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
                if (week === 1 && currentWeek > 1) {
                    // setWeek(currentWeek); // Optional: default to latest week
                }
            }
        };

        loadHabits();
        window.addEventListener("sync:success", loadHabits);
        window.addEventListener("storage", loadHabits);
        return () => {
            window.removeEventListener("sync:success", loadHabits);
            window.removeEventListener("storage", loadHabits);
        };
    }, [week]);

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
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-6 flex-1">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Award className="w-5 h-5 text-gold" />
                            <span className="font-mono text-[10px] text-gold uppercase tracking-[0.3em] opacity-80">Behavioral Architecture</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bebas tracking-tight text-text">Habit <span className="text-gold">Tracker</span></h1>
                    </div>
                    <div className="bg-bg-surface border border-border border-l-4 border-l-gold p-6 rounded-[2rem] shadow-sm">
                        <p className="font-serif italic text-sm text-text-muted leading-relaxed">
                            <strong>The Prime Directive:</strong> Every habit below is non-negotiable. Check it off each day you complete it.
                            Anything below 80% gets an audit in the journal. <span className="text-gold font-bold">No excuses — just data.</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-bg-surface border border-border p-2 rounded-2xl shadow-sm self-start md:self-end mb-2">
                    <button
                        onClick={() => setWeek(w => Math.max(1, w - 1))}
                        className="p-3 hover:bg-bg-elevated rounded-xl transition-all active:scale-95 text-text-muted hover:text-gold"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="px-6 text-center min-w-[140px]">
                        <p className="font-bebas text-2xl uppercase text-text">Week {week}</p>
                        <p className="font-mono text-[10px] uppercase text-text-dim tracking-widest opacity-60">{dateRange}</p>
                    </div>
                    <button
                        onClick={() => setWeek(w => w + 1)}
                        className="p-3 hover:bg-bg-elevated rounded-xl transition-all active:scale-95 text-text-muted hover:text-gold"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <section className="bg-bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-bg-surface/50">
                                <th className="p-6 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted border-b border-border/50 min-w-[200px]">Strategic Habit</th>
                                {days.map((day, idx) => {
                                    const dateObj = weekDates[idx];
                                    return (
                                        <th key={day} className="p-6 text-center border-b border-border/50 w-20">
                                            <p className="font-bebas text-base tracking-widest text-text-dim">{day}</p>
                                            <p className="font-mono text-[9px] text-text-muted/40 uppercase tracking-tighter">
                                                {dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                                            </p>
                                        </th>
                                    );
                                })}
                                <th className="p-6 text-center font-bebas text-lg tracking-widest text-gold border-b border-border/50 w-20">🔥</th>
                                <th className="p-6 text-center font-bebas text-lg tracking-widest text-text-dim border-b border-border/50 w-20">%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit) => {
                                let count = 0;
                                weekDates.forEach(date => {
                                    const dk = date.toISOString().split('T')[0];
                                    if (checkedState[`${habit.label}-${dk}`]) count++;
                                    else if (week === 1) {
                                        const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
                                        if (checkedState[`${habit.label}-${dayName}`]) count++;
                                    }
                                });
                                const pct = Math.round((count / 7) * 100);
                                const isGreat = pct >= 80;
                                const isBad = pct < 50 && count > 0;

                                return (
                                    <tr key={habit.label} className="group hover:bg-white/[0.01] transition-colors">
                                        <td className="p-6 border-b border-border/50">
                                            <p className="font-mono text-sm font-bold uppercase tracking-tight text-text">{habit.label}</p>
                                            <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.1em] mt-0.5 opacity-60">{habit.category}</p>
                                        </td>
                                        {days.map((day, dIdx) => {
                                            const dateObj = weekDates[dIdx];
                                            const dateKey = dateObj ? dateObj.toISOString().split('T')[0] : null;

                                            let isChecked = false;
                                            if (dateKey && checkedState[`${habit.label}-${dateKey}`]) {
                                                isChecked = true;
                                            } else if (week === 1 && dateKey) {
                                                isChecked = !!checkedState[`${habit.label}-${day}`];
                                            }

                                            return (
                                                <td key={day} className="p-6 text-center border-b border-border/50">
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            checked={isChecked}
                                                            disabled={!dateKey}
                                                            onCheckedChange={() => dateObj && toggleHabit(habit.label, dateObj)}
                                                            className={cn(
                                                                "w-6 h-6 rounded-lg border-2 transition-all active:scale-90",
                                                                habit.color.split(' ')[0],
                                                                isChecked ? "shadow-lg shadow-current/20" : "border-border-2 opacity-40 hover:opacity-100"
                                                            )}
                                                        />
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td className={cn("p-6 text-center border-b border-border/50 font-bebas text-2xl", isGreat ? "text-green" : isBad ? "text-red" : "text-text")}>
                                            {count}
                                        </td>
                                        <td className={cn("p-6 text-center border-b border-border/50 font-bebas text-2xl", isGreat ? "text-green" : isBad ? "text-red" : "text-text-muted")}>
                                            {pct}<span className="text-[10px] font-mono ml-0.5 opacity-60">%</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-border/50">
                    {habits.map((habit) => {
                        let count = 0;
                        weekDates.forEach(date => {
                            const dk = date.toISOString().split('T')[0];
                            if (checkedState[`${habit.label}-${dk}`]) count++;
                            else if (week === 1) {
                                const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
                                if (checkedState[`${habit.label}-${dayName}`]) count++;
                            }
                        });
                        const pct = Math.round((count / 7) * 100);

                        return (
                            <div key={habit.label} className="p-6 space-y-6 bg-bg-surface">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-mono text-[12px] font-bold uppercase tracking-tight text-text">{habit.label}</h3>
                                        <p className="font-mono text-[9px] text-text-dim uppercase tracking-[0.1em] mt-0.5 opacity-60">{habit.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn("font-bebas text-3xl", pct >= 80 ? "text-green" : pct >= 50 ? "text-gold" : "text-text-muted")}>{pct}%</span>
                                        <p className="font-mono text-[8px] text-text-dim uppercase tracking-widest opacity-60">Success Rate</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                    {days.map((day, dIdx) => {
                                        const dateObj = weekDates[dIdx];
                                        const dateKey = dateObj ? dateObj.toISOString().split('T')[0] : null;

                                        let isChecked = false;
                                        if (dateKey && checkedState[`${habit.label}-${dateKey}`]) {
                                            isChecked = true;
                                        } else if (week === 1 && dateKey) {
                                            isChecked = !!checkedState[`${habit.label}-${day}`];
                                        }

                                        return (
                                            <button
                                                key={day}
                                                disabled={!dateKey}
                                                onClick={() => dateObj && toggleHabit(habit.label, dateObj)}
                                                className={cn(
                                                    "flex-1 min-w-[40px] aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-90",
                                                    isChecked
                                                        ? `${habit.color.split(' ')[0]} bg-current/10 border-current shadow-lg shadow-current/5`
                                                        : "border-border-2 bg-bg-surface text-text-dim opacity-40",
                                                    !dateKey && "opacity-10"
                                                )}
                                            >
                                                <span className="font-bebas text-xs">{day[0]}</span>
                                                <span className="font-mono text-[8px] opacity-60 mt-0.5">
                                                    {dateObj ? dateObj.getDate() : ''}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
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
                        <div key={stat.label} className="bg-bg-surface border border-border p-8 rounded-[2rem] space-y-4 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-bg-surface border border-border group-hover:border-gold/30 transition-colors")}>
                                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                                </div>
                                <span className="font-bebas text-4xl text-text">{stat.val}</span>
                            </div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim opacity-60">{stat.label}</p>
                        </div>
                    ));
                })()}
            </section>
        </div>
    );
}
