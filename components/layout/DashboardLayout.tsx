"use client"

import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-bg-base">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0">
                <div className="max-w-[1200px] mx-auto p-4 md:p-8 lg:p-12">
                    {children}
                </div>
                <MobileNav />
            </main>
        </div>
    );
}
