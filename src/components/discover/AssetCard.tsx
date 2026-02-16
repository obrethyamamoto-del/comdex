"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AssetIcon from "@/components/AssetIcon";
import { PRIMARY_BUTTON_CLASS } from "@/lib/constants";

interface AssetCardProps {
    symbol: string;
    name: string;
    price: string;
    changePercent: string;
    isPositive: boolean;
    avatar: string;
    color?: string;
    volume: string;
    category: string;
}

export default function AssetCard({ symbol, name, price, changePercent, isPositive, avatar, color, volume, category }: AssetCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [sparklineData, setSparklineData] = useState({ path: "", fillPath: "" });
    const router = useRouter();

    useEffect(() => {
        const pointsCount = 24;
        const points: number[] = [];
        let current = isPositive ? 60 : 40;
        for (let i = 0; i < pointsCount; i++) {
            const volatility = 8;
            const trend = isPositive ? -1.5 : 1.5;
            current += (Math.random() - 0.5) * volatility + trend;
            current = Math.max(10, Math.min(90, current));
            points.push(current);
        }

        const path = points.reduce((acc, val, i) => {
            const x = (i / (pointsCount - 1)) * 100;
            if (i === 0) return `M${x} ${val}`;
            const prevX = ((i - 1) / (pointsCount - 1)) * 100;
            const cpX = (prevX + x) / 2;
            return acc + ` C${cpX} ${points[i - 1]}, ${cpX} ${val}, ${x} ${val}`;
        }, "");

        setSparklineData({ path, fillPath: `${path} V100 H0 Z` });
    }, [isPositive]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => router.push(`/discover/${symbol.toLowerCase()}`)}
            className="group relative bg-white border border-slate-100 rounded-[28px] p-6 flex flex-col gap-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-slate-200 transition-all duration-500 cursor-pointer overflow-hidden min-h-[320px]"
        >
            {/* Immersive Background Graph */}
            <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-[0.4]" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id={`bg-grad-${symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity="0.12" />
                            <stop offset="60%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity="0.04" />
                            <stop offset="100%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        d={sparklineData.fillPath}
                        fill={`url(#bg-grad-${symbol})`}
                    />
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.2 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        d={sparklineData.path}
                        fill="none"
                        stroke={isPositive ? "#10b981" : "#f43f5e"}
                        strokeWidth="1"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white to-transparent opacity-60 z-[1]" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <AssetIcon symbol={symbol} avatar={avatar} color={color} size="md" className="transition-all duration-500" />

                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[15px] font-black text-slate-950 tracking-tight leading-none">{symbol}</span>
                            <ArrowUpRight className={`w-3 h-3 text-slate-300 transition-colors ${isHovered ? "text-slate-950" : ""}`} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">{name}</span>
                    </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-500 border border-slate-100/50 rounded-md text-[9px] font-black uppercase tracking-widest leading-none">
                    {category}
                </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-col gap-1 relative z-10 mt-2">
                <div className="flex items-baseline gap-1">
                    <span className="text-[32px] font-black text-slate-950 tracking-tighter tabular-nums leading-none">${price}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">USD</span>
                </div>

                <div className="flex items-center gap-4 mt-1">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-[11px] shadow-sm ${isPositive ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" : "bg-rose-50 text-rose-600 border border-rose-100/50"
                        }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {changePercent}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Volume</span>
                        <span className="text-[11px] font-black text-slate-600 tabular-nums leading-none tracking-tight">${volume}</span>
                    </div>
                </div>
            </div>

            {/* Spacer to push button down */}
            <div className="flex-1 min-h-[40px]" />

            {/* Button */}
            <div className="relative z-10 pt-4">
                <button className={`w-full h-12 rounded-xl text-[11px] font-black uppercase tracking-widest ${PRIMARY_BUTTON_CLASS}`}>
                    Execute Trade
                </button>
            </div>

            {/* Dynamic Hover Accent */}
            <div className={`absolute bottom-0 left-0 h-[3px] w-full bg-slate-950 transition-transform duration-500 origin-left z-20 ${isHovered ? "scale-x-100" : "scale-x-0"}`} />
        </motion.div>
    );
}
