"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function DailyReflectionModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [wins, setWins] = useState("");
    const [gaps, setGaps] = useState("");
    const [fix, setFix] = useState("");

    useEffect(() => {
        // Check time every minute
        const checkTime = () => {
            const now = new Date();
            const hours = now.getHours();

            // Only trigger at or after 9 PM (21:00)
            if (hours >= 21) {
                const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                const savedDaily = localStorage.getItem("emmanuel_journal_daily");
                let hasReviewedToday = false;

                if (savedDaily) {
                    const entries = JSON.parse(savedDaily);
                    // Check if there's already an entry for exactly today
                    hasReviewedToday = entries.some((e: any) => e.date === todayStr);
                }

                // If no review for today, and not already marked as "snoozed" or closed manually during this session
                if (!hasReviewedToday && !sessionStorage.getItem("emmanuel_review_snoozed")) {
                    setIsOpen(true);
                }
            }
        };

        // Check immediately on mount, then every 60 seconds
        checkTime();
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const commitReflection = () => {
        if (!wins && !gaps && !fix) return;

        const savedDaily = localStorage.getItem("emmanuel_journal_daily");
        const entries = savedDaily ? JSON.parse(savedDaily) : [];

        // Ensure migration logic from Journal page is respected if entries is empty
        if (entries.length === 0) {
            const old = localStorage.getItem("emmanuel_journal");
            if (old) entries.push(...JSON.parse(old));
        }

        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            wins: wins || "No notes",
            gaps: gaps || "No notes",
            fix: fix || "No notes",
            rating: 3 // Default moderate rating if done from quick modal
        };

        const updatedEntries = [newEntry, ...entries];
        localStorage.setItem("emmanuel_journal_daily", JSON.stringify(updatedEntries));

        setIsOpen(false);
        setWins("");
        setGaps("");
        setFix("");
    };

    const snoozeModal = () => {
        setIsOpen(false);
        sessionStorage.setItem("emmanuel_review_snoozed", "true");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-bg-surface border border-gold/40 rounded-2xl p-6 w-full max-w-lg relative z-10 shadow-[0_0_50px_rgba(212,175,55,0.1)] overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold/50 via-gold to-gold/50" />

                        <div className="flex justify-between items-start mb-6 pt-2">
                            <div>
                                <h2 className="font-bebas text-3xl text-gold tracking-widest">End of Day Review</h2>
                                <p className="font-mono text-[10px] uppercase text-text-dim tracking-widest mt-1">9:00 PM · Accountability Check</p>
                            </div>
                            <button
                                onClick={snoozeModal}
                                className="text-text-muted hover:text-white transition-colors p-1"
                                title="Dismiss for now"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">01. Best Win Today</label>
                                <Textarea
                                    value={wins}
                                    onChange={(e) => setWins(e.target.value)}
                                    placeholder="What did you execute perfectly on?"
                                    className="bg-bg-base border-border-2 focus:border-gold resize-none h-[80px] font-mono text-xs uppercase"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">02. Failure / Gap</label>
                                <Textarea
                                    value={gaps}
                                    onChange={(e) => setGaps(e.target.value)}
                                    placeholder="Where did discipline waver?"
                                    className="bg-bg-base border-border-2 focus:border-red/40 resize-none h-[80px] font-mono text-xs uppercase"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">03. Tomorrow's Non-Negotiable</label>
                                <Textarea
                                    value={fix}
                                    onChange={(e) => setFix(e.target.value)}
                                    placeholder="The one thing that MUST happen."
                                    className="bg-bg-base border-border-2 focus:border-gold resize-none h-[80px] font-mono text-xs uppercase"
                                />
                            </div>

                            <Button
                                onClick={commitReflection}
                                className="w-full bg-gold hover:bg-gold-light text-black font-bebas text-xl tracking-wider py-6 mt-4"
                            >
                                <Save className="w-5 h-5 mr-2" /> Log & Seal Day
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
