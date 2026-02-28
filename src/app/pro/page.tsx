"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, FileSearch, BarChart2, List, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ASSETS } from "@/lib/assets";
import AssetIcon from "@/components/AssetIcon";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

/* ── Design tokens ── */
const LABEL = "text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500";
const PANEL_BG = "bg-white dark:bg-slate-950";
const BORDER = "border-slate-100 dark:border-slate-800";
const INPUT_BASE =
    "w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 " +
    "focus:border-blue-500/30 dark:focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/10 " +
    "rounded-2xl text-right text-[14px] font-black text-slate-900 dark:text-white outline-none transition-all " +
    "placeholder:text-slate-300 dark:placeholder:text-slate-600";

/* ── Sparkline generator ── */
function generateSparkline(points: number, trend: "up" | "down", amplitude = 28): string {
    const data: number[] = [];
    let y = 50;
    for (let i = 0; i < points; i++) {
        y += (Math.random() - 0.5) * amplitude + (trend === "up" ? -0.4 : 0.4);
        y = Math.max(10, Math.min(90, y));
        data.push(y);
    }
    return data.reduce((p, v, i) => {
        const x = (i / (points - 1)) * 100;
        if (i === 0) return `M${x} ${v}`;
        const px = ((i - 1) / (points - 1)) * 100;
        const cx = (px + x) / 2;
        return `${p} C${cx} ${data[i - 1]}, ${cx} ${v}, ${x} ${v}`;
    }, "");
}

/* ── Chart component ── */
function TradingChart({ asset, timeRange }: { asset: typeof ASSETS[0]; timeRange: string }) {
    const [linePath, setLinePath] = useState("");
    const [areaPath, setAreaPath] = useState("");

    useEffect(() => {
        const raw = generateSparkline(90, asset.isPositive ? "up" : "down", 28);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLinePath(raw);
        setAreaPath(`${raw} V300 H0 Z`);
    }, [asset.symbol, timeRange, asset.isPositive]);

    const clr = asset.isPositive ? "#10b981" : "#f43f5e";
    const p = parseFloat(asset.price);
    const prices = [p * 1.014, p * 1.008, p * 1.003, p, p * 0.997, p * 0.991].map(v => v.toFixed(2));

    return (
        <div className="flex-1 relative w-full min-h-0 overflow-hidden select-none">
            {/* grid */}
            <div className="absolute inset-x-[68px] inset-y-8 flex flex-col justify-between pointer-events-none z-0">
                {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className={`border-b ${BORDER} opacity-60 w-full`} />)}
            </div>
            <div className="absolute inset-x-[68px] inset-y-8 flex justify-between pointer-events-none z-0">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className={`border-l ${BORDER} opacity-60 h-full`} />)}
            </div>

            {/* info */}
            <div className="absolute top-2.5 left-3 z-20 flex items-center gap-2 font-mono">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">{asset.symbol}/CUSD · {timeRange}</span>
                <span className="text-[9px] font-black" style={{ color: clr }}>{asset.isPositive ? "▲" : "▼"} {asset.changePercent}</span>
            </div>

            {/* svg */}
            {linePath && (
                <svg className="absolute inset-0 w-full h-full z-10" preserveAspectRatio="none" viewBox="0 0 1000 300">
                    <defs>
                        <linearGradient id={`cg-${asset.symbol}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={clr} stopOpacity="0.12" />
                            <stop offset="100%" stopColor={clr} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <AnimatePresence mode="wait">
                        <motion.path key={`a-${asset.symbol}-${timeRange}`} d={areaPath}
                            fill={`url(#cg-${asset.symbol})`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
                        <motion.path key={`l-${asset.symbol}-${timeRange}`} d={linePath}
                            fill="none" stroke={clr} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke"
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                            exit={{ opacity: 0 }} transition={{ duration: 1.1, ease: "easeOut" }} />
                    </AnimatePresence>
                </svg>
            )}

            {/* y-axis */}
            <div className="absolute right-0 top-8 bottom-8 w-[64px] flex flex-col justify-between items-end pr-2 z-20 pointer-events-none">
                {prices.map((v, i) => i === 3
                    ? <span key={i} className="text-[8px] font-black text-white px-1 py-0.5 rounded" style={{ backgroundColor: clr }}>{v}</span>
                    : <span key={i} className="text-[8px] font-medium text-slate-400 dark:text-slate-500">{v}</span>
                )}
            </div>

            {/* x-axis */}
            <div className="absolute bottom-0 inset-x-[68px] flex justify-between pb-1 z-20 pointer-events-none">
                {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"].map(t =>
                    <span key={t} className="text-[8px] font-medium text-slate-400 dark:text-slate-500">{t}</span>
                )}
            </div>
        </div>
    );
}

