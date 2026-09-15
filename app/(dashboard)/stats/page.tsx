"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardCopy, Check, BarChart3, CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";
import { initialHabits } from "@/lib/data";

// TIP: this page does NOT introduce a new data source. It reads the exact
// same "emmanuel_habits" localStorage object the Checklist page already
// writes to (see toggleHabit in app/(dashboard)/habits/page.tsx), so it
// always reflects real data and never needs its own sync step. Keys look
// like "HabitLabel-2026-09-14" — we match by label PREFIX rather than
// splitting on "-", because some labels ("3AM Wake-up") already contain a
// hyphen and splitting would cut them in the wrong place.

// TIP: same literal-class-map issue as /roadmap and /books — Tailwind can't
// resolve a class built from `.replace("border-", "bg-")` at build time, it
// needs to see the literal text "bg-gold-light" etc. somewhere in a scanned
// file. This maps each `color` string from lib/data.ts's initialHabits to a
// fully literal {border, bar} pair instead of transforming it at runtime.
const PILLAR_CLASSES: Record<string, { border: string; bar: string; text: string }> = {
    "border-gold text-gold": { border: "border-gold", bar: "bg-gold", text: "text-gold" },
    "border-blue text-blue": { border: "border-blue", bar: "bg-blue", text: "text-blue" },
    "border-purple text-purple": { border: "border-purple", bar: "bg-purple", text: "text-purple" },
    "border-green text-green": { border: "border-green", bar: "bg-green", text: "text-green" },
    "border-red text-red": { border: "border-red", bar: "bg-red", text: "text-red" },
    "border-pink text-pink": { border: "border-pink", bar: "bg-pink", text: "text-pink" },
    "border-gold-light text-gold-light": { border: "border-gold-light", bar: "bg-gold-light", text: "text-gold-light" },
};
const FALLBACK_PILLAR_CLASS = { border: "border-gold", bar: "bg-gold", text: "text-gold" };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

interface ParsedEntry {
    label: string;
    dateKey: string; // ISO date, or "" if this was a legacy non-dated key
    done: boolean;
}

function parseHabitsData(raw: Record<string, boolean>): ParsedEntry[] {
    const labels = initialHabits.map((h) => h.label).sort((a, b) => b.length - a.length); // longest first, safer prefix match
    const out: ParsedEntry[] = [];
    for (const [key, done] of Object.entries(raw)) {
        const match = labels.find((l) => key.startsWith(`${l}-`));
        if (!match) continue;
        const suffix = key.slice(match.length + 1);
        out.push({ label: match, dateKey: ISO_DATE.test(suffix) ? suffix : "", done: !!done });
    }
    return out;
}

