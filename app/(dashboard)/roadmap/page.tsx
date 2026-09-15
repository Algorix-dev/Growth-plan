"use client";

import { useState } from "react";
import { ChevronDown, Map, Code2, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    ROADMAP_PHASES,
    CODING_PHASES,
    CODING_RESOURCES_STACK,
    CODING_RULE,
    RoadmapColor,
} from "@/lib/roadmap-data";

// TIP: Tailwind's compiler only generates a class if it can literally see the
// full class name as text somewhere in a source file — `bg-${c}` doesn't
// work because "bg-teal" never appears as actual text, only "bg-" and a
// variable. So instead of building class names dynamically, this is a plain
// lookup table with every class name spelled out in full. If you add a new
// RoadmapColor later, add it here too (all three maps) or its color won't render.
const DOT_CLASS: Record<RoadmapColor, string> = {
    gold: "bg-gold",
    blue: "bg-blue",
    teal: "bg-teal",
    orange: "bg-orange",
    green: "bg-green",
    purple: "bg-purple",
};
const TEXT_CLASS: Record<RoadmapColor, string> = {
    gold: "text-gold",
    blue: "text-blue",
    teal: "text-teal",
    orange: "text-orange",
    green: "text-green",
    purple: "text-purple",
};
const BORDER_CLASS: Record<RoadmapColor, string> = {
    gold: "border-gold",
    blue: "border-blue",
    teal: "border-teal",
    orange: "border-orange",
    green: "border-green",
    purple: "border-purple",
};
const dot = (c: RoadmapColor) => DOT_CLASS[c];
const textColor = (c: RoadmapColor) => TEXT_CLASS[c];
const borderColor = (c: RoadmapColor) => BORDER_CLASS[c];

