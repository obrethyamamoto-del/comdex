"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DOCS_DATA, DOCS_STRUCTURE } from '@/lib/docsData';
import {
    Search, Wallet, ArrowRightLeft, TrendingUp, BookOpen,
    MessageCircle, Mail, HelpCircle, ChevronRight,
    Copy, Check, Menu, X, Book, Info, Shield,
    Map, Rocket, DollarSign, Layers, FileText, Globe, Zap, ExternalLink, Clock,
    ArrowLeft, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const SUPPORT_CATEGORIES = [
    {
        icon: Wallet,
        title: "Wallet & Connectivity",
        desc: "Learn how to connect your Web3 wallet and manage your digital identity.",
        links: ["Connecting MetaMask", "BNB Chain Setup", "Wallet Security Tips"],
        color: "#3b82f6"
    },
    {
        icon: ArrowRightLeft,
        title: "Trading & Swaps",
        desc: "Understanding zero-slippage trades and commodity-backed assets.",
        links: ["How Swaps Work", "Price Oracles", "Transaction Fees"],
        color: "#10b981"
    },
    {
        icon: TrendingUp,
        title: "Earn & Yield",
        desc: "Maximize your returns with Participation Pools and AUSD rewards.",
        links: ["Staking Guide", "Revenue Share Model", "Reward Distribution"],
        color: "#8b5cf6"
    },
    {
        icon: BookOpen,
        title: "Assets & Compliance",
        desc: "Details on physical backing, vaulting, and Sharia compliance.",
        links: ["Vault Locations", "Independent Audits", "Sharia Principles"],
        color: "#f59e0b"
    }
];

const FAQS = [
    {
        q: "What is ALTAI Exchange?",
        a: "ALTAI is a decentralized exchange platform that enables users to trade, participate, and manage precious metals on the blockchain. We provide a secure, transparent, and efficient way to access precious metals markets without traditional intermediaries.",
        category: "General"
    },
    {
        q: "How does participation work on ALTAI?",
        a: "Participation on ALTAI allows you to commit your tokenized precious metals to support the ecosystem and earn returns. You can participate with Gold, Silver, Platinum, or Palladium tokens for different durations, receiving returns based on platform revenue.",
        category: "Participation"
    },
    {
        q: "What metals can I trade?",
        a: "Currently, ALTAI supports trading of four major precious metals: Gold (Au), Silver (Ag), Platinum (Pt), and Palladium (Pd). Each metal is backed by physical reserves and can be traded 24/7 with real-time pricing from major exchanges.",
        category: "Trading"
    },
    {
        q: "What is AUSD and how is it used?",
        a: "AUSD is the native yield-bearing stablecoin of the Altai ecosystem. It serves as the primary liquidity bridge, allowing users to move seamlessly between physical metal tokens. When you hold AUSD, you maintain your purchasing power while staying ready to capitalize on market movements within the Altai vault.",
        category: "General"
    },
    {
        q: "How are Altai assets backed by real-world metals?",
        a: "Every metal token on Altai is 1:1 backed by physical inventory stored in secure, institutional-grade vaults in Dubai (DMCC) and London. We bridge the gap between physical ownership and digital liquidity, ensuring that each digital unit represents a verifiable, tangible asset held in professional custody.",
        category: "Security"
    },
    {
        q: "Which blockchain networks does Altai support?",
        a: "Altai is optimized for high performance and low latency. We primarily support BNB Chain, providing our users with ultra-low transaction costs and the massive liquidity of the world’s largest exchange ecosystem.",
        category: "Trading"
    }
];

function DocsContent({ activeSection, setActiveSection, searchQuery = "" }: { activeSection: string, setActiveSection: (s: string) => void, searchQuery?: string }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

    const handleCopy = (address: string) => {
        navigator.clipboard.writeText(address);
        setCopiedAddress(address);
        setTimeout(() => setCopiedAddress(null), 2000);
    };

    // Global Search Logic for Whitepaper
    const getSearchResults = () => {
        if (!searchQuery) return null;
        const results: any[] = [];
        const query = searchQuery.toLowerCase();

        Object.keys(DOCS_DATA).forEach(key => {
            const section = DOCS_DATA[key];
            let sectionMatches = false;

            // Check title and content
            if (section.title.toLowerCase().includes(query) || section.content.toLowerCase().includes(query)) {
                sectionMatches = true;
            }

            // Check sections and items
            section.sections?.forEach((s: any) => {
                const subHeadingMatch = s.heading?.toLowerCase().includes(query);
                const contentMatch = s.content?.toLowerCase().includes(query);

                const matchingItems = s.items?.filter((item: any) =>
                    item.title.toLowerCase().includes(query) ||
                    item.desc.toLowerCase().includes(query)
                );

                if (subHeadingMatch || contentMatch || (matchingItems && matchingItems.length > 0)) {
                    results.push({
                        sectionKey: key,
                        sectionTitle: section.title,
                        matchType: subHeadingMatch ? 'heading' : 'content',
                        items: matchingItems || []
                    });
                }
            });

            if (sectionMatches && !results.find(r => r.sectionKey === key)) {
                results.push({
                    sectionKey: key,
                    sectionTitle: section.title,
                    matchType: 'section',
                    items: []
                });
            }
        });

        return results;
    };

    const searchResults = getSearchResults();
    const currentData = DOCS_DATA[activeSection] || DOCS_DATA['Overview'];

    // Navigation Logic
    const flattenDocs = DOCS_STRUCTURE.reduce((acc: any[], group: any) => [...acc, ...group.items], []);
    const currentIndex = flattenDocs.indexOf(activeSection);
    const prevSection = currentIndex > 0 ? flattenDocs[currentIndex - 1] : null;
    const nextSection = currentIndex < flattenDocs.length - 1 ? flattenDocs[currentIndex + 1] : null;

    return (
        <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-280px)] lg:min-h-[700px] bg-white rounded-[32px] border border-slate-100 overflow-hidden relative shadow-sm">
            {/* Sidebar Toggle (Mobile) */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-slate-950 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all shadow-slate-900/40"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Sidebar Backdrop */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden fixed inset-0 bg-slate-950/20 z-40 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:relative inset-y-0 left-0 w-80 bg-[#fafbfc] border-r border-slate-100 z-50 transition-transform duration-300 lg:translate-x-0 overflow-y-auto no-scrollbar pt-6",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 space-y-10">
                    <div className="flex items-center justify-between lg:hidden">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Documentation</span>
                        <button onClick={() => setIsSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                    </div>

                    {DOCS_STRUCTURE.map((group: any, idx: number) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">{group.title}</h3>
                            <nav className="space-y-1">
                                {group.items.map((item: string) => (
                                    <button
                                        key={item}
                                        onClick={() => {
                                            setActiveSection(item);
                                            setIsSidebarOpen(false);
                                            // Optional: clear search on navigation
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all text-left uppercase tracking-wide",
                                            activeSection === item && !searchQuery
                                                ? "bg-white text-slate-950 shadow-sm border border-slate-100"
                                                : "text-slate-400 hover:text-slate-950 hover:bg-slate-50/50"
                                        )}
                                    >
                                        <div className={cn("w-1.5 h-1.5 rounded-full transition-all", activeSection === item && !searchQuery ? "bg-blue-600 scale-125" : "bg-transparent")} />
                                        {item}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar bg-white relative">
                {/* Mobile TOC Trigger */}
                <div className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 py-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Navigation</span>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex items-center gap-2 text-[11px] font-black text-slate-950 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100 active:scale-95 transition-all"
                    >
                        <Menu className="w-3.5 h-3.5" />
                        Table of Contents
                    </button>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-8 lg:px-16 lg:py-16">
                    <AnimatePresence mode="wait">
                        {searchQuery ? (
                            <motion.div
                                key="search-results"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-12"
                            >
                                <header className="space-y-4">
                                    <h2 className="text-3xl font-black text-slate-950 tracking-tight">Whitepaper Search Results</h2>
                                    <p className="text-slate-500 font-medium text-sm">Found {searchResults?.length || 0} relative sections for "{searchQuery}"</p>
                                </header>

                                <div className="space-y-8">
                                    {searchResults && searchResults.length > 0 ? (
                                        searchResults.map((result: any, idx: number) => (
                                            <div key={idx} className="p-8 bg-slate-50/50 border border-slate-100 rounded-[32px] space-y-6 hover:bg-white hover:border-slate-200 transition-all group">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-black text-slate-950 group-hover:text-blue-600 transition-colors">{result.sectionTitle}</h3>
                                                    <button
                                                        onClick={() => {
                                                            setActiveSection(result.sectionKey);
                                                            window.dispatchEvent(new CustomEvent('clear-search'));
                                                        }}
                                                        className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950 flex items-center gap-2"
                                                    >
                                                        Go to section <ChevronRight className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <div className="space-y-4">
                                                    {result.items?.map((item: any, i: number) => (
                                                        <div key={i} className="pl-4 border-l-2 border-slate-200">
                                                            <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 space-y-6">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                                <Search className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-slate-950">No documentation found</h3>
                                                <p className="text-slate-500 font-medium">Try searching for broader terms like "Gold", "Vault", or "Security"</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-12"
                            >
                                {/* Header Section */}
                                <header className="space-y-6">
                                    {currentData.badge && (
                                        <div className="w-fit flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em]">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                            {currentData.badge}
                                        </div>
                                    )}
                                    <div className="space-y-3">
                                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">{currentData.title}</h1>
                                        <p className="text-slate-500 font-medium max-w-2xl text-sm leading-relaxed">
                                            {currentData.content}
                                        </p>
                                    </div>
                                </header>

                                <div className="h-px bg-slate-100" />

                                {/* Sections Content */}
                                <div className="space-y-16">
                                    {currentData.sections && currentData.sections.map((section: any, idx: number) => (
                                        <section key={idx} className="space-y-8">
                                            {section.heading && (
                                                <h2 className="text-xl font-black text-slate-950 tracking-tight">{section.heading}</h2>
                                            )}
                                            {section.content && (
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                    {section.content}
                                                </p>
                                            )}

                                            {/* Discovery Style Vertical Stack */}
                                            <div className="flex flex-col gap-6">
                                                {section.items && section.items.map((item: any, i: number) => (
                                                    <div key={i} className="group relative bg-white border border-slate-100 rounded-[32px] p-10 flex flex-col gap-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-500 overflow-hidden">
                                                        <div className="flex flex-col h-full gap-8 relative z-10">
                                                            <div className="flex items-center gap-4 md:gap-6">
                                                                <div className="flex items-center justify-center transition-all duration-500 group-hover:scale-110 shrink-0">
                                                                    {item.icon || <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all"><Layers className="w-6 h-6 md:w-8 md:h-8" /></div>}
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <h4 className="text-lg md:text-[20px] font-black text-slate-950 tracking-tight leading-tight">{item.title}</h4>
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Specification</span>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4 flex-1">
                                                                <p className="text-sm md:text-[15px] text-slate-500 font-medium leading-relaxed max-w-3xl">{item.desc}</p>
                                                            </div>
                                                            {item.contract && (
                                                                <div
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCopy(item.contract);
                                                                    }}
                                                                    className="flex items-center justify-between px-5 py-4 bg-[#fafbfc] border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-slate-300 transition-all group/copy w-full md:w-fit md:min-w-[320px]"
                                                                >
                                                                    <div className="flex flex-col gap-1 min-w-0">
                                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contract Address</span>
                                                                        <code className="text-[13px] text-slate-950 font-mono truncate font-bold">{item.contract}</code>
                                                                    </div>
                                                                    <div className="ml-6">
                                                                        {copiedAddress === item.contract ? (
                                                                            <Check className="w-5 h-5 text-emerald-500" />
                                                                        ) : (
                                                                            <Copy className="w-5 h-5 text-slate-300 group-hover/copy:text-slate-950 transition-colors" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="absolute bottom-0 left-0 h-[4px] w-full bg-slate-950 transition-transform duration-700 origin-left scale-x-0 group-hover:scale-x-100" />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ))}
                                </div>

                                {/* CTA: Discover Assets */}
                                {activeSection === 'Tokenized Assets' && (
                                    <div className="mt-16 p-8 md:p-12 rounded-[32px] bg-slate-950 relative overflow-hidden group border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full group-hover:bg-blue-600/30 transition-all duration-1000" />
                                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/10 blur-[100px] rounded-full group-hover:bg-emerald-600/20 transition-all duration-1000" />

                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                                            <div className="space-y-4 max-w-xl">
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Markets</span>
                                                </div>
                                                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">Explore Real-Time Asset Data</h3>
                                                <p className="text-slate-400 font-medium text-sm md:text-[15px] leading-relaxed">
                                                    Dive into the live market board to view real-time prices, 24h volume, and performance metrics for all Altai tokenized assets.
                                                </p>
                                            </div>

                                            <Link
                                                href="/discover"
                                                className="shrink-0 w-full md:w-auto px-8 py-5 bg-white text-slate-950 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-3 group/btn hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                                            >
                                                Go to Discover
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* CTA: AUSD Detail */}
                                {activeSection === 'AUSD (Altai USD)' && (
                                    <div className="mt-16 p-8 md:p-12 rounded-[32px] bg-slate-950 relative overflow-hidden group border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full group-hover:bg-blue-600/30 transition-all duration-1000" />
                                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-600/10 blur-[100px] rounded-full group-hover:bg-sky-600/20 transition-all duration-1000" />

                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                                            <div className="space-y-4 max-w-xl">
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Stablecoin & Settlement</span>
                                                </div>
                                                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">View AUSD Market Data</h3>
                                                <p className="text-slate-400 font-medium text-sm md:text-[15px] leading-relaxed">
                                                    Analyze the stability, treasury backing, and 24h volume of the Altai USD (AUSD) settlement token.
                                                </p>
                                            </div>

                                            <Link
                                                href="/discover/AUSD"
                                                className="shrink-0 w-full md:w-auto px-8 py-5 bg-white text-slate-950 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-3 group/btn hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                                            >
                                                Open AUSD Details
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* CTA: Earn Pools */}
                                {activeSection === 'Participation Pools' && (
                                    <div className="mt-16 p-8 md:p-12 rounded-[32px] bg-slate-950 relative overflow-hidden group border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/20 blur-[120px] rounded-full group-hover:bg-emerald-600/30 transition-all duration-1000" />
                                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-600/10 blur-[100px] rounded-full group-hover:bg-teal-600/20 transition-all duration-1000" />

                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                                            <div className="space-y-4 max-w-xl">
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Yield Opportunities</span>
                                                </div>
                                                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">Start Earning Real Yield</h3>
                                                <p className="text-slate-400 font-medium text-sm md:text-[15px] leading-relaxed">
                                                    Deposit your tokenized assets into Participation Pools and earn a share of platform revenue distributed in AUSD.
                                                </p>
                                            </div>

                                            <Link
                                                href="/earn"
                                                className="shrink-0 w-full md:w-auto px-8 py-5 bg-white text-slate-950 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 group/btn hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                                            >
                                                Browse Pools
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* CTA: Trade General (Links to AXAU) */}
                                {activeSection === 'How to Trade' && (
                                    <div className="mt-16 p-8 md:p-12 rounded-[32px] bg-slate-950 relative overflow-hidden group border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full group-hover:bg-blue-600/30 transition-all duration-1000" />
                                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-1000" />

                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                                            <div className="space-y-4 max-w-xl">
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Trading</span>
                                                </div>
                                                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">Professional Trading Terminal</h3>
                                                <p className="text-slate-400 font-medium text-sm md:text-[15px] leading-relaxed">
                                                    Access institutional-grade tools, real-time charts, and deep liquidity. Experience seamless execution on our advanced decentralized exchange interface.
                                                </p>
                                            </div>

                                            <Link
                                                href="/trade/AXAUAUSD"
                                                className="shrink-0 w-full md:w-auto px-8 py-5 bg-white text-slate-950 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-3 group/btn hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                                            >
                                                Launch App
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Footer */}
                                <div className="flex items-center justify-between mt-20 pt-10 border-t border-slate-100">
                                    {prevSection ? (
                                        <button
                                            onClick={() => {
                                                setActiveSection(prevSection);
                                                // Small timeout to ensure DOM update before scroll
                                                setTimeout(() => {
                                                    const mainElement = document.querySelector('main');
                                                    if (mainElement) mainElement.scrollTo({ top: 0, behavior: 'smooth' });
                                                }, 10);
                                            }}
                                            className="group flex flex-col items-start gap-2 text-left"
                                        >
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 group-hover:text-slate-600 transition-colors">
                                                <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Previous
                                            </span>
                                            <span className="text-sm md:text-base font-black text-slate-950 group-hover:text-blue-600 transition-colors max-w-[150px] md:max-w-xs truncate">
                                                {prevSection}
                                            </span>
                                        </button>
                                    ) : <div />}

                                    {nextSection ? (
                                        <button
                                            onClick={() => {
                                                setActiveSection(nextSection);
                                                // Small timeout to ensure DOM update before scroll
                                                setTimeout(() => {
                                                    const mainElement = document.querySelector('main');
                                                    if (mainElement) mainElement.scrollTo({ top: 0, behavior: 'smooth' });
                                                }, 10);
                                            }}
                                            className="group flex flex-col items-end gap-2 text-right"
                                        >
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 group-hover:text-slate-600 transition-colors">
                                                Next <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                            </span>
                                            <span className="text-sm md:text-base font-black text-slate-950 group-hover:text-blue-600 transition-colors max-w-[150px] md:max-w-xs truncate">
                                                {nextSection}
                                            </span>
                                        </button>
                                    ) : <div />}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function GettingStartedSteps() {
    const steps = [
        {
            number: "01",
            title: "Connect Wallet",
            desc: "Link your Web3 wallet (MetaMask/Trust) on BNB Chain to access the platform.",
            icon: Wallet,
            color: "blue",
            link: { text: "Download Trust Wallet", href: "https://trustwallet.com/download" }
        },
        {
            number: "02",
            title: "Convert to AUSD",
            desc: "Swap your USDT into AUSD, our gold-backed settlement engine on BNB Chain for all trades.",
            icon: ArrowRightLeft,
            color: "emerald",
            link: { text: "Buy AUSD", href: "/trade/AUSDUSDT" }
        },
        {
            number: "03",
            title: "Purchase Assets",
            desc: "Start trading institutional-grade Gold, Silver, and energy commodities.",
            icon: Rocket,
            color: "amber",
            link: { text: "Go to Discover", href: "/discover" }
        }
    ];

    return (
        <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 lg:p-16 relative overflow-hidden group mb-12 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-50/50 blur-[100px] md:blur-[150px] rounded-full group-hover:bg-blue-100/50 transition-all duration-1000" />

            <div className="relative z-10 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">Execution Guide</span>
                            <div className="h-px w-8 bg-slate-200" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Onboarding flow</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-none">Fast-Track Your Journey</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="relative group/step">
                            <div className="flex flex-col gap-8 p-8 bg-slate-50/50 border border-slate-100 rounded-[32px] hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] hover:border-slate-200 transition-all duration-500 h-full">
                                <div className="flex items-center justify-between">
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-transform duration-500 group-hover/step:scale-110 shadow-lg",
                                        step.color === 'blue' ? "bg-blue-600 shadow-blue-200" : step.color === 'emerald' ? "bg-emerald-600 shadow-emerald-200" : "bg-amber-500 shadow-amber-200"
                                    )}>
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <span className="text-5xl font-black text-slate-200/50 tracking-tighter group-hover/step:text-slate-200 transition-colors uppercase italic">{step.number}</span>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-[20px] font-black text-slate-950 tracking-tight leading-none">{step.title}</h3>
                                    <p className="text-slate-500 text-[14px] font-medium leading-relaxed">{step.desc}</p>
                                </div>
                                {(step as any).link && (
                                    <div className="pt-2 mt-auto">
                                        <a
                                            href={(step as any).link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all"
                                        >
                                            {(step as any).link.text} <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                )}
                            </div>
                            {i < 2 && (
                                <div className="hidden md:flex absolute top-1/2 -right-4 translate-y-[-20%] z-20">
                                    <ChevronRight className="w-8 h-8 text-slate-200" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EarnMechanismSteps() {
    const steps = [
        {
            number: "01",
            title: "Vault Your Assets",
            desc: "Deposit your tokenized commodities (AXAU, AXAG, ABRN) into specialized Participation Pools.",
            icon: Layers,
            color: "blue",
            link: { text: "View Pools", href: "/earn" }
        },
        {
            number: "02",
            title: "Generate Liquidity",
            desc: "Your assets provide the institutional collateral that powers the platform's trading engine.",
            icon: Zap,
            color: "emerald"
        },
        {
            number: "03",
            title: "Earn Real Yield",
            desc: "Receive a direct share of global platform revenue, distributed daily in gold-backed AUSD.",
            icon: TrendingUp,
            color: "violet"
        }
    ];

    return (
        <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 lg:p-16 relative overflow-hidden group border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-violet-50/50 blur-[100px] md:blur-[150px] rounded-full group-hover:bg-violet-100/50 transition-all duration-1000" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-50/50 blur-[120px] rounded-full group-hover:bg-blue-100/50 transition-all duration-1000" />

            <div className="relative z-10 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">Protocol Revenue</span>
                            <div className="h-px w-8 bg-slate-200" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participation Model</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-none">Earn Real Yield</h2>
                        <p className="text-slate-500 font-medium text-sm max-w-xl leading-relaxed text-balance">Turn your idle physical assets into active revenue streams through Altai's institutional-grade Participation Pools.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="relative group/step">
                            <div className="flex flex-col gap-8 p-8 bg-slate-50/50 border border-slate-100 rounded-[32px] hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] hover:border-slate-200 transition-all duration-500 h-full">
                                <div className="flex items-center justify-between">
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-transform duration-500 group-hover/step:scale-110 shadow-lg",
                                        step.color === 'blue' ? "bg-blue-600 shadow-blue-200" : step.color === 'emerald' ? "bg-emerald-600 shadow-emerald-200" : "bg-violet-600 shadow-violet-200"
                                    )}>
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <span className="text-5xl font-black text-slate-200/50 tracking-tighter group-hover/step:text-slate-200 transition-colors uppercase italic">{step.number}</span>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-[20px] font-black text-slate-950 tracking-tight leading-none">{step.title}</h3>
                                    <p className="text-slate-500 text-[14px] font-medium leading-relaxed">{step.desc}</p>
                                </div>
                                {(step as any).link && (
                                    <div className="pt-2 mt-auto">
                                        <a
                                            href={(step as any).link.href}
                                            className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all"
                                        >
                                            {(step as any).link.text} <ChevronRight className="w-3 h-3" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Connection Arrow (Desktop) */}
                            {i < 2 && (
                                <div className="hidden md:flex absolute top-1/2 -right-4 translate-y-[-20%] z-20">
                                    <ChevronRight className="w-8 h-8 text-slate-200" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FAQAccordion({ searchQuery = "" }: { searchQuery?: string }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const [activeCategory, setActiveCategory] = useState<string>("All");

    const categories = ["All", ...Array.from(new Set(FAQS.map(f => f.category)))];

    const filteredFaqs = FAQS.filter(faq => {
        const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    if (filteredFaqs.length === 0 && searchQuery) return null;

    return (
        <div className="space-y-8">
            {/* Header & Categories */}
            <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">Support FAQ</span>
                            <div className="h-px w-8 bg-slate-200" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Common Inquiries</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-none">Frequently Asked Questions</h2>
                    </div>
                </div>

                {/* Category Tabs - Mobile Optimized */}
                {!searchQuery && (
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setActiveIndex(null);
                                }}
                                className={cn(
                                    "px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                    activeCategory === cat
                                        ? "bg-slate-950 text-white border-slate-950 shadow-lg shadow-slate-900/10"
                                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-600"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* FAQ List - Optimized for performance */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredFaqs.map((faq, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={faq.q}
                            className={cn(
                                "group rounded-[32px] border transition-all duration-300 overflow-hidden cursor-pointer bg-white",
                                activeIndex === i
                                    ? "border-blue-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)]"
                                    : "border-slate-100 hover:border-slate-200"
                            )}
                            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 md:gap-6">
                                        <div className={cn(
                                            "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-[14px] md:text-[16px] font-black transition-all duration-300 shrink-0",
                                            activeIndex === i
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                                        )}>
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <h4 className={cn(
                                            "text-[16px] md:text-[18px] font-black tracking-tight leading-tight transition-colors duration-300",
                                            activeIndex === i ? "text-slate-950" : "text-slate-500 group-hover:text-slate-950"
                                        )}>
                                            {faq.q}
                                        </h4>
                                    </div>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center transition-all duration-300 shrink-0",
                                        activeIndex === i ? "rotate-180 bg-blue-50 border-blue-100 text-blue-600" : "text-slate-300"
                                    )}>
                                        <ChevronRight className="w-4 h-4 rotate-90" />
                                    </div>
                                </div>

                                <AnimatePresence initial={false}>
                                    {activeIndex === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "circOut" }}
                                        >
                                            <div className="pt-6 mt-6 border-t border-slate-50">
                                                <p className="text-[14px] md:text-[15px] text-slate-500 font-medium leading-relaxed max-w-3xl">
                                                    {faq.a}
                                                </p>
                                                <div className="mt-6 flex items-center gap-2">
                                                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        Category: {faq.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

function SupportContent({ searchQuery = "" }: { searchQuery?: string }) {
    const hasFaqResults = FAQS.some(faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-24 pb-20">
            {/* Getting Started Premium Section */}
            {!searchQuery && <GettingStartedSteps />}

            {/* Earn Mechanism Premium Section */}
            {!searchQuery && <EarnMechanismSteps />}

            {/* Redesigned FAQ Section */}
            <FAQAccordion searchQuery={searchQuery} />

            {searchQuery && !hasFaqResults && (
                <div className="text-center py-20 space-y-6 bg-white rounded-[48px] border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-950">No results found</h3>
                        <p className="text-slate-500 font-medium">We couldn't find any help topics matching "{searchQuery}"</p>
                    </div>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('clear-search'))}
                        className="text-blue-600 font-black text-[11px] uppercase tracking-widest hover:underline"
                    >
                        Clear search and view all topics
                    </button>
                </div>
            )}

            {/* Contact Section */}
            <div className="bg-slate-950 rounded-[32px] md:rounded-[48px] p-8 md:p-20 text-center space-y-8 md:space-y-12 relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000" />
                <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full group-hover:bg-emerald-600/20 transition-all duration-1000" />

                <div className="space-y-4 md:space-y-6 relative z-10">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] md:text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Support Connectivity active</span>
                    </div>
                    <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-none">Global Support Line</h2>
                    <p className="text-slate-400 font-medium text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-balance">Our specialized support team and global community are here to help you scaling institutional commodity trading.</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 relative z-10 pt-4 px-4 sm:px-0">
                    <a
                        href="https://t.me/altaiexchange"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-[24px] font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-200 transition-all active:scale-[0.98] shadow-2xl shadow-indigo-500/10"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Community
                    </a>
                    <a
                        href="mailto:Support@altai.exchange"
                        className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white border border-white/5 rounded-[24px] font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition-all active:scale-[0.98]"
                    >
                        <Mail className="w-5 h-5" />
                        Direct Email Support
                    </a>
                </div>
            </div>
        </div>
    );
}

function PageMain() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'support' | 'docs'>('support');
    const [activeSection, setActiveSection] = useState('Overview');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleClearSearch = () => setSearchQuery("");
        window.addEventListener('clear-search', handleClearSearch);
        return () => window.removeEventListener('clear-search', handleClearSearch);
    }, []);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'docs') setActiveTab('docs');

        const section = searchParams.get('section');
        if (section && DOCS_DATA[section]) {
            setActiveSection(section);
            setActiveTab('docs');
        }

        const query = searchParams.get('q');
        if (query) {
            setSearchQuery(query);
            setActiveTab('support'); // Default to support tab when searching
        }
    }, [searchParams]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#fafbfc]">
            <main className="flex-1 overflow-y-auto no-scrollbar relative z-0">
                <div className="max-w-[1500px] mx-auto flex flex-col gap-10 md:gap-16 px-4 md:px-10 py-8 md:py-12">

                    {/* Hero Header - Matching Discover style */}
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 px-1">
                        <div className="flex flex-col gap-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="w-fit flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em]"
                            >
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                Knowledge Intelligence
                            </motion.div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-none">
                                {activeTab === 'support' ? "Help & Support" : "Project Whitepaper"}
                            </h1>
                            <p className="text-slate-500 font-medium max-w-lg text-sm leading-relaxed">
                                {activeTab === 'support'
                                    ? "Access our comprehensive support network and community-driven guides for the Altai ecosystem."
                                    : "Detailed technical specifications, economic models, and architectural blueprints of Altai Pro."
                                }
                            </p>
                        </div>

                        {/* Premium Tab Control - Matching Discover Categories style */}
                        <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-[24px] border border-slate-100 shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab('support')}
                                className={cn(
                                    "flex-1 md:flex-none px-5 md:px-7 py-3 rounded-[18px] text-[11px] font-black transition-all whitespace-nowrap uppercase tracking-widest",
                                    activeTab === 'support' ? "text-slate-950 bg-slate-50 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-900"
                                )}
                            >
                                Support Center
                            </button>
                            <button
                                onClick={() => setActiveTab('docs')}
                                className={cn(
                                    "flex-1 md:flex-none px-5 md:px-7 py-3 rounded-[18px] text-[11px] font-black transition-all whitespace-nowrap uppercase tracking-widest",
                                    activeTab === 'docs' ? "text-slate-950 bg-slate-50 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-900"
                                )}
                            >
                                Whitepaper
                            </button>
                        </div>
                    </div>

                    {/* Search & Tool Bar - Matching Discover style */}
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-6 -mt-4">
                        <div className="relative flex-1 w-full md:max-w-xl group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search documentation, guides, or help topics..."
                                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[24px] text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 placeholder:text-slate-300 transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hidden lg:flex">
                            <span className="flex items-center gap-1.5 text-slate-400">
                                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                24/7 Global Support Active
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'support' ? (
                            <SupportContent searchQuery={searchQuery} />
                        ) : (
                            <DocsContent
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                searchQuery={searchQuery}
                            />
                        )}
                    </motion.div>

                </div>
            </main>
        </div>
    );
}

export default function SupportPage() {
    return (
        <Suspense fallback={null}>
            <PageMain />
        </Suspense>
    );
}
