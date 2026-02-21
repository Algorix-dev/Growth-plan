"use client"

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, Info, Timer, Play, Pause, StopCircle } from "lucide-react";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface ScheduleBlock {
    time: string;
    cat: string;
    emoji: string;
    title: string;
    dur: string;
}

interface DayData {
    courses: string;
    tag: string;
    blocks: ScheduleBlock[];
}

const scheduleData: Record<string, DayData> = {
    MON: {
        courses: "COS202 (11AM–1PM) · CUACOS216 (2PM–4PM)",
        tag: "2 Lectures · Busy Day",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna devotion + focused prayer", dur: "30m" },
            { time: "3:30AM", cat: "study", emoji: "📖", title: "COS202 self-study — OOP theory", dur: "60m" },
            { time: "4:30AM", cat: "study", emoji: "📖", title: "CUACOS216 self-study — graphics concepts", dur: "45m" },
            { time: "5:15AM", cat: "code", emoji: "💻", title: "LeetCode / OOP project work", dur: "45m" },
            { time: "6:00AM", cat: "body", emoji: "🤸", title: "Calisthenics — Push + Core circuit", dur: "40m" },
            { time: "6:40AM", cat: "style", emoji: "🪞", title: "Shower · Grooming · Fit selection", dur: "35m" },
            { time: "7:15AM", cat: "transit", emoji: "🚌", title: "First bus to campus · Audio revision", dur: "30m" },
            { time: "7:45AM", cat: "study", emoji: "📖", title: "On-campus prep — review COS202 notes", dur: "75m" },
            { time: "9:00AM", cat: "break", emoji: "☕", title: "Breakfast on campus · Social time", dur: "60m" },
            { time: "11:00AM", cat: "lecture", emoji: "🏫", title: "COS202 — Computer Programming II", dur: "120m" },
            { time: "1:00PM", cat: "break", emoji: "🍽️", title: "Lunch + rest", dur: "60m" },
            { time: "2:00PM", cat: "lecture", emoji: "🏫", title: "CUACOS216 — Introduction to Graphics", dur: "120m" },
            { time: "4:00PM", cat: "transit", emoji: "🚌", title: "Return bus · Reflection", dur: "30m" },
            { time: "4:30PM", cat: "trade", emoji: "📈", title: "Market analysis · Chart structure", dur: "45m" },
            { time: "5:15PM", cat: "body", emoji: "🏀", title: "Basketball / football", dur: "50m" },
            { time: "6:05PM", cat: "review", emoji: "📝", title: "Daily academic review", dur: "40m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep. Exactly 6 hours.", dur: "6h" },
        ]
    },
    TUE: {
        courses: "INS204 (9AM–11AM) · CUACSC214 (11AM–1PM) · COS202 (2PM–3PM)",
        tag: "3 Lectures · Heaviest Day",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna + prayer", dur: "25m" },
            { time: "3:25AM", cat: "study", emoji: "📖", title: "INS204 self-study — frameworks", dur: "55m" },
            { time: "4:20AM", cat: "study", emoji: "📖", title: "CUACSC214 self-study — data vis", dur: "55m" },
            { time: "5:15AM", cat: "study", emoji: "📖", title: "COS202 Tuesday content revision", dur: "30m" },
            { time: "9:00AM", cat: "lecture", emoji: "🏫", title: "INS204 — Systems Analysis & Design", dur: "120m" },
            { time: "11:00AM", cat: "lecture", emoji: "🏫", title: "CUACSC214 — Data Visualisation", dur: "120m" },
            { time: "2:00PM", cat: "lecture", emoji: "🏫", title: "COS202 — Computer Programming II", dur: "60m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep. Recover fully.", dur: "6h" },
        ]
    },
    // Adding placeholders for now to keep the code concise, but I'll implement full functional switching
    WED: {
        courses: "MTH202 (9AM–11AM)",
        tag: "1 Lecture · Focused Day",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna + Prayer Force", dur: "30m" },
            { time: "3:30AM", cat: "study", emoji: "📖", title: "MTH202 Deep Study — Differential Eq", dur: "90m" },
            { time: "5:00AM", cat: "code", emoji: "💻", title: "Project Work — Backend logic", dur: "60m" },
            { time: "6:00AM", cat: "body", emoji: "🧘", title: "Flexibility & Mobility Session", dur: "30m" },
            { time: "9:00AM", cat: "lecture", emoji: "🏫", title: "MTH202 — Elementary Differential Equations", dur: "120m" },
            { time: "11:30AM", cat: "study", emoji: "📖", title: "Library session — MTH202 revision", dur: "90m" },
            { time: "1:00PM", cat: "break", emoji: "🍽️", title: "Lunch", dur: "45m" },
            { time: "2:00PM", cat: "study", emoji: "📖", title: "Academic Self-Study (GST/DEP)", dur: "120m" },
            { time: "4:30PM", cat: "trade", emoji: "📈", title: "Market session — BOS identification", dur: "60m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep. Rest is discipline.", dur: "6h" },
        ]
    },
    THU: {
        courses: "GST212 (9AM–11AM) · DEP202 (2PM–4PM)",
        tag: "2 Lectures · Strategic Day",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna + Prayer", dur: "30m" },
            { time: "3:30AM", cat: "study", emoji: "📖", title: "GST212 Logic & Philosophy prep", dur: "60m" },
            { time: "4:30AM", cat: "study", emoji: "📖", title: "DEP202 Business Canvas study", dur: "60m" },
            { time: "5:30AM", cat: "code", emoji: "💻", title: "LeetCode Daily Challenge", dur: "45m" },
            { time: "9:00AM", cat: "lecture", emoji: "🏫", title: "GST212 — Philosophy & Logic", dur: "120m" },
            { time: "2:00PM", cat: "lecture", emoji: "🏫", title: "DEP202 — Digital Entrepreneurship III", dur: "120m" },
            { time: "4:30PM", cat: "body", emoji: "🏀", title: "Basketball Training", dur: "90m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep.", dur: "6h" },
        ]
    },
    FRI: {
        courses: "CUACOS212 (9AM–11AM) · IFT212 (11AM–1PM)",
        tag: "2 Lectures · End Strong",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna + Prayer", dur: "30m" },
            { time: "3:30AM", cat: "study", emoji: "📖", title: "CUACOS212 Probability theory", dur: "60m" },
            { time: "4:30AM", cat: "study", emoji: "📖", title: "IFT212 Arch & Org prep", dur: "60m" },
            { time: "5:30AM", cat: "body", emoji: "🤸", title: "Calisthenics — Pull session", dur: "45m" },
            { time: "9:00AM", cat: "lecture", emoji: "🏫", title: "CUACOS212 — Probability Theory", dur: "120m" },
            { time: "11:00AM", cat: "lecture", emoji: "🏫", title: "IFT212 — Computer Architecture", dur: "120m" },
            { time: "1:30PM", cat: "review", emoji: "📝", title: "Weekly review initiation", dur: "60m" },
            { time: "4:30PM", cat: "trade", emoji: "📈", title: "End of week market review", dur: "60m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep.", dur: "6h" },
        ]
    },
    SAT: {
        courses: "No lectures",
        tag: "Full Autonomy · Max Output",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Prophetic Prayer + Manna", dur: "60m" },
            { time: "4:00AM", cat: "code", emoji: "💻", title: "Deep Work — Project Building", dur: "180m" },
            { time: "7:00AM", cat: "body", emoji: "🤸", title: "Intensive Calisthenics", dur: "60m" },
            { time: "8:00AM", cat: "break", emoji: "🍳", title: "Balanced Breakfast + Rest", dur: "60m" },
            { time: "9:00AM", cat: "study", emoji: "📖", title: "Week syllabus catch-up", dur: "120m" },
            { time: "11:00AM", cat: "trade", emoji: "📊", title: "Fundamental Analysis Study", dur: "120m" },
            { time: "1:00PM", cat: "break", emoji: "🍽️", title: "Lunch", dur: "6h" },
            { time: "5:00PM", cat: "style", emoji: "✂️", title: "Grooming / Maintenance", dur: "60m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep.", dur: "6h" },
        ]
    },
    SUN: {
        courses: "No lectures",
        tag: "Spiritual + Planning Day",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna + Prayer Force", dur: "60m" },
            { time: "8:00AM", cat: "spirit", emoji: "⛪", title: "Church / Service", dur: "180m" },
            { time: "1:00PM", cat: "break", emoji: "🍽️", title: "Family / Rest / Recharge", dur: "120m" },
            { time: "3:00PM", cat: "review", emoji: "📝", title: "Weekly OS Audit", dur: "60m" },
            { time: "4:00PM", cat: "review", emoji: "📅", title: "Mon/Tue Detailed Planning", dur: "60m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep. Ready for battle.", dur: "6h" },
        ]
    },
};

export default function SchedulePage() {
    const [activeDay, setActiveDay] = useState("MON");

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
                        return 0;
                    }
                    return s - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [focusRunning]);

    const startFocus = (taskTitle: string) => {
        setFocusTask(taskTitle);
        setFocusSeconds(90 * 60);
        setFocusRunning(true);
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
                    {days.map((day) => (
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
                                {dayData.blocks.map((block, i) => (
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
                                            onClick={() => startFocus(block.title)}
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
