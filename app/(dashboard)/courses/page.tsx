"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    Plus,
    GraduationCap,
    LayoutGrid,
    Filter,
    X,
    Info
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

import { initialCourses, Course } from "@/lib/data";

function getGradePoint(score: number) {
    if (score >= 70) return 5.0; // A
    if (score >= 60) return 4.0; // B
    if (score >= 50) return 3.0; // C
    if (score >= 45) return 2.0; // D
    if (score >= 40) return 1.0; // E
    return 0.0; // F
}

function getGradeLetter(score: number) {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";
    return "F";
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [expanded, setExpanded] = useState<string | null>("1");
    const [loaded, setLoaded] = useState(false);

    // Scoring Modal State
    const [scoreVal, setScoreVal] = useState("");

    // Topic Addition State
    const [newTopicCourseId, setNewTopicCourseId] = useState<string | null>(null);
    const [newTopicTitle, setNewTopicTitle] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("emmanuel_courses");
        if (saved) setCourses(JSON.parse(saved));
        setLoaded(true);
    }, []);

    useEffect(() => {
        localStorage.setItem("emmanuel_courses", JSON.stringify(courses));
    }, [courses]);

    const toggleTopic = (courseId: string, topicId: string) => {
        setCourses(prev => prev.map(c => {
            if (c.id !== courseId) return c;
            return {
                ...c,
                topics: c.topics.map(t => t.id === topicId ? { ...t, completed: !t.completed } : t)
            }
        }));
    };

    const addScore = () => {
        if (!scoreModal || !scoreLabel || !scoreVal) return;
        const val = parseFloat(scoreVal);
        if (isNaN(val) || val < 0 || val > 100) return;

        setCourses(courses.map(c => {
            if (c.id === scoreModal) {
                return {
                    ...c,
                    scores: [...c.scores, { label: scoreLabel, value: val }]
                };
            }
            return c;
        }));

        setScoreModal(null);
        setScoreLabel("");
        setScoreVal("");
    };

    const addTopic = (courseId: string) => {
        if (!newTopicTitle.trim()) return;

        setCourses(prev => prev.map(c => {
            if (c.id !== courseId) return c;
            const newTopic = {
                id: `custom-${Date.now()}`,
                title: newTopicTitle.trim(),
                completed: false
            };
            return {
                ...c,
                topics: [...c.topics, newTopic]
            };
        }));

        setNewTopicTitle("");
        setNewTopicCourseId(null);
    };

    // Live GPA Estimate: based on ACTUAL scores entered, assuming equal weight for now.
    // If a course has no scores, it falls back to 0.
    const coursesWithScores = courses.filter(c => c.scores.length > 0);
    let gpa = "0.00";

    if (coursesWithScores.length > 0) {
        const totalPoints = coursesWithScores.reduce((acc, c) => {
            // Sum up scores. Typically CA is 30, Exam is 70 = 100.
            // If they enter multiple, we sum them capped at 100 for the final grade calculation.
            const totalScore = Math.min(c.scores.reduce((sum, s) => sum + s.value, 0), 100);
            return acc + getGradePoint(totalScore);
        }, 0);

        const calcGpa = (totalPoints / coursesWithScores.length);
        gpa = calcGpa.toFixed(2);
    }

    if (!loaded) return null;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bebas tracking-wider">Academic Command</h1>
                        <div className="h-px bg-border flex-1" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-blue/10 border border-blue/20 text-blue font-mono text-[9px] uppercase tracking-widest rounded-sm">
                            Target: 5.0 GPA
                        </span>
                        <span className="px-3 py-1 bg-bg-surface border border-border text-text-muted font-mono text-[9px] uppercase tracking-widest rounded-sm">
                            9 Active Courses
                        </span>
                        <span className={`px-3 py-1 border font-mono text-[9px] uppercase tracking-widest rounded-sm ${parseFloat(gpa) >= 4.5 ? 'bg-green/10 border-green/20 text-green' : parseFloat(gpa) >= 3.5 ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-red/10 border-red/20 text-red'}`}>
                            Projected CGPA: {gpa} / 5.0
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 bg-bg-surface border border-border rounded-lg text-text-muted hover:text-text transition-all">
                        <Filter className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-bg-surface border border-border rounded-lg text-text-muted hover:text-text transition-all">
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course) => {
                    const completedCount = course.topics.filter(t => t.completed).length;
                    const totalTopics = course.topics.length;
                    const progress = Math.round((completedCount / totalTopics) * 100);
                    const isExpanded = expanded === course.id;

                    return (
                        <motion.div
                            key={course.id}
                            layout
                            className={cn(
                                "bg-bg-surface border border-border rounded-xl transition-all overflow-hidden relative",
                                isExpanded ? "ring-1 ring-gold/30 shadow-[0_0_30px_rgba(201,150,46,0.1)]" : "hover:border-border-2"
                            )}
                        >
                            <div
                                className="absolute top-0 left-0 w-1 h-full"
                                style={{ backgroundColor: course.color }}
                            />

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-1">{course.code} · {course.category}</p>
                                        <h3 className="text-xl font-bebas leading-none">{course.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bebas text-2xl text-gold">{progress}%</p>
                                        <p className="font-mono text-[9px] uppercase text-text-dim">{completedCount}/{totalTopics} UNITs</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <Progress value={progress} className="h-1 bg-bg-muted" />

                                    <div className="grid grid-cols-2 gap-2">
                                        {course.scores.map((score, sidx) => (
                                            <div key={sidx} className="bg-bg-base border border-border-2 p-2 rounded flex items-center justify-between">
                                                <span className="font-mono text-[9px] uppercase text-text-dim truncate">{score.label}</span>
                                                <span className={cn("font-bebas text-lg tracking-widest", score.value >= 70 ? "text-green" : "text-gold")}>{score.value}</span>
                                            </div>
                                        ))}
                                        {course.scores.length > 0 && (
                                            <div className="bg-bg-base border border-gold/30 p-2 rounded flex items-center justify-between col-span-full">
                                                <span className="font-mono text-[9px] uppercase text-gold truncate">Total Score</span>
                                                <div className="flex gap-2 items-center">
                                                    <span className="font-bebas text-xl text-text">
                                                        {Math.min(course.scores.reduce((sum, s) => sum + s.value, 0), 100)}
                                                    </span>
                                                    <span className="font-bebas text-lg px-2 rounded bg-gold text-black">
                                                        {getGradeLetter(Math.min(course.scores.reduce((sum, s) => sum + s.value, 0), 100))}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setScoreModal(course.id)}
                                            className="border border-dashed border-border-2 p-2 rounded flex items-center justify-center text-text-dim hover:text-gold hover:border-gold transition-all text-[10px] font-mono uppercase gap-2 col-span-full mt-2"
                                        >
                                            <Plus className="w-3 h-3" /> Add CA / Exam Score
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border">
                                <button
                                    onClick={() => setExpanded(isExpanded ? null : course.id)}
                                    className="w-full p-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-text-muted hover:text-text transition-colors"
                                >
                                    <span>Syllabus Breakdown</span>
                                    <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 space-y-3">
                                                {course.topics.map((topic) => (
                                                    <div
                                                        key={topic.id}
                                                        className={cn(
                                                            "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                                                            topic.completed ? "bg-green/5 border-green/20" : "bg-bg-base border-border-2 hover:border-border"
                                                        )}
                                                        onClick={() => toggleTopic(course.id, topic.id)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Checkbox
                                                                checked={topic.completed}
                                                                onCheckedChange={() => toggleTopic(course.id, topic.id)}
                                                                className="border-border-2 data-[state=checked]:bg-green data-[state=checked]:border-green"
                                                            />
                                                            <span className={cn("font-mono text-[11px] uppercase tracking-tight", topic.completed ? "text-text line-through opacity-50" : "text-text")}>
                                                                {topic.title}
                                                            </span>
                                                        </div>
                                                        {topic.completed && <CheckCircle2 className="w-3 h-3 text-green" />}
                                                    </div>
                                                ))}

                                                {/* Add Topic UI */}
                                                <div className="mt-4 pt-4 border-t border-border/30">
                                                    {newTopicCourseId === course.id ? (
                                                        <div className="flex gap-2">
                                                            <input
                                                                autoFocus
                                                                type="text"
                                                                value={newTopicTitle}
                                                                onChange={(e) => setNewTopicTitle(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && addTopic(course.id)}
                                                                placeholder="Topic title..."
                                                                className="flex-1 bg-bg-base border border-gold/30 rounded px-3 py-2 font-mono text-[10px] uppercase focus:border-gold outline-none"
                                                            />
                                                            <button
                                                                onClick={() => addTopic(course.id)}
                                                                className="px-3 bg-gold text-black rounded font-bebas text-sm"
                                                            >
                                                                ADD
                                                            </button>
                                                            <button
                                                                onClick={() => setNewTopicCourseId(null)}
                                                                className="px-3 bg-bg-elevated text-text-muted rounded font-bebas text-sm"
                                                            >
                                                                CANCEL
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setNewTopicCourseId(course.id);
                                                            }}
                                                            className="w-full py-2 border border-dashed border-border-2 rounded flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-widest text-text-dim hover:text-gold hover:border-gold transition-all"
                                                        >
                                                            <Plus className="w-3 h-3" /> Expand Syllabus
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
                    <GraduationCap className="text-gold w-8 h-8" />
                    <div>
                        <h4 className="font-bebas text-xl">GPA Target</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bebas text-green">5.00</span>
                            <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">Current Semester</span>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
                    <BookOpen className="text-blue w-8 h-8" />
                    <div>
                        <h4 className="font-bebas text-xl">Unit Completion</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bebas text-blue">
                                {courses.reduce((acc, c) => acc + c.topics.filter(t => t.completed).length, 0)} / {courses.reduce((acc, c) => acc + c.topics.length, 0)}
                            </span>
                            <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">Mastery Level</span>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-surface border border-border p-6 rounded-xl md:col-span-full xl:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Info className="text-text-dim w-5 h-5" />
                        <h4 className="font-bebas text-xl">Standard Grading System</h4>
                    </div>
                    <div className="grid grid-cols-6 gap-2 text-center border-t border-border-2 pt-4">
                        <div><p className="font-bebas text-lg text-green">A</p><p className="font-mono text-[9px] text-text-dim">70-100</p><p className="font-mono text-[9px] text-text-dim">5.0</p></div>
                        <div><p className="font-bebas text-lg text-gold-light">B</p><p className="font-mono text-[9px] text-text-dim">60-69</p><p className="font-mono text-[9px] text-text-dim">4.0</p></div>
                        <div><p className="font-bebas text-lg text-gold">C</p><p className="font-mono text-[9px] text-text-dim">50-59</p><p className="font-mono text-[9px] text-text-dim">3.0</p></div>
                        <div><p className="font-bebas text-lg text-orange">D</p><p className="font-mono text-[9px] text-text-dim">45-49</p><p className="font-mono text-[9px] text-text-dim">2.0</p></div>
                        <div><p className="font-bebas text-lg text-red/80">E</p><p className="font-mono text-[9px] text-text-dim">40-44</p><p className="font-mono text-[9px] text-text-dim">1.0</p></div>
                        <div><p className="font-bebas text-lg text-red">F</p><p className="font-mono text-[9px] text-text-dim">0-39</p><p className="font-mono text-[9px] text-text-dim">0.0</p></div>
                    </div>
                </div>
            </div>

            {/* Score Entry Modal */}
            <AnimatePresence>
                {scoreModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-bg-surface border border-gold/30 rounded-2xl p-6 w-full max-w-sm relative"
                        >
                            <button
                                onClick={() => setScoreModal(null)}
                                className="absolute top-4 right-4 text-text-muted hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="font-bebas text-2xl mb-2 text-gold">Input Score</h3>
                            <p className="font-mono text-[10px] text-text-dim uppercase tracking-widest mb-6 border-b border-border/50 pb-4">
                                Enter CA (0-30) or Exam (0-70) score
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim block mb-2">Assessment Label</label>
                                    <input
                                        type="text"
                                        value={scoreLabel}
                                        onChange={(e) => setScoreLabel(e.target.value)}
                                        placeholder="e.g. Midterm CA, Final Exam"
                                        className="w-full bg-bg-base border border-border-2 rounded-lg px-4 py-3 font-mono text-sm uppercase focus:border-gold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim block mb-2">Points</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={scoreVal}
                                        onChange={(e) => setScoreVal(e.target.value)}
                                        placeholder="0 - 100"
                                        className="w-full bg-bg-base border border-border-2 rounded-lg px-4 py-3 font-bebas text-2xl tracking-widest focus:border-gold outline-none"
                                    />
                                </div>
                                <button
                                    onClick={addScore}
                                    className="w-full bg-gold hover:bg-gold-light text-black font-bebas text-xl tracking-widest py-3 rounded-lg mt-2"
                                >
                                    Save Score
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
