"use client";

import { useState } from "react";
import {
    ShieldCheck,
    LineChart,
    Calculator,
    CheckCircle2,
    Clock,
    Map,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const ROADMAP_PHASES = [
    {
        id: 1,
        title: "Foundation",
        subtitle: "Months 1-3 · Demo Only",
        concepts: ["Market Structure (BOS/ChoCH)", "Liquidity Pools (EQH/EQL)", "Order Blocks (Mitigation)", "Fair Value Gaps (Imbalances)", "Premium vs Discount"]
    },
    {
        id: 2,
        title: "Strategy",
        subtitle: "Months 3-6 · Build Your Edge",
        concepts: ["The SMC Confluence Entry", "All 7 Checklist Items", "Risk Management Rules", "Multi-Timeframe Analysis", "Kill Zone Timing"]
    },
    {
        id: 3,
        title: "Psychology",
        subtitle: "The Final Boss",
        concepts: ["The Composure Protocol", "Win/Loss Detachment", "Anti-FOMO Systems", "Greed Mitigation", "Emotional Neutrality"]
    }
];

const CHECKLIST_ITEMS = [
    "Higher Timeframe Bias Confirmed",
    "Price in Discount/Premium Zone",
    "Valid Order Block Identified",
    "FVG Present in Entry Zone",
    "Liquidity Sweep Occurred",
    "Lower Timeframe BOS Confirmation",
    "Risk:Reward Minimum 1:2"
];

export default function TradingRoadmapPage() {
    const [activePhase, setActivePhase] = useState(1);
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

    // Position Sizer State
    const [balance, setBalance] = useState(1000);
    const [riskPercent, setRiskPercent] = useState(1);
    const [stopLoss, setStopLoss] = useState(10); // in pips

    const positionSize = (balance * (riskPercent / 100)) / (stopLoss * 1); // rough micro lot calc
    const riskAmount = balance * (riskPercent / 100);

    const toggleCheck = (idx: number) => {
        setCheckedItems(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <LineChart className="w-5 h-5 text-gold" />
                        <span className="font-mono text-[10px] text-gold uppercase tracking-[0.2em]">Finance Pillar</span>
                    </div>
                    <h1 className="font-bebas text-5xl text-gold tracking-tight lowercase">Strategic Roadmap</h1>
                    <p className="font-mono text-xs text-text-dim mt-1">SMC · ICT framework · Discipline over Emotion</p>
                </div>

                <div className="flex items-center gap-3 bg-bg-surface border border-border p-3 rounded-2xl shadow-sm">
                    <div className="text-right">
                        <p className="text-[9px] font-mono text-text-dim uppercase">Current Bias</p>
                        <p className="font-bold text-gold text-xs">Neutral / Analyzing</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gold/5 flex items-center justify-center border border-gold/10">
                        <Activity className="w-5 h-5 text-gold animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Phase Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ROADMAP_PHASES.map((phase) => (
                    <button
                        key={phase.id}
                        onClick={() => setActivePhase(phase.id)}
                        className={cn(
                            "p-6 rounded-3xl border text-left transition-all relative overflow-hidden group",
                            activePhase === phase.id
                                ? "bg-bg-surface border-gold/50 shadow-lg shadow-gold/10"
                                : "bg-bg-surface/50 border-border opacity-70 hover:opacity-100"
                        )}
                    >
                        {activePhase === phase.id && <div className="absolute top-0 right-0 p-4 opacity-10"><Map className="w-12 h-12 text-gold" /></div>}
                        <p className="font-mono text-[10px] text-gold uppercase tracking-widest mb-1">Phase 0{phase.id}</p>
                        <h3 className="font-bebas text-2xl text-text transition-colors group-hover:text-gold">{phase.title}</h3>
                        <p className="text-[10px] font-mono text-text-dim lowercase mt-1 tracking-tighter">{phase.subtitle}</p>

                        <div className="mt-4 flex gap-1">
                            {[1, 2, 3, 4, 5].map(dot => (
                                <div key={dot} className={cn("h-1 flex-1 rounded-full", activePhase >= phase.id ? "bg-gold" : "bg-bg-elevated")} />
                            ))}
                        </div>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Phase Details */}
                <div className="lg:col-span-2 space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePhase}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-bg-surface border border-border rounded-[2.5rem] p-8 space-y-8"
                        >
                            <div>
                                <h2 className="font-bebas text-3xl text-text mb-2">Technical Core: {ROADMAP_PHASES.find(p => p.id === activePhase)?.title}</h2>
                                <p className="text-sm text-text-dim">Master these concepts in the demo phase. Pattern recognition comes from volume.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ROADMAP_PHASES.find(p => p.id === activePhase)?.concepts.map((concept, idx) => (
                                    <div key={concept} className="flex items-center gap-4 p-4 bg-bg-elevated border border-border/50 rounded-2xl group hover:border-gold/30 transition-all">
                                        <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center font-mono text-[10px] text-gold font-bold">
                                            {idx + 1}
                                        </div>
                                        <span className="text-sm text-text-muted">{concept}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-bg-dark/40 rounded-2xl border border-gold/5 flex items-start gap-4">
                                <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-1" />
                                <div>
                                    <p className="text-[10px] font-mono text-gold uppercase tracking-widest mb-1">The Golden Rule</p>
                                    <p className="text-xs text-text-dim italic leading-relaxed">
                                        &quot;You cannot remove loss. You can only control it until your wins make it irrelevant.&quot;
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Kill Zones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <KillZoneCard
                            title="London Open"
                            time="7AM - 10AM GMT"
                            note="Highest probability setup for EURUSD & GBPUSD"
                        />
                        <KillZoneCard
                            title="New York Open"
                            time="1PM - 4PM GMT"
                            note="Silver Bullet window. High volatility, clear trends."
                        />
                    </div>
                </div>

                {/* Entry Protocol & Calculator */}
                <div className="space-y-6">
                    {/* Entry Checklist */}
                    <div className="bg-bg-surface border border-border rounded-3xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bebas text-xl text-text shadow-sm tracking-wide">Entry Protocol</h4>
                            <span className="text-[10px] font-mono text-gold uppercase">{checkedItems.size}/7</span>
                        </div>

                        <div className="space-y-3">
                            {CHECKLIST_ITEMS.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => toggleCheck(idx)}
                                    className="w-full flex items-center gap-3 text-left group"
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded border transition-all flex items-center justify-center",
                                        checkedItems.has(idx) ? "bg-gold border-gold text-bg-dark" : "border-border group-hover:border-gold/30"
                                    )}>
                                        {checkedItems.has(idx) && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </div>
                                    <span className={cn(
                                        "text-xs transition-all",
                                        checkedItems.has(idx) ? "text-text-dim line-through" : "text-text-muted"
                                    )}>
                                        {item}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {checkedItems.size === 7 ? (
                            <div className="p-3 bg-green/10 border border-green/20 rounded-xl text-center animate-pulse">
                                <p className="text-[10px] font-mono text-green uppercase font-bold tracking-widest">Execution Qualified</p>
                            </div>
                        ) : (
                            <div className="p-3 bg-red/5 border border-red/10 rounded-xl text-center">
                                <p className="text-[10px] font-mono text-red/60 uppercase tracking-widest">Patience Required</p>
                            </div>
                        )}
                    </div>

                    {/* Risk Calculator */}
                    <div className="bg-bg-surface border border-border rounded-3xl p-6 space-y-6">
                        <div className="flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-gold" />
                            <h4 className="font-bebas text-xl text-text shadow-sm tracking-wide">Position Sizer</h4>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between font-mono text-[9px] text-text-dim uppercase tracking-widest">
                                    <span>Account Balance</span>
                                    <span>${balance}</span>
                                </div>
                                <input
                                    type="range" min="100" max="5000" step="50"
                                    value={balance} onChange={(e) => setBalance(Number(e.target.value))}
                                    className="w-full accent-gold h-1 bg-bg-elevated rounded-full appearance-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between font-mono text-[9px] text-text-dim uppercase tracking-widest">
                                    <span>Risk Amount</span>
                                    <span className="text-gold font-bold">${riskAmount.toFixed(0)} ({riskPercent}%)</span>
                                </div>
                                <input
                                    type="range" min="0.5" max="3" step="0.5"
                                    value={riskPercent} onChange={(e) => setRiskPercent(Number(e.target.value))}
                                    className="w-full accent-gold h-1 bg-bg-elevated rounded-full appearance-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between font-mono text-[9px] text-text-dim uppercase tracking-widest">
                                    <span>Stop Loss (Pips)</span>
                                    <span>{stopLoss} Pips</span>
                                </div>
                                <input
                                    type="range" min="5" max="30" step="1"
                                    value={stopLoss} onChange={(e) => setStopLoss(Number(e.target.value))}
                                    className="w-full accent-gold h-1 bg-bg-elevated rounded-full appearance-none"
                                />
                            </div>

                            <div className="pt-4 border-t border-border/50">
                                <div className="bg-bg-elevated p-4 rounded-2xl border border-border/50 text-center">
                                    <p className="text-[10px] font-mono text-text-dim uppercase tracking-[0.2em] mb-1">Recommended Size</p>
                                    <p className="text-4xl font-bebas text-gold tracking-widest">{(positionSize / 10).toFixed(2)} <span className="text-xs uppercase">lots</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface KillZoneCardProps {
    title: string;
    time: string;
    note: string;
}

function KillZoneCard({ title, time, note }: KillZoneCardProps) {
    return (
        <div className="bg-bg-surface border border-border rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-all" />
            <div className="relative z-10 flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gold" />
                    <h5 className="font-bebas text-lg text-text shadow-sm uppercase tracking-wider">{title}</h5>
                </div>
                <p className="font-mono text-xs text-gold font-bold">{time}</p>
                <p className="text-[10px] text-text-dim leading-relaxed mt-2">{note}</p>
            </div>
        </div>
    );
}
