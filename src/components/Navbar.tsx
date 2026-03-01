"use client";

import { Search, Menu, X, Github, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { open } = useAppKit();
    const { isConnected, address } = useAppKitAccount();

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const query = encodeURIComponent(searchQuery);
            if (pathname.startsWith('/discover')) {
                router.push(`/discover?q=${query}`);
            } else {
                router.push(`/support?q=${query}`);
            }
            setIsMenuOpen(false);
            setSearchQuery("");
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Discover", href: "/discover" },
        { name: "Comdex Pro", href: "/pro" },
        { name: "Earn", href: "/earn" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Support", href: "/support" },
    ];

    return (
        <header className="h-[72px] bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 md:px-6 sticky top-0 z-50 transition-colors duration-300">
            {/* Logo */}
            <div className="flex items-center gap-2 mr-4 md:mr-12">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-11 md:h-11 bg-[#0052cc] rounded-[18px] flex items-center justify-center shadow-lg shadow-blue-900/20 border border-blue-700/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/comdex-logo.svg"
                            alt="Comdex Logo"
                            className="w-6 h-6 md:w-7 md:h-7 object-contain"
                        />
                    </div>
                    <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-[-0.03em] whitespace-nowrap uppercase">
                        COMDEX
                    </span>
                </Link>
            </div>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden lg:block flex-1 max-w-[480px] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    suppressHydrationWarning
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search support, assets or guide..."
                    className="w-full bg-[#f1f5f9] dark:bg-slate-900 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none placeholder:text-slate-400 text-slate-600 dark:text-slate-300 shadow-inner shadow-slate-200/50 dark:shadow-black/20"
                />
            </form>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-auto">
                {navLinks.map((link) => {
                    const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                    return (
                        <Link key={link.name} href={link.href}>
                            <button className={cn(
                                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                isActive ? "text-blue-600 bg-[#eff6ff] dark:bg-blue-900/30 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                            )}>
                                {link.name === "Comdex Pro" ? (
                                    <span className="flex items-center">
                                        Comdex
                                        <span className={cn(
                                            "ml-1.5 px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider relative -top-1 font-black transition-colors duration-300",
                                            isActive
                                                ? "bg-blue-500 text-white shadow-sm"
                                                : "bg-[#e2e8f0] dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                        )}>PRO</span>
                                    </span>
                                ) : (
                                    link.name
                                )}
                            </button>
                        </Link>
                    );
                })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto lg:ml-8">
                <ThemeToggle />
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="hidden md:flex items-center justify-center w-10 h-10 lg:hidden text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all"
                >
                    <Search className="w-5 h-5" />
                </button>

                <div className="hidden sm:block h-6 w-[1px] bg-slate-100 dark:bg-slate-800 mx-1"></div>

                <button
                    onClick={() => {
                        console.log("DEBUG: Navbar (Desktop) Connect Wallet clicked");
                        open();
                    }}
                    className="hidden sm:block px-5 md:px-6 py-2.5 bg-slate-950 dark:bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-lg shadow-black/5 active:scale-95 whitespace-nowrap"
                >
                    {isConnected ? formatAddress(address!) : "Connect Wallet"}
                </button>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all active:scale-90"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-[72px] inset-x-0 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 shadow-2xl p-4 flex flex-col gap-2 lg:hidden z-40 transition-colors"
                    >
                        <form onSubmit={handleSearch} className="relative mb-4">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                suppressHydrationWarning
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full bg-[#f1f5f9] dark:bg-slate-900 border-none rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none text-slate-600 dark:text-slate-300"
                            />
                        </form>
                        {navLinks.map((link) => {
                            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        "flex items-center px-4 py-3 rounded-xl text-sm font-black transition-all",
                                        isActive ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                                    )}
                                >
                                    {link.name === "Comdex Pro" ? (
                                        <span className="flex items-center">
                                            Comdex
                                            <span className={cn(
                                                "ml-1.5 px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider relative -top-1 font-black transition-colors duration-300",
                                                isActive
                                                    ? "bg-blue-500 text-white shadow-sm"
                                                    : "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                            )}>PRO</span>
                                        </span>
                                    ) : (
                                        link.name
                                    )}
                                </Link>
                            );
                        })}
                        <div className="pt-4 mt-2 border-t border-slate-50 dark:border-slate-800 flex flex-col gap-4">
                            <button
                                onClick={() => {
                                    console.log("DEBUG: Navbar (Mobile) Connect Wallet clicked");
                                    open();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full py-4 bg-slate-950 dark:bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-[0.98] transition-all"
                            >
                                {isConnected ? formatAddress(address!) : "Connect Wallet"}
                            </button>

                            <div className="flex items-center justify-center gap-3">
                                {[
                                    {
                                        name: "X", icon: (props: React.SVGProps<SVGSVGElement>) => (
                                            <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                            </svg>
                                        ), href: "https://x.com/comdexexchange"
                                    },
                                    { name: "Telegram", icon: Send, href: "https://t.me/comdexexchange" },
                                    {
                                        name: "Medium", icon: (props: React.SVGProps<SVGSVGElement>) => (
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
                                        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-300"
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
