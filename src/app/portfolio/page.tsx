"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Wallet, Lock, Briefcase, ArrowDown, Zap, ArrowRight, ShieldCheck, PieChart } from "lucide-react";
import AssetIcon from "@/components/AssetIcon";
import { TABLE_HEADER_CLASS, TABLE_CELL_CLASS } from "@/lib/constants";
import { ASSETS } from "@/lib/assets";

/* ─────────────────────────────────────────────────────────────
   MOCK DATA
   ───────────────────────────────────────────────────────────── */
const WALLET_BALANCES = [
    {
        asset: ASSETS.find(a => a.symbol === "AUSD")!,
        balance: "15,240.50",
        value: "$15,240.50",
        allocation: "45%",
    },
    {
        asset: ASSETS.find(a => a.symbol === "AXAU")!,
        balance: "4.25",
        value: "$8,695.20",
        allocation: "25%",
    },
    {
        asset: ASSETS.find(a => a.symbol === "AXAG")!,
        balance: "150.00",
        value: "$3,450.00",
        allocation: "10%",
    },
    {
        asset: ASSETS.find(a => a.symbol === "USDT")!,
        balance: "5,000.00",
        value: "$5,000.00",
        allocation: "15%",
    },
];

const STAKED_POSITIONS = [
    {
        asset: ASSETS.find(a => a.symbol === "AXAU")!,
        amount: "12.50 AXAU",
        value: "$25,430.00",
        rewards: "158.42 AUSD",
        duration: "45 Days",
        apy: "5.20%",
        progress: 65,
        redeemed: "420.50 AUSD",
    },
    {
        asset: ASSETS.find(a => a.symbol === "AXPD")!,
        amount: "5.00 AXPD",
        value: "$4,729.00",
        rewards: "210.10 AUSD",
        duration: "92 Days",
        apy: "9.15%",
        progress: 85,
        redeemed: "850.25 AUSD",
    },
];

/* ─────────────────────────────────────────────────────────────
   COMPONENTS
   ───────────────────────────────────────────────────────────── */

interface PortfolioStatCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    subValue?: string;
    colorClass: string;
    delay: number;
}

function PortfolioStatCard({ icon: Icon, title, value, subValue, colorClass, delay }: PortfolioStatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="bg-white border border-slate-100 p-6 md:p-8 rounded-[32px] shadow-sm flex flex-col gap-4 group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all"
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight tabular-nums">{value}</h3>
                    {subValue && <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50">{subValue}</span>}
                </div>
            </div>
        </motion.div>
    );
}

function BalanceRow({ item, index }: { item: typeof WALLET_BALANCES[0], index: number }) {
    return (
        <motion.tr
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none"
        >
            <td className={TABLE_CELL_CLASS}>
                <div className="flex items-center gap-4">
                    <AssetIcon symbol={item.asset.symbol} avatar={item.asset.avatar} color={item.asset.color} size="sm" className="transition-transform group-hover:scale-110" />
                    <div>
                        <p className="text-[13px] font-black text-slate-950 leading-none">{item.asset.symbol}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">{item.asset.name}</p>
                    </div>
                </div>
            </td>
            <td className={TABLE_CELL_CLASS}>
                <p className="text-[13px] font-black text-slate-950 tabular-nums tracking-tight mb-1">{item.balance}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tabular-nums">{item.asset.symbol}</p>
            </td>
            <td className={TABLE_CELL_CLASS}>
                <p className="text-[13px] font-black text-slate-950 tabular-nums tracking-tight">{item.value}</p>
            </td>
            <td className={TABLE_CELL_CLASS}>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: item.allocation }} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 tabular-nums">{item.allocation}</span>
                </div>
            </td>
            <td className={`${TABLE_CELL_CLASS} text-right`}>
                <div className="flex justify-end gap-2">
                    <button className="px-3 py-1.5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-sm active:scale-95">
                        Trade
                    </button>
                </div>
            </td>
        </motion.tr>
    );
}

