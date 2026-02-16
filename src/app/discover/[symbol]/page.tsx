"use client";

import { use, useState, useEffect } from "react";
import { ASSETS } from "@/lib/assets";
import AssetIcon from "@/components/AssetIcon";
import {
    Clock,
    TrendingUp,
    TrendingDown,
    ChevronDown,
    ArrowDown,
    ArrowLeft,
    Copy,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import DiscoverTicker from "@/components/discover/DiscoverTicker";
import BnbLogo from "@/components/icons/BnbLogo";

export default function AssetDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = use(params);
    const asset = ASSETS.find(a => a.symbol === symbol.toUpperCase()) || ASSETS[0];
    const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("1D");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(asset.symbol === "AUSD" ? (ASSETS.find(a => a.symbol === "USDT") || ASSETS[0]) : asset);
    const [swapStatus, setSwapStatus] = useState<"idle" | "loading" | "success">("idle");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (asset.symbol === "AUSD") {
            setSelectedAsset(ASSETS.find(a => a.symbol === "USDT") || ASSETS[0]);
        } else {
            setSelectedAsset(asset);
        }
    }, [asset]);

    if (!mounted) return null;

    const toggleTrade = () => {
        setTradeType(prev => prev === "buy" ? "sell" : "buy");
    };

    const handleAssetSelect = (a: typeof asset) => {
        setSelectedAsset(a);
        setIsDropdownOpen(false);
    };

    const handleSwap = () => {
        setSwapStatus("loading");
        setTimeout(() => {
            setSwapStatus("success");
            setTimeout(() => {
                setSwapStatus("idle");
            }, 2000);
        }, 2000);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#fafbfc]">
            <DiscoverTicker />
            <main className="flex-1 overflow-y-auto no-scrollbar">
                <div className="max-w-[1400px] mx-auto w-full px-4 md:px-10 py-6 md:py-12">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <Link
                            href="/discover"
                            className="flex items-center gap-2 group transition-all"
                        >
                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:border-slate-200 shadow-sm transition-all group-active:scale-90">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Back</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                        {/* 1. Header & Chart: Top on Mobile, Top-Left on Desktop */}
                        <div className="flex flex-col gap-8 order-1 lg:col-span-1">
                            {/* Asset Header */}
                            <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                                    <div className="flex items-center gap-4">
                                        <AssetIcon symbol={selectedAsset.symbol} avatar={selectedAsset.avatar} color={selectedAsset.color} size="lg" className="shadow-lg" />
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h1 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight truncate">{selectedAsset.name}</h1>
                                                <span className="text-slate-400 font-bold text-base md:text-lg">{selectedAsset.symbol}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full">
                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Market Open</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-baseline md:items-end justify-between md:justify-start gap-2">
                                        <div className="text-3xl md:text-[42px] font-black text-slate-950 tracking-tighter leading-none">
                                            ${selectedAsset.price}
                                        </div>
                                        <div className={`flex items-center gap-1.5 font-black text-[12px] md:text-[13px] ${selectedAsset.isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                                            {selectedAsset.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            {selectedAsset.isPositive ? "+" : "-"}${selectedAsset.changeValue} ({selectedAsset.changePercent})
                                        </div>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="relative h-[300px] md:h-[400px] w-full bg-[#fcfdff] rounded-[24px] border border-slate-50 overflow-hidden group">
                                    <div className="absolute top-4 md:top-6 right-4 md:right-6 z-10 flex items-center gap-1 p-1 bg-white border border-slate-100 rounded-xl shadow-sm overflow-x-auto no-scrollbar">
                                        {["1D", "1W", "1M", "1Y", "ALL"].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-2.5 md:px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black transition-all ${activeTab === tab ? "bg-slate-950 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                                                    }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    <svg viewBox="0 0 1000 400" className="w-full h-full p-4 md:p-8" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={selectedAsset.isPositive ? "#10b881" : "#f43f5e"} stopOpacity="0.1" />
                                                <stop offset="100%" stopColor={selectedAsset.isPositive ? "#10b881" : "#f43f5e"} stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <motion.path
                                            key={`fill-${selectedAsset.symbol}`}
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1.5, ease: "easeInOut" }}
                                            d="M0,250 C100,230 150,280 250,240 C350,200 400,300 500,220 C600,150 700,200 850,180 C950,170 1000,100 1000,100 L1000,400 L0,400 Z"
                                            fill="url(#chartGradient)"
                                        />
                                        <motion.path
                                            key={`stroke-${selectedAsset.symbol}`}
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, ease: "easeInOut" }}
                                            d="M0,250 C100,230 150,280 250,240 C350,200 400,300 500,220 C600,150 700,200 850,180 C950,170 1000,100 1000,100"
                                            fill="none"
                                            stroke={selectedAsset.isPositive ? "#10b881" : "#f43f5e"}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-x-4 md:inset-x-8 bottom-4 md:bottom-8 top-16 md:top-20 pointer-events-none border-b border-l border-slate-100/50" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Trade Module: Middle on Mobile, Right on Desktop */}
                        <div className="flex flex-col gap-6 order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2">
                            <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-xl lg:sticky lg:top-24">
                                {/* Token Selectors */}
                                <div className="space-y-1 relative">
                                    <div className="bg-[#fcfdff] border border-slate-50 rounded-[24px] p-6 transition-all hover:bg-[#f8faff] hover:border-blue-100 group">
                                        <div className="flex justify-between items-center mb-4 text-[9px] font-black tracking-widest uppercase">
                                            <span className="text-slate-400">{tradeType === "buy" ? "Spend" : "Sell"}</span>
                                            <div className="text-slate-400 font-bold">
                                                Balance: 0.00 <span className="text-blue-600 ml-1 cursor-pointer hover:text-blue-700">MAX</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <input
                                                placeholder="0.00"
                                                className="bg-transparent text-[32px] font-black text-slate-950 outline-none w-full tabular-nums placeholder:text-slate-200"
                                                type="text"
                                            />
                                            {tradeType === "buy" ? (
                                                <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <AssetIcon symbol="AUSD" avatar="A" color="#8B5CF6" size="sm" />
                                                        <span className="text-[14px] font-black text-slate-900 tracking-tight">AUSD</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                        className="flex items-center gap-2.5 px-3 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-all active:scale-[0.98]"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <AssetIcon symbol={selectedAsset.symbol} avatar={selectedAsset.avatar} color={selectedAsset.color} size="sm" />
                                                            <span className="text-[14px] font-black text-slate-900 tracking-tight">{selectedAsset.symbol}</span>
                                                        </div>
                                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                                                    </button>
                                                    {isDropdownOpen && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-40 cursor-default"
                                                                onClick={() => setIsDropdownOpen(false)}
                                                            />
                                                            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 max-h-64 overflow-y-auto no-scrollbar">
                                                                {ASSETS.filter(a => a.symbol !== "AUSD").map((a) => (
                                                                    <button
                                                                        key={a.symbol}
                                                                        onClick={() => handleAssetSelect(a)}
                                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                                                                    >
                                                                        <AssetIcon symbol={a.symbol} avatar={a.avatar} color={a.color} size="sm" />
                                                                        <div className="flex flex-col items-start leading-none">
                                                                            <span className="text-[13px] font-black text-slate-950">{a.symbol}</span>
                                                                            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{a.name}</span>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-center -my-3.5 relative z-10">
                                        <button
                                            onClick={toggleTrade}
                                            className="w-9 h-9 bg-white border border-slate-100 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-[0.8] cursor-pointer group"
                                        >
                                            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                                        </button>
                                    </div>

                                    <div className="bg-[#fcfdff] border border-slate-50 rounded-[24px] p-6 transition-all hover:bg-[#f8faff] hover:border-blue-100 group">
                                        <div className="flex justify-between items-center mb-4 text-[9px] font-black tracking-widest uppercase">
                                            <span className="text-slate-400">{tradeType === "buy" ? "Receive (Estimated)" : "Receive"}</span>
                                            <div className="text-slate-400 font-bold">
                                                Balance: 0.00
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <input
                                                placeholder="0.00"
                                                className="bg-transparent text-[32px] font-black text-slate-950 outline-none w-full tabular-nums placeholder:text-slate-200"
                                                type="text"
                                            />
                                            {tradeType === "buy" ? (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                        className="flex items-center gap-2.5 px-3 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-all active:scale-[0.98]"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <AssetIcon symbol={selectedAsset.symbol} avatar={selectedAsset.avatar} color={selectedAsset.color} size="sm" />
                                                            <span className="text-[14px] font-black text-slate-900 tracking-tight">{selectedAsset.symbol}</span>
                                                        </div>
                                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                                                    </button>
                                                    {isDropdownOpen && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-40 cursor-default"
                                                                onClick={() => setIsDropdownOpen(false)}
                                                            />
                                                            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 max-h-64 overflow-y-auto no-scrollbar">
                                                                {ASSETS.filter(a => a.symbol !== "AUSD").map((a) => (
                                                                    <button
                                                                        key={a.symbol}
                                                                        onClick={() => handleAssetSelect(a)}
                                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                                                                    >
                                                                        <AssetIcon symbol={a.symbol} avatar={a.avatar} color={a.color} size="sm" />
                                                                        <div className="flex flex-col items-start leading-none">
                                                                            <span className="text-[13px] font-black text-slate-950">{a.symbol}</span>
                                                                            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{a.name}</span>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <AssetIcon symbol="AUSD" avatar="A" color="#8B5CF6" size="sm" />
                                                        <span className="text-[14px] font-black text-slate-900 tracking-tight">AUSD</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Info Rows */}
                                <div className="space-y-4 pt-10 pb-8 px-1">
                                    <div className="flex justify-between text-[11px] font-black tracking-widest uppercase mb-1">
                                        <span className="text-slate-400">Network</span>
                                        <div className="flex items-center gap-1.5">
                                            <BnbLogo className="w-3.5 h-3.5" />
                                            <span className="text-slate-900">BNB Chain</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-black tracking-widest uppercase mb-1">
                                        <span className="text-slate-400">Network Fee</span>
                                        <span className="text-slate-900">
                                            {selectedAsset.symbol === "USDT" ? "~$1.00" : "0.3%"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-black tracking-widest uppercase">
                                        <span className="text-slate-400">Live Price</span>
                                        <span className="text-slate-900">1 {selectedAsset.symbol} = {selectedAsset.price} AUSD</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSwap}
                                    disabled={swapStatus !== "idle"}
                                    className={`w-full py-5 rounded-[24px] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${swapStatus === "success"
                                        ? "bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600"
                                        : "bg-slate-950 text-white shadow-slate-950/20 hover:bg-slate-800"
                                        }`}
                                >
                                    {swapStatus === "idle" && "SWAP"}
                                    {swapStatus === "loading" && (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    )}
                                    {swapStatus === "success" && (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            Success
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 3. About Section: Bottom on Mobile, Bottom-Left on Desktop */}
                        <div className="flex flex-col gap-8 order-3 lg:col-span-1 lg:row-start-2">
                            <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm">
                                <h2 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-2">
                                    About <span className="text-slate-400 font-bold">{selectedAsset.name}</span>
                                </h2>
                                <p className="text-slate-500 text-[14px] md:text-[15px] leading-relaxed mb-10 font-medium">
                                    {selectedAsset.description}
                                    <button className="text-blue-600 font-bold hover:underline ml-1">Show More</button>
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-y-10 gap-x-12 pt-8 border-t border-slate-50">
                                    <div className="flex flex-col gap-6">
                                        <DetailRow label="Supported Chains" value="BSC" />
                                        <DetailRow label="Onchain Address" value={
                                            <div className="flex items-center gap-2 text-slate-950 font-black text-[12px] md:text-[13px]">
                                                <span className="font-mono text-[11px] md:text-[12px] truncate max-w-[120px] md:max-w-none">{selectedAsset.address}</span>
                                                <button className="text-slate-300 hover:text-slate-900 shrink-0"><Copy className="w-3.5 h-3.5" /></button>
                                            </div>
                                        } />
                                        <DetailRow label="Category" value={
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">{selectedAsset.category}</span>
                                            </div>
                                        } />
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <DetailRow label="Underlying Name" value={selectedAsset.underlying} />
                                        <DetailRow label="Underlying Ticker" value={selectedAsset.symbol.slice(1)} />
                                        <DetailRow label="Shares Per Token" value={`1 ${selectedAsset.symbol} = 1.00 ${selectedAsset.symbol.slice(1)}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between group">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">{label}</span>
            <div className="text-[13px] font-black text-slate-950 transition-colors">{value}</div>
        </div>
    );
}
