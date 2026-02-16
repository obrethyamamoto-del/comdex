"use client";

import { useState } from "react";
import { Lock, DollarSign, Users, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AssetIcon from "@/components/AssetIcon";
import { TABLE_HEADER_CLASS, PRIMARY_BUTTON_CLASS, SUCCESS_BUTTON_CLASS } from "@/lib/constants";

const POOLS = [
    { name: "Altai Gold", ticker: "AXAU", apy: "5.20%", tvl: "12,042 AXAU", rewards: "$1.2M", stake: "12.50 AXAU", yourReward: "158.42 AUSD", color: "#FFD700", avatar: "G" },
    { name: "Altai Silver", ticker: "AXAG", apy: "12.80%", tvl: "570,240 AXAG", rewards: "$850K", stake: "450.00 AXAG", yourReward: "42.15 AUSD", color: "#C0C0C0", avatar: "S" },
    { name: "Altai Platinum", ticker: "AXPT", apy: "7.45%", tvl: "6,065 AXPT", rewards: "$420K", stake: "0.00 AXPT", yourReward: "0.00 AUSD", color: "#4A7EBB", avatar: "P" },
    { name: "Altai Palladium", ticker: "AXPD", apy: "9.15%", tvl: "3,385 AXPD", rewards: "$280K", stake: "5.00 AXPD", yourReward: "210.10 AUSD", color: "#5D9B76", avatar: "D" }
];

function PoolCard({ pool }: { pool: typeof POOLS[0] }) {
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
    const [redeemStatus, setRedeemStatus] = useState<"idle" | "loading" | "success">("idle");
    const [claimStatus, setClaimStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleParticipate = () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
        setStatus("loading");
        setTimeout(() => {
            setStatus("success");
            setTimeout(() => {
                setStatus("idle");
                setAmount("");
            }, 3000);
        }, 2000);
    };

    const handleRedeem = () => {
        setRedeemStatus("loading");
        setTimeout(() => {
            setRedeemStatus("success");
            setTimeout(() => setRedeemStatus("idle"), 3000);
        }, 2000);
    };

    const handleClaim = () => {
        setClaimStatus("loading");
        setTimeout(() => {
            setClaimStatus("success");
            setTimeout(() => setClaimStatus("idle"), 3000);
        }, 2000);
    };

    return (
        <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm flex flex-col group hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:border-slate-200 transition-all duration-500 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <AssetIcon symbol={pool.ticker} avatar={pool.avatar} color={pool.color} size="md" className="shadow-lg transition-transform group-hover:scale-110" />
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Ticker</p>
                    <p className="text-sm font-black text-slate-950">{pool.ticker}</p>
                </div>
            </div>

            <div className="relative z-10 mb-8">
                <h3 className="text-lg font-black text-slate-950 mb-1">{pool.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-blue-600 transition-colors group-hover:text-blue-700">{pool.apy}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">APY</span>
                </div>
            </div>

            <div className="space-y-4 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100/50 relative z-10 transition-colors group-hover:bg-slate-50">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">TVL</span>
                    <span className="text-slate-950">{pool.tvl}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Total Reward</span>
                    <span className="text-slate-950">{pool.rewards}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Your Position</span>
                    <span className="text-slate-950">{pool.stake}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Your Reward</span>
                    <span className="text-blue-600 font-bold">{pool.yourReward}</span>
                </div>
            </div>

            {/* Amount Input */}
            <div className="relative z-10 mb-4 group/input">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`0.00 ${pool.ticker}`}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 pr-16 text-sm font-black text-slate-950 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-200 focus:bg-white transition-all placeholder:text-slate-200"
                />
                <button
                    onClick={() => setAmount(pool.stake.split(' ')[0].replace(/,/g, ''))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all shadow-sm"
                >
                    MAX
                </button>
            </div>

            <div className="relative z-10 flex flex-col gap-3">
                <button
                    onClick={handleClaim}
                    disabled={claimStatus !== "idle" || status !== "idle" || redeemStatus !== "idle"}
                    className={`w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 border shadow-sm ${claimStatus === "success"
                        ? `${SUCCESS_BUTTON_CLASS} border-emerald-100`
                        : "bg-white border-blue-100 text-blue-600 hover:bg-blue-50"
                        }`}
                >
                    {claimStatus === "idle" && "Claim Rewards"}
                    {claimStatus === "loading" && (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Claiming...
                        </>
                    )}
                    {claimStatus === "success" && (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Rewards Claimed
                        </>
                    )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleParticipate}
                        disabled={status !== "idle" || redeemStatus !== "idle" || claimStatus !== "idle"}
                        className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2 ${status === "success"
                            ? SUCCESS_BUTTON_CLASS
                            : PRIMARY_BUTTON_CLASS
                            }`}
                    >
                        {status === "idle" && "Participate"}
                        {status === "loading" && (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing
                            </>
                        )}
                        {status === "success" && (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Success
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleRedeem}
                        disabled={redeemStatus !== "idle" || status !== "idle" || claimStatus !== "idle"}
                        className={`h-12 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] whitespace-nowrap flex items-center justify-center gap-2 ${redeemStatus === "success"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-950"
                            }`}
                    >
                        {redeemStatus === "idle" && "Redeem"}
                        {redeemStatus === "loading" && (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Redeeming
                            </>
                        )}
                        {redeemStatus === "success" && (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Redeemed
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Hover Accent – identical to Discover cards */}
            <div className="absolute bottom-0 left-0 h-[3px] w-full bg-slate-950 transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100" />
        </div>
    );
}

const STAKES = [
    { symbol: "AXAU", fullName: "Altai Gold", id: "#1204", amount: "12.500 AXAU", value: "≈ $25,430.00", duration: "45 Days", progress: 65, apy: "5.20%", rewarded: "158.42", color: "#FFD700" },
    { symbol: "AXAG", fullName: "Altai Silver", id: "#8921", amount: "450.000 AXAG", value: "≈ $10,102.50", duration: "12 Days", progress: 20, apy: "12.80%", rewarded: "42.15", color: "#C0C0C0" },
    { symbol: "AXPD", fullName: "Altai Palladium", id: "#5412", amount: "5.000 AXPD", value: "≈ $4,729.00", duration: "92 Days", progress: 85, apy: "9.15%", rewarded: "210.10", color: "#5D9B76" }
];

function StakeRow({ stake }: { stake: typeof STAKES[0] }) {
    const [claimStatus, setClaimStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleClaim = () => {
        setClaimStatus("loading");
        setTimeout(() => {
            setClaimStatus("success");
            setTimeout(() => setClaimStatus("idle"), 3000);
        }, 2000);
    };

    return (
        <tr key={stake.id} className="group hover:bg-slate-50/50 transition-all">
            <td className="px-6 py-6">
                <div className="flex items-center gap-4">
                    <AssetIcon symbol={stake.symbol} avatar="" color={stake.color} size="sm" className="transition-transform group-hover:scale-110" />
                    <div>
                        <p className="text-sm font-black text-slate-950 leading-none">{stake.symbol}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{stake.fullName}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-6">
                <p className="text-sm font-black text-slate-950 leading-none tabular-nums whitespace-nowrap">{stake.amount}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest tabular-nums whitespace-nowrap">{stake.value}</p>
            </td>
            <td className="px-6 py-6">
                <div className="w-32">
                    <p className="text-sm font-black text-slate-950 mb-2 leading-none tabular-nums">{stake.duration}</p>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stake.progress}%` }} />
                    </div>
                </div>
            </td>
            <td className="px-6 py-6">
                <p className="text-sm font-black text-blue-600 tabular-nums">{stake.apy}</p>
            </td>
            <td className="px-6 py-6">
                <p className="text-sm font-black text-slate-950 tabular-nums">{stake.rewarded} AUSD</p>
            </td>
            <td className="px-6 py-6 text-right">
                <button
                    onClick={handleClaim}
                    disabled={claimStatus !== "idle"}
                    className={`min-w-[100px] h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 inline-flex items-center justify-center gap-2 ${claimStatus === "success"
                        ? SUCCESS_BUTTON_CLASS
                        : PRIMARY_BUTTON_CLASS
                        }`}
                >
                    {claimStatus === "idle" && "Claim"}
                    {claimStatus === "loading" && (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            ...
                        </>
                    )}
                    {claimStatus === "success" && (
                        <>
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                        </>
                    )}
                </button>
            </td>
        </tr>
    );
}

