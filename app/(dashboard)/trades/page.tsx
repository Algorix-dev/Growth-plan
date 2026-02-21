"use client"

import { useState, useEffect } from "react";
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
import { toast } from "sonner";

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
}

const defaultChecklist = [
    { id: 1, label: "Market Structure Identified (HH/HL/LH/LL)", checked: false },
    { id: 2, label: "Break of Structure (BOS) Confirmed", checked: false },
    { id: 3, label: "Multi-timeframe Alignment (Weekly → 1H)", checked: false },
    { id: 4, label: "Risk/Reward Minimum 1:2", checked: false },
    { id: 5, label: "Stop Loss Calculated (Max 1% Risk)", checked: false },
    { id: 6, label: "Emotion Check: No Revenge, No Fear, No FOMO", checked: false }
];

export default function TradesPage() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [checklist, setChecklist] = useState(defaultChecklist);
    const [newTrade, setNewTrade] = useState<Partial<Trade>>({
        pair: "",
        dir: "LONG",
        entry: "",
        sl: "",
        tp: "",
        outcome: "WIN",
        emotion: ""
    });

    // Load data from localStorage
    useEffect(() => {
        const savedTrades = localStorage.getItem("emmanuel_trades");
        if (savedTrades) {
            setTrades(JSON.parse(savedTrades));
        }
    }, []);

    // Save data to localStorage
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
            dir: newTrade.dir || "LONG",
            entry: newTrade.entry || "",
            sl: newTrade.sl || "",
            tp: newTrade.tp || "",
            rr: "1:2.0", // Simplified for now
            outcome: newTrade.outcome || "WIN",
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            emotion: newTrade.emotion || "Calm"
        };

        setTrades([trade, ...trades]);
        setNewTrade({ pair: "", dir: "LONG", entry: "", sl: "", tp: "", outcome: "WIN", emotion: "" });
        toast.success("Trade committed to Mission Log.");
    };

    const deleteTrade = (id: string) => {
        setTrades(trades.filter(t => t.id !== id));
        toast.info("Trade removed from log.");
    };

    const toggleCheck = (id: number) => {
        setChecklist(checklist.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
    };

    const wins = trades.filter(t => t.outcome === "WIN").length;
    const total = trades.length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    // Generate chart data from trades
    const chartData = trades.length > 0
        ? trades.slice(0, 7).reverse().map((t, i) => ({ name: t.date, wr: Math.round(((trades.slice(0, total - i).filter(tr => tr.outcome === "WIN").length) / (total - i)) * 100) }))
        : Array(7).fill({ name: "...", wr: 0 });

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
                    { label: "Profit Factor", val: total > 0 ? (wins / (total - wins || 1)).toFixed(2) : "0.00", color: "text-gold" },
                    { label: "Wins", val: wins, color: "text-green" },
                    { label: "Losses", val: total - wins, color: "text-red" },
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
                    {checklist.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => toggleCheck(item.id)}
                            className="flex items-center gap-3 group/check cursor-pointer"
                        >
                            <div className={cn(
                                "w-4 h-4 rounded border transition-all flex items-center justify-center",
                                item.checked ? "border-gold bg-gold/20" : "border-border-2 group-hover/check:border-gold group-hover/check:bg-gold/10"
                            )}>
                                <div className={cn(
                                    "w-2 h-2 rounded-sm bg-gold transition-opacity",
                                    item.checked ? "opacity-100" : "opacity-0 group-hover/check:opacity-50"
                                )} />
                            </div>
                            <span className={cn(
                                "font-mono text-[10px] uppercase tracking-tight transition-colors",
                                item.checked ? "text-gold" : "text-text-muted group-hover/check:text-text"
                            )}>
                                {item.label}
                            </span>
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
                                    <Input
                                        placeholder="EURUSD"
                                        className="bg-bg-base border-border-2"
                                        value={newTrade.pair}
                                        onChange={(e) => setNewTrade({ ...newTrade, pair: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-[9px] uppercase text-text-dim tracking-widest">Direction</label>
                                    <Select
                                        value={newTrade.dir}
                                        onValueChange={(v: "LONG" | "SHORT") => setNewTrade({ ...newTrade, dir: v })}
                                    >
                                        <SelectTrigger className="bg-bg-base border-border-2 font-mono text-xs uppercase text-white">
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
                                    <Input
                                        placeholder="0.00"
                                        className="bg-bg-base border-border-2 h-8"
                                        value={newTrade.entry}
                                        onChange={(e) => setNewTrade({ ...newTrade, entry: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-mono text-[8px] uppercase text-text-dim">SL</label>
                                    <Input
                                        placeholder="0.00"
                                        className="bg-bg-base border-border-2 h-8"
                                        value={newTrade.sl}
                                        onChange={(e) => setNewTrade({ ...newTrade, sl: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-mono text-[8px] uppercase text-text-dim">TP</label>
                                    <Input
                                        placeholder="0.00"
                                        className="bg-bg-base border-border-2 h-8"
                                        value={newTrade.tp}
                                        onChange={(e) => setNewTrade({ ...newTrade, tp: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-mono text-[9px] uppercase text-text-dim tracking-widest">Psychology / Emotion</label>
                                <Input
                                    placeholder="e.g. Calm, Patient, FOMO"
                                    className="bg-bg-base border-border-2 h-10"
                                    value={newTrade.emotion}
                                    onChange={(e) => setNewTrade({ ...newTrade, emotion: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4 pt-4">
                                <label className="font-mono text-[9px] uppercase text-text-dim tracking-widest">Outcome</label>
                                <div className="flex gap-2">
                                    {["WIN", "LOSS", "BE"].map((o) => (
                                        <button
                                            key={o}
                                            onClick={() => setNewTrade({ ...newTrade, outcome: o as Trade["outcome"] })}
                                            className={cn(
                                                "flex-1 py-3 rounded border font-bebas text-lg transition-all",
                                                newTrade.outcome === o
                                                    ? (o === "WIN" ? "bg-green border-green text-black" : o === "LOSS" ? "bg-red border-red text-white" : "bg-gold border-gold text-black")
                                                    : (o === "WIN" ? "border-green/20 text-green hover:bg-green/10" : o === "LOSS" ? "border-red/20 text-red hover:bg-red/10" : "border-gold/20 text-gold hover:bg-gold/10")
                                            )}
                                        >
                                            {o}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={addTrade}
                                className="w-full bg-gold hover:bg-gold-light text-black font-bebas text-xl py-6 mt-4"
                            >
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
                                    <CartesianGrid strokeDasharray="3 3" stroke="#21212e" vertical={false} />
                                    <XAxis dataKey="name" stroke="#5a5a78" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#5a5a78" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
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
                        <div className="flex items-center justify-between">
                            <h3 className="font-bebas text-2xl text-text-dim">Mission Log</h3>
                            <span className="font-mono text-[9px] uppercase text-text-dim">{trades.length} entries</span>
                        </div>

                        <div className="space-y-3">
                            {trades.map((trade) => (
                                <div key={trade.id} className="bg-bg-surface border border-border p-5 rounded-2xl flex items-center justify-between group hover:border-border-2 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center font-bebas text-xl",
                                            trade.outcome === "WIN" ? "bg-green/10 text-green" :
                                                trade.outcome === "LOSS" ? "bg-red/10 text-red" : "bg-gold/10 text-gold"
                                        )}>
                                            {trade.outcome[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bebas text-xl leading-tight text-white">{trade.pair} · {trade.dir}</h4>
                                            <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim">
                                                Entry: {trade.entry} · SL: {trade.sl} · TP: {trade.tp} · {trade.date}
                                            </p>
                                            <p className="font-serif italic text-[11px] text-text-muted mt-1 leading-relaxed">
                                                Emotion: {trade.emotion || "No notes"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteTrade(trade.id)}
                                        className="text-text-dim hover:text-red transition-colors md:opacity-0 group-hover:opacity-100 p-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {trades.length === 0 && (
                                <div className="py-20 text-center border border-dashed border-border rounded-2xl">
                                    <p className="font-serif italic text-text-dim">No trades logged. Access the markets.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
