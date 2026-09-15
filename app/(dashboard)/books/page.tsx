"use client";

import { useEffect, useState } from "react";
import { BookOpen, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOKS, READ_ALOUD_TIP, Book } from "@/lib/books-data";
import { RoadmapColor } from "@/lib/roadmap-data";

// TIP: same literal-class-map trick as /roadmap — Tailwind can't resolve
// `bg-${color}` at build time, only literal text, so these are spelled out.
const STRIPE_CLASS: Record<RoadmapColor, string> = {
    gold: "bg-gold",
    blue: "bg-blue",
    teal: "bg-teal",
    orange: "bg-orange",
    green: "bg-green",
    purple: "bg-purple",
};

const STORAGE_KEY = "em_books_v1";

export default function BooksPage() {
    // TIP: this page's own localStorage key, separate from "emmanuel_habits".
    // Kept isolated on purpose so this doesn't interact with the checklist's
    // XP/streak logic at all.
    const [done, setDone] = useState<Set<number>>(new Set());

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setDone(new Set(JSON.parse(saved)));
        } catch {
            // ignore malformed storage
        }
    }, []);

    const toggle = (id: number) => {
        setDone((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
            return next;
        });
    };

    const groups = BOOKS.reduce<Record<string, Book[]>>((acc, book) => {
        (acc[book.monthGroup] ||= []).push(book);
        return acc;
    }, {});

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-32">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-gold" />
                    <span className="font-mono text-[10px] text-gold uppercase tracking-[0.2em]">
                        9 books to graduation
                    </span>
                </div>
                <h1 className="font-bebas text-5xl text-gold tracking-tight lowercase">Reading Schedule</h1>
                <p className="font-mono text-xs text-text-dim mt-1">
                    Tap to mark done · 15–20 pages per day · read one passage aloud every morning
                </p>
            </div>

            {/* Compact tracker grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {BOOKS.map((book) => {
                    const isDone = done.has(book.id);
                    return (
                        <button
                            key={book.id}
                            onClick={() => toggle(book.id)}
                            className={cn(
                                "rounded-xl border p-3 text-center transition-all",
                                isDone
                                    ? "bg-green/10 border-green/40"
                                    : "bg-bg-surface border-border hover:border-gold/30"
                            )}
                        >
                            <p className={cn("text-sm font-bold", isDone ? "text-green" : "text-text-muted")}>
                                {book.id + 1}
                            </p>
                            <p
                                className={cn(
                                    "text-[9px] mt-0.5 truncate",
                                    isDone ? "text-green/70" : "text-text-dim"
                                )}
                            >
                                {book.shortLabel}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Book cards, grouped by month */}
            <div className="space-y-8">
                {Object.entries(groups).map(([group, books]) => (
                    <div key={group}>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-dim mb-3">
                            {group}
                        </p>
                        <div className="space-y-3">
                            {books.map((book) => {
                                const isDone = done.has(book.id);
                                return (
                                    <div
                                        key={book.id}
                                        className="flex gap-4 bg-bg-surface border border-border rounded-2xl p-4"
                                    >
                                        <div className={cn("w-1 rounded-full shrink-0", STRIPE_CLASS[book.color])} />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-bold text-text">{book.title}</p>
                                                    <p className="text-xs text-text-dim">{book.author}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggle(book.id)}
                                                    className={cn(
                                                        "shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-all",
                                                        isDone
                                                            ? "bg-green border-green text-bg-dark"
                                                            : "border-border text-transparent hover:border-gold/40"
                                                    )}
                                                    aria-label={isDone ? "Mark unread" : "Mark read"}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-text-muted leading-relaxed mt-2">{book.why}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-bg-dark/40 rounded-2xl border border-gold/10 border-l-4 border-l-gold">
                <p className="text-[10px] font-mono text-gold uppercase tracking-widest mb-1">
                    The read-aloud habit
                </p>
                <p className="text-xs text-text-dim leading-relaxed">{READ_ALOUD_TIP}</p>
            </div>
        </div>
    );
}
