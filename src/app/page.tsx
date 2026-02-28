"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Github, Send, ShieldCheck, Zap, Globe2, TrendingUp, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AssetIcon from "@/components/AssetIcon";
import { ASSETS } from "@/lib/assets";

/* ═══════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════ */
function generateSparkline(points: number, trend: "up" | "down" = "up", amplitude = 20): string {
  const data: number[] = [];
  let y = 50;
  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.5) * amplitude;
    const drift = trend === "up" ? -0.4 : 0.4;
    y += noise + drift;
    y = Math.max(15, Math.min(85, y));
    data.push(y);
  }
  return data.reduce((path, val, i) => {
    const x = (i / (points - 1)) * 100;
    if (i === 0) return `M${x} ${val}`;
    const px = ((i - 1) / (points - 1)) * 100;
    const cx = (px + x) / 2;
    return `${path} C${cx} ${data[i - 1]}, ${cx} ${val}, ${x} ${val}`;
  }, "");
}


/* ═══════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════ */

function LiveSparkline({ color = "#10b981", trend = "up" as "up" | "down" }) {
  const [path, setPath] = useState("");
  useEffect(() => {
    setPath(generateSparkline(32, trend, 18));
  }, [trend]);

  if (!path) return null;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full text-current" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-fill-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${path} V100 H0 Z`}
        fill={`url(#spark-fill-${color.replace("#", "")})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
}

/* -------------------------------------------------------------
   HERO ASSET CARD (Updated Design)
------------------------------------------------------------- */
const SLIDER_ASSETS = ASSETS.filter(a => a.symbol !== "USDT" && a.symbol !== "CUSD");

function HeroAssetCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDER_ASSETS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const asset = SLIDER_ASSETS[index];
  const priceParts = asset.price.split(".");

  return (
    <div className="relative group w-full max-w-[360px] mx-auto sm:mr-0">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/10 dark:to-purple-900/10 rounded-[35px] blur-xl opacity-70 group-hover:opacity-100 transition duration-1000" />

      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800/50 rounded-[32px] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-none overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-60" />

        <AnimatePresence mode="wait">
          <motion.div
            key={asset.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <AssetIcon symbol={asset.symbol} color={asset.color} size="md" className="shadow-lg shadow-black/5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white leading-none">{asset.symbol}</h3>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">{asset.name}</p>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide ${asset.isPositive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                {asset.isPositive ? "+" : "-"}{asset.changePercent}
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-[40px] font-black text-slate-950 dark:text-white tracking-[-0.03em] tabular-nums leading-none">
                ${priceParts[0]}
              </span>
              {priceParts[1] && (
                <span className="text-[24px] font-black text-slate-300 dark:text-slate-600 tracking-[-0.03em]">.{priceParts[1]}</span>
              )}
            </div>

            <div className="h-20 w-full mt-6 mb-2">
              <LiveSparkline color={asset.isPositive ? "#10b981" : "#f43f5e"} trend={asset.isPositive ? "up" : "down"} />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 mt-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Volume (24h)</span>
                <span className="text-[13px] font-black text-slate-950 dark:text-white tabular-nums">$1.2M</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Holders</span>
                <span className="text-[13px] font-black text-slate-950 dark:text-white tabular-nums">12,402</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   MAIN PAGE
------------------------------------------------------------- */
export default function HomePage() {
  // const { scrollY } = useScroll(); // Placeholder for scroll logic if needed

  return (
    <div className="flex-1 overflow-x-hidden bg-[#fafbfc] dark:bg-[#020617] transition-colors duration-300">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Soft Mesh Gradient */}
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse-slow" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-100/40 dark:bg-purple-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 transition-opacity"
            style={{ backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(to right, #0f172a 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

            {/* LEFT: Text Content */}
            <div className="flex flex-col gap-8 max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center lg:justify-start gap-3"
              >
                <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-500 text-[11px] font-black uppercase tracking-wider flex items-center gap-2 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 dark:bg-blue-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 dark:bg-blue-500"></span>
                  </span>
                  Live on Mainnet
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-black text-slate-900 dark:text-white leading-[0.95] tracking-[-0.04em]"
              >
                Real Assets. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Real Yield.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg md:text-xl font-medium text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed mx-auto lg:mx-0"
              >
                Trade tokenized commodities with institutional-grade security. Gold, Silver, and Oil. Fully backed, audited, and liquid on-chain.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto mx-auto lg:mx-0"
              >
                <Link href="/discover" className="w-full sm:w-auto">
                  <button className="h-[56px] px-8 w-full sm:w-auto bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-500 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 dark:shadow-blue-900/20 hover:shadow-2xl hover:shadow-slate-900/20 active:scale-95 transition-all duration-300">
                    Start Trading
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/support" className="w-full sm:w-auto">
                  <button className="h-[56px] px-8 w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all duration-300">
                    Documentation
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* RIGHT: Dynamic Visuals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative lg:h-[600px] flex items-center justify-center perspective-[2000px] mt-12 lg:mt-0"
            >
              {/* Floating Elements Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl opacity-60" />

              {/* Main Card */}
              <div className="transform transition-transform hover:scale-[1.02] duration-500 relative z-10 w-full px-4 sm:px-0 flex justify-center">
                <HeroAssetCard />
              </div>

              {/* Floating Stats Cards around it - Hidden on mobile, visible on desktop */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="hidden md:block absolute top-10 right-0 lg:top-20 lg:-right-4 xl:right-10 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl dark:shadow-black/40 border border-slate-100 dark:border-slate-800 z-20 max-w-[180px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Yield</span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">+12.4%</div>
                <div className="text-[10px] font-bold text-slate-400">APY on Gold Vaults</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="hidden md:block absolute bottom-20 left-0 lg:bottom-32 lg:-left-4 xl:left-0 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl dark:shadow-black/40 border border-slate-100 dark:border-slate-800 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80",
                      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&h=80",
                      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=80&h=80"
                    ].map((src, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-950 dark:bg-blue-500 flex items-center justify-center text-[8px] font-black text-white">
                      +12k
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">12k+ Users</div>
                    <div className="text-[10px] font-bold text-slate-400">Trust Comdex Pro</div>
                  </div>
                </div>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BENTO FEATURES
      ═══════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-blue-600 font-extrabold uppercase tracking-widest text-xs mb-2 block">Why Choose Comdex</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Backed by Earth, <br /> Powered by Code.
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm text-sm leading-relaxed">
            Built on BNB Chain for speed and low costs. Fully audited smart contracts ensuring your assets are safe and always accessible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto lg:auto-rows-[340px]">
          {/* Feature 1: RWA */}
          <div className="md:col-span-2 bg-[#f1f5f9] dark:bg-slate-900 rounded-[32px] p-10 relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-slate-900 dark:text-white">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Real World Assets</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">Bridging the gap between physical commodities and digital finance. Own real World assets on-chain.</p>
              </div>
              <Link href="/discover" className="inline-flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white hover:text-blue-600 transition-colors uppercase tracking-widest">
                Explore Assets <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Decoration */}
            <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-slate-200/50 dark:bg-slate-800/50 rounded-tl-full translate-y-10 translate-x-10 group-hover:scale-105 transition-transform duration-700" />
          </div>

          {/* Feature 2: Compliance */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-24 h-24 text-slate-900 dark:text-slate-100" />
            </div>
            <div className="h-full flex flex-col justify-between relative z-10">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Shariah Compliant</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Certified <strong className="text-slate-700 dark:text-slate-200">Halal</strong> investment structure. Fully verified by top-tier audit firms with on-chain Proof of Reserves.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3: Yield */}
          <div className="bg-slate-900 rounded-[32px] p-8 relative overflow-hidden text-white group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-blue-500/20 rounded-full blur-[60px]" />
            <div className="h-full flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-black text-white">Revenue Share</span>
                </div>
                <h3 className="text-lg font-bold text-blue-200">Participate & Earn</h3>
              </div>
              <div className="mt-4">
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">
                  Participate in the protocol to receive a share of generated profits. Real yield from real activity.
                </p>
                <Link href="/earn" className="inline-flex h-10 px-4 bg-white/10 hover:bg-white/20 rounded-xl items-center justify-center text-xs font-black uppercase tracking-widest backdrop-blur-sm transition-all">
                  Start Participating
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 4: Verified Price Feeds */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-10 relative overflow-hidden group hover:border-blue-100 dark:hover:border-blue-900 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
              <div>
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Multi-Source Oracles</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Prices are aggregated from <strong className="text-slate-700 dark:text-slate-200">Pyth Network</strong> and <strong className="text-slate-700 dark:text-slate-200">Redstone</strong>, then validated by our internal <strong className="text-blue-600 dark:text-blue-400">Comdex Oracle</strong>. Triple-layer security ensures tamper-proof valuations.
                </p>
              </div>
              <div className="flex flex-col justify-center gap-4">
                {[
                  { name: "Pyth Network", status: "Operational", color: "bg-emerald-500" },
                  { name: "RedStone", status: "Operational", color: "bg-emerald-500" },
                  { name: "Comdex Oracle", status: "Primary Source", color: "bg-blue-600 dark:bg-blue-500" }
                ].map((oracle, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${oracle.color} animate-pulse`} />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{oracle.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{oracle.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          START TRADING CTA
      ═══════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto bg-slate-900 rounded-[40px] px-8 md:px-20 py-16 md:py-24 text-center relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Ready to diversify?
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of investors trading real-world assets on the blockchain. No account required, just connect your wallet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link href="/discover">
                <button className="h-[60px] px-10 bg-white text-slate-900 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-xl shadow-white/5 active:scale-95">
                  Launch App
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER (Simple)
      ═══════════════════════════════════════ */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-20 pb-12 px-6 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0052cc] rounded-xl flex items-center justify-center border border-blue-700/50 shadow-lg shadow-blue-900/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/comdex-logo.svg" alt="Comdex" className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">COMDEX</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Tokenized real-world assets for the decentralized economy.
            </p>
          </div>

          {[
            {
              title: "Platform", links: [
                { label: "Discover", href: "/discover" },
                { label: "Earn", href: "/earn" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Comdex Pro", href: "/pro" }
              ]
            },
            {
              title: "Support", links: [
                { label: "Help Center", href: "/support" },
                { label: "Documentation", href: "/support?tab=docs" },
                { label: "API Status", href: "/support" },
                { label: "Contact", href: "/support" }
              ]
            },
            {
              title: "Legal", links: [
                { label: "Privacy Policy", href: "/legal" },
                { label: "Terms of Service", href: "/legal" },
                { label: "Risk Disclosure", href: "/legal" }
              ]
            }
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-400">© 2026 Comdex Pro. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[
              {
                name: "X", icon: (props: React.ComponentProps<"svg">) => (
                  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                ), href: "https://x.com/comdexexchange"
              },
              { name: "Telegram", icon: Send, href: "https://t.me/comdexexchange" },
              {
                name: "Medium", icon: (props: React.ComponentProps<"svg">) => (
                  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42S14.2 15.54 14.2 12s1.52-6.42 3.38-6.42S20.96 8.46 20.96 12zm3.04 0c0 3.07-.33 5.56-.73 5.56s-.73-2.49-.73-5.56.33-5.56.73-5.56.73 2.49.73 5.56z" />
                  </svg>
                ), href: "https://medium.com/@comdexexchange"
              },
              { name: "GitHub", icon: Github, href: "https://github.com" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
