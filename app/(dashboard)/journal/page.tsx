"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    PenTool,
    Calendar,
    Target,
    ChevronRight,
    Plus,
    Save,
    Trash2,
    Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function JournalPage() {
    const [activeTab, setActiveTab] = useState("daily");
    const [dailyRating, setDailyRating] = useState<number | null>(null);

    const ratings = [
        { val: 1, label: "Lacked Discipline" },
        { val: 2, label: "Moderate" },
        { val: 3, label: "Good" },
        { val: 4, label: "Strong Execution" },
        { val: 5, label: "Warrior Tier" },
    ];

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

            <Tabs defaultValue="daily" onValueChange={setActiveTab} className="w-full">
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
                                <h3 className="font-bebas text-2xl mb-6">Today's Data</h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">01. Major Wins Today</label>
                                        <Textarea
                                            placeholder="What did you dominate today?"
                                            className="bg-bg-base border-border-2 focus:border-gold resize-none min-h-[100px] font-mono text-xs uppercase"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">02. Critical Gaps & Failures</label>
                                        <Textarea
                                            placeholder="Where did your discipline waver? Be honest."
                                            className="bg-bg-base border-border-2 focus:border-red/40 resize-none min-h-[100px] font-mono text-xs uppercase"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">03. Tomorrow's Fix</label>
                                        <Textarea
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

                                    <Button className="w-full bg-gold hover:bg-gold-light text-black font-bebas text-xl tracking-wider py-6">
                                        <Save className="w-5 h-5 mr-2" /> Commit to Journal
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bebas text-2xl text-text-dim">Recent Entries</h3>
                            <div className="space-y-4">
                                {[
                                    { date: "Feb 20", wins: "Completed 3hr LeetCode streak, hit gym at 6am.", rating: 4 },
                                    { date: "Feb 19", wins: "Finished COS202 reading, marked all charts.", rating: 5 },
                                    { date: "Feb 18", wins: "Woke up at 3am, followed schedule perfectly.", rating: 5 },
                                ].map((entry, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-bg-surface border border-border p-4 rounded-xl group hover:border-border-2 transition-all relative overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-mono text-[9px] uppercase tracking-widest text-text-dim">{entry.date} · Rating: {entry.rating}</span>
                                            <button className="text-text-dim hover:text-red transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
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
                {/* Weekly & Monthly content would follow a similar pattern but specialized */}
            </Tabs>
        </div>
    );
}
