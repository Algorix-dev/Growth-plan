"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Calendar,
    Target,
    CheckCircle2,
    BookOpen,
    PenTool,
    TrendingUp,
    User,
    Zap,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
    BarChart3,
    Sparkles,
    Swords,
    Dumbbell,
    Map
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/", section: "CORE" },
    { label: "Schedule", icon: Calendar, href: "/schedule", section: "CORE" },
    { label: "Goals", icon: Target, href: "/goals", section: "CORE" },
    { label: "Habits", icon: CheckCircle2, href: "/habits", section: "TRACK" },
    { label: "Courses", icon: BookOpen, href: "/courses", section: "TRACK" },
    { label: "Journal", icon: PenTool, href: "/journal", section: "TRACK" },
    { label: "Warrior Forge", icon: Dumbbell, href: "/workout", section: "EXECUTE" },
    { label: "Martial Arts", icon: Swords, href: "/martial-arts", section: "EXECUTE" },
    { label: "Trading Roadmap", icon: Map, href: "/trading-roadmap", section: "EXECUTE" },
    { label: "Trades", icon: TrendingUp, href: "/trades", section: "EXECUTE" },
    { label: "Style", icon: Sparkles, href: "/style", section: "EXECUTE" },
    { label: "Identity", icon: User, href: "/identity", section: "EXECUTE" },
    { label: "Rules", icon: Zap, href: "/rules", section: "EXECUTE" },
    { label: "Analytics", icon: BarChart3, href: "/analytics", section: "EXECUTE" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const sections = ["CORE", "TRACK", "EXECUTE"];

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col bg-bg-surface border-r border-border transition-all duration-300 z-40 h-screen sticky top-0",
                collapsed ? "w-20" : "w-[240px]"
            )}
        >
            <div className="p-6 flex items-center justify-between">
                {!collapsed && (
                    <div className="font-bebas text-3xl tracking-tighter text-gold flex items-center gap-2">
                        EP <span className="text-text-dim">·</span> OS
                    </div>
                )}
                {collapsed && (
                    <div className="font-bebas text-3xl tracking-tighter text-gold w-full text-center">
                        EP
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                {sections.map((section) => (
                    <div key={section} className="space-y-1">
                        {!collapsed && (
                            <h3 className="px-3 text-[10px] font-mono tracking-[0.2em] text-text-dim uppercase mb-2">
                                ─── {section} ───
                            </h3>
                        )}
                        <div className="space-y-1">
                            {navItems
                                .filter((item) => item.section === section)
                                .map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                                                isActive
                                                    ? "text-gold bg-gold-dim"
                                                    : "text-text-muted hover:text-text hover:bg-bg-elevated"
                                            )}
                                        >
                                            <item.icon className={cn("w-5 h-5", isActive ? "text-gold" : "text-text-muted group-hover:text-text")} />
                                            {!collapsed && (
                                                <span className="font-mono text-xs tracking-wide uppercase">{item.label}</span>
                                            )}
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-r-full shadow-[2px_0_10px_rgba(201,150,46,0.5)]" />
                                            )}
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-border space-y-2">
                <div className={cn("flex items-center gap-3 px-3 py-2", collapsed && "justify-center")}>
                    <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xs font-bebas text-gold">
                        EP
                    </div>
                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-mono text-text truncate">Emmanuel P.</p>
                            <p className="text-[10px] font-mono text-text-dim truncate">Forging Phase</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn(
                            "flex items-center justify-center gap-3 py-2 text-text-muted hover:text-text hover:bg-bg-elevated rounded-lg transition-all",
                            collapsed ? "w-full" : "flex-1 px-3"
                        )}
                        title={collapsed ? "Expand Sidebar" : "Collapse"}
                    >
                        {collapsed ? <ChevronRight className="w-5 h-5" /> : (
                            <>
                                <ChevronLeft className="w-5 h-5" />
                                <span className="font-mono text-[10px] tracking-wider uppercase">Collapse</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={toggleTheme}
                        className={cn(
                            "flex items-center justify-center py-2 text-gold hover:bg-gold-dim rounded-lg transition-all",
                            collapsed ? "w-full mt-2 hidden" : "w-10" // Hide when collapsed to save space or adjust as needed
                        )}
                        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    {collapsed && (
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-center py-2 text-gold hover:bg-gold-dim rounded-lg transition-all mt-2"
                            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    )}
                </div>

                <button className="w-full flex items-center gap-3 px-3 py-2 text-red/60 hover:text-red hover:bg-red/5 rounded-lg transition-all">
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span className="font-mono text-xs tracking-wide uppercase">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
