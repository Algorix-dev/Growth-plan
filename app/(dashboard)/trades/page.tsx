"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Trash2,
    CheckCircle2,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const chartData = [
    { name: 'Mon', wr: 45 },
    { name: 'Tue', wr: 52 },
    { name: 'Wed', wr: 48 },
    { name: 'Thu', wr: 61 },
    { name: 'Fri', wr: 58 },
    { name: 'Sat', wr: 64 },
    { name: 'Sun', wr: 60 },
];

export default function TradesPage() {
    const [trades] = useState([
        { id: 1, pair: "EURUSD", dir: "LONG", entry: "1.0850", sl: "1.0820", tp: "1.0910", rr: "1:2", outcome: "WIN", date: "20 Feb", emotion: "Calm" },
        { id: 2, pair: "BTCUSD", dir: "SHORT", entry: "52400", sl: "53000", tp: "51000", rr: "1:2.3", outcome: "LOSS", date: "19 Feb", emotion: "Felt fomo" },
    ]);

    const wins = trades.filter(t => t.outcome === "WIN").length;
    const total = trades.length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    return (
        <div className="space-y-12">
            <header className="flex items-center gap-4">
                <h1 className="text-3xl font-bebas tracking-wider">Trading Edge</h1>
                <div className="h-px bg-border flex-1" />
                <span className="font-mono text-[10px] uppercase text-text-dim tracking-widest">Logic over Emotion</span>
            </header>

            {/* Stats Bar */}
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Total Trades", val: total, color: "text-text" },
                    { label: "Win Rate", val: `${winRate}%`, color: "text-green" },
                    { label: "Profit Factor", val: "1.82", color: "text-gold" },
                    { label: "Current Streak", val: "3W", color: "text-green" },
                    { label: "RR Average", val: "1:1.9", color: "text-blue" },
                ].map((stat, i) => (
                    <div key={i} className="bg-bg-surface border border-border p-5 rounded-xl text-center">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim mb-1">{stat.label}</p>
                        <p className={cn("font-bebas text-3xl", stat.color)}>{stat.val}</p>
                    </div>
                ))}
            </section>

            {/* Pre-trade Checklist */}
            <section className="bg-bg-surface border border-border p-8 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all">
                    <CheckCircle2 className="w-32 h-32 text-gold" />
                </div>
                <h3 className="font-bebas text-2xl mb-6 flex items-center gap-3">
                    <Zap className="text-gold w-5 h-5" /> Pre-Trade Checklist
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {[
                        "Market Structure Identified (HH/HL/LH/LL)",
                        "Break of Structure (BOS) Confirmed",
                        "Multi-timeframe Alignment (Weekly → 1H)",
                        "Risk/Reward Minimum 1:2",
                        "Stop Loss Calculated (Max 1% Risk)",
                        "Emotion Check: No Revenge, No Fear, No FOMO"
                    ].map((check, idx) => (
                        <div key={idx} className="flex items-center gap-3 group/check cursor-pointer">
                            <div className="w-4 h-4 rounded border border-border-2 group-hover/check:border-gold group-hover/check:bg-gold/10 transition-all flex items-center justify-center">
                                <div className="w-2 h-2 rounded-sm bg-gold opacity-0 group-hover/check:opacity-100 transition-opacity" />
                            </div>
                            <span className="font-mono text-[10px] uppercase tracking-tight text-text-muted group-hover/check:text-text">{check}</span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trading Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-bg-surface border border-border p-6 rounded-2xl sticky top-8">
                        <h3 className="font-bebas text-2xl mb-6">Log New Trade</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="font-mono text-[9px] uppercase text-text-dim tracking-widest">Pair / Asset</label>
                                    <Input placeholder="EURUSD" className="bg-bg-base border-border-2" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-[9px] uppercase text-text-dim tracking-widest">Direction</label>
                                    <Select defaultValue="LONG">
                                        <SelectTrigger className="bg-bg-base border-border-2 font-mono text-xs uppercase">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-bg-surface border-border">
                                            <SelectItem value="LONG">LONG</SelectItem>
                                            <SelectItem value="SHORT">SHORT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="font-mono text-[8px] uppercase text-text-dim">Entry</label>
                                    <Input placeholder="0.00" className="bg-bg-base border-border-2 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-mono text-[8px] uppercase text-text-dim">SL</label>
                                    <Input placeholder="0.00" className="bg-bg-base border-border-2 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-mono text-[8px] uppercase text-text-dim">TP</label>
                                    <Input placeholder="0.00" className="bg-bg-base border-border-2 h-8" />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <label className="font-mono text-[9px] uppercase text-text-dim tracking-widest">Outcome</label>
                                <div className="flex gap-2">
                                    {["WIN", "LOSS", "BE"].map((o) => (
                                        <button
                                            key={o}
                                            className={cn(
                                                "flex-1 py-3 rounded border font-bebas text-lg transition-all",
                                                o === "WIN" ? "border-green/20 text-green hover:bg-green/10" :
                                                    o === "LOSS" ? "border-red/20 text-red hover:bg-red/10" :
                                                        "border-gold/20 text-gold hover:bg-gold/10"
                                            )}
                                        >
                                            {o}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full bg-gold hover:bg-gold-light text-black font-bebas text-xl py-6 mt-4">
                                COMMIT TRADE
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Trade History & Performance */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Win Rate Chart */}
                    <div className="bg-bg-surface border border-border p-6 rounded-2xl">
                        <h3 className="font-bebas text-xl mb-6">Win Rate Trend</h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#21212e" />
                                    <XAxis dataKey="name" stroke="#5a5a78" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#5a5a78" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f0f14', border: '1px solid #21212e', fontSize: '10px' }}
                                        itemStyle={{ color: '#c9962e' }}
                                    />
                                    <Line type="monotone" dataKey="wr" stroke="#c9962e" strokeWidth={2} dot={{ fill: '#c9962e', r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Log */}
                    <div className="space-y-4">
                        <h3 className="font-bebas text-2xl text-text-dim">Mission Log</h3>
                        <div className="space-y-3">
                            {trades.map((trade) => (
                                <div key={trade.id} className="bg-bg-surface border border-border p-5 rounded-2xl flex items-center justify-between group hover:border-border-2 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center font-bebas text-xl",
                                            trade.outcome === "WIN" ? "bg-green/10 text-green" : "bg-red/10 text-red"
                                        )}>
                                            {trade.outcome[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bebas text-xl leading-tight">{trade.pair} · {trade.dir}</h4>
                                            <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim">
                                                Entry: {trade.entry} · R:R: {trade.rr} · {trade.date}
                                            </p>
                                            <p className="font-serif italic text-[11px] text-text-muted mt-1 leading-relaxed">
                                                Emotion: {trade.emotion}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-text-dim hover:text-red transition-colors opacity-0 group-hover:opacity-100 p-2">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
