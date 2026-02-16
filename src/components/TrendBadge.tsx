"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { TREND_COLORS } from "@/lib/constants";

interface TrendBadgeProps {
    isPositive: boolean;
    value: string;
    /** "badge" = pill-style with bg, "text" = plain inline text */
    variant?: "badge" | "text";
}

/**
 * Consistent performance/trend indicator used in cards, rows, stat items.
 * Uses shared TREND_COLORS so any color change applies everywhere.
 */
export default function TrendBadge({ isPositive, value, variant = "badge" }: TrendBadgeProps) {
    const colors = isPositive ? TREND_COLORS.positive : TREND_COLORS.negative;

    if (variant === "text") {
        return (
            <span className={`flex items-center gap-1 text-[11px] font-black ${colors.text}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {value}
            </span>
        );
    }

    return (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-black ${colors.bg} ${colors.text} border ${colors.border}`}>
            {isPositive ? "▲" : "▼"} {value}
        </div>
    );
}