export default function EarnPage() {
    const [selectedFilter, setSelectedFilter] = useState("All Vaults");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredPools = selectedFilter === "All Vaults"
        ? POOLS
        : POOLS.filter(p => p.name === selectedFilter);

    return (
        <div className="flex-1 overflow-y-auto bg-[#fafbfc] px-4 md:px-10 py-8 md:py-12 no-scrollbar">
            <div className="max-w-[1500px] mx-auto space-y-12 md:space-y-16 pb-20">

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 px-1">
                    <div className="flex flex-col gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-fit flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em]"
                        >
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                            Revenue Share Mechanism
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-none">Put Your Assets to Work</h1>
                        <p className="text-slate-500 font-medium max-w-lg text-sm leading-relaxed">
                            Participate with your assets and earn high-yield rewards in AUSD stablecoins.
                            Institutional-grade security, fully audited and always liquid.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { icon: Lock, title: "Total Value Locked", val: "$142,850,920.00", color: "text-blue-600", bg: "bg-blue-50" },
                        { icon: DollarSign, title: "Total Rewards", val: "$1,842,450.65", color: "text-emerald-600", bg: "bg-emerald-50" },
                        { icon: Users, title: "Total Users", val: "12,842", color: "text-slate-950", bg: "bg-slate-50" }
                    ].map((stat, i) => (
                        <div key={i} className={`bg-white border border-slate-100 p-6 md:p-8 rounded-[32px] shadow-sm flex items-center gap-6 group hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-default ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                            <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110 flex-shrink-0`}>
                                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                                <p className="text-xl md:text-2xl font-black text-slate-950 tracking-tight tabular-nums">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Staking Pools Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-1 relative z-30">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">Available Vaults</h2>

                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-black text-slate-950 shadow-sm transition-all uppercase tracking-widest hover:border-slate-200"
                            >
                                {selectedFilter}
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isFilterOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-20"
                                        >
                                            {["All Vaults", ...POOLS.map(p => p.name)].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setSelectedFilter(option);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full text-left px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${selectedFilter === option
                                                        ? "text-slate-950 bg-slate-50"
                                                        : "text-slate-400 hover:text-slate-950 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
                        {filteredPools.map((pool) => (
                            <PoolCard key={pool.ticker} pool={pool} />
                        ))}
                    </div>
                </div>

                {/* Active Participations Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">Active Participations</h2>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden mb-32">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left min-w-[1000px]">
                                <thead className="bg-[#fafbfc] border-b border-slate-100">
                                    <tr>
                                        <th className={TABLE_HEADER_CLASS}>Asset Pool</th>
                                        <th className={TABLE_HEADER_CLASS}>Participated Amount</th>
                                        <th className={TABLE_HEADER_CLASS}>Lifecycle</th>
                                        <th className={TABLE_HEADER_CLASS}>APY %</th>
                                        <th className={TABLE_HEADER_CLASS}>Yield Earned</th>
                                        <th className={`${TABLE_HEADER_CLASS} text-right`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {STAKES.map((stake) => (
                                        <StakeRow key={stake.id} stake={stake} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
