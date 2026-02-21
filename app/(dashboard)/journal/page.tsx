"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Save,
    Trash2,
    Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DailyEntry {
    id: number;
    date: string;
    wins: string;
    gaps: string;
    fix: string;
    rating: number;
}

interface WeeklyEntry {
    id: number;
    date: string;
    alignment: string;
    distraction: string;
    nextWeek: string;
}

interface MonthlyEntry {
    id: number;
    date: string;
    pillarsReview: string;
    financialReview: string;
    habitReview: string;
}

export default function JournalPage() {
    // Daily State
    const [dailyRating, setDailyRating] = useState<number | null>(null);
    const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
    const [wins, setWins] = useState("");
    const [gaps, setGaps] = useState("");
    const [fix, setFix] = useState("");

    // Weekly State
    const [weeklyEntries, setWeeklyEntries] = useState<WeeklyEntry[]>([]);
    const [alignment, setAlignment] = useState("");
    const [distraction, setDistraction] = useState("");
    const [nextWeek, setNextWeek] = useState("");

    // Monthly State
    const [monthlyEntries, setMonthlyEntries] = useState<MonthlyEntry[]>([]);
    const [pillarsReview, setPillarsReview] = useState("");
    const [financialReview, setFinancialReview] = useState("");
    const [habitReview, setHabitReview] = useState("");

    const ratings = [
        { val: 1, label: "Lacked Discipline" },
        { val: 2, label: "Moderate" },
        { val: 3, label: "Good" },
        { val: 4, label: "Strong Execution" },
        { val: 5, label: "Warrior Tier" },
    ];

    useEffect(() => {
        const savedDaily = localStorage.getItem("emmanuel_journal_daily");
        const savedWeekly = localStorage.getItem("emmanuel_journal_weekly");
        const savedMonthly = localStorage.getItem("emmanuel_journal_monthly");

        if (savedDaily) setDailyEntries(JSON.parse(savedDaily));
        else {
            // migration from old single key
            const old = localStorage.getItem("emmanuel_journal");
            if (old) setDailyEntries(JSON.parse(old));
        }

        if (savedWeekly) setWeeklyEntries(JSON.parse(savedWeekly));
        if (savedMonthly) setMonthlyEntries(JSON.parse(savedMonthly));
    }, []);

    useEffect(() => {
        localStorage.setItem("emmanuel_journal_daily", JSON.stringify(dailyEntries));
        localStorage.setItem("emmanuel_journal_weekly", JSON.stringify(weeklyEntries));
        localStorage.setItem("emmanuel_journal_monthly", JSON.stringify(monthlyEntries));
    }, [dailyEntries, weeklyEntries, monthlyEntries]);

    const commitDaily = () => {
        if (!wins && !gaps && !fix && !dailyRating) return;
        const newEntry: DailyEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            wins: wins || "No notes", gaps, fix, rating: dailyRating || 3
        };
        setDailyEntries([newEntry, ...dailyEntries]);
        setWins(""); setGaps(""); setFix(""); setDailyRating(null);
    };

    const commitWeekly = () => {
        if (!alignment && !distraction && !nextWeek) return;
        const newEntry: WeeklyEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            alignment: alignment || "No notes", distraction, nextWeek
        };
        setWeeklyEntries([newEntry, ...weeklyEntries]);
        setAlignment(""); setDistraction(""); setNextWeek("");
    };

    const commitMonthly = () => {
        if (!pillarsReview && !financialReview && !habitReview) return;
        const newEntry: MonthlyEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
            pillarsReview: pillarsReview || "No notes", financialReview, habitReview
        };
        setMonthlyEntries([newEntry, ...monthlyEntries]);
        setPillarsReview(""); setFinancialReview(""); setHabitReview("");
    };

    const deleteDaily = (id: number) => setDailyEntries(dailyEntries.filter(e => e.id !== id));
    const deleteWeekly = (id: number) => setWeeklyEntries(weeklyEntries.filter(e => e.id !== id));
    const deleteMonthly = (id: number) => setMonthlyEntries(monthlyEntries.filter(e => e.id !== id));

    return (
        <div className="space-y-8">
            <header className="flex items-center gap-4">
                <h1 className="text-3xl font-bebas tracking-wider">Reflection Log</h1>
                <div className="h-px bg-border flex-1" />
                <div className="flex items-center gap-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            </header>

            <Tabs defaultValue="daily" className="w-full">
                <TabsList className="bg-bg-surface border border-border p-1 rounded-xl mb-8">
                    <TabsTrigger value="daily" className="font-mono text-[10px] uppercase tracking-widest data-[state=active]:bg-gold data-[state=active]:text-black">Daily Review</TabsTrigger>
                    <TabsTrigger value="weekly" className="font-mono text-[10px] uppercase tracking-widest data-[state=active]:bg-blue data-[state=active]:text-black">Weekly Alignment</TabsTrigger>
                    <TabsTrigger value="monthly" className="font-mono text-[10px] uppercase tracking-widest data-[state=active]:bg-purple data-[state=active]:text-black">Monthly Audit</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-8">
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-bg-surface border border-border p-8 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                                <h3 className="font-bebas text-2xl mb-6">Today&apos;s Data</h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">01. Major Wins Today</label>
                                        <Textarea
                                            value={wins}
                                            onChange={(e) => setWins(e.target.value)}
                                            placeholder="What did you dominate today?"
                                            className="bg-bg-base border-border-2 focus:border-gold resize-none min-h-[100px] font-mono text-xs uppercase"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">02. Critical Gaps & Failures</label>
                                        <Textarea
                                            value={gaps}
                                            onChange={(e) => setGaps(e.target.value)}
                                            placeholder="Where did your discipline waver? Be honest."
                                            className="bg-bg-base border-border-2 focus:border-red/40 resize-none min-h-[100px] font-mono text-xs uppercase"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">03. Tomorrow&apos;s Fix</label>
                                        <Textarea
                                            value={fix}
                                            onChange={(e) => setFix(e.target.value)}
                                            placeholder="Identify the one thing to fix for tomorrow."
                                            className="bg-bg-base border-border-2 focus:border-gold resize-none min-h-[100px] font-mono text-xs uppercase"
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">Discipline Rating</label>
                                        <div className="flex gap-2">
                                            {ratings.map((r) => (
                                                <button
                                                    key={r.val}
                                                    onClick={() => setDailyRating(r.val)}
                                                    className={cn(
                                                        "flex-1 py-3 rounded-lg border font-bebas text-lg transition-all",
                                                        dailyRating === r.val ? "bg-gold border-gold text-black" : "bg-bg-base border-border-2 text-text-muted hover:border-gold/50"
                                                    )}
                                                    title={r.label}
                                                >
                                                    {r.val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={commitDaily}
                                        className="w-full bg-gold hover:bg-gold-light text-black font-bebas text-xl tracking-wider py-6"
                                    >
                                        <Save className="w-5 h-5 mr-2" /> Commit to Journal
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bebas text-2xl text-text-dim">Recent Entries</h3>
                            <div className="space-y-4">
                                {dailyEntries.map((entry) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-bg-surface border border-border p-4 rounded-xl group hover:border-border-2 transition-all relative overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-mono text-[9px] uppercase tracking-widest text-text-dim">{entry.date} · Rating: {entry.rating}</span>
                                            <button
                                                onClick={() => deleteDaily(entry.id)}
                                                className="text-text-dim hover:text-red transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="font-mono text-[11px] uppercase tracking-tight line-clamp-2 text-text-muted group-hover:text-text transition-colors">
                                            {entry.wins}
                                        </p>
                                        <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center font-bebas text-gold/10 text-2xl group-hover:text-gold/20 transition-colors pointer-events-none">
                                            {entry.rating}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </TabsContent>

                <TabsContent value="weekly" className="space-y-8">
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-bg-surface border border-blue/30 p-8 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue" />
                                <h3 className="font-bebas text-2xl mb-6 text-blue">Weekly Alignment</h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">01. Purpose & Action Alignment</label>
                                        <Textarea
                                            value={alignment}
                                            onChange={(e) => setAlignment(e.target.value)}
                                            placeholder="Did your actions this week match your stated values and goals?"
                                            className="bg-bg-base border-border-2 focus:border-blue resize-none min-h-[100px] font-mono text-xs uppercase"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">02. Dominant Distraction</label>
                                        <Textarea
                                            value={distraction}
                                            onChange={(e) => setDistraction(e.target.value)}
                                            placeholder="What stole your focus this week, and how will you kill it?"
                                            className="bg-bg-base border-border-2 focus:border-red/40 resize-none min-h-[100px] font-mono text-xs uppercase"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">03. Next Week&apos;s Blueprint</label>
                                        <Textarea
                                            value={nextWeek}
                                            onChange={(e) => setNextWeek(e.target.value)}
                                            placeholder="Set the target for the upcoming 7 days."
                                            className="bg-bg-base border-border-2 focus:border-blue resize-none min-h-[100px] font-mono text-xs uppercase"
                                        />
                                    </div>

                                    <Button
                                        onClick={commitWeekly}
                                        className="w-full bg-blue hover:bg-blue/80 text-black font-bebas text-xl tracking-wider py-6 mt-4"
                                    >
                                        <Save className="w-5 h-5 mr-2" /> Log Weekly Alignment
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bebas text-2xl text-text-dim">Weekly Logs</h3>
                            <div className="space-y-4">
                                {weeklyEntries.map((entry) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-bg-surface border border-border p-4 rounded-xl group hover:border-blue/50 transition-all relative overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-mono text-[9px] uppercase tracking-widest text-text-dim">{entry.date}</span>
                                            <button
                                                onClick={() => deleteWeekly(entry.id)}
                                                className="text-text-dim hover:text-red transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="font-mono text-[11px] uppercase tracking-tight line-clamp-3 text-text-muted group-hover:text-text transition-colors">
                                            {entry.alignment}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </TabsContent>

                <TabsContent value="monthly" className="space-y-8">
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-bg-surface border border-purple/30 p-8 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple" />
                                <h3 className="font-bebas text-2xl mb-6 text-purple">Monthly Audit</h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">01. 6-Pillar Review</label>
                                        <Textarea
                                            value={pillarsReview}
                                            onChange={(e) => setPillarsReview(e.target.value)}
                                            placeholder="Review Foundation, Spiritual, Grades, Programming, Physical, Identity."
                                            className="bg-bg-base border-border-2 focus:border-purple resize-none min-h-[100px] font-mono text-xs uppercase"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">02. Financial & Trading Summary</label>
                                        <Textarea
                                            value={financialReview}
                                            onChange={(e) => setFinancialReview(e.target.value)}
                                            placeholder="What was your win rate? Account growth/drawdown? Key lessons?"
                                            className="bg-bg-base border-border-2 focus:border-purple resize-none min-h-[100px] font-mono text-xs uppercase"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">03. Habit Consistency Analysis</label>
                                        <Textarea
                                            value={habitReview}
                                            onChange={(e) => setHabitReview(e.target.value)}
                                            placeholder="Look at the heatmap. Where did you drop the ball consistently across the month?"
                                            className="bg-bg-base border-border-2 focus:border-purple resize-none min-h-[100px] font-mono text-xs uppercase"
                                        />
                                    </div>

                                    <Button
                                        onClick={commitMonthly}
                                        className="w-full bg-purple hover:bg-purple/80 text-black font-bebas text-xl tracking-wider py-6 mt-4"
                                    >
                                        <Save className="w-5 h-5 mr-2" /> Seal Monthly Audit
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bebas text-2xl text-text-dim">Audit Logs</h3>
                            <div className="space-y-4">
                                {monthlyEntries.map((entry) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-bg-surface border border-border p-4 rounded-xl group hover:border-purple/50 transition-all relative overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-mono text-[9px] uppercase tracking-widest text-text-dim">{entry.date}</span>
                                            <button
                                                onClick={() => deleteMonthly(entry.id)}
                                                className="text-text-dim hover:text-red transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="font-mono text-[11px] uppercase tracking-tight line-clamp-3 text-text-muted group-hover:text-text transition-colors">
                                            {entry.pillarsReview}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </TabsContent>
            </Tabs>
        </div>
    );
}
