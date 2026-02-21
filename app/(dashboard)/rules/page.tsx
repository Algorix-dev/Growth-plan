"use client"

import { motion } from "framer-motion";

const rules = [
    { n: '01', t: '3AM feet hit the floor.', b: 'The moment the alarm goes — no snooze, no negotiation, no "5 more minutes." That first motion decides who runs your life: you or comfort.' },
    { n: '02', t: 'Nobody sees the 3AM.', b: 'You build in darkness. You share the light. Never announce the schedule. Never explain the discipline. Let them wonder how.' },
    { n: '03', t: 'Lectures are confirmation.', b: 'You walk in already knowing the material. The lecturer confirms what you self-studied. First class students aren\'t smarter — they arrived earlier.' },
    { n: '04', t: 'One hour of code. Every day.', b: 'Not when motivated. Not when inspired. Every day. Even if it\'s 30 minutes of struggling on one problem. The streak is the skill.' },
    { n: '05', t: 'No journal, no trade.', b: 'Every trade logged: entry reason, SL, TP, emotion, outcome, lesson. No exceptions. The journal is the edge. Without it, you\'re gambling.' },
    { n: '06', t: 'Pause before you react.', b: '2 seconds before every response — social, emotional, situational. In that gap lives your composure. That gap is your reputation being built.' },
    { n: '07', t: 'Train the body like the mind.', b: 'Discipline in the gym makes discipline in the books easier. Your physique reflects your internal order. Treat it as seriously as your GPA.' },
    { n: '08', t: 'Manna first. Always.', b: 'Before study. Before code. Before checking your phone. 3AM: open Manna. This is the anchor that holds every other discipline in place.' },
    { n: '09', t: '9PM is protected.', b: 'Nothing overrides sleep. No social event, no content, no conversation. Sleep is when the brain consolidates everything you worked for. Guard it.' },
    { n: '10', t: 'Look intentional. Every time.', b: 'Grooming done. Fit planned. Posture correct. Fragrance applied. You don\'t have to be the loudest in the room. But you will be noticed.' },
    { n: '11', t: 'Speak less. Mean more.', b: 'Every word you cut makes the ones you keep worth more. Silence is not weakness — it is precision. The most respected people in the room speak last.' },
    { n: '12', t: 'Compete with yesterday.', b: 'Not your classmates. Not their social media. The only scoreboard that matters: am I better than I was 24 hours ago? That\'s the race. That\'s the only one.' },
];

export default function RulesPage() {
    return (
        <div className="space-y-12">
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bebas tracking-wider">The Code of Conduct</h1>
                    <div className="h-px bg-border flex-1" />
                    <span className="font-mono text-[10px] uppercase text-text-dim tracking-widest">12 Seals of Discipline</span>
                </div>
            </header>

            <section className="bg-bg-surface border border-border p-12 rounded-2xl text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
                <p className="font-serif italic text-3xl text-gold-light max-w-3xl mx-auto leading-relaxed relative z-10">
                    &quot;The code is not a suggestion. It is the law that guarantees the result. Break the code, break the future.&quot;
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rules.map((rule, i) => (
                    <motion.div
                        key={rule.n}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-bg-surface border border-border p-6 rounded-xl hover:border-gold/30 hover:-translate-y-1 transition-all group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span className="font-bebas text-3xl text-gold/40 group-hover:text-gold transition-colors">{rule.n}</span>
                            <h3 className="font-bebas text-xl tracking-wide">{rule.t}</h3>
                        </div>
                        <p className="font-mono text-[10px] text-text-muted leading-relaxed group-hover:text-text transition-colors">
                            {rule.b}
                        </p>
                    </motion.div>
                ))}
            </section>

            <footer className="pt-12 text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-text-dim animate-pulse">
                    Forged in Darkness · Emmanuel Peter · v2.0
                </p>
            </footer>
        </div>
    );
}
