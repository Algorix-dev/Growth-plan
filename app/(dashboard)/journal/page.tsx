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

interface JournalEntry {
    id: number;
    date: string;
    wins: string;
    gaps: string;
    fix: string;
    rating: number;
}

export default function JournalPage() {
    const [dailyRating, setDailyRating] = useState<number | null>(null);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [wins, setWins] = useState("");
    const [gaps, setGaps] = useState("");
    const [fix, setFix] = useState("");

    const ratings = [
        { val: 1, label: "Lacked Discipline" },
        { val: 2, label: "Moderate" },
        { val: 3, label: "Good" },
        { val: 4, label: "Strong Execution" },
        { val: 5, label: "Warrior Tier" },
    ];

    useEffect(() => {
        const saved = localStorage.getItem("emmanuel_journal");
        if (saved) setEntries(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("emmanuel_journal", JSON.stringify(entries));
    }, [entries]);

    const commitEntry = () => {
        if (!wins && !gaps && !fix && !dailyRating) return;

        const newEntry: JournalEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            wins: wins || "No notes",
            gaps,
            fix,
            rating: dailyRating || 3
        };

        setEntries([newEntry, ...entries]);
        setWins("");
        setGaps("");
        setFix("");
        setDailyRating(null);
    };

    const deleteEntry = (id: number) => {
        setEntries(entries.filter(e => e.id !== id));
    };

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
                                        onClick={commitEntry}
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
                                {entries.map((entry) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-bg-surface border border-border p-4 rounded-xl group hover:border-border-2 transition-all relative overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-mono text-[9px] uppercase tracking-widest text-text-dim">{entry.date} · Rating: {entry.rating}</span>
                                            <button
                                                onClick={() => deleteEntry(entry.id)}
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
            </Tabs>
        </div>
    );
}