export default function StatsPage() {
    const [entries, setEntries] = useState<ParsedEntry[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const load = () => {
            const saved = localStorage.getItem("emmanuel_habits");
            const raw = saved ? JSON.parse(saved) : {};
            setEntries(parseHabitsData(raw));
        };
        load();
        // TIP: same pattern the Checklist page uses to stay in sync after a
        // background sync completes or another tab changes localStorage.
        window.addEventListener("sync:success", load);
        window.addEventListener("storage", load);
        return () => {
            window.removeEventListener("sync:success", load);
            window.removeEventListener("storage", load);
        };
    }, []);

    const dated = useMemo(() => entries.filter((e) => e.dateKey), [entries]);
    const distinctDates = useMemo(
        () => Array.from(new Set(dated.map((e) => e.dateKey))).sort(),
        [dated]
    );

    const pillarStats = useMemo(() => {
        const byCategory: Record<string, { done: number; total: number; color: string }> = {};
        initialHabits.forEach((h) => {
            byCategory[h.category] ||= { done: 0, total: 0, color: h.color };
            byCategory[h.category].total += distinctDates.length;
        });
        dated.forEach((e) => {
            if (!e.done) return;
            const habit = initialHabits.find((h) => h.label === e.label);
            if (habit) byCategory[habit.category].done += 1;
        });
        return byCategory;
    }, [dated, distinctDates]);

    const dailyHistory = useMemo(() => {
        const byDate: Record<string, Set<string>> = {};
        distinctDates.forEach((d) => (byDate[d] = new Set()));
        dated.forEach((e) => {
            if (e.done) byDate[e.dateKey].add(e.label);
        });
        return [...distinctDates].reverse().map((date) => ({
            date,
            checked: Array.from(byDate[date] || []),
        }));
    }, [distinctDates, dated]);

    const totalDone = dated.filter((e) => e.done).length;
    const totalPossible = initialHabits.length * distinctDates.length;
    const overallPct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

    const buildExportText = () => {
        let text = `EMMANUEL — CHECKLIST HISTORY EXPORT\n`;
        text += `Generated: ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}\n`;
        text += `Days tracked: ${distinctDates.length} | Overall consistency: ${overallPct}%\n`;
        text += `${"─".repeat(48)}\n\n`;

        text += `PILLAR BREAKDOWN (all time)\n`;
        Object.entries(pillarStats).forEach(([name, s]) => {
            const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
            const bar = "█".repeat(Math.round(pct / 10)) + "░".repeat(10 - Math.round(pct / 10));
            text += `${name.padEnd(12)} ${bar} ${pct}%\n`;
        });
        text += `\n${"─".repeat(48)}\n\n`;

        text += `DAILY LOG\n`;
        dailyHistory.forEach(({ date, checked }) => {
            const pct = Math.round((checked.length / initialHabits.length) * 100);
            const label = new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
            text += `\n${label} — ${pct}% (${checked.length}/${initialHabits.length})\n`;
            initialHabits.forEach((h) => {
                text += `  ${checked.includes(h.label) ? "✓" : "✗"} ${h.label} [${h.category}]\n`;
            });
        });

        text += `\n${"─".repeat(48)}\n`;
        text += `Ask the AI you paste this to for patterns, weak pillars, or what to adjust next week.`;
        return text;
    };

    const copyForReview = async () => {
        try {
            await navigator.clipboard.writeText(buildExportText());
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            alert("Couldn't access the clipboard — your browser may be blocking it on this page.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-gold" />
                        <span className="font-mono text-[10px] text-gold uppercase tracking-[0.2em]">
                            No excuses — just data
                        </span>
                    </div>
                    <h1 className="font-bebas text-5xl text-gold tracking-tight lowercase">Checklist Stats</h1>
                    <p className="font-mono text-xs text-text-dim mt-1">
                        {distinctDates.length} day{distinctDates.length === 1 ? "" : "s"} tracked · {overallPct}% overall
                    </p>
                </div>

                <button
                    onClick={copyForReview}
                    disabled={distinctDates.length === 0}
                    className={cn(
                        "flex items-center gap-2 px-5 py-3 rounded-2xl font-mono text-xs uppercase tracking-wide transition-all shrink-0",
                        distinctDates.length === 0
                            ? "bg-bg-elevated text-text-dim cursor-not-allowed"
                            : copied
                                ? "bg-green text-bg-dark"
                                : "bg-gold text-bg-dark hover:opacity-90"
                    )}
                >
                    {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy for AI Review"}
                </button>
            </div>

            {distinctDates.length === 0 ? (
                <div className="bg-bg-surface border border-border rounded-3xl p-10 text-center">
                    <CalendarRange className="w-8 h-8 text-text-dim mx-auto mb-3" />
                    <p className="text-sm text-text-muted">
                        No dated checklist history yet — check off a few days on the Checklist page first.
                    </p>
                </div>
            ) : (
                <>
                    {/* Pillar breakdown */}
                    <div className="bg-bg-surface border border-border rounded-3xl p-6 space-y-5">
                        <h3 className="font-bebas text-xl text-text tracking-wide">Pillar Breakdown</h3>
                        <div className="space-y-4">
                            {Object.entries(pillarStats).map(([name, s]) => {
                                const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
                                const classes = PILLAR_CLASSES[s.color] ?? FALLBACK_PILLAR_CLASS;
                                return (
                                    <div key={name} className="space-y-1.5">
                                        <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest">
                                            <span className="text-text-muted">{name}</span>
                                            <span className={classes.text}>{pct}%</span>
                                        </div>
                                        <div className={cn("h-1.5 rounded-full bg-bg-elevated border", classes.border)}>
                                            <div
                                                className={cn("h-full rounded-full", classes.bar)}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Daily history */}
                    <div className="space-y-3">
                        <h3 className="font-bebas text-xl text-text tracking-wide">Daily Log</h3>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                            {dailyHistory.map(({ date, checked }) => {
                                const pct = Math.round((checked.length / initialHabits.length) * 100);
                                const label = new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "short",
                                });
                                return (
                                    <div key={date} className="bg-bg-surface border border-border rounded-2xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs font-mono text-text-muted">{label}</p>
                                            <p className={cn("text-xs font-mono font-bold", pct >= 80 ? "text-green" : pct >= 40 ? "text-gold" : "text-red")}>
                                                {pct}% ({checked.length}/{initialHabits.length})
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {initialHabits.map((h) => {
                                                const done = checked.includes(h.label);
                                                return (
                                                    <span
                                                        key={h.label}
                                                        className={cn(
                                                            "text-[9px] font-mono px-2 py-1 rounded-full border",
                                                            done
                                                                ? "bg-green/10 border-green/40 text-green"
                                                                : "border-border text-text-dim line-through opacity-60"
                                                        )}
                                                    >
                                                        {h.label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
