/* ──────────────────────────────────────
   Design Tokens – single source of truth
   ────────────────────────────────────── */

/** Shared table header class applied to <th> across all pages */
export const TABLE_HEADER_CLASS =
    "px-6 py-5 text-[11px] font-black text-slate-950 dark:text-white uppercase tracking-widest";

/** Shared table cell class applied to <td> across all pages */
export const TABLE_CELL_CLASS = "px-6 py-5";

/** Standard icon sizes used across components (in Tailwind) */
export const ICON_SIZES = {
    /** Pair list rows */
    xs: { container: "w-7 h-7", img: "w-4 h-4", radius: "rounded-lg" },
    /** Cards, stat items */
    sm: { container: "w-10 h-10", img: "w-6 h-6", radius: "rounded-xl" },
    /** Default / rows, pool cards */
    md: { container: "w-11 h-11", img: "w-7 h-7", radius: "rounded-xl" },
    /** Asset detail header */
    lg: { container: "w-12 h-12 md:w-14 md:h-14", img: "w-9 h-9 md:w-11 md:h-11", radius: "rounded-2xl" },
} as const;

/** The comdex mark SVG path used for all non-USDT icons */
export const COMDEX_MARK_SRC = "/images/comdex-mark.svg";

/** Shared positive / negative color tokens */
export const TREND_COLORS = {
    positive: {
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
        border: "border-emerald-100/50 dark:border-emerald-800/50",
    },
    negative: {
        text: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-50 dark:bg-rose-500/10",
        border: "border-rose-100/50 dark:border-rose-800/50",
    },
} as const;

/** Primary button class (dark CTA) */
export const PRIMARY_BUTTON_CLASS =
    "bg-slate-950 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-500 shadow-xl shadow-slate-950/10 dark:shadow-black/20 active:scale-[0.98] transition-all";

/** Success state button class */
export const SUCCESS_BUTTON_CLASS =
    "bg-emerald-500 text-white shadow-emerald-500/20";
