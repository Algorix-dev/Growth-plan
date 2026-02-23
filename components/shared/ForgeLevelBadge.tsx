"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateLevel, getLevelTitle, xpForNextLevel } from "@/lib/xp";
import { Zap } from "lucide-react";

const STORAGE_KEY = "emmanuel_forging_xp";

interface ForgeLevelProps {
    compact?: boolean; // for mobile nav use
}

export function ForgeLevelBadge({ compact = false }: ForgeLevelProps) {
    const [totalXp, setTotalXp] = useState(0);
    const [showXpGain, setShowXpGain] = useState<number | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setTotalXp(parseInt(stored));

        // listen for XP updates from any page action
        const onXpUpdate = (e: Event) => {
            const detail = (e as CustomEvent<{ amount: number }>).detail;
            setTotalXp(prev => {
                const next = prev + detail.amount;
                localStorage.setItem(STORAGE_KEY, String(next));
                return next;
            });
            setShowXpGain(detail.amount);
            setTimeout(() => setShowXpGain(null), 2500);
        };

        window.addEventListener("xp:award", onXpUpdate);
        return () => window.removeEventListener("xp:award", onXpUpdate);
    }, []);

    const { level, xpInLevel, xpNeeded } = calculateLevel(totalXp);
    const title = getLevelTitle(level);
    const progress = xpNeeded > 0 ? Math.round((xpInLevel / xpNeeded) * 100) : 0;

    if (compact) {
        return (
            <div className="flex items-center gap-1 px-2 py-1 bg-gold/10 border border-gold/20 rounded-lg">
                <Zap className="w-3 h-3 text-gold" />
                <span className="font-mono text-[9px] text-gold font-bold">Lv.{level}</span>
                <span className="font-mono text-[9px] text-text-dim hidden sm:inline">{title}</span>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="bg-bg-surface border border-border rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                            <p className="font-bebas text-xl text-gold leading-none">Level {level}</p>
                            <p className="font-mono text-[9px] text-text-dim uppercase tracking-widest">{title}</p>
                        </div>
                    </div>
                    <span className="font-mono text-xs text-text-muted">{totalXp.toLocaleString()} XP</span>
                </div>

                {/* XP Progress Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span className="font-mono text-[9px] text-text-dim">{xpInLevel} / {xpNeeded} XP</span>
                        <span className="font-mono text-[9px] text-text-dim">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </div>
                </div>
            </div>

            {/* Floating +XP indicator */}
            <AnimatePresence>
                {showXpGain && (
                    <motion.div
                        key="xp-gain"
                        initial={{ opacity: 0, y: 0, scale: 0.8 }}
                        animate={{ opacity: 1, y: -32, scale: 1 }}
                        exit={{ opacity: 0, y: -48 }}
                        className="absolute top-0 right-4 text-gold font-bebas text-xl pointer-events-none"
                    >
                        +{showXpGain} XP
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Utility to trigger XP award from any component
export function awardXP(amount: number) {
    window.dispatchEvent(new CustomEvent("xp:award", { detail: { amount } }));
}