/* ── Trade Form ── */
function TradeForm({ asset, isConnected, address, open, tradeSide, setTradeSide }:
    {
        asset: typeof ASSETS[0]; isConnected: boolean; address: string | undefined; open: () => void;
        tradeSide: "BUY" | "SELL"; setTradeSide: (s: "BUY" | "SELL") => void;
    }) {
    const fmtAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;
    const price = parseFloat(asset.price);

    // BUY: user enters CUSD → gets asset
    // SELL: user enters asset → gets CUSD
    const [spendAmount, setSpendAmount] = useState("");

    const receiveAmount = spendAmount
        ? tradeSide === "BUY"
            ? (parseFloat(spendAmount) / price).toFixed(6)   // CUSD → asset
            : (parseFloat(spendAmount) * price).toFixed(2)   // asset → CUSD
        : "";

    const spendToken = tradeSide === "BUY" ? "CUSD" : asset.symbol;
    const receiveToken = tradeSide === "BUY" ? asset.symbol : "CUSD";
    const spendLabel = tradeSide === "BUY" ? "You Spend" : "You Sell";
    const receiveLabel = tradeSide === "BUY" ? "You Receive" : "You Receive";
    const available = tradeSide === "BUY" ? "1,000.00 CUSD" : `0.00 ${asset.symbol}`;

    // Reset when asset or side changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setSpendAmount(""); }, [asset.symbol, tradeSide]);

    const handlePct = (pct: number) => {
        if (tradeSide === "BUY") {
            setSpendAmount((1000 * pct).toFixed(2));
        }
    };

    return (
        <div className="flex flex-col gap-5 p-5 overflow-y-auto no-scrollbar flex-1">
            {/* toggle */}
            <div className={`flex bg-slate-50 dark:bg-slate-900 border ${BORDER} rounded-2xl p-1.5 shrink-0`}>
                {(["BUY", "SELL"] as const).map(side => (
                    <button key={side} onClick={() => setTradeSide(side)}
                        className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all uppercase tracking-widest ${tradeSide === side
                            ? `bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md border ${BORDER}`
                            : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}>
                        {side === "BUY" ? "Buy" : "Sell"}
                    </button>
                ))}
            </div>

            {isConnected ? (
                <>
                    {/* Available */}
                    <div className="flex items-center justify-between shrink-0">
                        <span className={LABEL}>Available</span>
                        <span className="text-[12px] font-black text-slate-900 dark:text-white">{available}</span>
                    </div>

                    <div className="flex flex-col gap-3 shrink-0">
                        {/* Spend input */}
                        <div className="relative">
                            <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${LABEL} pointer-events-none`}>{spendLabel}</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={spendAmount}
                                onChange={e => setSpendAmount(e.target.value)}
                                className={`${INPUT_BASE} py-4 pl-24 pr-[72px]`}
                            />
                            <span className={`absolute right-4 top-1/2 -translate-y-1/2 ${LABEL} pointer-events-none`}>{spendToken}</span>
                        </div>

                        {/* % shortcuts */}
                        <div className="flex items-center gap-2">
                            {[["25%", 0.25], ["50%", 0.5], ["75%", 0.75], ["100%", 1]].map(([label, pct]) => (
                                <button key={label as string} onClick={() => handlePct(pct as number)}
                                    className={`flex-1 py-2 text-[10px] font-black rounded-xl bg-slate-50 dark:bg-slate-900 border ${BORDER} text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400/30 transition-all uppercase tracking-widest`}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Receive (read-only, auto-calc) */}
                        <div className="relative">
                            <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${LABEL} pointer-events-none`}>{receiveLabel}</span>
                            <input
                                type="number"
                                readOnly
                                placeholder="0.00"
                                value={receiveAmount}
                                className={`${INPUT_BASE} py-4 pl-24 pr-[72px] opacity-70 cursor-default`}
                            />
                            <span className={`absolute right-4 top-1/2 -translate-y-1/2 ${LABEL} pointer-events-none`}>{receiveToken}</span>
                        </div>

                        {/* Fee */}
                        <div className={`flex items-center justify-between pt-2 border-t ${BORDER}`}>
                            <span className={LABEL}>Network Fee</span>
                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400">0.3%</span>
                        </div>

                        {/* Submit */}
                        <button className={`w-full py-4 rounded-2xl text-[12px] font-black text-white uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl ${tradeSide === "BUY"
                            ? "bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-slate-900/10 dark:shadow-blue-900/20"
                            : "bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-slate-700/10"
                            }`}>
                            {tradeSide === "BUY" ? `Buy ${asset.symbol}` : `Sell ${asset.symbol}`}
                        </button>
                        <p className="text-center text-[10px] font-semibold text-slate-400 dark:text-slate-500">{fmtAddr(address!)}</p>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-5 py-4">
                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border ${BORDER} flex items-center justify-center`}>
                        <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5m0 0h-6a2 2 0 0 0 0 4h6" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-[14px] font-black text-slate-900 dark:text-white mb-1.5">Connect Your Wallet</p>
                        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 max-w-[200px] leading-relaxed">
                            Connect your wallet to start trading on Comdex Pro
                        </p>
                    </div>
                    <button onClick={() => open()}
                        className="w-full py-4 rounded-2xl text-[12px] font-black text-white uppercase tracking-widest bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-xl shadow-slate-900/10 dark:shadow-blue-900/20 transition-all active:scale-[0.98]">
                        Connect Wallet
                    </button>
                </div>
            )}
        </div>
    );
}


/* ── Page ── */
const TRADE_PAIRS = ASSETS.filter(a => a.symbol !== "CUSD");

type MobileTab = "chart" | "pairs" | "trade";

function ProTradePageInner() {
    const searchParams = useSearchParams();
    const assetParam = searchParams.get("asset");
    const initialAsset = (assetParam && TRADE_PAIRS.find(a => a.symbol === assetParam.toUpperCase())) || TRADE_PAIRS[0];

    const [selectedAsset, setSelectedAsset] = useState(initialAsset);
    const [timeRange, setTimeRange] = useState("4h");
    const [tradeSide, setTradeSide] = useState<"BUY" | "SELL">("BUY");
    const [searchQuery, setSearchQuery] = useState("");
    const [chartTab, setChartTab] = useState("Chart");
    const [mobileTab, setMobileTab] = useState<MobileTab>("pairs");

    // If asset param changes (navigation), update selected asset
    const prevParam = useRef(assetParam);
    useEffect(() => {
        if (assetParam && assetParam !== prevParam.current) {
            prevParam.current = assetParam;
            const found = TRADE_PAIRS.find(a => a.symbol === assetParam.toUpperCase());
            if (found) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSelectedAsset(found);
                setMobileTab("trade");
            }
        }
    }, [assetParam]);

    const { open } = useAppKit();
    const { isConnected, address } = useAppKitAccount();

    const filtered = TRADE_PAIRS.filter(a =>
        a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectAsset = (a: typeof ASSETS[0]) => {
        setSelectedAsset(a);
        setMobileTab("trade");
    };

    // Market hours: Mon-Fri 09:00–21:30 UTC
    const now = new Date();
    const utcDay = now.getUTCDay(); // 0=Sun, 6=Sat
    const utcHour = now.getUTCHours();
    const utcMin = now.getUTCMinutes();
    const utcMins = utcHour * 60 + utcMin;
    const isMarketOpen = utcDay >= 1 && utcDay <= 5 && utcMins >= 540 && utcMins < 1290;

    return (
        <div className={`flex-1 flex flex-col overflow-hidden bg-[#f8fafc] dark:bg-[#020617] w-full h-[calc(100vh-72px)] transition-colors duration-300`}>

            {/* ── TICKER BAR — Mobile ── */}
            <div className={`md:hidden flex flex-col ${PANEL_BG} border-b ${BORDER} shrink-0`}>
                {/* Row 1: Identity + Price */}
                <div className="flex items-center justify-between p-4">
                    {/* Left: Identity */}
                    <div className="flex items-center gap-3.5 min-w-0">
                        <AssetIcon symbol={selectedAsset.symbol} color={selectedAsset.color} size="md" />
                        <div className="min-w-0 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[16px] font-black text-slate-900 dark:text-white tracking-tight leading-none">
                                    {selectedAsset.symbol}
                                    <span className="text-slate-400 dark:text-slate-500 font-bold text-[13px]">/CUSD</span>
                                </span>
                                <span className={`inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-md ${isMarketOpen
                                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                                    }`}>
                                    <span className={`w-1 h-1 rounded-full shrink-0 ${isMarketOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                    {isMarketOpen ? "OPEN" : "CLOSED"}
                                </span>
                            </div>
                            <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 truncate">{selectedAsset.name}</span>
                        </div>
                    </div>

                    {/* Right: Price */}
                    <div className="flex flex-col items-end shrink-0 pl-4">
                        <span className="text-[22px] font-black text-slate-900 dark:text-white tracking-tight leading-none">
                            ${selectedAsset.price}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedAsset.isPositive ? "bg-emerald-500" : "bg-rose-500"}`} />
                            <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 leading-none">
                                {selectedAsset.isPositive ? "+" : ""}{selectedAsset.changePercent}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Expanded Stats */}
                {(() => {
                    const p = parseFloat(selectedAsset.price);
                    const bid = (p * 0.9995).toFixed(p < 1 ? 4 : 2);
                    const ask = (p * 1.0005).toFixed(p < 1 ? 4 : 2);
                    const now = new Date();
                    const updated = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
                    return (
                        <div className={`flex items-center gap-5 px-4 py-3 border-t ${BORDER} overflow-x-auto no-scrollbar`}>
                            <div className="flex flex-col gap-0.5 shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Buy</span>
                                <span className="text-[13px] font-black text-slate-900 dark:text-white">${bid}</span>
                            </div>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 shrink-0" />
                            <div className="flex flex-col gap-0.5 shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sell</span>
                                <span className="text-[13px] font-black text-slate-900 dark:text-white">${ask}</span>
                            </div>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 shrink-0" />
                            <div className="flex flex-col gap-0.5 shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Trend</span>
                                <span className={`text-[13px] font-black ${selectedAsset.isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>{selectedAsset.isPositive ? "+" : ""}{selectedAsset.changePercent}</span>
                            </div>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 shrink-0" />
                            <div className="flex flex-col gap-0.5 shrink-0 pr-2">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Time</span>
                                <span className="text-[13px] font-black text-slate-900 dark:text-white">{updated}</span>
                            </div>
                        </div>
                    );
                })()}

            </div>



            {/* ── TICKER BAR — Tablet + Desktop ── */}
            <div className={`hidden md:flex items-stretch px-0 ${PANEL_BG} border-b ${BORDER} shrink-0 overflow-x-auto no-scrollbar`}>

                {/* Asset identity block */}
                <div className={`flex items-center gap-3 px-6 py-3 shrink-0 border-r ${BORDER}`}>
                    <AssetIcon symbol={selectedAsset.symbol} color={selectedAsset.color} size="sm" />
                    <div>
                        <div className="flex items-center gap-1.5 leading-none">
                            <span className="text-[15px] font-black text-slate-900 dark:text-white tracking-tight">
                                {selectedAsset.symbol}
                                <span className="text-slate-400 dark:text-slate-500 font-semibold text-[13px]">/CUSD</span>
                            </span>
                        </div>
                        <p className={`${LABEL} mt-0.5`}>{selectedAsset.name}</p>
                    </div>
                </div>

                {/* Price block */}
                <div className={`flex flex-col justify-center px-6 py-3 shrink-0 border-r ${BORDER}`}>
                    <span className="text-[20px] font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        ${selectedAsset.price}
                    </span>
                    <span className={`${LABEL} mt-1`}>
                        {selectedAsset.isPositive ? "+" : ""}{selectedAsset.changePercent} · CUSD
                    </span>
                </div>

                {/* Buy / Sell / Trend / Updated blocks */}
                {(() => {
                    const p = parseFloat(selectedAsset.price);
                    const bid = (p * 0.9995).toFixed(p < 1 ? 4 : 2);
                    const ask = (p * 1.0005).toFixed(p < 1 ? 4 : 2);
                    const now = new Date();
                    const updated = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} / ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
                    return (
                        <>
                            <div className={`flex flex-col justify-center px-6 py-3 shrink-0 border-r ${BORDER}`}>
                                <span className={`${LABEL} mb-0.5`}>Buy</span>
                                <span className="text-[13px] font-black text-slate-900 dark:text-white">${bid}</span>
                            </div>
                            <div className={`flex flex-col justify-center px-6 py-3 shrink-0 border-r ${BORDER}`}>
                                <span className={`${LABEL} mb-0.5`}>Sell</span>
                                <span className="text-[13px] font-black text-slate-900 dark:text-white">${ask}</span>
                            </div>
                            <div className={`flex flex-col justify-center px-6 py-3 shrink-0 border-r ${BORDER}`}>
                                <span className={`${LABEL} mb-0.5`}>Trend</span>
                                <span className={`text-[13px] font-black ${selectedAsset.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                    {selectedAsset.isPositive ? "+" : ""}{selectedAsset.changePercent}
                                </span>
                            </div>
                            <div className={`flex flex-col justify-center px-6 py-3 shrink-0 border-r ${BORDER}`}>
                                <span className={`${LABEL} mb-0.5`}>Market</span>
                                <span className={`inline-flex items-center gap-1.5 text-[12px] font-black ${isMarketOpen ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isMarketOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                    {isMarketOpen ? "Open" : "Closed"}
                                </span>
                            </div>
                            <div className={`flex flex-col justify-center px-6 py-3 shrink-0`}>
                                <span className={`${LABEL} mb-0.5`}>Last Updated</span>
                                <span className="text-[13px] font-black text-slate-900 dark:text-white">{updated}</span>
                            </div>
                        </>
                    );
                })()}
            </div>



            {/* ── DESKTOP LAYOUT (lg+) ── */}
            <div className="hidden lg:flex flex-1 flex-row overflow-hidden min-h-0">

                {/* Left: Pairs */}
                <div className={`flex flex-col w-[340px] xl:w-[380px] border-r ${BORDER} ${PANEL_BG} shrink-0`}>
                    <div className={`p-3 border-b ${BORDER}`}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search assets…"
                                className={`w-full bg-slate-50 dark:bg-slate-900 border ${BORDER} rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all`}
                            />
                        </div>
                    </div>
                    <div className={`flex items-center px-4 py-2 border-b ${BORDER} shrink-0`}>
                        <span className={`${LABEL} flex-1`}>Pair</span>
                        <span className={`${LABEL} w-[72px] text-right`}>Bid</span>
                        <span className={`${LABEL} w-[72px] text-right`}>Ask</span>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {filtered.map(asset => {
                            const active = selectedAsset.symbol === asset.symbol;
                            const p = parseFloat(asset.price);
                            const bid = (p * 0.9995).toFixed(p < 1 ? 4 : 2);
                            const ask = (p * 1.0005).toFixed(p < 1 ? 4 : 2);
                            return (
                                <motion.div key={asset.symbol} onClick={() => selectAsset(asset)}
                                    whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    className={`flex items-center px-4 py-3.5 cursor-pointer transition-colors border-l-2 ${active ? `bg-blue-50/60 dark:bg-blue-950/30 border-blue-600 dark:border-blue-500` : `border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/60`
                                        }`}>
                                    <div className="flex-1 flex items-center gap-3 min-w-0">
                                        <AssetIcon symbol={asset.symbol} color={asset.color} size="sm" />
                                        <div className="min-w-0">
                                            <div className="text-[13px] font-black text-slate-900 dark:text-white leading-none">
                                                {asset.symbol}<span className="text-slate-400 dark:text-slate-500 font-medium text-[11px]">/CUSD</span>
                                            </div>
                                            <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 truncate">{asset.name}</div>
                                        </div>
                                    </div>
                                    <span className="w-[72px] text-right text-[12px] font-black text-slate-700 dark:text-slate-300">{bid}</span>
                                    <span className="w-[72px] text-right text-[12px] font-black text-slate-500 dark:text-slate-400">{ask}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Center: Chart + History */}
                <div className={`flex-1 flex flex-col min-w-0 border-r ${BORDER}`}>
                    <div className={`flex-1 flex flex-col ${PANEL_BG} min-h-0`}>
                        <div className={`flex items-center px-4 border-b ${BORDER} shrink-0 overflow-x-auto no-scrollbar`}>
                            {["Chart", "Info"].map(tab => (
                                <button key={tab} onClick={() => setChartTab(tab)}
                                    className={`relative px-3 py-3 text-[11px] font-black transition-colors shrink-0 ${chartTab === tab ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        }`}>
                                    {tab}
                                    {chartTab === tab && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t" />}
                                </button>
                            ))}
                            <div className={`w-px h-4 bg-slate-200 dark:bg-slate-700 mx-2 shrink-0`} />
                            {["1min", "5min", "15min", "1h", "4h", "1day", "1week"].map(t => (
                                <button key={t} onClick={() => setTimeRange(t)}
                                    className={`px-2 py-3 text-[10px] font-black transition-colors shrink-0 ${timeRange === t ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        }`}>{t}</button>
                            ))}
                            <span className="ml-auto pr-3 text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest shrink-0">TradingView</span>
                        </div>
                        <TradingChart asset={selectedAsset} timeRange={timeRange} />
                    </div>
                    {/* history */}
                    <div className={`h-[190px] shrink-0 border-t ${BORDER} ${PANEL_BG} flex flex-col`}>
                        <div className={`flex items-center px-5 border-b ${BORDER} shrink-0`}>
                            <span className="relative py-3 text-[13px] font-black text-slate-900 dark:text-white">
                                Trade History
                                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t" />
                            </span>
                        </div>
                        <div className={`flex items-center px-5 py-2.5 border-b ${BORDER} shrink-0`}>
                            <span className={`${LABEL} flex-1`}>Date</span>
                            <span className={`${LABEL} w-28`}>Pair</span>
                            <span className={`${LABEL} w-28 text-right`}>Price</span>
                            <span className={`${LABEL} w-28 text-right`}>Amount</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-40 select-none">
                            <FileSearch className="w-7 h-7 text-slate-400 dark:text-slate-500 stroke-1" />
                            <span className={LABEL}>No trade history</span>
                        </div>
                    </div>
                </div>

                {/* Right: Trade */}
                <div className={`w-[360px] xl:w-[400px] ${PANEL_BG} flex flex-col shrink-0 overflow-hidden`}>
                    <TradeForm asset={selectedAsset} isConnected={isConnected} address={address} open={open}
                        tradeSide={tradeSide} setTradeSide={setTradeSide} />
                </div>
            </div>

            {/* ── TABLET LAYOUT (md – lg) ── */}
            <div className="hidden md:flex lg:hidden flex-1 flex-row overflow-hidden min-h-0">
                {/* Center: Chart + History */}
                <div className={`flex-1 flex flex-col min-w-0 border-r ${BORDER}`}>
                    <div className={`flex-1 flex flex-col ${PANEL_BG} min-h-0`}>
                        {/* chart header */}
                        <div className={`flex items-center px-3 border-b ${BORDER} shrink-0 overflow-x-auto no-scrollbar`}>
                            {["Chart", "Info"].map(tab => (
                                <button key={tab} onClick={() => setChartTab(tab)}
                                    className={`relative px-3 py-2.5 text-[10px] font-black transition-colors shrink-0 ${chartTab === tab ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"
                                        }`}>
                                    {tab}
                                    {chartTab === tab && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t" />}
                                </button>
                            ))}
                            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1.5 shrink-0" />
                            {["15min", "1h", "4h", "1day", "1week"].map(t => (
                                <button key={t} onClick={() => setTimeRange(t)}
                                    className={`px-2 py-2.5 text-[10px] font-black transition-colors shrink-0 ${timeRange === t ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}>{t}</button>
                            ))}
                        </div>
                        <TradingChart asset={selectedAsset} timeRange={timeRange} />
                    </div>
                    {/* history */}
                    <div className={`h-[160px] shrink-0 border-t ${BORDER} ${PANEL_BG} flex flex-col`}>
                        <div className={`flex items-center px-4 border-b ${BORDER} shrink-0`}>
                            <span className="relative py-2.5 text-[12px] font-black text-slate-900 dark:text-white">
                                Trade History
                                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t" />
                            </span>
                        </div>
                        <div className={`flex items-center px-4 py-2 border-b ${BORDER} shrink-0`}>
                            <span className={`${LABEL} flex-1`}>Date</span>
                            <span className={`${LABEL} w-24 text-right`}>Price</span>
                            <span className={`${LABEL} w-24 text-right`}>Amount</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center gap-1.5 opacity-40 select-none">
                            <FileSearch className="w-6 h-6 text-slate-400 dark:text-slate-500 stroke-1" />
                            <span className={LABEL}>No trade history</span>
                        </div>
                    </div>
                </div>

                {/* Right: Trade */}
                <div className={`w-[320px] ${PANEL_BG} flex flex-col shrink-0 overflow-hidden`}>
                    <TradeForm asset={selectedAsset} isConnected={isConnected} address={address} open={open}
                        tradeSide={tradeSide} setTradeSide={setTradeSide} />
                </div>
            </div>

            {/* ── MOBILE LAYOUT (<md) ── */}
            <div className="flex md:hidden flex-1 flex-col overflow-hidden min-h-0">
                {/* tab content */}
                <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {/* Chart tab */}
                        {mobileTab === "chart" && (
                            <motion.div key="chart" className={`absolute inset-0 flex flex-col ${PANEL_BG}`}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                                {/* time range */}
                                <div className={`flex items-center px-3 border-b ${BORDER} overflow-x-auto no-scrollbar shrink-0`}>
                                    {["15min", "1h", "4h", "1day", "1week"].map(t => (
                                        <button key={t} onClick={() => setTimeRange(t)}
                                            className={`px-3 py-2.5 text-[10px] font-black shrink-0 transition-colors ${timeRange === t ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}>{t}</button>
                                    ))}
                                </div>
                                <TradingChart asset={selectedAsset} timeRange={timeRange} />
                                {/* mini history */}
                                <div className={`h-[140px] shrink-0 border-t ${BORDER} flex flex-col`}>
                                    <div className={`flex items-center px-4 border-b ${BORDER} shrink-0`}>
                                        <span className="relative py-2.5 text-[11px] font-black text-slate-900 dark:text-white">
                                            Trade History
                                            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t" />
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center gap-1.5 opacity-40 select-none">
                                        <FileSearch className="w-5 h-5 text-slate-400 dark:text-slate-500 stroke-1" />
                                        <span className={LABEL}>No trade history</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Pairs tab */}
                        {mobileTab === "pairs" && (
                            <motion.div key="pairs" className={`absolute inset-0 flex flex-col ${PANEL_BG}`}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                                <div className={`p-3 border-b ${BORDER} shrink-0`}>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                            placeholder="Search assets…"
                                            className={`w-full bg-slate-50 dark:bg-slate-900 border ${BORDER} rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all`}
                                        />
                                    </div>
                                </div>
                                <div className={`flex items-center px-4 py-2 border-b ${BORDER} shrink-0`}>
                                    <span className={`${LABEL} flex-1`}>Pair</span>
                                    <span className={`${LABEL} w-[72px] text-right`}>Bid</span>
                                    <span className={`${LABEL} w-[72px] text-right`}>Ask</span>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar">
                                    {filtered.map(asset => {
                                        const active = selectedAsset.symbol === asset.symbol;
                                        const p = parseFloat(asset.price);
                                        const bid = (p * 0.9995).toFixed(p < 1 ? 4 : 2);
                                        const ask = (p * 1.0005).toFixed(p < 1 ? 4 : 2);
                                        return (
                                            <div key={asset.symbol} onClick={() => selectAsset(asset)}
                                                className={`flex items-center px-4 py-3.5 cursor-pointer transition-colors border-l-2 ${active ? `bg-blue-50/60 dark:bg-blue-950/30 border-blue-600 dark:border-blue-500` : `border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/60`
                                                    }`}>
                                                <div className="flex-1 flex items-center gap-3 min-w-0">
                                                    <AssetIcon symbol={asset.symbol} color={asset.color} size="sm" />
                                                    <div className="min-w-0">
                                                        <div className="text-[13px] font-black text-slate-900 dark:text-white leading-none">
                                                            {asset.symbol}<span className="text-slate-400 dark:text-slate-500 font-medium text-[11px]">/CUSD</span>
                                                        </div>
                                                        <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 truncate">{asset.name}</div>
                                                    </div>
                                                </div>
                                                <span className="w-[72px] text-right text-[12px] font-black text-slate-700 dark:text-slate-300">{bid}</span>
                                                <span className="w-[72px] text-right text-[12px] font-black text-slate-500 dark:text-slate-400">{ask}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Trade tab */}
                        {mobileTab === "trade" && (
                            <motion.div key="trade" className={`absolute inset-0 flex flex-col ${PANEL_BG} overflow-hidden`}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                                <TradeForm asset={selectedAsset} isConnected={isConnected} address={address} open={open}
                                    tradeSide={tradeSide} setTradeSide={setTradeSide} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Bottom Tab Bar */}
                <div className={`shrink-0 ${PANEL_BG} border-t ${BORDER} flex items-center safe-area-bottom`}>
                    {([
                        { id: "pairs" as MobileTab, label: "Pairs", icon: List },
                        { id: "trade" as MobileTab, label: "Trade", icon: ArrowUpDown },
                        { id: "chart" as MobileTab, label: "Chart", icon: BarChart2 },
                    ]).map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setMobileTab(id)}
                            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${mobileTab === id ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                                }`}>
                            <Icon className="w-5 h-5" strokeWidth={mobileTab === id ? 2.5 : 1.5} />
                            <span className={`text-[9px] font-black uppercase tracking-widest`}>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

        </div >
    );
}

export default function ProTradePage() {
    return (
        <Suspense fallback={null}>
            <ProTradePageInner />
        </Suspense>
    );
}
