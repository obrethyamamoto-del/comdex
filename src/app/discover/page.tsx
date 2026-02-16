"use client";

import { Search, LayoutGrid, List, ChevronDown, Clock } from "lucide-react";
import DiscoverTicker from "@/components/discover/DiscoverTicker";
import StatSection from "@/components/discover/StatSection";
import AssetCard from "@/components/discover/AssetCard";
import AssetRow from "@/components/discover/AssetRow";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { ASSETS } from "@/lib/assets";
import { TABLE_HEADER_CLASS } from "@/lib/constants";

const TOP_GAINERS = [
    { icon: "C", name: "Altai Copper", symbol: "AXCU", value: "$8.45", subValue: "+1.15%", isPositive: true, color: "#d35400" },
    { icon: "P", name: "Altai Palladium", symbol: "AXPD", value: "$950.25", subValue: "+1.20%", isPositive: true, color: "#5D9B76" },
    { icon: "G", name: "Altai Gold", symbol: "AXAU", value: "$2,045.80", subValue: "+0.45%", isPositive: true, color: "#FFD700" },
];

const TRENDING = [
    { icon: "G", name: "Altai Gold", symbol: "AXAU", value: "$2,045.80", subValue: "+0.64%", isPositive: true, color: "#FFD700" },
    { icon: "O", name: "Altai Brent Oil", symbol: "ABRN", value: "$78.45", subValue: "-0.85%", isPositive: false, color: "#216477" },
    { icon: "A", name: "Altai USD", symbol: "AUSD", value: "$1.00", subValue: "+0.00%", isPositive: true, color: "#8B5CF6" },
];

const NEWLY_ADDED = [
    { icon: "S", name: "Altai Silver", symbol: "AXAG", value: "$23.45", subValue: "Metal", color: "#C0C0C0" },
    { icon: "P", name: "Altai Platinum", symbol: "AXPT", value: "$915.20", subValue: "Metal", color: "#4A7EBB" },
    { icon: "C", name: "Altai Copper", symbol: "AXCU", value: "$8.45", subValue: "Metal", color: "#d35400" },
];

const CATEGORIES = ["All assets", "Metal", "Commodity", "Stable"];

