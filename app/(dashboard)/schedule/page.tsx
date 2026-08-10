"use client"

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, Info, Timer, Play, Pause, StopCircle } from "lucide-react";
import { scheduleData, days, ScheduleBlock } from "@/lib/data";
import { awardXP } from "@/components/shared/ForgeLevelBadge";

export default function SchedulePage() {
    const [activeDay, setActiveDay] = useState(() => {
        if (typeof window === "undefined") return "MON";
        const now = new Date();
        const adjustedDayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
        return days[adjustedDayIndex];
    });

    const dayData = scheduleData[activeDay];

    const catColors: Record<string, string> = {
        spirit: "border-gold text-gold bg-gold/5",
        study: "border-blue text-blue bg-blue/5",
        code: "border-purple text-purple bg-purple/5",
        body: "border-green text-green bg-green/5",
        transit: "border-orange text-orange bg-orange/5",
        lecture: "border-blue text-blue bg-blue/5",
        trade: "border-red text-red bg-red/5",
        review: "border-gold text-gold bg-gold/5",
        sleep: "border-text-dim text-text-dim bg-bg-muted",
        break: "border-border text-text-muted bg-bg-muted",
        style: "border-pink text-pink bg-pink/5",
    };

    const dotColors: Record<string, string> = {
        spirit: "bg-gold",
        study: "bg-blue",
        code: "bg-purple",
        body: "bg-green",
        transit: "bg-orange",
        lecture: "bg-blue",
        trade: "bg-red",
        review: "bg-gold",
        sleep: "bg-text-dim",
        break: "bg-border",
        style: "bg-pink",
    };

    // Pomodoro Timer
    const [focusSetupTask, setFocusSetupTask] = useState<string | null>(null);
    const [customMinutes, setCustomMinutes] = useState("90");
    const [focusTask, setFocusTask] = useState<string | null>(null);
    const [focusSeconds, setFocusSeconds] = useState(90 * 60);
    const [focusRunning, setFocusRunning] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (focusRunning) {
            timerRef.current = setInterval(() => {
                setFocusSeconds(s => {
                    if (s <= 1) {
                        clearInterval(timerRef.current!);
                        setFocusRunning(false);
                        // 🏆 Award XP for Pomodoro completion
                        awardXP(50);
                        // 📝 Log the focus session to localStorage
                        const sessions = JSON.parse(localStorage.getItem("emmanuel_focus_sessions") || "[]");
                        sessions.push({
                            id: Date.now(),
                            task: focusTask,
                            duration: Math.round((focusSeconds - s + 1) / 60),
                            date: new Date().toISOString(),
                            category: "focus",
                        });
                        localStorage.setItem("emmanuel_focus_sessions", JSON.stringify(sessions));
                        return 0;
                    }
                    return s - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [focusRunning, focusTask, focusSeconds]);

    const initiateFocus = (taskTitle: string, defaultDurStr: string) => {
        let defaultMins = "90";
        if (defaultDurStr.endsWith("m")) {
            defaultMins = defaultDurStr.replace("m", "");
        } else if (defaultDurStr.endsWith("h")) {
            defaultMins = (parseInt(defaultDurStr.replace("h", "")) * 60).toString();
        }
        setCustomMinutes(defaultMins);
        setFocusSetupTask(taskTitle);
    };

    const startFocus = (taskTitle: string, minutes: number) => {
        setFocusTask(taskTitle);
        setFocusSeconds(minutes * 60);
        setFocusRunning(true);
        setFocusSetupTask(null);
    };

    const stopFocus = () => {
        setFocusTask(null);
        setFocusRunning(false);
        setFocusSeconds(90 * 60);
    };

    const fmtTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <div className="space-y-8">
            {/* Pomodoro / Focus Timer Banner */}
            <AnimatePresence>
                {focusTask && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-4 right-4 z-50 bg-bg-surface border border-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.2)] rounded-xl p-4 flex items-center gap-4 min-w-[280px]"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${focusRunning ? "bg-green animate-pulse" : "bg-gold"}`} />
                                <span className="font-mono text-[9px] uppercase tracking-widest text-text-dim">
                                    {focusRunning ? "Deep Work" : "Paused"}
                                </span>
                            </div>
                            <p className="font-bebas text-2xl text-gold leading-none">{fmtTime(focusSeconds)}</p>
                            <p className="font-mono text-[9px] text-text-dim truncate">{focusTask}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setFocusRunning(r => !r)}
                                className="p-2 bg-bg-elevated rounded-lg hover:bg-gold/10 text-text-muted hover:text-gold transition-all"
                            >
                                {focusRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={stopFocus}
                                className="p-2 bg-bg-elevated rounded-lg hover:bg-red/10 text-text-muted hover:text-red transition-all"
                            >
                                <StopCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Timer Setup Modal */}
            <AnimatePresence>
                {focusSetupTask && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-bg-surface border border-gold/30 rounded-2xl p-6 w-full max-w-sm relative shadow-2xl"
                        >
                            <h3 className="font-bebas text-2xl mb-1 text-gold">Set Focus Timer</h3>
                            <p className="font-mono text-[10px] uppercase text-text-dim mb-6 line-clamp-2">{focusSetupTask}</p>

                            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim block mb-2">Duration (Minutes)</label>
                            <input
                                type="number"
                                min="1"
                                value={customMinutes}
                                onChange={(e) => setCustomMinutes(e.target.value)}
                                className="w-full bg-bg-base border border-border-2 rounded-lg px-4 py-3 font-bebas text-2xl tracking-widest focus:border-gold outline-none mb-6 text-center"
                            />

                            <button
                                onClick={() => startFocus(focusSetupTask, parseInt(customMinutes) || 90)}
                                className="w-full bg-gold hover:bg-gold-light text-black font-bebas text-xl tracking-widest py-3 rounded-lg transition-colors"
                            >
                                Start Deep Work
                            </button>
                            <button
                                onClick={() => setFocusSetupTask(null)}
                                className="w-full mt-3 text-text-muted hover:text-white font-mono text-[10px] tracking-widest uppercase transition-colors"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bebas tracking-wider">Weekly Schedule</h1>
                    <div className="h-px bg-border flex-1" />
                    <span className="font-mono text-[10px] uppercase text-text-dim tracking-widest">3:00AM → 9:00PM</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Bus Departs", val: "7:10–7:40", sub: "Take the first bus" },
                        { label: "Campus Arrival", val: "~7:40AM", sub: "~30 min commute" },
                        { label: "Secret Rule", val: "3AM", sub: "Build before the world wakes" },
                        { label: "Status", val: "Locked In", sub: "Forging Phase Active" },
                    ].map((item) => (
                        <div key={item.label} className="bg-bg-surface border border-border p-4 rounded-lg">
                            <p className="font-mono text-[9px] uppercase tracking-widest text-text-muted mb-1">{item.label}</p>
                            <p className="font-bebas text-xl text-text">{item.val}</p>
                            <p className="font-mono text-[9px] text-text-dim">{item.sub}</p>
                        </div>
                    ))}
                </div>
            </header>

            <section className="sticky top-0 z-20 bg-bg-base/80 backdrop-blur-md py-4 border-b border-border">
                <div className="flex flex-wrap gap-2">
                    {days.map((day: string) => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={cn(
                                "px-4 py-2 rounded-md font-mono text-[10px] tracking-widest transition-all border",
                                activeDay === day
                                    ? "bg-gold border-gold text-black font-bold shadow-[0_0_15px_rgba(201,150,46,0.3)]"
                                    : "bg-bg-surface border-border text-text-muted hover:text-text hover:border-border-2"
                            )}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </section>

            <div className="relative">
                <div className="bg-bg-surface border border-border border-l-4 border-l-gold rounded-xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-bebas text-2xl tracking-tight text-text mb-1">{activeDay}DAY</h2>
                        <p className="font-mono text-xs text-text-muted">{dayData.courses}</p>
                    </div>
                    <span className="px-3 py-1 bg-gold/10 border border-gold/20 text-gold font-mono text-[10px] uppercase tracking-widest rounded-sm self-start md:self-center">
                        {dayData.tag}
                    </span>
                </div>

                <div className="relative pl-12 md:pl-20 py-4">
                    <div className="absolute left-[54px] md:left-[84px] top-0 bottom-0 w-px bg-border" />

                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeDay}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                {dayData.blocks.map((block: ScheduleBlock, i: number) => (
                                    <div key={i} className="relative group">
                                        <div className="absolute -left-12 md:-left-20 top-1/2 -translate-y-1/2 w-8 md:w-16 text-right font-mono text-[10px] text-text-muted group-hover:text-text transition-colors">
                                            {block.time}
                                        </div>

                                        <div className={cn(
                                            "absolute -left-[56.5px] md:-left-[86.5px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full z-10 transition-transform group-hover:scale-150",
                                            dotColors[block.cat]
                                        )} />

                                        <div
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-bg-elevated/50 cursor-pointer group/block",
                                                catColors[block.cat]
                                            )}
                                            onClick={() => initiateFocus(block.title, block.dur)}
                                            title="Click to start focus timer"
                                        >
                                            <span className="font-serif text-lg">{block.emoji}</span>
                                            <div className="flex-1">
                                                <h4 className="font-mono text-xs font-semibold uppercase tracking-tight">{block.title}</h4>
                                                <p className="font-mono text-[10px] text-current opacity-60">Duration: {block.dur}</p>
                                            </div>
                                            <Timer className="w-3.5 h-3.5 opacity-0 group-hover/block:opacity-40 transition-opacity shrink-0" />
                                        </div>
                                    </div>
                                ))}

                                {dayData.blocks.length === 0 && (
                                    <div className="py-20 text-center">
                                        <Info className="w-8 h-8 text-text-dim mx-auto mb-4" />
                                        <p className="font-serif italic text-text-muted">No blocks defined for this day in simulation.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="bg-bg-surface border border-red/20 border-l-4 border-l-red p-6 rounded-xl flex items-center gap-4">
                <MapPin className="text-red w-5 h-5" />
                <div>
                    <h4 className="font-bebas text-lg text-red">Campus Commute</h4>
                    <p className="font-serif italic text-sm text-text-muted">🚌 First bus: 7:10–7:40AM · Arrive ~7:40AM. No exceptions. Arrive before the crowd.</p>
                </div>
            </div>
        </div>
    );
}
