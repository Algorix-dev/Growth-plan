"use client"

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    User,
    Eye,
    MessageSquare,
    Zap,
    ShieldCheck,
    Search
} from "lucide-react";

const blueprints = [
    {
        title: "The Silent Presence",
        subtitle: "Aura & Composure",
        icon: User,
        color: "gold",
        steps: [
            "The 2-Second Pause before every reaction.",
            "Stillness in the room — no fidgeting, no rushing.",
            "Speak last, speak least, speak precisely.",
            "Eye contact that remains steady but not aggressive."
        ]
    },
    {
        title: "Manipulation Detection",
        subtitle: "Counter-Influence",
        icon: Search,
        color: "red",
        steps: [
            "Identify guilt-tripping and false urgency.",
            "Notice DARVO and Gaslighting techniques.",
            "Maintain frame when faced with emotional bait.",
            "Set boundaries without explanation — just state it."
        ]
    },
    {
        title: "The Aesthetic Blueprint",
        subtitle: "Style & Grooming",
        icon: Zap,
        color: "pink",
        steps: [
            "Signature fragrance daily — identity in scent.",
            "Posture as the foundation of respect.",
            "Clean lines in clothing — no logos, just fit.",
            "Meticulous grooming — every day is game day."
        ]
    },
    {
        title: "Command Composure",
        subtitle: "Social Dynamics",
        icon: ShieldCheck,
        color: "teal",
        steps: [
            "Respond, don't react. The gap is power.",
            "Calm voice even when the room is loud.",
            "Dismissal of disrespect without showing anger.",
            "Physical presence that takes up space naturally."
        ]
    },
    {
        title: "Strategic Interaction",
        subtitle: "Aura & Charm",
        icon: MessageSquare,
        color: "blue",
        steps: [
            "Genuinely curious, never performing.",
            "Listening is the highest form of influence.",
            "Open body language, closed strategic mind.",
            "Confident vulnerability — admit only intended flaws."
        ]
    },
    {
        title: "The 3AM Mindset",
        subtitle: "Core Identity",
        icon: Eye,
        color: "purple",
        steps: [
            "You are the version of you that others fear.",
            "Discipline is not a burden, it is your weapon.",
            "Privacy is your edge. Never reveal the schedule.",
            "Every day is a brick in the monument."
        ]
    }
];

export default function IdentityPage() {
    return (
        <div className="space-y-12">
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bebas tracking-wider">Identity Blueprint</h1>
                    <div className="h-px bg-border flex-1" />
                    <span className="font-mono text-[10px] uppercase text-text-dim tracking-widest">Aura · Presence · Impact</span>
                </div>
                <p className="font-serif italic text-text-muted text-lg max-w-xl leading-relaxed">
                    "Your identity is not who you are. It is who you decide to be every single morning at 3:00 AM."
                </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blueprints.map((blueprint, i) => (
                    <motion.div
                        key={blueprint.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-bg-surface border border-border p-8 rounded-2xl group hover:border-border-2 transition-all relative overflow-hidden"
                    >
                        <div className={cn(
                            "absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all",
                            `text-${blueprint.color}`
                        )}>
                            <blueprint.icon className="w-24 h-24" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div>
                                <h3 className="font-bebas text-2xl group-hover:text-gold transition-colors">{blueprint.title}</h3>
                                <p className="font-serif italic text-sm text-text-muted">{blueprint.subtitle}</p>
                            </div>

                            <div className="space-y-3">
                                {blueprint.steps.map((step, sidx) => (
                                    <div key={sidx} className="flex gap-3 items-start">
                                        <div className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", `bg-${blueprint.color}`)} />
                                        <p className="font-mono text-[10px] uppercase tracking-tight text-text leading-relaxed">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </section>

            <div className="bg-gold-dim border border-gold/20 p-12 rounded-2xl text-center">
                <h4 className="font-bebas text-4xl mb-4 text-gold">The Composure Rule</h4>
                <p className="font-serif italic text-xl text-gold-light max-w-2xl mx-auto leading-relaxed mb-6">
                    "The most powerful man in the room is the one who understands his own triggers and has placed absolute seals upon them."
                </p>
                <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-gold/40">
          // 2-Second Seal · Active
                </div>
            </div>
        </div>
    );
}
