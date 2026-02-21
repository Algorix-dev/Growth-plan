"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate login for now - real Supabase Auth would go here
        setTimeout(() => {
            if (email === "emmanuel@os.com") {
                toast.success("Welcome back, Emmanuel.");
                router.push("/");
            } else {
                toast.error("Access denied. Authorized users only.");
            }
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[40%] h-[60%] bg-gold/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[50%] bg-purple/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[400px] z-10"
            >
                <div className="bg-bg-surface border border-border p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gold" />

                    <div className="text-center mb-8">
                        <h1 className="font-bebas text-5xl tracking-tighter text-gold mb-2">EP <span className="text-text-dim">·</span> OS</h1>
                        <p className="font-serif italic text-text-muted text-sm tracking-wide">
                            &quot;Build in the dark. Shine in the light.&quot;
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Command Access</Label>
                            <Input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-bg-base border-border-2 focus:border-gold h-12 rounded-md font-mono text-xs uppercase"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Password Key</Label>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-bg-base border-border-2 focus:border-gold h-12 rounded-md font-mono"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold hover:bg-gold-light text-black font-mono font-bold uppercase tracking-widest h-12 transition-all active:scale-[0.98]"
                        >
                            {loading ? "AUTHENTICATING..." : "INITIATE SESSION"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <h1 className="text-4xl font-bebas tracking-tighter text-white mb-2">ACCESS &quot;THE FORGE&quot;</h1>
                        <p className="font-mono text-[10px] text-gold/60 tracking-[0.2em]">&quot;REPRODUCE OR BE ERASED&quot;</p>
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-dim">
                            Forging Phase v2.0 · Nigeria
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
