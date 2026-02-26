"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AssetIcon from "@/components/AssetIcon";
import TrendBadge from "@/components/TrendBadge";
import { TABLE_CELL_CLASS } from "@/lib/constants";

interface AssetRowProps {
    index: number;
    symbol: string;
    name: string;
    price: string;
    changeValue: string;
    changePercent: string;
    isPositive: boolean;
    avatar: string;
    volume: string;
    category: string;
    color?: string;
}

export default function AssetRow({ index, symbol, name, price, changePercent, isPositive, avatar, volume, category, color }: AssetRowProps) {
    const router = useRouter();

    return (
        <motion.tr
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => router.push(`/discover/${symbol.toLowerCase()}`)}
            className="group border-b border-slate-50 hover:bg-slate-50/80 transition-all cursor-pointer"
        >
            <td className={`${TABLE_CELL_CLASS} text-[12px] font-black w-10 md:w-16 text-center tabular-nums sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors border-r border-slate-50`}>
                <span className="text-slate-400 group-hover:text-slate-900 transition-colors">{index + 1}</span>
            </td>
            <td className={`${TABLE_CELL_CLASS} min-w-[140px] md:min-w-[200px] max-w-[160px] md:max-w-none sticky left-10 md:left-16 z-10 bg-white group-hover:bg-slate-50 transition-colors border-r border-slate-50 shadow-[10px_0_15px_-10px_rgba(0,0,0,0.02)]`}>
                <div className="flex items-center gap-2 md:gap-3">
                    <AssetIcon symbol={symbol} avatar={avatar} color={color} size="sm" className="transition-all duration-300 group-hover:scale-110 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-black text-slate-950 leading-none tracking-tight truncate">{symbol}</span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider truncate">{name}</span>
                    </div>
                </div>
            </td>
            <td className={`${TABLE_CELL_CLASS} text-[14px] font-black text-slate-950 tabular-nums tracking-tighter`}>${price}</td>
            <td className={TABLE_CELL_CLASS}>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-500 border border-slate-100/50 rounded-md text-[10px] font-black uppercase tracking-widest leading-none">
                    {category}
                </div>
            </td>
            <td className={TABLE_CELL_CLASS}>
                <TrendBadge isPositive={isPositive} value={changePercent} />
            </td>
            <td className={`${TABLE_CELL_CLASS} text-right text-[13px] font-bold text-slate-500 tabular-nums leading-none tracking-tight`}>
                <span className="text-[10px] text-slate-300 mr-1 uppercase">$</span>{volume}
            </td>
        </motion.tr>
    );
}
