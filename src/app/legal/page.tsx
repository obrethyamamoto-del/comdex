"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, FileText, Shield, Cookie, AlertTriangle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ═══════════════════════════════════════════════════
// LEGAL DOCUMENTS DATA (Example Texts)
// ═══════════════════════════════════════════════════
const LEGAL_DOCS: Record<string, { title: string; icon: any; content: React.ReactNode }> = {
    terms: {
        title: "Terms of Service",
        icon: FileText,
        content: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">1. Introduction</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Welcome to Altai Exchange. By accessing or using our website, services, or applications (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Services.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">2. Eligibility</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        You must be at least 18 years old and have the legal capacity to enter into these Terms. By using the Services, you represent and warrant that you meet these requirements. Access to the Services may be restricted in certain jurisdictions.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">3. Account Registration</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        To access certain features, you may be required to register an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">4. Tokenized Assets</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Altai Exchange facilitates the trading of tokenized real-world assets. You acknowledge that the value of these assets can fluctuate significantly. You agree that Altai Exchange is not responsible for any losses you may incur as a result of such fluctuations. All assets are backed 1:1 by physical reserves as stated in our transparency reports.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">5. User Conduct</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        You agree not to use the Services for any unlawful purpose or in any way that interrupts, damages, or impairs the service. Prohibited activities include, but are not limited to, money laundering, fraud, and distributing malware.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">6. Termination</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        We reserve the right to suspend or terminate your account and access to the Services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Services, us, or third parties, or for any other reason.
                    </p>
                </section>
            </div>
        )
    },
    privacy: {
        title: "Privacy Policy",
        icon: Shield,
        content: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">1. Data Collection</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, and wallet address. We also automatically collect certain information when you access our Services, such as your IP address and device information.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">2. Use of Information</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        We use the information we collect to operate, maintain, and improve our Services, to process your transactions, to communicate with you, and to detect and prevent fraud. We do not sell your personal information to third parties.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">3. Blockchain Data</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Please note that due to the inherent nature of the blockchain, transactions are public and permanent. Your wallet address and transaction history will be publicly available on the blockchain. We have no control over this public data.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">4. Data Security</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">5. Your Rights</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict the processing of your personal information. To exercise these rights, please contact our support team.
                    </p>
                </section>
            </div>
        )
    },
    cookies: {
        title: "Cookie Policy",
        icon: Cookie,
        content: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">1. What are Cookies?</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">2. How We Use Cookies</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        We use cookies to understand how you use our Services, to remember your preferences, and to improve your user experience. We may use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your device for a set period of time or until you delete them).
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">3. Types of Cookies We Use</h3>
                    <ul className="list-disc pl-5 text-slate-500 font-medium leading-relaxed space-y-2">
                        <li><strong>Essential Cookies:</strong> Necessary for the operation of the website (e.g., enabling you to log into secure areas).</li>
                        <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and see how visitors move around our website.</li>
                        <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our website and remember your preferences.</li>
                    </ul>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">4. Managing Cookies</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
                    </p>
                </section>
            </div>
        )
    },
    risk: {
        title: "Risk Disclosure",
        icon: AlertTriangle,
        content: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">1. General Trading Risks</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Trading in digital assets and tokenized commodities involves a high degree of risk and exists in a volatile market context. Values can fluctuate significantly over short periods of time. You should carefully consider your investment objectives, level of experience, and risk appetite before participating.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">2. Regulatory Risk</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        The regulatory status of digital assets and blockchain technology is evolving rapidly in many jurisdictions. Changes in laws or regulations may adversely affect the value or utility of the tokens available on Altai Exchange.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">3. Technology Risk</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Blockchain protocols and smart contracts are subject to the risk of software bugs, security vulnerabilities, and cyber-attacks. While we conduct rigorous security audits, we cannot guarantee the absolute security of the underlying technology.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-black text-slate-950 mb-4">4. No Financial Advice</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        The content provided on Altai Exchange is for informational purposes only and should not be construed as financial, investment, or legal advice. You should conduct your own due diligence and consult with a qualified financial advisor before making any investment decisions.
                    </p>
                </section>
            </div>
        )
    }
};