function DiscoverContent() {
    const searchParams = useSearchParams();
    const [activeCategory, setActiveCategory] = useState("All assets");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
    const [activeSort, setActiveSort] = useState("Most Popular");
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    const filteredAssets = ASSETS.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All assets" || a.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort the filtered assets based on activeSort
    const sortedAssets = [...filteredAssets].sort((a, b) => {
        switch (activeSort) {
            case "Price: High to Low":
                return parseFloat(b.price.replace(/,/g, '')) - parseFloat(a.price.replace(/,/g, ''));
            case "Price: Low to High":
                return parseFloat(a.price.replace(/,/g, '')) - parseFloat(b.price.replace(/,/g, ''));
            case "Top Gainer":
                return parseFloat(b.changePercent) - parseFloat(a.changePercent);
            case "Top Loser":
                return parseFloat(a.changePercent) - parseFloat(b.changePercent);
            case "Most Popular":
                return parseFloat(b.volume.replace(/,/g, '')) - parseFloat(a.volume.replace(/,/g, ''));
            case "Least Popular":
                return parseFloat(a.volume.replace(/,/g, '')) - parseFloat(b.volume.replace(/,/g, ''));
            default:
                return 0;
        }
    });

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#fafbfc]">
            <DiscoverTicker />

            <main className="flex-1 overflow-y-auto no-scrollbar relative z-0">
                <div className="max-w-[1500px] mx-auto flex flex-col gap-10 md:gap-16 px-4 md:px-10 py-8 md:py-12">

                    {/* Hero Section */}
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 px-1">
                        <div className="flex flex-col gap-3">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="w-fit flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em]"
                            >
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                Market Intelligence
                            </motion.div>
                            <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-none">Discover Opportunities</h1>
                            <p className="text-slate-500 font-medium max-w-lg text-sm leading-relaxed">
                                Stay ahead of the curve with real-time analytics, trending assets, and premium market insights.
                            </p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <StatSection title="Top Gainers" items={TOP_GAINERS} />
                        <StatSection title="Trending Now" items={TRENDING} />
                        <div className="md:col-span-2 lg:col-span-1">
                            <StatSection title="Newly Added" items={NEWLY_ADDED} />
                        </div>
                    </div>

                    {/* Explorer Bar */}
                    <div className="flex flex-col gap-10">
                        <div className="sticky top-0 z-40 bg-[#fafbfc] py-6 -mx-1 px-1 border-b border-slate-100 flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-black text-slate-950 tracking-tight">Market Explorer</h2>
                                    <div className="h-4 w-[1px] bg-slate-200 hidden xs:block" />
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5 text-slate-400">
                                            <Clock className="w-3.5 h-3.5 text-orange-400" />
                                            Market Closed
                                        </span>
                                        <span className="text-slate-300 font-bold ml-1 hidden sm:inline-block">(08:05 PM ET)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
                                <div className="flex flex-col md:flex-row items-center gap-4 flex-1 w-full">
                                    <div className="relative flex-1 w-full md:max-w-xl group">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Fast search for assets, sectors or people..."
                                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[24px] text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 placeholder:text-slate-300 transition-all shadow-sm"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-[24px] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar w-full md:w-auto">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveCategory(cat)}
                                                className={`px-5 py-2.5 rounded-[18px] text-[11px] font-black transition-all whitespace-nowrap uppercase tracking-widest ${activeCategory === cat
                                                    ? "text-slate-950 bg-slate-50 shadow-sm border border-slate-100"
                                                    : "text-slate-400 hover:text-slate-900"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between md:justify-end relative">
                                    <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="relative flex-1 md:flex-none">
                                        <button
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                            className="flex items-center gap-6 px-6 py-4 bg-white border border-slate-100 rounded-[22px] text-[11px] font-black text-slate-950 shadow-sm hover:hover:shadow-md transition-all uppercase tracking-widest w-full md:min-w-[220px] justify-between group/btn"
                                        >
                                            <span>{activeSort}</span>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        <AnimatePresence>
                                            {isSortOpen && (
                                                <>
                                                    {/* Overlay to close on click outside */}
                                                    <div
                                                        className="fixed inset-0 z-40"
                                                        onClick={() => setIsSortOpen(false)}
                                                    />
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                        className="absolute right-0 top-full mt-2 w-full bg-white border border-slate-100 rounded-[24px] shadow-2xl py-3 z-50 text-left"
                                                    >
                                                        {[
                                                            "Most Popular",
                                                            "Least Popular",
                                                            "Top Gainer",
                                                            "Top Loser",
                                                            "Newest",
                                                            "Oldest",
                                                            "Price: High to Low",
                                                            "Price: Low to High"
                                                        ].map((option) => (
                                                            <button
                                                                key={option}
                                                                onClick={() => {
                                                                    setActiveSort(option);
                                                                    setIsSortOpen(false);
                                                                }}
                                                                className={`w-full text-left px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${activeSort === option
                                                                    ? "text-slate-950"
                                                                    : "text-slate-400 hover:text-slate-950"
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
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <AnimatePresence mode="wait">
                            {viewMode === "grid" ? (
                                <motion.div
                                    key="grid"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-32"
                                >
                                    {sortedAssets.map((asset) => (
                                        <AssetCard key={asset.symbol} {...asset} />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white rounded-[32px] border border-slate-100 shadow-sm mb-32 overflow-hidden"
                                >
                                    <div className="overflow-x-auto no-scrollbar">
                                        <table className="w-full text-left border-collapse min-w-[1000px]">
                                            <thead className="bg-[#fafbfc] border-b border-slate-100">
                                                <tr>
                                                    <th className={`${TABLE_HEADER_CLASS} w-16 text-center`}>#</th>
                                                    <th className={`${TABLE_HEADER_CLASS} min-w-[200px]`}>Asset Name</th>
                                                    <th className={TABLE_HEADER_CLASS}>Price</th>
                                                    <th className={TABLE_HEADER_CLASS}>Categories</th>
                                                    <th className={TABLE_HEADER_CLASS}>Performance</th>
                                                    <th className={`${TABLE_HEADER_CLASS} text-right`}>Volume</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {sortedAssets.map((asset, idx) => (
                                                    <AssetRow key={asset.symbol} index={idx} {...asset} />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function DiscoverPage() {
    return (
        <Suspense fallback={null}>
            <DiscoverContent />
        </Suspense>
    );
}
