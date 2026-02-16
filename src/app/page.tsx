"use client";

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Github, Twitter, Send, Globe, ShieldCheck, Lock, Shield, Zap, BarChart3, Layers } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import AssetIcon from "@/components/AssetIcon";
import { ASSETS } from "@/lib/assets";
import BnbLogo from "@/components/icons/BnbLogo";

/* ═══════════════════════════════════════════════════
   SPARKLINE GENERATOR
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
   ANIMATED COUNTER
═══════════════════════════════════════════════════ */
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 2000 }: {
  value: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.floor(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

/* ═══════════════════════════════════════════════════
   INTERACTIVE CURSOR GLOW
═══════════════════════════════════════════════════ */
function useMouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 30 });
  const springY = useSpring(y, { stiffness: 200, damping: 30 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }, [x, y]);

  return { ref, springX, springY, handleMouse };
}

/* ═══════════════════════════════════════════════════
   ANIMATED SPARKLINE SVG
═══════════════════════════════════════════════════ */
function LiveSparkline({ color = "#10b981", trend = "up" as "up" | "down" }) {
  const [path, setPath] = useState("");
  useEffect(() => {
    setPath(generateSparkline(32, trend, 18));
  }, [trend]);

  if (!path) return null;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-fill-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
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
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   ASSET SLIDER CARD
   Cycles through all assets automatically
═══════════════════════════════════════════════════ */
const SLIDER_ASSETS = ASSETS.filter(a => a.symbol !== "USDT" && a.symbol !== "AUSD");

const ASSET_META: Record<string, { unit: string; vol: string; mcap: string; holdings: string }> = {
  AXAU: { unit: "Per 1 Gram", vol: "$1.2M", mcap: "$18.4B", holdings: "374,500 g" },
  AXAG: { unit: "Per 1 Gram", vol: "$820K", mcap: "$1.3B", holdings: "1,082,000 g" },
  AXPD: { unit: "Per 1 Gram", vol: "$95K", mcap: "$245M", holdings: "39,800 g" },
  AXPT: { unit: "Per 1 Gram", vol: "$78K", mcap: "$185M", holdings: "65,300 g" },
  ABRN: { unit: "Per Barrel", vol: "$3.8M", mcap: "$5.2B", holdings: "58,000 bbl" },
  AXCU: { unit: "Per 1 Gram", vol: "$2.1M", mcap: "$980M", holdings: "112,500 kg" },
};

function AssetSliderCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sparkKey, setSparkKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % SLIDER_ASSETS.length);
      setSparkKey(prev => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const asset = SLIDER_ASSETS[activeIndex];
  const meta = ASSET_META[asset.symbol] || { unit: "Per Unit", vol: "$500K", mcap: "$1B", holdings: "10,000" };
  const priceParts = asset.price.split(".");
  const sparkColor = asset.isPositive ? "#10b981" : "#f43f5e";

  return (
    <div className="relative w-full max-w-full sm:max-w-[380px]">
      {/* Shadow card behind */}
      <div className="absolute -bottom-3 left-4 right-4 h-full bg-slate-100 rounded-[28px] blur-sm" />

      {/* Main card */}
      <div className="relative bg-white border border-slate-100 rounded-[28px] p-7 shadow-[0_40px_100px_rgba(0,0,0,0.08)] backdrop-blur-xl overflow-hidden">

        <AnimatePresence mode="wait">
          <motion.div
            key={asset.symbol}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Link href={`/discover/${asset.symbol.toLowerCase()}`} className="block">
              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <AssetIcon symbol={asset.symbol} avatar={asset.avatar} color={asset.color} size="md" />
                  <div className="flex flex-col">
                    <span className="text-[14px] font-black text-slate-950 tracking-tight">{asset.symbol}</span>
                    <span className="text-[10px] font-bold text-slate-400">{asset.name}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${asset.isPositive ? "bg-emerald-50 border-emerald-100/50" : "bg-rose-50 border-rose-100/50"}`}>
                  <span className={`text-[11px] font-black ${asset.isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                    {asset.isPositive ? "+" : "-"}{asset.changePercent}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-2">
                <span className="text-[38px] font-black text-slate-950 tracking-[-0.03em] tabular-nums leading-none">
                  ${priceParts[0]}
                </span>
                {priceParts[1] && (
                  <span className="text-[22px] font-black text-slate-300 tracking-[-0.03em]">.{priceParts[1]}</span>
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">{meta.unit}</p>

              {/* Chart */}
              <div className="h-[100px] mb-6 -mx-1">
                <LiveSparkline key={sparkKey} color={sparkColor} trend={asset.isPositive ? "up" : "down"} />
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-slate-100">
                {[
                  { label: "24h Vol", val: meta.vol },
                  { label: "Market Cap", val: meta.mcap },
                  { label: "Holdings", val: meta.holdings },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                    <span className="text-[13px] font-black text-slate-950 tabular-nums">{s.val}</span>
                  </div>
                ))}
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {SLIDER_ASSETS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveIndex(i); setSparkKey(prev => prev + 1); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-slate-950" : "w-1.5 bg-slate-200 hover:bg-slate-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Floating accent — color follows the active asset */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-xl"
        style={{ background: `${asset.color}30` }}
      />
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { ref: heroRef, springX, springY, handleMouse } = useMouseGlow();
  const glowBg = useTransform(
    [springX, springY],
    // combine spring values into a radial gradient
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(59,130,246,0.04), transparent 60%)`
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafbfc] no-scrollbar">

      {/* ═══════════════════════════════════════
                HERO — Cinematic, Full Viewport
            ═══════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        onMouseMove={handleMouse}
        className="relative min-h-[calc(100vh-72px)] flex flex-col justify-center overflow-hidden"
      >
        {/* Mouse-following glow */}
        <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: glowBg }} />

        {/* Giant watermark text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-[clamp(12rem,22vw,26rem)] font-black tracking-[-0.06em] leading-none text-transparent"
            style={{ WebkitTextStroke: "1.5px rgba(148,163,184,0.08)" }}
          >
            ALTAI
          </motion.span>
        </div>

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }}
        />

        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-10 w-full relative z-10 pt-10 md:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left: Copy */}
            <div className="flex flex-col gap-8 max-w-xl items-center text-center lg:items-start lg:text-left mx-auto lg:mx-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="h-[1px] w-8 bg-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Tokenized Commodities Protocol
                </span>
              </motion.div>

              <div className="flex flex-col gap-2">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[clamp(2.5rem,7vw,4.8rem)] font-black text-slate-950 tracking-[-0.04em] leading-[0.95]"
                >
                  Trade real
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[clamp(2.5rem,7vw,4.8rem)] tracking-[-0.04em] leading-[0.95]"
                >
                  <span className="font-extralight text-slate-400">assets</span>
                  <span className="font-black text-slate-950">,</span>
                  <br className="hidden sm:block" />
                  <span className="font-black text-slate-950"> on-chain</span>
                  <span className="font-black text-blue-600">.</span>
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="text-[14px] md:text-[15px] font-medium text-slate-400 leading-[1.8] max-w-md"
              >
                Altai is the digital gateway to physical wealth. We transform RWAs into liquid digital assets, granting you direct ownership and instant trade through the markets.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-4 w-full sm:w-auto"
              >
                <Link href="/discover" className="w-full sm:w-auto">
                  <button className="group relative w-full h-[56px] px-8 bg-slate-950 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-slate-950/20 hover:shadow-slate-950/30 hover:bg-slate-900 active:scale-[0.98] transition-all overflow-hidden whitespace-nowrap">
                    <span className="relative z-10 flex items-center gap-3">
                      Start Exploring
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
                <Link href="/docs" className="w-full sm:w-auto flex justify-center sm:justify-start">
                  <span className="h-[56px] px-4 flex items-center justify-center sm:justify-start gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-950 transition-colors whitespace-nowrap cursor-pointer group">
                    Learn More
                    <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-slate-950 transition-colors">
                      <ArrowUpRight className="w-3 h-3 transition-transform group-hover:rotate-45" />
                    </div>
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Right: Auto-cycling asset slider card */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex justify-center perspective-[1200px] w-full lg:justify-end"
            >
              <AssetSliderCard />
            </motion.div>
          </div>

          {/* Bottom stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-12 sm:gap-20 md:gap-32 mt-24 lg:mt-32"
          >
            {[
              { label: "Total Value Locked", val: 142850920 },
              { label: "24h Trading Volume", val: 18420000 },
              { label: "Active Wallets", val: 12842 },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center sm:items-start group">
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[28px] md:text-[32px] font-black text-slate-950 tabular-nums tracking-tighter leading-none">
                    {stat.val > 100000 ? (
                      <AnimatedNumber value={stat.val} prefix="$" />
                    ) : (
                      <AnimatedNumber value={stat.val} />
                    )}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mt-3 leading-tight text-center sm:text-left">
                    {stat.label}
                  </span>
                </div>
                {/* Mobile divider */}
                {i < 2 && <div className="w-8 h-[1px] bg-slate-100 mt-12 sm:hidden" />}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>


      {/* ═══════════════════════════════════════
                BENTO GRID — Asymmetric Feature Cards
            ═══════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-14">
            <div className="h-[1px] w-8 bg-slate-300" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Why Altai</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-[minmax(180px,auto)]">

            {/* Card 1 — Large mission statement — Elegant Technical Style (Redesigned) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 lg:row-span-2 bg-white border border-slate-100 rounded-[32px] p-8 sm:p-12 md:p-14 flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-700"
            >
              {/* ── Thematic Background: Earth to Digital ── */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <svg className="absolute w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#bfdbfe" strokeWidth="1.5" />
                    </pattern>
                  </defs>

                  {/* Right Side: Digital Infrastructure (Grid) */}
                  <rect x="350" y="0" width="450" height="600" fill="url(#grid)" opacity="0.6" />

                  {/* Left Side: Physical Commodities (Topographic Lines) */}
                  <path d="M0 600 C 120 550, 50 450, 150 400 C 250 350, 200 250, 300 200 C 400 150, 350 50, 450 0" stroke="#cbd5e1" strokeWidth="3" fill="none" />
                  <path d="M-50 650 C 50 580, 0 480, 100 420 C 200 360, 150 260, 250 200" stroke="#cbd5e1" strokeWidth="3" fill="none" opacity="0.7" />

                </svg>

                {/* Fade Overlay (Lighter to show pattern) */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
              </div>

              {/* ── Top Header (Only Text) ── */}
              <div className="relative z-10 flex flex-col gap-0.5 mb-12">
                <span className="text-[13px] font-black text-blue-600 uppercase tracking-[0.25em] font-display">Altai Protocol</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Commodity Infrastructure</span>
              </div>

              {/* ── Main Content ── */}
              <div className="relative z-10 flex flex-col items-start gap-10">
                <div className="flex flex-col gap-6">
                  <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-black text-slate-950 tracking-[-0.05em] leading-[1.05] max-w-2xl">
                    Bridging physical
                    <br />
                    commodities to
                    <br />
                    <span className="text-blue-600">decentralized</span> finance.
                  </h2>
                  <p className="text-[16px] md:text-[18px] font-medium text-slate-500 leading-relaxed max-w-sm">
                    Each Altai token is backed 1:1 by physical reserves stored in institutional-grade vaults globally.
                  </p>
                </div>

                <div className="flex w-full sm:w-auto">
                  <Link href="/discover" className="w-full sm:w-auto">
                    <button className="group relative h-[64px] px-10 bg-white border border-slate-100/80 text-slate-950 rounded-2xl text-[14px] font-black uppercase tracking-[0.18em] flex items-center justify-center gap-5 shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.12)] hover:border-blue-100 hover:bg-slate-50 active:scale-[0.97] transition-all duration-500 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative z-10 flex items-center gap-3">
                        Launch App
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </span>
                    </button>
                  </Link>
                </div>
              </div>

            </motion.div>

            {/* Card 2 — BNB Chain (single chain) */}
            <Link href="/docs?section=How%20to%20Trade">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white border border-slate-100 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between group hover:border-slate-200 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all duration-500 h-full cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#F0B90B]/5 rounded-full blur-2xl" />
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-[#F0B90B]/10 border border-[#F0B90B]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BnbLogo className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-[17px] font-black text-slate-950 tracking-tight mb-2 flex items-center gap-2 group/title">
                    BNB Chain
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/title:text-slate-950 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-[12px] font-medium text-slate-400 leading-relaxed">
                    Built on BNB Smart Chain for fast transactions and low fees.
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Card 3 — Security */}
            <Link href="/docs?section=Vault%20%26%20Compliance">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white border border-slate-100 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between group hover:border-slate-200 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all duration-500 h-full cursor-pointer relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-50/50 rounded-full blur-2xl" />
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center mb-8 transition-transform group-hover:scale-110 relative z-10">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-[17px] font-black text-slate-950 tracking-tight mb-2 flex items-center gap-2 group/title">
                    Proof of Reserves
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/title:text-slate-950 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-[12px] font-medium text-slate-400 leading-relaxed">
                    Real-time, on-chain verification of backing. Always transparent.
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Card 4 — Yield — Clean White Style */}
            <Link href="/earn">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="bg-white border border-slate-100 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between group hover:border-slate-200 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all duration-500 h-full cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <span className="text-[42px] font-black text-slate-950 tracking-[-0.04em] leading-none">12.8%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">APY</span>
                </div>
                <div className="relative z-10 mt-6">
                  <h3 className="text-[17px] font-black text-slate-950 tracking-tight mb-2 flex items-center gap-2 group/title">
                    Earn Yield
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/title:text-slate-950 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-[12px] font-medium text-slate-400 leading-relaxed">
                    Stake your tokenized assets and earn rewards in AUSD stablecoins.
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Card 5 — Instant Settlement */}
            <Link href="/docs?section=How%20to%20Trade">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="bg-white border border-slate-100 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between group hover:border-slate-200 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all duration-500 h-full cursor-pointer"
              >
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-[36px] font-black text-slate-950 tracking-[-0.04em] leading-none">&lt;2s</span>
                </div>
                <div>
                  <h3 className="text-[17px] font-black text-slate-950 tracking-tight mb-2 flex items-center gap-2 group/title">
                    Settlement Time
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/title:text-slate-950 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-[12px] font-medium text-slate-400 leading-relaxed">
                    Execute and settle trades in under two seconds. No intermediaries.
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Card 6 — Assets count */}
            <Link href="/discover">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white border border-slate-100 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between group hover:border-slate-200 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all duration-500 h-full cursor-pointer"
              >
                <div className="flex -space-x-2 mb-8">
                  {ASSETS.filter(a => a.symbol !== "USDT" && a.symbol !== "AUSD").slice(0, 5).map((a) => (
                    <AssetIcon key={a.symbol} symbol={a.symbol} avatar={a.avatar} color={a.color} size="sm" className="ring-2 ring-white" />
                  ))}
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 ring-2 ring-white">+3</div>
                </div>
                <div>
                  <h3 className="text-[17px] font-black text-slate-950 tracking-tight mb-2 flex items-center gap-2 group/title">
                    8 Live Assets
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/title:text-slate-950 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-[12px] font-medium text-slate-400 leading-relaxed">
                    Precious metals, energy, and stablecoins. More coming soon.
                  </p>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════
                CLOSING CTA — Rich Graphical Design
            ═══════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative bg-slate-950 rounded-[32px] px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-24 overflow-hidden">

            {/* ── Rich graphical background ── */}
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }} />
            {/* Large gradient orbs */}
            <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-60px] left-[-60px] w-[350px] h-[350px] bg-blue-400/8 rounded-full blur-[100px]" />
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-blue-300/5 rounded-full blur-[80px]" />
            {/* Concentric rings */}
            <div className="absolute top-1/2 right-[15%] -translate-y-1/2">
              <div className="w-[300px] h-[300px] rounded-full border border-white/[0.03]" />
              <div className="absolute inset-4 rounded-full border border-white/[0.04]" />
              <div className="absolute inset-10 rounded-full border border-white/[0.05]" />
            </div>
            {/* Diagonal lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" preserveAspectRatio="none">
              <line x1="0" y1="100%" x2="40%" y2="0" stroke="white" strokeWidth="1" />
              <line x1="10%" y1="100%" x2="50%" y2="0" stroke="white" strokeWidth="1" />
              <line x1="60%" y1="100%" x2="100%" y2="0" stroke="white" strokeWidth="1" />
              <line x1="70%" y1="100%" x2="110%" y2="0" stroke="white" strokeWidth="1" />
            </svg>
            {/* Glowing dots */}
            <motion.div
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-12 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"
            />
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-12 left-16 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_12px_rgba(147,197,253,0.4)]"
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Get Started</span>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-white tracking-[-0.04em] leading-[1.05]">
                Start building your
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                  commodity portfolio.
                </span>
              </h2>

              <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full sm:w-auto">
                <Link href="/discover" className="w-full sm:w-auto">
                  <button className="group w-full h-[56px] px-8 bg-white text-slate-950 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-white/10 hover:bg-slate-50 active:scale-[0.97] transition-all whitespace-nowrap">
                    Launch App
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link href="/docs" className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap">
                  Read Documentation
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-[11px] font-medium text-slate-500 mt-6">
                No account needed. Connect your wallet to start.
              </p>
            </div>
          </div>
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════
                FOOTER — Ultra Minimal
            ═══════════════════════════════════════ */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 overflow-hidden relative">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Brand Column */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              <div className="flex items-center gap-4">
                <img src="/images/altai.svg" alt="Altai Logo" className="w-10 h-10 object-contain shadow-lg shadow-blue-500/10 rounded-xl" />
                <span className="text-[20px] font-black text-slate-950 tracking-tight">ALTAI</span>
              </div>
              <p className="text-[14px] font-medium text-slate-400 leading-relaxed max-w-[240px]">
                The premier institutional-grade protocol for tokenized commodities and yield-bearing assets on BNB Chain.
              </p>
              <div className="flex items-center gap-4">
                {[
                  {
                    name: "X", icon: (props: any) => (
                      <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                      </svg>
                    ), href: "https://x.com/altaiexchange"
                  },
                  { name: "Telegram", icon: Send, href: "https://t.me/altaiexchange" },
                  {
                    name: "Medium", icon: (props: any) => (
                      <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42S14.2 15.54 14.2 12s1.52-6.42 3.38-6.42S20.96 8.46 20.96 12zm3.04 0c0 3.07-.33 5.56-.73 5.56s-.73-2.49-.73-5.56.33-5.56.73-5.56.73 2.49.73 5.56z" />
                      </svg>
                    ), href: "https://medium.com/@Altaiexchange"
                  },
                  { name: "GitHub", icon: Github, href: "https://github.com" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {[
              {
                title: "Platform",
                links: [
                  { name: "Discover Assets", href: "/discover" },
                  { name: "Earn Yield", href: "/earn" },
                  { name: "Buy AUSD", href: "/earn" },
                  { name: "Portfolio", href: "/portfolio" },
                ]
              },
              {
                title: "Resources",
                links: [
                  { name: "Documentation", href: "/docs" },
                  { name: "Brand Assets", href: "#" },
                  { name: "Support Center", href: "/support" },
                ]
              },
              {
                title: "Legal",
                links: [
                  { name: "Terms of Service", href: "/legal?doc=terms" },
                  { name: "Privacy Policy", href: "/legal?doc=privacy" },
                  { name: "Cookie Policy", href: "/legal?doc=cookies" },
                  { name: "Risk Disclosure", href: "/legal?doc=risk" },
                ]
              }
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-6">
                <span className="text-[12px] font-black text-slate-950 uppercase tracking-[0.2em]">{col.title}</span>
                <ul className="flex flex-col gap-4">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-[14px] font-medium text-slate-400 hover:text-slate-950 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <span className="text-[13px] font-medium text-slate-400">© 2026 Altai Protocol. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