import { useSearchParams } from 'next/navigation';

function LegalContent() {
    const searchParams = useSearchParams();
    const initialDoc = searchParams.get('doc') || 'terms';
    const [activeDoc, setActiveDoc] = useState<string>(initialDoc);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const docParam = searchParams.get('doc');
        if (docParam && LEGAL_DOCS[docParam]) {
            setActiveDoc(docParam);
        } else if (!docParam) {
            setActiveDoc('terms'); // Default if no param is present
        }
    }, [searchParams]);

    const currentDoc = LEGAL_DOCS[activeDoc] || LEGAL_DOCS['terms'];

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#fafbfc]">
            <main className="flex-1 overflow-y-auto no-scrollbar relative z-0">
                <div className="max-w-[1500px] mx-auto px-4 md:px-10 py-8 md:py-12">

                    {/* Navigation Header */}
                    <div className="flex items-center justify-between mb-12">
                        <Link href="/" className="flex items-center gap-2 group transition-all">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:border-slate-200 shadow-sm transition-all group-active:scale-95">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Back to Home</span>
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">Legal Center</h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 pb-20">
                        {/* Sidebar */}
                        <aside className={cn(
                            "fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-100 p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-80 lg:bg-transparent lg:border-none lg:p-0 lg:block",
                            isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                        )}>
                            <div className="flex items-center justify-between lg:hidden mb-8">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Legal Menu</span>
                                <button onClick={() => setIsSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                            </div>

                            <nav className="space-y-4">
                                {Object.entries(LEGAL_DOCS).map(([key, doc]) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setActiveDoc(key);
                                            setIsSidebarOpen(false);
                                            // Update URL without reload if needed, or just set state
                                            const url = new URL(window.location.href);
                                            url.searchParams.set('doc', key);
                                            window.history.pushState({}, '', url);
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all border group",
                                            activeDoc === key
                                                ? "bg-white border-slate-200 shadow-[0_10px_20px_rgba(0,0,0,0.03)]"
                                                : "bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                            activeDoc === key ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-600"
                                        )}>
                                            <doc.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-[14px] font-black tracking-tight",
                                                activeDoc === key ? "text-slate-950" : "text-slate-500 group-hover:text-slate-900"
                                            )}>
                                                {doc.title}
                                            </span>
                                        </div>
                                        {activeDoc === key && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        {/* Mobile Sidebar Toggle */}
                        <div className="lg:hidden flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl mb-6">
                            <span className="text-sm font-bold text-slate-900">{currentDoc.title}</span>
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 bg-slate-50 rounded-lg text-slate-500"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Backdrop */}
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 lg:hidden"
                                />
                            )}
                        </AnimatePresence>


                        {/* Content Area */}
                        <main className="flex-1 min-w-0">
                            <div className="bg-white border border-slate-100 rounded-[32px] md:rounded-[48px] p-8 md:p-12 shadow-sm min-h-[600px] relative overflow-hidden">
                                {/* Decorative Blur */}
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50/50 rounded-full blur-[100px] pointer-events-none" />

                                <motion.div
                                    key={activeDoc}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative z-10 space-y-8"
                                >
                                    <header className="flex flex-col gap-4 border-b border-slate-100 pb-8">
                                        <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                            {React.createElement(currentDoc.icon, { className: "w-7 h-7" })}
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-none">
                                            {currentDoc.title}
                                        </h2>
                                        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em]">
                                            Last Updated: October 24, 2024
                                        </p>
                                    </header>

                                    <div className="max-w-3xl">
                                        {currentDoc.content}
                                    </div>

                                    <div className="pt-12 mt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <p className="text-slate-400 text-xs font-medium max-w-md">
                                            These documents are for informational purposes. Please consult with legal counsel for specific advice.
                                        </p>

                                    </div>
                                </motion.div>
                            </div>
                        </main>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function LegalPage() {
    return (
        <Suspense fallback={<div>Loading legal documents...</div>}>
            <LegalContent />
        </Suspense>
    );
}
