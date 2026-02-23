"use client";

import { useState, useEffect } from "react";
import {
    BarChart3,
    Clock,
    Calendar,
    Zap,
    Trophy
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface FocusSession {
    id: number;
    duration: number;
    date: string;
    task: string | null;
}

export default function AnalyticsPage() {
    const [sessions, setSessions] = useState<FocusSession[]>([]);
    const [stats, setStats] = useState({
        totalHours: 0,
        avgSession: 0,
        bestDay: 0,
        streak: 0
    });

    useEffect(() => {
        const saved = localStorage.getItem("emmanuel_focus_sessions");
        if (saved) {
            const data: FocusSession[] = JSON.parse(saved);
            setSessions(data);

            // Calculate stats
            const totalMins = data.reduce((acc, s) => acc + s.duration, 0);
            const hours = Math.round((totalMins / 60) * 10) / 10;

            // Daily aggregation
            const daily: Record<string, number> = {};
            data.forEach(s => {
                const dateKey = s.date.split('T')[0];
                daily[dateKey] = (daily[dateKey] || 0) + s.duration;
            });
            const maxMins = Math.max(...Object.values(daily), 0);

            setStats({
                totalHours: hours,
                avgSession: data.length > 0 ? Math.round(totalMins / data.length) : 0,
                bestDay: Math.round((maxMins / 60) * 10) / 10,
                streak: Object.keys(daily).length // Simplified for now
            });
        }
    }, []);

    // Last 7 days chart data
    const getChartData = () => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const displayDate = d.toLocaleDateString('en-US', { weekday: 'short' });

            const dayMins = sessions
                .filter(s => s.date.startsWith(dateStr))
                .reduce((acc, s) => acc + s.duration, 0);

            data.push({
                name: displayDate,
                hours: Math.round((dayMins / 60) * 10) / 10,
                mins: dayMins
            });
        }
        return data;
    };

    const chartData = getChartData();

    return (
        <div className="space-y-10 pb-20">
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bebas tracking-wider">Focus Analytics</h1>
                    <div className="h-px bg-border flex-1" />
                    <BarChart3 className="w-5 h-5 text-gold" />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
                    Deep Work Quantified • System Performance Metrics
                </p>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    label="Total Deep Work"
                    value={`${stats.totalHours}h`}
                    icon={Clock}
                    sub="Lifetime Focused"
                />
                <StatCard
                    label="Avg. Session"
                    value={`${stats.avgSession}m`}
                    icon={Zap}
                    sub="Per Pomodoro"
                />
                <StatCard
                    label="Best Day"
                    value={`${stats.bestDay}h`}
                    icon={Trophy}
                    sub="Single Day Peak"
                />
                <StatCard
                    label="Focus Days"
                    value={stats.streak.toString()}
                    icon={Calendar}
                    sub="Logged Sessions"
                />
            </div>

            {/* Main Chart */}
            <div className="bg-bg-surface border border-border rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bebas text-xl tracking-wide">Deep Work Distribution</h3>
                        <p className="font-mono text-[9px] text-text-dim uppercase tracking-widest">Last 7 Days (Hours)</p>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#737373', fontSize: 10, fontFamily: 'monospace' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#737373', fontSize: 10, fontFamily: 'monospace' }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(212, 175, 55, 0.05)' }}
                                contentStyle={{
                                    backgroundColor: '#171717',
                                    border: '1px solid #D4AF3740',
                                    borderRadius: '8px',
                                    fontFamily: 'monospace',
                                    fontSize: '10px'
                                }}
                            />
                            <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.hours > 0 ? '#D4AF37' : '#262626'}
                                        fillOpacity={0.8}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Session History */}
            <div className="space-y-4">
                <h3 className="font-bebas text-xl tracking-wide">Recent Sessions</h3>
                <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-elevated/50 font-mono text-[10px] uppercase tracking-widest text-text-dim border-b border-border">
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Task / Block</th>
                                <th className="px-4 py-3 font-medium text-right">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sessions.length > 0 ? sessions.slice(-10).reverse().map((s) => (
                                <tr key={s.id} className="group hover:bg-gold/5 transition-colors">
                                    <td className="px-4 py-4 font-mono text-xs text-text-muted">
                                        {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-4 py-4 font-mono text-xs text-text-muted truncate max-w-[200px]">
                                        {s.task || "Focused Study"}
                                    </td>
                                    <td className="px-4 py-4 font-mono text-xs text-gold text-right font-bold">
                                        {s.duration}m
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-text-dim font-mono text-xs italic">
                                        No focus sessions recorded yet. Start the timer in Schedule.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string;
    icon: React.ElementType;
    sub: string;
}

function StatCard({ label, value, icon: Icon, sub }: StatCardProps) {
    return (
        <div className="bg-bg-surface border border-border rounded-xl p-4 space-y-1 ring-1 ring-gold/0 hover:ring-gold/20 transition-all group">
            <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-dim group-hover:text-text-muted">{label}</span>
                <Icon className="w-4 h-4 text-gold/40 group-hover:text-gold transition-colors" />
            </div>
            <p className="text-3xl font-bebas tracking-wider text-white">{value}</p>
            <p className="font-mono text-[8px] text-text-dim italic">{sub}</p>
        </div>
    );
}
