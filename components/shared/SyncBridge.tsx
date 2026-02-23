"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/components/providers/UserContext";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncBridge() {
    const { user } = useUser();
    const [syncing, setSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState<Date | null>(null);
    const [error, setError] = useState(false);

    const performSync = useCallback(async () => {
        if (!user) return;
        setSyncing(true);
        setError(false);

        try {
            // 1. Gather Local Data
            const habits = JSON.parse(localStorage.getItem("emmanuel_habits") || "{}");
            const focus = JSON.parse(localStorage.getItem("emmanuel_focus_sessions") || "[]");
            const dailyJournal = JSON.parse(localStorage.getItem("emmanuel_journal_daily") || "[]");
            const trades = JSON.parse(localStorage.getItem("emmanuel_trades") || "[]");
            const xp = parseInt(localStorage.getItem("emmanuel_forging_xp") || "0");
            const pillarXP = JSON.parse(localStorage.getItem("emmanuel_sync_pillar_xp") || "[]");
            const energy = localStorage.getItem("emmanuel_energy_level") || "medium";

            // 2. Push to Server
            const response = await fetch("/api/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, habits, focus, dailyJournal, trades, xp, pillarXP, energy }),
            });

            // 3. Pull & Resolve (Update Local with Server State)
            if (response.ok) {
                const data = await response.json();
                const state = data.state;
                if (!state) return;

                if (state.xp !== undefined) localStorage.setItem("emmanuel_forging_xp", state.xp.toString());
                if (state.energy) localStorage.setItem("emmanuel_energy_level", state.energy);

                // Clear the sync queue for pillars since they are now on server
                localStorage.setItem("emmanuel_sync_pillar_xp", "[]");

                // If local data is empty but server has data, populate it
                if (Object.keys(habits).length === 0 && state.habits) {
                    localStorage.setItem("emmanuel_habits", JSON.stringify(state.habits));
                }
                if (focus.length === 0 && state.focus) {
                    localStorage.setItem("emmanuel_focus_sessions", JSON.stringify(state.focus));
                }
                if (trades.length === 0 && state.trades) {
                    localStorage.setItem("emmanuel_trades", JSON.stringify(state.trades));
                }
                if (dailyJournal.length === 0 && state.journal) {
                    localStorage.setItem("emmanuel_journal_daily", JSON.stringify(state.journal));
                }
            } else {
                throw new Error("Sync failed");
            }

            setLastSynced(new Date());
        } catch (e) {
            console.error("Sync Error:", e);
            setError(true);
        } finally {
            setSyncing(false);
        }
    }, [user]);

    // Sync on mount and heartbeat
    useEffect(() => {
        if (user) {
            performSync();
            // Heartbeat every 2 minutes
            const id = setInterval(performSync, 120000);
            return () => clearInterval(id);
        }
    }, [user, performSync]);

    // Monitor tab focus to trigger pull
    useEffect(() => {
        const onFocus = () => { if (user) performSync(); };
        window.addEventListener("focus", onFocus);
        window.addEventListener("sync:now", performSync);
        return () => {
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("sync:now", performSync);
        };
    }, [user, performSync]);

    if (!user) return null;

    return (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[100]">
            <div
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest transition-all",
                    error ? "bg-red/10 border-red/30 text-red" :
                        syncing ? "bg-gold/10 border-gold/30 text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]" :
                            "bg-bg-surface border-border text-text-dim"
                )}
            >
                {syncing ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                ) : error ? (
                    <CloudOff className="w-3 h-3" />
                ) : (
                    <Cloud className="w-3 h-3" />
                )}

                <span className="hidden sm:inline">
                    {syncing ? "Linking Identity..." : error ? "Link Severed" : "Identity In Sync"}
                </span>

                {lastSynced && !syncing && !error && (
                    <span className="opacity-40 text-[8px]">
                        · {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
}
