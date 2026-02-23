"use client"

import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import DailyReflectionModal from "@/components/shared/DailyReflectionModal";
import { SyncBridge } from "@/components/shared/SyncBridge";
import { useUser } from "@/components/providers/UserContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        // Only run in browser
        if (typeof window === "undefined" || !("Notification" in window)) return;

        // Request permission
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }

        // Check time every minute for the 3AM alarm
        const check3AM = () => {
            const now = new Date();
            if (now.getHours() === 3 && now.getMinutes() === 0) {
                const todayStr = now.toLocaleDateString();
                const lastFired = localStorage.getItem("emmanuel_3am_fired");

                if (lastFired !== todayStr && Notification.permission === "granted") {
                    new Notification("Wake Up.", {
                        body: "The world is sleeping. Time to build. No excuses.",
                        icon: "/icon-192x192.png",
                        requireInteraction: true // Stays on screen until clicked
                    });
                    localStorage.setItem("emmanuel_3am_fired", todayStr);
                }
            }
        };

        const interval = setInterval(check3AM, 60000);
        // Initial check just in case we load exactly at 3:00
        check3AM();

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-bg-base relative">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0">
                <div className="max-w-[1200px] mx-auto p-4 md:p-8 lg:p-12">
                    {children}
                </div>
                <MobileNav />
            </main>
            <DailyReflectionModal />
            <SyncBridge />
        </div>
    );
}
