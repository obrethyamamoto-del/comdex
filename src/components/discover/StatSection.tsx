"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import AssetIcon from "@/components/AssetIcon";

interface StatItemProps {
    icon: string | ReactNode;
    name: string;
    symbol: string;
    value: string;
    subValue: string;
    isPositive?: boolean;
    idx?: number;
    color?: string;
}

function StatItem({ icon, name, symbol, value, subValue, isPositive, idx = 0, color }: StatItemProps) {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => router.push(`/discover/${symbol.toLowerCase()}`)}
            className="flex items-center justify-between py-4 hover:bg-white dark:hover:bg-slate-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all duration-300 rounded-[20px] px-3 cursor-pointer group"
        >
            <div className="flex items-center gap-4">
                <AssetIcon
                    symbol={symbol}
                    avatar={typeof icon === "string" ? icon : ""}
                    color={color}
                    size="sm"
                    className="transition-all duration-300"
                />
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-black text-slate-900 dark:text-white leading-none group-hover:text-primary transition-colors">{symbol}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ArrowRight className="w-3 h-3 text-primary" />
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">{name}</span>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[13px] font-black text-slate-950 dark:text-white leading-none tabular-nums">{value}</span>
                <div className={`flex items-center gap-1 mt-1 font-bold text-[10px] ${isPositive === undefined ? "text-slate-400 dark:text-slate-500" : isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                    }`}>
                    {isPositive === true && <TrendingUp className="w-2.5 h-2.5" />}
                    {isPositive === false && <TrendingDown className="w-2.5 h-2.5" />}
                    {subValue}
                </div>
            </div>
        </motion.div>
    );
}

interface StatSectionProps {
    title: string;
    items: StatItemProps[];
}

export default function StatSection({ title, items }: StatSectionProps) {
    return (
        <div className="flex flex-col bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[32px] p-6 border border-white dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                    <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
                    <span className="text-[9px] bg-slate-900 dark:bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">24H</span>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                {items.map((item, idx) => (
                    <StatItem key={idx} {...item} idx={idx} />
                ))}
            </div>
        </div>
    );
}