function StakedRow({ item, index }: { item: typeof STAKED_POSITIONS[0], index: number }) {
    return (
        <motion.tr
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
            className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none"
        >
            <td className={TABLE_CELL_CLASS}>
                <div className="flex items-center gap-4">
                    <AssetIcon symbol={item.asset.symbol} avatar={item.asset.avatar} color={item.asset.color} size="sm" className="transition-transform group-hover:scale-110" />
                    <div>
                        <p className="text-[13px] font-black text-slate-950 leading-none">{item.asset.symbol} Vault</p>
                        <p className="text-[10px] font-bold text-blue-600 mt-1.5 uppercase tracking-widest">{item.apy} APY</p>
                    </div>
                </div>
            </td>
            <td className={TABLE_CELL_CLASS}>
                <p className="text-[13px] font-black text-slate-950 tabular-nums tracking-tight mb-1">{item.amount}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest tabular-nums">{item.value}</p>
            </td>
            <td className={TABLE_CELL_CLASS}>
                <p className="text-[13px] font-black text-slate-950 tabular-nums tracking-tight mb-1">+{item.rewards}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Unredeemed</p>
            </td>
            <td className={TABLE_CELL_CLASS}>
                <p className="text-[13px] font-black text-slate-950 tabular-nums tracking-tight mb-1">{item.redeemed}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Redeemed</p>
            </td>
            <td className={`${TABLE_CELL_CLASS} text-right`}>
                <button className="px-4 py-2 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-black/10">
                    Claim
                </button>
            </td>
        </motion.tr>
    );
}

