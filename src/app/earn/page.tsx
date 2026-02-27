"use client";

import { useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Lock, DollarSign, Users, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import AssetIcon from "@/components/AssetIcon";
import { TABLE_HEADER_CLASS, PRIMARY_BUTTON_CLASS, SUCCESS_BUTTON_CLASS } from "@/lib/constants";

const POOLS = [
    { name: "Comdex Gold", ticker: "XAUc", apy: "5.20%", tvl: "12,042 XAUc", rewards: "$1.2M", stake: "12.50 XAUc", yourReward: "158.42 CUSD", color: "#FFD700", avatar: "G" },
    { name: "Comdex Silver", ticker: "XAGc", apy: "12.80%", tvl: "570,240 XAGc", rewards: "$850K", stake: "450.00 XAGc", yourReward: "42.15 CUSD", color: "#C0C0C0", avatar: "S" },
    { name: "Comdex Platinum", ticker: "XPTc", apy: "7.45%", tvl: "6,065 XPTc", rewards: "$420K", stake: "0.00 XPTc", yourReward: "0.00 CUSD", color: "#4A7EBB", avatar: "P" },
    { name: "Comdex Palladium", ticker: "XPDc", apy: "9.15%", tvl: "3,385 XPDc", rewards: "$280K", stake: "5.00 XPDc", yourReward: "210.10 CUSD", color: "#5D9B76", avatar: "D" }
];

function PoolCard({ pool }: { pool: typeof POOLS[0] }) {
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
    const [redeemStatus, setRedeemStatus] = useState<"idle" | "loading" | "success">("idle");
    const [claimStatus, setClaimStatus] = useState<"idle" | "loading" | "success">("idle");

    const { open } = useAppKit();
    const { isConnected } = useAppKitAccount();

    const handleParticipate = () => {
        if (!isConnected) {
            toast.error("Wallet Not Connected", {
                description: "Connect your wallet to participate in this vault.",
            });
            open();
            return;
        }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error("Invalid Amount", {
                description: "Enter a valid amount to participate.",
            });
            return;
        }
        setStatus("loading");
        setTimeout(() => {
            setStatus("success");
            toast.success("Participation Confirmed", {
                description: `You have successfully joined the ${pool.name} vault.`,
            });
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
            toast.success("Assets Redeemed", {
                description: `Successfully withdrawn assets from ${pool.name}.`,
            });
            setTimeout(() => setRedeemStatus("idle"), 3000);
        }, 2000);
    };

    const handleClaim = () => {
        setClaimStatus("loading");
        setTimeout(() => {
            setClaimStatus("success");
            toast.success("Rewards Claimed", {
                description: `Reward amount credited to your wallet.`,
            });
            setTimeout(() => setClaimStatus("idle"), 3000);
        }, 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 p-8 rounded-[32px] shadow-sm flex flex-col group hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-500 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <AssetIcon symbol={pool.ticker} color={pool.color} size="md" className="shadow-lg transition-transform group-hover:scale-110" />
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Ticker</p>
                    <p className="text-sm font-black text-slate-950 dark:text-white">{pool.ticker}</p>
                </div>
            </div>

            <div className="relative z-10 mb-8">
                <h3 className="text-lg font-black text-slate-950 dark:text-white mb-1">{pool.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400 transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-500">{pool.apy}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">APY</span>
                </div>
            </div>

            <div className="space-y-4 mb-8 bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 relative z-10 transition-colors group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 dark:text-slate-500">TVL</span>
                    <span className="text-slate-950 dark:text-white">{pool.tvl}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 dark:text-slate-500">Total Reward</span>
                    <span className="text-slate-950 dark:text-white">{pool.rewards}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 dark:text-slate-500">Your Position</span>
                    <span className="text-slate-950 dark:text-white">{pool.stake}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 dark:text-slate-500">Your Reward</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{pool.yourReward}</span>
                </div>
            </div>

            {/* Amount Input */}
            <div className="relative z-10 mb-4 group/input">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`0.00 ${pool.ticker}`}
                    className="w-full h-14 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 pr-16 text-sm font-black text-slate-950 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-200 dark:focus:border-blue-800 focus:bg-white dark:focus:bg-slate-950 transition-all placeholder:text-slate-200 dark:placeholder:text-slate-600"
                />
                <button
                    onClick={() => setAmount(pool.stake.split(' ')[0].replace(/,/g, ''))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-black text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 hover:border-blue-600 transition-all shadow-sm"
                >
                    MAX
                </button>
            </div>

            {!isConnected ? (
                <div className="relative z-10 pt-4">
                    <button
                        onClick={() => {
                            console.log("DEBUG: Earn Page Connect Wallet clicked");
                            open();
                        }}
                        className="w-full py-5 bg-slate-950 dark:bg-blue-600 text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-[24px] shadow-2xl dark:shadow-blue-900/40 hover:bg-slate-800 dark:hover:bg-blue-500 transition-all active:scale-[0.98]"
                    >
                        Connect Wallet
                    </button>
                </div>
            ) : (
                <div className="relative z-10 flex flex-col gap-3">
                    <button
                        onClick={handleClaim}
                        disabled={claimStatus !== "idle" || status !== "idle" || redeemStatus !== "idle"}
                        className={`w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 border shadow-sm ${claimStatus === "success"
                            ? `${SUCCESS_BUTTON_CLASS} border-emerald-100 dark:border-emerald-800`
                            : "bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40"
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
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-950 dark:hover:text-white"
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
            )}

            {/* Hover Accent – identical to Discover cards */}
            <div className="absolute bottom-0 left-0 h-[3px] w-full bg-slate-950 transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100" />
        </div>
    );
}

const STAKES = [
    { symbol: "XAUc", fullName: "Comdex Gold", id: "#1204", amount: "12.500 XAUc", value: "≈ $25,430.00", duration: "45 Days", progress: 65, apy: "5.20%", rewarded: "158.42", color: "#FFD700" },
    { symbol: "XAGc", fullName: "Comdex Silver", id: "#8921", amount: "450.000 XAGc", value: "≈ $10,102.50", duration: "12 Days", progress: 20, apy: "12.80%", rewarded: "42.15", color: "#C0C0C0" },
    { symbol: "XPDc", fullName: "Comdex Palladium", id: "#5412", amount: "5.000 XPDc", value: "≈ $4,729.00", duration: "92 Days", progress: 85, apy: "9.15%", rewarded: "210.10", color: "#5D9B76" }
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
        <tr key={stake.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
            <td className="px-6 py-4 md:py-6 min-w-[140px] md:min-w-[200px] max-w-[160px] md:max-w-none sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 transition-colors border-r border-slate-50 dark:border-slate-800/50 shadow-[10px_0_15px_-10px_rgba(0,0,0,0.02)] dark:shadow-none">
                <div className="flex items-center gap-2 md:gap-4">
                    <AssetIcon symbol={stake.symbol} color={stake.color} size="sm" className="transition-transform group-hover:scale-110 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                        <p className="text-sm font-black text-slate-950 dark:text-white leading-none truncate">{stake.symbol}</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest truncate">{stake.fullName}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-6 border-b border-slate-100 dark:border-slate-800/50">
                <p className="text-sm font-black text-slate-950 dark:text-white leading-none tabular-nums whitespace-nowrap">{stake.amount}</p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest tabular-nums whitespace-nowrap">{stake.value}</p>
            </td>
            <td className="px-6 py-6 border-b border-slate-100 dark:border-slate-800/50">
                <div className="w-32">
                    <p className="text-sm font-black text-slate-950 dark:text-white mb-2 leading-none tabular-nums">{stake.duration}</p>
                    <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${stake.progress}%` }} />
                    </div>
                </div>
            </td>
            <td className="px-6 py-6 border-b border-slate-100 dark:border-slate-800/50">
                <p className="text-sm font-black text-blue-600 dark:text-blue-400 tabular-nums">{stake.apy}</p>
            </td>
            <td className="px-6 py-6 border-b border-slate-100 dark:border-slate-800/50">
                <p className="text-sm font-black text-slate-950 dark:text-white tabular-nums">{stake.rewarded} CUSD</p>
            </td>
            <td className="px-6 py-6 text-right border-b border-slate-100 dark:border-slate-800/50">
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
    const { isConnected } = useAppKitAccount();

    const filteredPools = selectedFilter === "All Vaults"
        ? POOLS
        : POOLS.filter(p => p.name === selectedFilter);

    return (
        <div className="flex-1 overflow-y-auto bg-[#fafbfc] dark:bg-[#020617] transition-colors duration-300 px-4 md:px-10 py-8 md:py-12 no-scrollbar">
            <div className="max-w-[1500px] mx-auto space-y-12 md:space-y-16 pb-20">

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 px-1">
                    <div className="flex flex-col gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-fit flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-slate-900 border border-transparent dark:border-blue-900/50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em]"
                        >
                            <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse" />
                            Revenue Share Mechanism
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-none">Put Your Assets to Work</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg text-sm leading-relaxed">
                            Participate with your assets and earn high-yield rewards in CUSD stablecoins.
                            Institutional-grade security, fully audited and always liquid.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { icon: Lock, title: "Total Value Locked", val: "$142,850,920.00", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
                        { icon: DollarSign, title: "Total Rewards", val: "$1,842,450.65", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                        { icon: Users, title: "Total Users", val: "12,842", color: "text-slate-950 dark:text-white", bg: "bg-slate-50 dark:bg-slate-800" }
                    ].map((stat, i) => (
                        <div key={i} className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-[32px] shadow-sm flex items-center gap-6 group hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-default ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                            <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110 flex-shrink-0`}>
                                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.title}</p>
                                <p className="text-xl md:text-2xl font-black text-slate-950 dark:text-white tracking-tight tabular-nums">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Staking Pools Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-1 relative z-30">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">Available Vaults</h2>

                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-black text-slate-950 dark:text-white shadow-sm transition-all uppercase tracking-widest hover:border-slate-200 dark:hover:border-slate-700"
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
                                            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-black/50 py-2 z-20"
                                        >
                                            {["All Vaults", ...POOLS.map(p => p.name)].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setSelectedFilter(option);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full text-left px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${selectedFilter === option
                                                        ? "text-slate-950 dark:text-white bg-slate-50 dark:bg-slate-800"
                                                        : "text-slate-400 dark:text-slate-500 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
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
                {isConnected && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">Active Participations</h2>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-sm overflow-hidden mb-32">
                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[1000px]">
                                    <thead className="bg-[#fafbfc] dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                                        <tr>
                                            <th className={`${TABLE_HEADER_CLASS} min-w-[140px] md:min-w-[200px] max-w-[160px] md:max-w-none sticky left-0 z-20 bg-[#fafbfc] dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shadow-[10px_0_15px_-10px_rgba(0,0,0,0.05)] dark:shadow-none`}>Asset Pool</th>
                                            <th className={TABLE_HEADER_CLASS}>Participated Amount</th>
                                            <th className={TABLE_HEADER_CLASS}>Lifecycle</th>
                                            <th className={TABLE_HEADER_CLASS}>APY %</th>
                                            <th className={TABLE_HEADER_CLASS}>Yield Earned</th>
                                            <th className={`${TABLE_HEADER_CLASS} text-right`}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {STAKES.map((stake) => (
                                            <StakeRow key={stake.id} stake={stake} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
