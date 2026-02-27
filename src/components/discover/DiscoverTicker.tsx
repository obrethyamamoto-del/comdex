"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const TICKER_DATA = [
    { name: "S&P 500", value: "5,214.30", change: "+0.59%", isUp: true },
    { name: "GOLD", value: "2,185.40", change: "-1.06%", isUp: false },
    { name: "NASDAQ", value: "16,384.47", change: "-1.17%", isUp: false },
    { name: "BTC/USD", value: "68,230.12", change: "+2.40%", isUp: true },
    { name: "CRUDE OIL", value: "81.24", change: "-0.15%", isUp: false },
    { name: "TREASURY 10Y", value: "4.32%", change: "-0.10%", isUp: false },
    { name: "ETH/USD", value: "3,842.12", change: "+1.85%", isUp: true },
    { name: "SILVER", value: "24.50", change: "+0.45%", isUp: true },
];

export default function DiscoverTicker() {
    return (
        <div className="w-full bg-white dark:bg-[#020617] border-b border-slate-100 dark:border-slate-800 flex items-center h-11 overflow-hidden relative transition-colors duration-300">
            {/* Side Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-[#020617] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-[#020617] to-transparent z-10" />

            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-12 whitespace-nowrap pl-6"
            >
                {[...TICKER_DATA, ...TICKER_DATA].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 py-1.5 rounded-full transition-all duration-300">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">{item.name}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-slate-900 dark:text-white">{item.value}</span>
                            <span className={`flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-md ${item.isUp ? "text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" : "text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10"
                                }`}>
                                {item.isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                                {item.change}
                            </span>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