export default function PortfolioPage() {
    const { open } = useAppKit();
    const { isConnected } = useAppKitAccount();

    if (!isConnected) {
        return (
            <div className="flex-1 overflow-y-auto bg-[#fafbfc] flex items-start lg:items-center justify-center p-4 pt-20 lg:pt-4">
                <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-6 md:gap-8 items-center lg:items-start text-center lg:text-left"
                    >
                        <div className="w-fit flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em]">
                            <ShieldCheck className="w-3 h-3" />
                            Secure Access
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tighter leading-[1] md:leading-[0.9]">
                            Portfolio <br className="hidden md:block" />
                            <span className="text-slate-300">Management.</span>
                        </h1>
                        <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                            Connect your wallet to track your digital assets, monitor yield performance, and manage your tokenized commodity portfolio in real-time.
                        </p>
                        <div className="flex flex-col gap-4 w-full md:w-auto items-center lg:items-start">
                            <button
                                onClick={() => open()}
                                className="w-full md:w-fit px-12 py-5 bg-slate-950 text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
                            >
                                Connect Wallet
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Support for MetaMask, Trust & 300+ Wallets
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="hidden lg:flex items-center justify-center relative"
                    >
                        {/* Soft Glow Background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-emerald-500/10 blur-[100px] rounded-full" />

                        <div className="relative">
                            {/* Main Decorative Card */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="w-[380px] h-[480px] bg-white border border-slate-100 rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center p-12 relative overflow-hidden"
                            >
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

                                {/* Icon Sphere */}
                                <div className="relative mb-10">
                                    <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full scale-150" />
                                    <div className="relative w-24 h-24 bg-slate-950 rounded-[32px] flex items-center justify-center shadow-2xl">
                                        <Wallet className="w-10 h-10 text-white" />
                                    </div>

                                    {/* Small floating dots */}
                                    <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-4 -right-4 w-4 h-4 bg-emerald-400 rounded-full blur-[2px]" />
                                    <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-2 -left-6 w-3 h-3 bg-blue-400 rounded-full blur-[1px]" />
                                </div>

                                <div className="text-center space-y-3">
                                    <h3 className="text-xl font-black text-slate-950 tracking-tight">Your Digital Vault</h3>
                                    <p className="text-[13px] font-medium text-slate-400 leading-relaxed">
                                        Securely connect to manage and track your tokenized assets.
                                    </p>
                                </div>

                                {/* Minimal Skeleton Lines */}
                                <div className="mt-12 w-full space-y-4">
                                    <div className="h-[2px] w-full bg-slate-50" />
                                    <div className="h-[2px] w-2/3 bg-slate-50 mx-auto" />
                                    <div className="h-[2px] w-1/2 bg-slate-50 mx-auto" />
                                </div>

                                <div className="absolute bottom-12 inset-x-0 flex justify-center">
                                    <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-100 px-5 py-2.5 rounded-full flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Gateway</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Element - Secondary Card */}
                            <motion.div
                                animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-12 top-20 w-32 h-32 bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] shadow-xl z-10 flex items-center justify-center"
                            >
                                <PieChart className="w-10 h-10 text-slate-200" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#fafbfc] px-4 md:px-10 py-8 md:py-12 no-scrollbar">
            <div className="max-w-[1400px] mx-auto pb-32">

                {/* Header */}
                <div className="flex flex-col gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-fit flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em]"
                    >
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                        My Assets
                    </motion.div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-none mb-3">Portfolio Overview</h1>
                            <p className="text-slate-500 font-medium text-sm max-w-lg leading-relaxed">
                                Track your wallet balances, Participated assets, and real-time performance across the Altai ecosystem.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
                    <PortfolioStatCard
                        icon={Wallet}
                        title="Wallet Balance"
                        value="$32,385.70"
                        colorClass="bg-blue-50 text-blue-600"
                        delay={0}
                    />
                    <PortfolioStatCard
                        icon={Lock}
                        title="Participated Value"
                        value="$30,000.00"
                        colorClass="bg-emerald-50 text-emerald-600"
                        delay={0.1}
                    />
                    <PortfolioStatCard
                        icon={Zap}
                        title="Yield Earnings"
                        value="$5,430.50"
                        colorClass="bg-slate-950 text-white"
                        delay={0.2}
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
                    {/* Main Content: Lists */}
                    <div className="flex flex-col gap-10">

                        {/* 1. Wallet Balances */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-3">
                                    Wallet Balances
                                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-bold">{WALLET_BALANCES.length} Assets</span>
                                </h2>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden">
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead className="bg-[#fafbfc] border-b border-slate-100">
                                            <tr>
                                                <th className={TABLE_HEADER_CLASS}>Asset</th>
                                                <th className={TABLE_HEADER_CLASS}>Balance</th>
                                                <th className={TABLE_HEADER_CLASS}>Value</th>
                                                <th className={TABLE_HEADER_CLASS}>Allocation</th>
                                                <th className={`${TABLE_HEADER_CLASS} text-right`}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {WALLET_BALANCES.map((item, idx) => (
                                                <BalanceRow key={item.asset.symbol} item={item} index={idx} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* 2. Staked Positions */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-3">
                                    Active Vaults
                                    <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-md font-bold">{STAKED_POSITIONS.length} Active</span>
                                </h2>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden">
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead className="bg-[#fafbfc] border-b border-slate-100">
                                            <tr>
                                                <th className={TABLE_HEADER_CLASS}>Vault</th>
                                                <th className={TABLE_HEADER_CLASS}>Participated</th>
                                                <th className={TABLE_HEADER_CLASS}>Rewards</th>
                                                <th className={TABLE_HEADER_CLASS}>Redeemed</th>
                                                <th className={`${TABLE_HEADER_CLASS} text-right`}>Claim</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {STAKED_POSITIONS.map((item, idx) => (
                                                <StakedRow key={item.asset.symbol} item={item} index={idx} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar: Analytics */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm flex flex-col gap-8 sticky top-24">
                            <div>
                                <h3 className="text-lg font-black text-slate-950 tracking-tight mb-6">Asset Allocation</h3>
                                <div className="relative aspect-square max-w-[240px] mx-auto">
                                    {/* Mock Pie Chart Visualization */}
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="20" strokeDasharray="45 100" />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="20" strokeDasharray="25 100" strokeDashoffset="-45" />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#26A17B" strokeWidth="20" strokeDasharray="15 100" strokeDashoffset="-70" />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#94a3b8" strokeWidth="20" strokeDasharray="10 100" strokeDashoffset="-85" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                                        <span className="text-xl font-black text-slate-950">$62K</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {WALLET_BALANCES.map((item) => (
                                    <div key={item.asset.symbol} className="flex items-start justify-between text-sm py-1">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full mt-1.5" style={{ backgroundColor: item.asset.color || "#ccc" }} />
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-slate-700">{item.asset.name}</span>
                                                <span className="text-[11px] font-medium text-slate-400 tabular-nums">{item.balance} {item.asset.symbol}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="font-black text-slate-950 tabular-nums">{item.value}</span>
                                            <span className="text-[11px] font-bold text-slate-500">{item.allocation}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>


                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
