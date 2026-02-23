"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Sword, Target, Flame, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { awardXP } from "@/components/shared/ForgeLevelBadge";

const RANKS = [
    { level: "White", color: "text-white bg-white/10" },
    { level: "Blue", color: "text-blue-400 bg-blue-400/10" },
    { level: "Purple", color: "text-purple-400 bg-purple-400/10" },
    { level: "Brown", color: "text-orange-950 bg-orange-950/10" },
    { level: "Black", color: "text-gold bg-gold/10" },
];

export default function MartialArtsPage() {
    const [currentRank, setCurrentRank] = useState("White");

    const logSparring = () => {
        awardXP(100, "Athletics");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-bebas text-4xl text-gold tracking-tight">Martial Progression</h1>
                    <p className="font-mono text-[10px] text-text-dim uppercase tracking-widest">The Warrior's Path</p>
                </div>

                <div className="flex gap-2">
                    {RANKS.map((r) => (
                        <div
                            key={r.level}
                            className={cn(
                                "w-3 h-8 rounded-sm",
                                r.color,
                                currentRank === r.level ? "scale-110 shadow-[0_0_10px_currentColor]" : "opacity-30"
                            )}
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skill Mastery */}
                <div className="bg-bg-surface border border-border rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Sword className="w-5 h-5 text-gold" />
                        <h2 className="font-bebas text-xl text-text-muted">Current Curriculum</h2>
                    </div>

                    <div className="space-y-3">
                        {[
                            { skill: "Striking Accuracy", progress: 65 },
                            { skill: "Grappling Control", progress: 40 },
                            { skill: "Footwork/Agility", progress: 80 },
                            { skill: "Mental Composure", progress: 55 },
                        ].map((s) => (
                            <div key={s.skill} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono uppercase">
                                    <span className="text-text-dim">{s.skill}</span>
                                    <span className="text-gold">{s.progress}%</span>
                                </div>
                                <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gold transition-all duration-1000"
                                        style={{ width: `${s.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Center */}
                <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-gold" />
                            <h2 className="font-bebas text-xl text-text-muted">Combat Readiness</h2>
                        </div>
                        <p className="text-xs text-text-dim leading-relaxed">
                            Log high-intensity sparring or drill sessions. Each major session contributes to the Athletics pillar and awards 100 XP.
                        </p>
                    </div>

                    <button
                        onClick={logSparring}
                        className="w-full py-4 bg-gold text-bg-dark font-bebas text-xl rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-gold/10"
                    >
                        LOG INTENSE SPARRING
                    </button>
                </div>
            </div>

            {/* Techniques List */}
            <div className="bg-bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-bebas text-lg text-text-muted mb-4 uppercase tracking-wider">Technique Library</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Double Leg Takdown", "Roundhouse Kick", "Kimura Lock", "Rear Naked Choke", "Thai Clinch", "Overhand Right"].map(t => (
                        <div key={t} className="p-3 bg-bg-elevated border border-border rounded-xl text-center hover:border-gold/30 transition-all">
                            <p className="text-[10px] text-text-muted font-mono">{t}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