export default function RoadmapPage() {
    const [view, setView] = useState<"life" | "coding">("life");
    const [activePhase, setActivePhase] = useState(ROADMAP_PHASES[0].id);
    const [openMonth, setOpenMonth] = useState<string | null>(
        `${ROADMAP_PHASES[0].id}-0`
    );

    const phase = ROADMAP_PHASES.find((p) => p.id === activePhase)!;

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Compass className="w-5 h-5 text-gold" />
                        <span className="font-mono text-[10px] text-gold uppercase tracking-[0.2em]">
                            The Becoming
                        </span>
                    </div>
                    <h1 className="font-bebas text-5xl text-gold tracking-tight lowercase">
                        Master Roadmap
                    </h1>
                    <p className="font-mono text-xs text-text-dim mt-1">
                        Month by month, holiday to graduation — April 2028
                    </p>
                </div>

                {/* view switch */}
                <div className="flex bg-bg-surface border border-border rounded-2xl p-1 gap-1">
                    <button
                        onClick={() => setView("life")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wide transition-all",
                            view === "life" ? "bg-gold text-bg-dark" : "text-text-muted hover:text-text"
                        )}
                    >
                        <Map className="w-3.5 h-3.5" /> Life
                    </button>
                    <button
                        onClick={() => setView("coding")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wide transition-all",
                            view === "coding" ? "bg-gold text-bg-dark" : "text-text-muted hover:text-text"
                        )}
                    >
                        <Code2 className="w-3.5 h-3.5" /> Coding
                    </button>
                </div>
            </div>

            {view === "life" ? (
                <>
                    {/* Phase tabs */}
                    <div className="flex flex-wrap gap-2">
                        {ROADMAP_PHASES.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => {
                                    setActivePhase(p.id);
                                    setOpenMonth(`${p.id}-0`);
                                }}
                                className={cn(
                                    "px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wide border transition-all",
                                    activePhase === p.id
                                        ? "bg-gold border-gold text-bg-dark"
                                        : "bg-bg-surface border-border text-text-muted hover:text-text"
                                )}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Intro box */}
                    <div className="p-4 bg-bg-dark/40 rounded-2xl border border-gold/10 border-l-4 border-l-gold">
                        <p className="text-[10px] font-mono text-gold uppercase tracking-widest mb-1">
                            {phase.intro.title}
                        </p>
                        <p className="text-xs text-text-dim leading-relaxed">{phase.intro.body}</p>
                    </div>

                    {/* Month accordion */}
                    <div className="space-y-4">
                        {phase.months.map((month, mIdx) => {
                            const key = `${phase.id}-${mIdx}`;
                            const isOpen = openMonth === key;
                            return (
                                <div
                                    key={key}
                                    className="bg-bg-surface border border-border rounded-3xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenMonth(isOpen ? null : key)}
                                        className="w-full flex items-center justify-between p-5 text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2.5 h-2.5 rounded-full", dot(month.dotColor))} />
                                            <div>
                                                <h3 className="font-bebas text-xl text-text tracking-wide">
                                                    {month.title}
                                                </h3>
                                                <p className="text-[11px] font-mono text-text-dim">{month.sub}</p>
                                            </div>
                                        </div>
                                        <ChevronDown
                                            className={cn(
                                                "w-4 h-4 text-text-dim transition-transform",
                                                isOpen && "rotate-180"
                                            )}
                                        />
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 space-y-5">
                                                    {month.sections.map((section) => (
                                                        <div key={section.title}>
                                                            <p
                                                                className={cn(
                                                                    "text-[10px] font-mono uppercase tracking-[0.15em] mb-2",
                                                                    textColor(section.color)
                                                                )}
                                                            >
                                                                {section.title}
                                                            </p>
                                                            <div className="space-y-2.5">
                                                                {section.items.map((item, iIdx) => (
                                                                    <div key={iIdx} className="flex gap-3">
                                                                        <div
                                                                            className={cn(
                                                                                "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                                                                                dot(item.color ?? section.color)
                                                                            )}
                                                                        />
                                                                        <div>
                                                                            <p className="text-sm text-text leading-relaxed">
                                                                                {item.text}
                                                                            </p>
                                                                            {item.sub && (
                                                                                <p className="text-[11px] text-text-dim mt-0.5 leading-relaxed">
                                                                                    {item.sub}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <>
                    {/* Coding path */}
                    <div className="p-4 bg-bg-dark/40 rounded-2xl border border-gold/10 border-l-4 border-l-gold">
                        <p className="text-[10px] font-mono text-gold uppercase tracking-widest mb-1">
                            The 20-minute rule
                        </p>
                        <p className="text-xs text-text-dim leading-relaxed">{CODING_RULE}</p>
                    </div>

                    <div className="space-y-8">
                        {CODING_PHASES.map((cp) => (
                            <div key={cp.heading}>
                                <h3 className="font-bebas text-2xl text-text tracking-wide mb-4">
                                    {cp.heading}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {cp.items.map((item) => (
                                        <div
                                            key={item.title}
                                            className="bg-bg-surface border border-border rounded-2xl p-5 space-y-2 hover:border-gold/30 transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="text-sm font-bold text-text leading-snug">
                                                    {item.title}
                                                </p>
                                                <span
                                                    className={cn(
                                                        "shrink-0 text-[9px] font-mono uppercase tracking-wide px-2 py-1 rounded-full border",
                                                        textColor(item.color),
                                                        borderColor(item.color)
                                                    )}
                                                >
                                                    {item.tag}
                                                </span>
                                            </div>
                                            <p className="text-xs text-text-dim leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-bg-dark/40 rounded-2xl border border-gold/10 border-l-4 border-l-gold">
                        <p className="text-[10px] font-mono text-gold uppercase tracking-widest mb-1">
                            The Resources Stack
                        </p>
                        <p className="text-xs text-text-dim leading-relaxed">{CODING_RESOURCES_STACK}</p>
                    </div>
                </>
            )}
        </div>
    );
}
