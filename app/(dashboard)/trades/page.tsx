"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
    Trash2,
    ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Recharts removed as not used in v2 simplified view
import { toast } from "sonner";
import { awardXP } from "@/components/shared/ForgeLevelBadge";

interface Trade {
    id: string;
    pair: string;
    dir: "LONG" | "SHORT";
    entry: string;
    sl: string;
    tp: string;
    rr: string;
    outcome: "WIN" | "LOSS" | "BE";
    date: string;
    emotion: string;
    strategy: string;
    riskPercent: string;
    violation?: string;
    screenshotUrl?: string;
}

const STRATEGIES = ["MMXM", "Silver Bullet", "Unicorn", "Turtle Soup", "IFVG", "Other"];

export default function TradesPage() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [newTrade, setNewTrade] = useState<Partial<Trade>>({
        pair: "",
        dir: "LONG",
        entry: "",
        sl: "",
        tp: "",
        outcome: "WIN",
        emotion: "",
        strategy: "MMXM",
        riskPercent: "1.0",
        violation: "NONE"
    });

    useEffect(() => {
        const savedTrades = localStorage.getItem("emmanuel_trades");
        if (savedTrades) setTrades(JSON.parse(savedTrades));
    }, []);

    useEffect(() => {
        localStorage.setItem("emmanuel_trades", JSON.stringify(trades));
    }, [trades]);

    const addTrade = () => {
        if (!newTrade.pair || !newTrade.entry) {
            toast.error("Pair and Entry Price are required.");
            return;
        }

        const trade: Trade = {
            id: Math.random().toString(36).substr(2, 9),
            pair: newTrade.pair || "",
            dir: (newTrade.dir as "LONG" | "SHORT") || "LONG",
            entry: newTrade.entry || "",
            sl: newTrade.sl || "",
            tp: newTrade.tp || "",
            rr: "1:2.0",
            outcome: (newTrade.outcome as "WIN" | "LOSS" | "BE") || "WIN",
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            emotion: newTrade.emotion || "Systematic",
            strategy: newTrade.strategy || "MMXM",
            riskPercent: newTrade.riskPercent || "1.0",
            violation: newTrade.violation || "NONE"
        };

        setTrades([trade, ...trades]);
        setNewTrade({ pair: "", dir: "LONG", entry: "", sl: "", tp: "", outcome: "WIN", emotion: "", strategy: "MMXM", riskPercent: "1.0", violation: "NONE" });
        awardXP(trade.outcome === "WIN" ? 50 : 20, "Finance");
        toast.success("Trade log updated.");
    };

    const deleteTrade = (id: string) => {
        setTrades(trades.filter(t => t.id !== id));
        toast.info("Trade removed.");
    };

    const wins = trades.filter(t => t.outcome === "WIN").length;
    const losses = trades.filter(t => t.outcome === "LOSS").length;
    const total = trades.filter(t => t.outcome !== "BE").length;
    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";

    return (
        <div className="space-y-12 pb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bebas tracking-wider text-gold">Tactical Portfolio</h1>
                    <p className="font-mono text-[10px] uppercase text-text-dim tracking-widest">Calculated Execution · Finance Pillar</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="font-mono text-[9px] uppercase text-text-dim">Win Rate</p>
                        <p className="font-bebas text-3xl text-green">{winRate}%</p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-[9px] uppercase text-text-dim">Profit Factor</p>
                        <p className="font-bebas text-3xl text-gold">{(wins / (losses || 1)).toFixed(2)}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-bg-surface border border-border p-6 rounded-2xl space-y-4">
                        <h3 className="font-bebas text-2xl mb-4">Log Execution</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="font-mono text-[9px] uppercase text-text-dim">Strategy</label>
                                <Select value={newTrade.strategy} onValueChange={(v) => setNewTrade({ ...newTrade, strategy: v })}>
                                    <SelectTrigger className="bg-bg-base border-border-2"><SelectValue /></SelectTrigger>
                                    <SelectContent>{STRATEGIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <label className="font-mono text-[9px] uppercase text-text-dim">Risk %</label>
                                <Input type="number" step="0.5" value={newTrade.riskPercent} onChange={(e) => setNewTrade({ ...newTrade, riskPercent: e.target.value })} className="bg-bg-base border-border-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="font-mono text-[9px] uppercase text-text-dim">Pair</label>
                                <Input placeholder="XAUUSD" value={newTrade.pair} onChange={(e) => setNewTrade({ ...newTrade, pair: e.target.value.toUpperCase() })} className="bg-bg-base border-border-2" />
                            </div>
                            <div className="space-y-1">
                                <label className="font-mono text-[9px] uppercase text-text-dim">Outcome</label>
                                <Select value={newTrade.outcome} onValueChange={(v: "WIN" | "LOSS" | "BE") => setNewTrade({ ...newTrade, outcome: v })}>
                                    <SelectTrigger className="bg-bg-base border-border-2"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="WIN">WIN</SelectItem>
                                        <SelectItem value="LOSS">LOSS</SelectItem>
                                        <SelectItem value="BE">B.E</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="font-mono text-[9px] uppercase text-text-dim">Rule Violation</label>
                            <Select value={newTrade.violation} onValueChange={(v) => setNewTrade({ ...newTrade, violation: v })}>
                                <SelectTrigger className="bg-bg-base border-border-2"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NONE">NONE (Disciplined)</SelectItem>
                                    <SelectItem value="FOMO">FOMO / Chasing</SelectItem>
                                    <SelectItem value="REVENGE">Revenge Trading</SelectItem>
                                    <SelectItem value="EARLY_EXIT">Early Exit</SelectItem>
                                    <SelectItem value="OVERSIZE">Oversizing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={addTrade} className="w-full bg-gold hover:bg-gold-light text-bg-dark font-bebas text-xl py-6 rounded-xl shadow-lg shadow-gold/10">
                            COMMIT LOG
                        </Button>
                    </div>
                </div>

                {/* History */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-bebas text-2xl text-text-muted">Execution History</h2>
                        <span className="font-mono text-[9px] text-text-dim uppercase tracking-widest">{trades.length} Trades Total</span>
                    </div>

                    <div className="space-y-3">
                        {trades.map((t) => (
                            <div key={t.id} className="bg-bg-surface border border-border p-5 rounded-2xl flex items-center justify-between group hover:border-gold/20 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center font-bebas text-xl",
                                        t.outcome === "WIN" ? "bg-green/10 text-green" : t.outcome === "LOSS" ? "bg-red/10 text-red" : "bg-gold/10 text-gold"
                                    )}>
                                        {t.outcome[0]}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bebas text-xl text-white">{t.pair} · {t.dir}</h4>
                                            <span className="px-1.5 py-0.5 bg-bg-base border border-border rounded text-[8px] font-mono text-gold uppercase">{t.strategy}</span>
                                            {t.violation !== "NONE" && <span className="flex items-center gap-1 text-[8px] font-mono text-red"><ShieldAlert className="w-2 h-2" /> {t.violation}</span>}
                                        </div>
                                        <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim mt-1">
                                            Risk: {t.riskPercent}% · {t.date} · {t.emotion}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => deleteTrade(t.id)} className="p-2 text-text-dim hover:text-red transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
