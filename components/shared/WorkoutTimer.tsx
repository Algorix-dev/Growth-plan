"use client";

import { useState, useEffect, useRef } from "react";
import {
    X,
    Play,
    Pause,
    RotateCcw,
    Maximize2,
    Minimize2,
    Volume2,
    VolumeX,
    Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface WorkoutTimerProps {
    isOpen: boolean;
    onClose: () => void;
    initialSeconds: number;
    title: string;
}

export function WorkoutTimer({ isOpen, onClose, initialSeconds, title }: WorkoutTimerProps) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        setSeconds(initialSeconds);
    };

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (err) {
            console.error("Fullscreen Error:", err);
            // Fallback to local state if API fails
            setIsFullscreen(!isFullscreen);
        }
    };

    // Exit fullscreen on close
    const handleClose = async () => {
        if (document.fullscreenElement) {
            try {
                await document.exitFullscreen();
            } catch (e) {
                console.error("Exit Fullscreen Error", e);
            }
        }
        setIsFullscreen(false);
        onClose();
    };

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        const handleFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFsChange);
        return () => document.removeEventListener("fullscreenchange", handleFsChange);
    }, []);

    useEffect(() => {
        if (isRunning && seconds > 0) {
            timerRef.current = setInterval(() => {
                setSeconds((s) => s - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsRunning(false);
            if (!isMuted && audioRef.current) {
                audioRef.current.play().catch(e => console.log("Audio play blocked", e));
            }
            if (window.navigator.vibrate) {
                window.navigator.vibrate([500, 200, 500]);
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, seconds, isMuted]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                ref={containerRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                    "fixed inset-0 z-[200] flex flex-col items-center justify-center transition-all bg-bg-dark/95 backdrop-blur-xl",
                    isFullscreen ? "p-0" : "p-4 md:p-8"
                )}
            >
                {/* Audio Element */}
                <audio ref={audioRef} src="/sounds/alarm.mp3" preload="auto" />

                {/* Top Controls */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="font-mono text-[10px] text-gold uppercase tracking-[0.3em]">Active Session</p>
                        <h2 className="font-bebas text-3xl text-text tracking-wider">{title}</h2>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"
                        >
                            {isMuted ? <VolumeX className="w-5 h-5 text-red" /> : <Volume2 className="w-5 h-5 text-gold" />}
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"
                        >
                            {isFullscreen ? <Minimize2 className="w-5 h-5 text-gold" /> : <Maximize2 className="w-5 h-5 text-gold" />}
                        </button>
                        <button
                            onClick={handleClose}
                            className="w-10 h-10 rounded-full bg-red/10 border border-red/20 flex items-center justify-center hover:bg-red/20 group"
                        >
                            <X className="w-5 h-5 text-red group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Large Display */}
                <div className="relative flex flex-col items-center justify-center">
                    <motion.div
                        key={seconds}
                        initial={{ opacity: 0.5, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "font-bebas leading-none text-text select-none",
                            isFullscreen ? "text-[25vw]" : "text-[20vw]"
                        )}
                    >
                        {formatTime(seconds)}
                    </motion.div>

                    {seconds === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute -top-12 flex items-center gap-2 px-4 py-2 bg-gold text-bg-dark rounded-full font-bebas text-2xl shadow-lg shadow-gold/20"
                        >
                            <Bell className="w-6 h-6 animate-bounce" /> BLOCK COMPLETE
                        </motion.div>
                    )}
                </div>

                {/* Main Controls */}
                <div className="mt-12 flex items-center gap-8">
                    <button
                        onClick={resetTimer}
                        className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
                    >
                        <RotateCcw className="w-8 h-8 text-text-dim" />
                    </button>
                    <button
                        onClick={toggleTimer}
                        className={cn(
                            "w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95",
                            isRunning ? "bg-red text-white shadow-red/20" : "bg-gold text-bg-dark shadow-gold/20"
                        )}
                    >
                        {isRunning ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current ml-2" />}
                    </button>
                </div>

                {/* Aesthetic Progress Bar */}
                <div className="absolute bottom-12 left-12 right-12 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: `${(seconds / initialSeconds) * 100}%` }}
                        className="h-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
