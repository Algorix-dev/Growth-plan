"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    CheckCircle2,
    Clock,
    Shirt,
    Droplets,
    Sun,
    Moon,
    Scissors,
    ShieldCheck,
    Accessibility,
    Zap,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { awardXP } from "@/components/shared/ForgeLevelBadge";

interface GroomingItem {
    id: string;
    label: string;
    category: "daily-am" | "daily-pm" | "weekly" | "monthly";
    completed: boolean;
}

export default function StylePage() {
    const [activeTab, setActiveTab] = useState<"grooming" | "wardrobe" | "presence">("grooming");
    const [grooming, setGrooming] = useState<GroomingItem[]>([
        // AM Routine
        { id: "g1", label: "Face Wash (lukewarm + cool rinse)", category: "daily-am", completed: false },
        { id: "g2", label: "Moisturizer with SPF 50", category: "daily-am", completed: false },
        { id: "g3", label: "Hair Definition (Cantu + Edge control)", category: "daily-am", completed: false },
        { id: "g4", label: "Lip Care (Vaseline/Balm)", category: "daily-am", completed: false },
        { id: "g5", label: "Intentional Fragrance (Skin only)", category: "daily-am", completed: false },
        // PM Routine (Inferred from daily needs)
        { id: "pm1", label: "Face Wash (remove pollutants)", category: "daily-pm", completed: false },
        { id: "pm2", label: "Vitamin C Serum (Forehead mark)", category: "daily-pm", completed: false },
        { id: "pm3", label: "Night Lip Recovery", category: "daily-pm", completed: false },
        // Weekly
        { id: "w1", label: "Hair Wash Day (Shampoo + Condition)", category: "weekly", completed: false },
        { id: "w2", label: "Scalp Oil Massage (2 mins)", category: "weekly", completed: false },
        { id: "w3", label: "Nail Clean & Trim", category: "weekly", completed: false },
        // Monthly
        { id: "m1", label: "Barber Visit (Fade + Shape up)", category: "monthly", completed: false },
    ]);

    const toggleGrooming = (id: string) => {
        setGrooming(prev => prev.map(item => {
            if (item.id === id) {
                const newState = !item.completed;
                if (newState) awardXP(10, "Social");
                return { ...item, completed: newState };
            }
            return item;
        }));
    };

    const progress = (cat: string) => {
        const items = grooming.filter(i => i.category === cat);
        return Math.round((items.filter(i => i.completed).length / items.length) * 100);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                        <Sparkles className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                        <h1 className="font-bebas text-4xl text-gold tracking-tight lowercase">The Style System</h1>
                        <p className="font-mono text-[10px] text-text-dim uppercase tracking-widest">Identity · Presence · Intentionality</p>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex gap-2 p-1 bg-bg-surface border border-border rounded-2xl overflow-x-auto no-scrollbar">
                {([
                    { id: "grooming", label: "Grooming", icon: Droplets },
                    { id: "wardrobe", label: "Wardrobe", icon: Shirt },
                    { id: "presence", label: "Presence", icon: Accessibility },
                ] as const).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-mono text-[10px] uppercase tracking-wider transition-all whitespace-nowrap",
                            activeTab === tab.id
                                ? "bg-gold text-bg-dark font-bold shadow-lg"
                                : "text-text-dim hover:text-text-muted"
                        )}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "grooming" && (
                    <motion.div
                        key="grooming"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <GroomingSection
                            title="Daily AM Protocol"
                            icon={<Sun className="w-4 h-4" />}
                            items={grooming.filter(i => i.category === "daily-am")}
                            onToggle={toggleGrooming}
                            progress={progress("daily-am")}
                        />
                        <GroomingSection
                            title="Daily PM Protocol"
                            icon={<Moon className="w-4 h-4" />}
                            items={grooming.filter(i => i.category === "daily-pm")}
                            onToggle={toggleGrooming}
                            progress={progress("daily-pm")}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <GroomingSection
                                title="Weekly Maintenance"
                                icon={<Clock className="w-4 h-4" />}
                                items={grooming.filter(i => i.category === "weekly")}
                                onToggle={toggleGrooming}
                                progress={progress("weekly")}
                            />
                            <GroomingSection
                                title="Monthly Audit"
                                icon={<Scissors className="w-4 h-4" />}
                                items={grooming.filter(i => i.category === "monthly")}
                                onToggle={toggleGrooming}
                                progress={progress("monthly")}
                            />
                        </div>
                    </motion.div>
                )}

                {activeTab === "wardrobe" && (
                    <motion.div
                        key="wardrobe"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {/* Wardrobe formulas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormulaCard
                                title="Clean Athletic"
                                components={["Beige Joggers", "Dark T-Shirt (Black/Navy)", "White Sneakers"]}
                                context="Lectures · Social · Sport"
                            />
                            <FormulaCard
                                title="Sharp Casual"
                                components={["Dark Fitted Jeans", "Clean White T-Shirt", "White Sneakers"]}
                                context="Evening · Weekend Outings"
                            />
                            <FormulaCard
                                title="The Layered Look"
                                components={["Neutral T-Shirt", "Open Overshirt (Olive/Grey)", "Black Joggers"]}
                                context="Travel · Evening Lectures"
                            />
                            <FormulaCard
                                title="Core Sport"
                                components={["Black Nike Joggers", "Fitted Compression Top", "High-Performance Trainers"]}
                                context="Training · Basketball"
                            />
                        </div>

                        {/* Visual Rules */}
                        <div className="bg-bg-surface border border-border rounded-2xl p-6 space-y-4">
                            <h3 className="font-bebas text-xl text-gold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" /> The Proportional Rules
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <RuleItem label="Shoulder Focus" desc="Shirts must fit exactly on the shoulder bone. Avoid drop shoulders." />
                                <RuleItem label="Ankle Show" desc="Jeans should hit just at the ankle. 0.5 inch show adds intentionality." />
                                <RuleItem label="The V-Taper" desc="Fitted in the chest/shoulders. Slight room in the waist." />
                                <RuleItem label="Clean Contrast" desc="Always pair one dark with one neutral/light. Avoid matching skin tone." />
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "presence" && (
                    <motion.div
                        key="presence"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <PresenceCard
                            title="The Posture Reset"
                            icon={<Accessibility className="w-5 h-5 text-gold" />}
                            points={[
                                "Shoulders: Back and DOWN (not military shrugging)",
                                "Chin: Parallel to the floor (Composition of spirit)",
                                "Core: 10% tension always (Keeps frame stable)",
                                "Feet: Shoulder width when stationary"
                            ]}
                        />
                        <PresenceCard
                            title="The Stillness Protocol"
                            icon={<Zap className="w-5 h-5 text-gold" />}
                            points={[
                                "The 2-Second Pause before every response",
                                "Unhurried movement: Rushing signals low status",
                                "Neutral face at rest: Foundation of composed aura",
                                "Speak less than you listen. Mean more than you say."
                            ]}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface GroomingSectionProps {
    title: string;
    icon: React.ReactNode;
    items: GroomingItem[];
    onToggle: (id: string) => void;
    progress: number;
}

function GroomingSection({ title, icon, items, onToggle, progress }: GroomingSectionProps) {
    return (
        <div className="bg-bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                        {icon}
                    </div>
                    <h3 className="font-bebas text-lg text-text shadow-sm tracking-tight">{title}</h3>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-mono text-[9px] text-text-dim uppercase">Efficiency</span>
                    <span className="font-bold text-gold text-xs">{progress}%</span>
                </div>
            </div>
            <div className="divide-y divide-border/30">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onToggle(item.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                item.completed ? "bg-gold border-gold" : "border-border"
                            )}>
                                {item.completed && <CheckCircle2 className="w-3.5 h-3.5 text-bg-dark" />}
                            </div>
                            <span className={cn(
                                "text-sm transition-all",
                                item.completed ? "text-text-dim line-through" : "text-text-muted"
                            )}>
                                {item.label}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
            {/* Progress Bar */}
            <div className="h-1 bg-bg-elevated w-full">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gold"
                />
            </div>
        </div>
    );
}

interface FormulaCardProps {
    title: string;
    components: string[];
    context: string;
}

function FormulaCard({ title, components, context }: FormulaCardProps) {
    return (
        <div className="bg-bg-surface border border-border rounded-2xl p-5 space-y-4 hover:border-gold/30 transition-all group">
            <div className="flex justify-between items-start">
                <h3 className="font-bebas text-xl text-text-muted group-hover:text-gold transition-colors">{title}</h3>
                <span className="px-2 py-0.5 rounded bg-gold/5 text-gold font-mono text-[8px] uppercase tracking-tighter">Verified</span>
            </div>
            <div className="space-y-2">
                {components.map((c: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gold/50" />
                        <span className="text-xs text-text-dim font-mono">{c}</span>
                    </div>
                ))}
            </div>
            <div className="pt-2 border-t border-border/30 flex items-center gap-2">
                <Info className="w-3 h-3 text-gold/50" />
                <span className="text-[9px] text-text-dim uppercase font-mono">{context}</span>
            </div>
        </div>
    );
}

interface RuleItemProps {
    label: string;
    desc: string;
}

function RuleItem({ label, desc }: RuleItemProps) {
    return (
        <div className="p-3 bg-bg-elevated rounded-xl border border-border/50">
            <p className="font-mono text-[9px] text-gold uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xs text-text-dim leading-relaxed">{desc}</p>
        </div>
    );
}

interface PresenceCardProps {
    title: string;
    icon: React.ReactNode;
    points: string[];
}

function PresenceCard({ title, icon, points }: PresenceCardProps) {
    return (
        <div className="bg-bg-surface border border-border rounded-2xl p-6 hover:border-gold/30 transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    {icon}
                </div>
                <h3 className="font-bebas text-2xl text-text-muted tracking-wide">{title}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {points.map((p: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start group">
                        <div className="w-5 h-5 rounded bg-bg-elevated border border-border flex items-center justify-center shrink-0 mt-0.5 group-hover:border-gold/30 transition-all">
                            <span className="text-[10px] font-mono text-gold">{i + 1}</span>
                        </div>
                        <p className="text-sm text-text-dim leading-relaxed">{p}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
