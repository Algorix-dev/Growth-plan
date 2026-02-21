import { cn } from "@/lib/utils";
import { format, subDays, startOfWeek } from "date-fns";

interface HeatmapProps {
    checkedState: Record<string, boolean>;
    totalHabits: number;
}

export default function StreakHeatmap({ checkedState, totalHabits }: HeatmapProps) {
    // Generate the last 84 days (12 weeks * 7 days)
    const today = new Date();
    // Start from the beginning of the week 12 weeks ago to get a clean grid
    const startDate = startOfWeek(subDays(today, 83), { weekStartsOn: 1 }); // Monday start

    const days = Array.from({ length: 84 }).map((_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return date;
    });

    // Group into weeks for columns
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    // Helper to get completion % for a specific date
    const getDayCompletion = (date: Date) => {
        const dayStr = format(date, "EEE"); // "Mon", "Tue" etc base format from existing app
        // The app currently saves state as "HabitName-Mon".
        // To precisely track history, it would ideally be "HabitName-YYYY-MM-DD"
        // Since the current app structure uses abstract days for the current week only,
        // we will simulate historical data completion based on current abstract days, 
        // mapping them sequentially for visual effect, but real persistence would require date-keys.

        let completed = 0;
        // Search through checked state for matching active day
        Object.entries(checkedState).forEach(([key, val]) => {
            if (val && key.endsWith(`-${dayStr}`)) { // This maps back to the current week's M-S abstract
                completed++;
            }
        });

        return totalHabits > 0 ? (completed / totalHabits) * 100 : 0;
    };

    const getColorClass = (pct: number) => {
        if (pct === 0) return "bg-bg-elevated/50 border-border-2";
        if (pct < 30) return "bg-gold/20 border-gold/10";
        if (pct < 60) return "bg-gold/50 border-gold/30";
        if (pct < 90) return "bg-gold/80 border-gold/60";
        return "bg-gold border-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]";
    };

    return (
        <div className="bg-bg-surface border border-border p-6 rounded-xl overflow-hidden mt-8">
            <h3 className="font-bebas text-2xl mb-6 text-gold flex items-center gap-3">
                <span>12-Week Consistency</span>
                <span className="font-mono bg-gold/10 text-gold px-2 py-0.5 rounded text-[10px] tracking-widest uppercase border border-gold/20">Data Projection</span>
            </h3>

            <div className="flex gap-4">
                {/* Y-Axis Labels (M/W/F) */}
                <div className="flex flex-col gap-[6px] text-[10px] font-mono uppercase text-text-dim pr-2 justify-between py-1">
                    <span>Mon</span>
                    <span className="opacity-0">Tue</span>
                    <span>Wed</span>
                    <span className="opacity-0">Thu</span>
                    <span>Fri</span>
                    <span className="opacity-0">Sat</span>
                    <span>Sun</span>
                </div>

                {/* Grid */}
                <div className="flex gap-[6px] overflow-x-auto pb-4 scrollbar-hide flex-1">
                    {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-[6px]">
                            {week.map((date, dIdx) => {
                                const pct = getDayCompletion(date);
                                const dateStr = format(date, "MMM d, yyyy");

                                return (
                                    <div
                                        key={dIdx}
                                        title={`${dateStr}: ${Math.round(pct)}% completion`}
                                        className={cn(
                                            "w-4 h-4 rounded-sm border transition-all duration-300 hover:scale-125 hover:z-10 cursor-crosshair",
                                            getColorClass(pct)
                                        )}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 font-mono text-[9px] uppercase text-text-dim">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-bg-elevated/50" />
                    <div className="w-3 h-3 rounded-sm bg-gold/20" />
                    <div className="w-3 h-3 rounded-sm bg-gold/50" />
                    <div className="w-3 h-3 rounded-sm bg-gold/80" />
                    <div className="w-3 h-3 rounded-sm bg-gold shadow-[0_0_5px_rgba(212,175,55,0.4)]" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
