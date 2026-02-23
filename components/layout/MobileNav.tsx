"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Calendar,
    CheckCircle2,
    Menu,
    Plus,
    X,
    PenTool,
    TrendingUp,
    ClipboardList,
    BookOpen,
    Target,
    User,
    Zap,
    ChevronLeft,
    BarChart3
} from "lucide-react";
import { awardXP } from "@/components/shared/ForgeLevelBadge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ForgeLevelBadge } from "@/components/shared/ForgeLevelBadge";

const menuLinks = [
    { label: "Goals", icon: Target, href: "/goals", section: "CORE" },
    { label: "Courses", icon: BookOpen, href: "/courses", section: "TRACK" },
    { label: "Journal", icon: PenTool, href: "/journal", section: "TRACK" },
    { label: "Review", icon: ClipboardList, href: "/review", section: "TRACK" },
    { label: "Trades", icon: TrendingUp, href: "/trades", section: "EXECUTE" },
    { label: "Identity", icon: User, href: "/identity", section: "EXECUTE" },
    { label: "Rules", icon: Zap, href: "/rules", section: "EXECUTE" },
    { label: "Analytics", icon: BarChart3, href: "/analytics", section: "EXECUTE" },
];

export default function MobileNav() {
    const pathname = usePathname();
    const [captureOpen, setCaptureOpen] = useState(false);
    const [captureMode, setCaptureMode] = useState<"menu" | "journal" | "trade">("menu");
    const [menuOpen, setMenuOpen] = useState(false);

    // Quick Capture States
    const [journalNote, setJournalNote] = useState("");
    const [tradePair, setTradePair] = useState("");
    const [tradeDir, setTradeDir] = useState<"LONG" | "SHORT">("LONG");
    const [tradeOutcome, setTradeOutcome] = useState<"WIN" | "LOSS" | "BE">("WIN");
    const [tradeRR, setTradeRR] = useState("");

    const handleSaveJournal = () => {
        if (!journalNote.trim()) return;
        const saved = localStorage.getItem("emmanuel_journal_daily");
        const entries = saved ? JSON.parse(saved) : [];
        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            wins: journalNote, // Saving generic quick note into the Wins section
            gaps: "Quick Note",
            fix: "Keep building",
            rating: 5
        };
        localStorage.setItem("emmanuel_journal_daily", JSON.stringify([newEntry, ...entries]));

        // 🏆 Award XP
        awardXP(15);

        setJournalNote("");
        setCaptureMode("menu");
        setCaptureOpen(false);
    };

    const handleSaveTrade = () => {
        if (!tradePair.trim()) return;
        const saved = localStorage.getItem("emmanuel_trades");
        const trades = saved ? JSON.parse(saved) : [];
        const newTrade = {
            id: Date.now().toString(),
            pair: tradePair.toUpperCase(),
            dir: tradeDir,
            entry: "0.00", sl: "0.00", tp: "0.00",
            rr: tradeRR || "1:2",
            outcome: tradeOutcome,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            emotion: "Quick Logged"
        };
        localStorage.setItem("emmanuel_trades", JSON.stringify([newTrade, ...trades]));

        // 🏆 Award XP
        awardXP(newTrade.outcome === "WIN" ? 50 : 20);

        setTradePair(""); setTradeRR("");
        setCaptureMode("menu");
        setCaptureOpen(false);
    };

    return (
        <>
            {/* Quick Capture Bottom Sheet */}
            <AnimatePresence>
                {captureOpen && (
                    <div className="md:hidden fixed inset-0 z-[60] flex items-end justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-bg-surface border border-gold/30 rounded-2xl w-full p-6 relative shadow-[0_-10px_40px_rgba(212,175,55,0.15)] mb-20"
                        >
                            {captureMode === "menu" ? (
                                <button onClick={() => setCaptureOpen(false)} className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            ) : (
                                <button onClick={() => setCaptureMode("menu")} className="absolute top-4 left-4 text-text-muted hover:text-white transition-colors p-2">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}

                            <h3 className="font-bebas text-2xl mb-1 text-gold text-center pt-2">
                                {captureMode === "menu" && "Quick Capture"}
                                {captureMode === "journal" && "Quick Note"}
                                {captureMode === "trade" && "Quick Trade Log"}
                            </h3>
                            <p className="font-mono text-[9px] uppercase tracking-widest text-text-dim mb-6 text-center">
                                {captureMode === "menu" ? "Log essential actions instantly" : "Fill details below"}
                            </p>

                            <AnimatePresence mode="wait">
                                {captureMode === "menu" && (
                                    <motion.div
                                        key="menu"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        <button onClick={() => setCaptureMode("journal")} className="flex flex-col items-center justify-center gap-2 p-5 bg-bg-base border border-border-2 rounded-xl active:bg-gold/10 active:border-gold/30 transition-all select-none">
                                            <PenTool className="w-6 h-6 text-blue" />
                                            <span className="font-mono text-xs uppercase tracking-wider text-text font-semibold mt-1">Journal Note</span>
                                        </button>
                                        <button onClick={() => setCaptureMode("trade")} className="flex flex-col items-center justify-center gap-2 p-5 bg-bg-base border border-border-2 rounded-xl active:bg-gold/10 active:border-gold/30 transition-all select-none">
                                            <TrendingUp className="w-6 h-6 text-red" />
                                            <span className="font-mono text-xs uppercase tracking-wider text-text font-semibold mt-1">Log Trade</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCaptureOpen(false);
                                                window.location.href = "/review";
                                            }}
                                            className="flex items-center justify-center gap-3 p-5 bg-gold hover:bg-gold-light text-black border border-gold rounded-xl transition-all col-span-2 select-none"
                                        >
                                            <ClipboardList className="w-5 h-5" />
                                            <span className="font-bebas text-xl tracking-wider mt-1">Launch Weekly Review</span>
                                        </button>
                                    </motion.div>
                                )}

                                {captureMode === "journal" && (
                                    <motion.div
                                        key="journal"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-4"
                                    >
                                        <textarea
                                            placeholder="What's on your mind? Did you win today?"
                                            value={journalNote}
                                            onChange={(e) => setJournalNote(e.target.value)}
                                            className="w-full h-32 bg-bg-base border border-border-2 rounded-xl p-4 font-serif text-sm focus:border-gold outline-none resize-none"
                                        />
                                        <button
                                            onClick={handleSaveJournal}
                                            disabled={!journalNote.trim()}
                                            className="w-full p-4 bg-blue hover:bg-blue/90 text-black font-bebas text-xl tracking-widest rounded-xl transition-all disabled:opacity-50"
                                        >
                                            Save Note
                                        </button>
                                    </motion.div>
                                )}

                                {captureMode === "trade" && (
                                    <motion.div
                                        key="trade"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Pair (e.g. XAUUSD)"
                                                value={tradePair}
                                                onChange={(e) => setTradePair(e.target.value)}
                                                className="w-full bg-bg-base border border-border-2 rounded-xl px-4 py-3 font-mono text-sm uppercase focus:border-gold outline-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="R:R (e.g. 1:2)"
                                                value={tradeRR}
                                                onChange={(e) => setTradeRR(e.target.value)}
                                                className="w-full bg-bg-base border border-border-2 rounded-xl px-4 py-3 font-mono text-sm focus:border-gold outline-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setTradeDir("LONG")}
                                                className={cn("p-2 rounded-lg font-mono text-xs font-bold border", tradeDir === "LONG" ? "bg-green/20 text-green border-green" : "border-border-2 text-text-muted")}
                                            >LONG</button>
                                            <button
                                                onClick={() => setTradeDir("SHORT")}
                                                className={cn("p-2 rounded-lg font-mono text-xs font-bold border", tradeDir === "SHORT" ? "bg-red/20 text-red border-red" : "border-border-2 text-text-muted")}
                                            >SHORT</button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {["WIN", "LOSS", "BE"].map(out => (
                                                <button
                                                    key={out}
                                                    onClick={() => setTradeOutcome(out as "WIN" | "LOSS" | "BE")}
                                                    className={cn("p-2 rounded-lg font-mono text-xs font-bold border", tradeOutcome === out ? "bg-gold/20 text-gold border-gold" : "border-border-2 text-text-muted")}
                                                >{out}</button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleSaveTrade}
                                            disabled={!tradePair.trim()}
                                            className="w-full p-4 mt-2 bg-text hover:bg-white text-black font-bebas text-xl tracking-widest rounded-xl transition-all disabled:opacity-50"
                                        >
                                            Log Trade
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Menu Full Screen Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <div className="md:hidden fixed inset-0 z-[60] bg-bg-base/95 backdrop-blur-md flex flex-col pt-6 px-6 pb-24 overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-bebas text-3xl text-gold tracking-widest leading-none mt-2">Modules</h2>
                            <button onClick={() => setMenuOpen(false)} className="p-2 bg-bg-surface border border-border rounded-full text-text-muted hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-bebas text-xl tracking-wider">Navigation</h2>
                                <ForgeLevelBadge compact />
                            </div>
                        </div>

                        <div className="space-y-8">
                            {["CORE", "TRACK", "EXECUTE"].map((section) => (
                                <div key={section} className="space-y-3">
                                    <h3 className="text-[10px] font-mono tracking-[0.2em] text-text-dim uppercase border-b border-border-2 pb-2">
                                        ─── {section}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {menuLinks.filter(item => item.section === section).map(item => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setMenuOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3.5 rounded-xl border transition-all active:scale-95",
                                                        isActive ? "bg-gold-dim border-gold/30 text-gold" : "bg-bg-surface border-border text-text hover:bg-bg-elevated"
                                                    )}
                                                >
                                                    <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-gold" : "text-text-muted")} />
                                                    <span className="font-mono text-xs uppercase tracking-wider truncate">{item.label}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </AnimatePresence>


            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-surface border-t border-border flex items-center justify-around px-2 z-50 backdrop-blur-lg bg-bg-surface/90 pb-safe">

                <Link href="/" className={cn("flex flex-col items-center justify-center gap-1 w-[20%] h-full transition-all", pathname === "/" ? "text-gold" : "text-text-muted")}>
                    <LayoutDashboard className={cn("w-5 h-5", pathname === "/" && "drop-shadow-[0_0_8px_rgba(201,150,46,0.5)]")} />
                    <span className="text-[9px] font-mono tracking-tighter uppercase font-medium">Home</span>
                </Link>

                <Link href="/schedule" className={cn("flex flex-col items-center justify-center gap-1 w-[20%] h-full transition-all", pathname === "/schedule" ? "text-gold" : "text-text-muted")}>
                    <Calendar className={cn("w-5 h-5", pathname === "/schedule" && "drop-shadow-[0_0_8px_rgba(201,150,46,0.5)]")} />
                    <span className="text-[9px] font-mono tracking-tighter uppercase font-medium">Schedule</span>
                </Link>

                {/* Center FAB */}
                <div className="w-[20%] h-full flex justify-center items-center relative -top-4">
                    <button
                        onClick={() => setCaptureOpen(true)}
                        className="w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(201,150,46,0.4)] active:scale-95 transition-all text-black hover:brightness-110 border-4 border-bg-surface"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>

                <Link href="/habits" className={cn("flex flex-col items-center justify-center gap-1 w-[20%] h-full transition-all", pathname === "/habits" ? "text-gold" : "text-text-muted")}>
                    <CheckCircle2 className={cn("w-5 h-5", pathname === "/habits" && "drop-shadow-[0_0_8px_rgba(201,150,46,0.5)]")} />
                    <span className="text-[9px] font-mono tracking-tighter uppercase font-medium">Habits</span>
                </Link>

                <button onClick={() => setMenuOpen(true)} className="flex flex-col items-center justify-center gap-1 w-[20%] h-full transition-all text-text-muted">
                    <Menu className="w-5 h-5" />
                    <span className="text-[9px] font-mono tracking-tighter uppercase font-medium">Menu</span>
                </button>

            </nav>
        </>
    );
}
