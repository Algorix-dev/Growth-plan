"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Calendar,
    CheckCircle2,
    TrendingUp,
    MoreHorizontal
} from "lucide-react";

const mobileItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/" },
    { label: "Schedule", icon: Calendar, href: "/schedule" },
    { label: "Habits", icon: CheckCircle2, href: "/habits" },
    { label: "Trades", icon: TrendingUp, href: "/trades" },
    { label: "More", icon: MoreHorizontal, href: "/rules" }, // Using Rules as "More" for now
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-surface border-t border-border flex items-center justify-around px-2 z-50 backdrop-blur-lg bg-bg-surface/90">
            {mobileItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
                            isActive ? "text-gold" : "text-text-muted hover:text-text"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(201,150,46,0.5)]")} />
                        <span className="text-[9px] font-mono tracking-tighter uppercase font-medium">{item.label}</span>
                        {isActive && (
                            <div className="absolute bottom-0 w-8 h-1 bg-gold rounded-t-full shadow-[0_-2px_8px_rgba(201,150,46,0.5)]" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
