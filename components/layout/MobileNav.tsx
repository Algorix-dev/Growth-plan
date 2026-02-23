"use client";

import { Home, ClipboardList, Target, LineChart, BookOpen, Search, Menu, Trophy, Plus, Dumbbell, Zap, History, X, ChevronLeft, PenTool, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { awardXP } from "@/components/shared/ForgeLevelBadge";

export function MobileNav() {
    const pathname = usePathname();
    const [showFabMenu, setShowFabMenu] = useState(false);

    const navItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/habits", icon: ClipboardList, label: "Habits" },
        { href: "/workout", icon: Dumbbell, label: "Training" },
        { href: "/trades", icon: LineChart, label: "Trades" },
        { href: "/analytics", icon: History, label: "Stats" },
    ];

    return (
        <>
            {/* Bottom Sticky Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-surface/80 backdrop-blur-xl border-t border-border px-4 py-2 md:hidden">
                <div className="flex justify-between items-center max-w-lg mx-auto pb-safe">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 transition-all",
                                    isActive ? "text-gold" : "text-text-dim"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]")} />
                                <span className="text-[9px] font-mono tracking-tighter">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Floating Action Button (FAB) */}
            <div className="fixed bottom-20 right-6 md:hidden z-[60]">
                <button
                    onClick={() => setShowFabMenu(!showFabMenu)}
                    className="w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/20 active:scale-95 transition-all text-bg-dark"
                >
                    <Plus className={cn("w-6 h-6 transition-transform duration-300", showFabMenu && "rotate-45")} />
                </button>

                <AnimatePresence>
                    {showFabMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            className="absolute bottom-16 right-0 space-y-4"
                        >
                            {[
                                { label: "Log Trade", icon: LineChart, href: "/trades" },
                                { label: "Start Focus", icon: Zap, href: "/schedule" },
                                { label: "Add Win", icon: Trophy, href: "/journal" },
                            ].map((act) => (
                                <Link
                                    key={act.label}
                                    href={act.href}
                                    className="flex items-center gap-3 justify-end whitespace-nowrap"
                                    onClick={() => setShowFabMenu(false)}
                                >
                                    <span className="text-[10px] font-mono bg-bg-surface border border-border px-2 py-1 rounded-md text-gold lowercase">
                                        {act.label}
                                    </span>
                                    <div className="w-10 h-10 bg-bg-surface border border-gold/30 rounded-full flex items-center justify-center text-gold shadow-lg">
                                        <act.icon className="w-5 h-5" />
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

export default MobileNav;
