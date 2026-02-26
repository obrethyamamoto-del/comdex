import React from 'react';

export interface DocsSectionItem {
    title: string;
    desc: string;
    icon?: React.ReactNode;
    contract?: string;
}

export interface DocsSection {
    heading?: string;
    content?: string;
    items?: DocsSectionItem[];
    layout?: string;
}

export interface DocsItem {
    title: string;
    type: string;
    content: string;
    sections?: DocsSection[];
    badge?: string;
}

export const DOCS_DATA: Record<string, DocsItem> = {
    'Overview': {
        title: 'Overview',
        type: 'rich',
        content: `Comdex is a next-generation Web3 commodities exchange that bridges traditional finance and blockchain technology. By tokenizing real-world assets like Gold, Silver, Platinum, and Oil, we enable decentralized trading that is fully asset-backed, transparent, and Sharia-compliant. Every transaction is tied to tangible commodities, ensuring real value — not speculation.`,
        sections: [
            {
                heading: 'Platform Pillars',
                items: [
                    {
                        title: 'Precious Metals',
                        desc: 'Gain exposure to Gold (Au), Silver (Ag), Platinum (Pt), and Palladium (Pd) with institutional-grade liquidity.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    },
                    {
                        title: 'Energy Commodities',
                        desc: 'Trade tokenized Brent Crude Oil (BRNc) with real-time pricing from global markets via Pyth Network.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10c0 4-3 6-5 8-2-2-5-4-5-8a5 5 0 0 1 1.5-3.5C9.5 5.5 11 5 12 2z"></path></svg>
                    },
                    {
                        title: 'Institutional Vaulting',
                        desc: 'Every unit is backed 1:1 by physical inventory stored in secure vaults in Dubai (DMCC) and London.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    },
                    {
                        title: 'Comdex USD (CUSD)',
                        desc: 'Gold-backed stablecoin serving as the primary settlement currency for all trades on the platform.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M9 12h6"></path></svg>
                    },
                    {
                        title: 'Participation Pools',
                        desc: 'Stake your assets and earn real-yield rewards from platform trading fees and revenue sharing.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    }
                ]
            }
        ],
        badge: 'Introduction'
    },

    'Tokenized Assets': {
        title: 'Tokenized Commodities',
        type: 'rich',
        content: 'All Comdex commodity tokens are fully backed by real-world positions and secured through real-time hedging mechanisms at the moment of purchase. Every digital asset traded on the Comdex Exchange maintains an intrinsic link to its physical counterpart.',
        sections: [
            {
                heading: 'Precious Metals',
                items: [
                    {
                        title: 'XAUc (Tokenized Gold)',
                        desc: 'XAUc is a tokenized version of gold on the Comdex platform. Each XAUc token represents 1 Gram of physical gold.',
                        contract: '0x544ff249Be54bEaba1a80b4716D576222d41236d',
                        icon: (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-sm transition-all duration-500 bg-[#FFD700]">
                                G
                            </div>
                        )
                    },
                    {
                        title: 'XAGc (Tokenized Silver)',
                        desc: 'XAGc is a tokenized version of silver on the Comdex platform. Each XAGc token represents 1 Gram of physical silver.',
                        contract: '0x1f22a92AdcD346B0a4EAB1672F51584f15487c91',
                        icon: (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-sm transition-all duration-500 bg-[#C0C0C0]">
                                S
                            </div>
                        )
                    },
                    {
                        title: 'XPTc (Tokenized Platinum)',
                        desc: 'XPTc is a tokenized version of platinum on the Comdex platform. Each XPTc token represents 1 Gram of physical platinum.',
                        contract: '0xf1E087d98928B99D02c2b72412608089688A979f',
                        icon: (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-sm transition-all duration-500 bg-[#4A7EBB]">
                                P
                            </div>
                        )
                    },
                    {
                        title: 'XPDc (Tokenized Palladium)',
                        desc: 'XPDc is a tokenized version of palladium on the Comdex platform. Each XPDc token represents 1 Gram of physical palladium.',
                        contract: '0x5270A13CeA56f15AcfA8A58378cc8a643DFfDbFa',
                        icon: (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-sm transition-all duration-500 bg-[#5D9B76]">
                                P
                            </div>
                        )
                    }
                ]
            },
            {
                heading: 'Energy',
                items: [
                    {
                        title: 'BRNc (Brent Crude Oil)',
                        desc: 'BRNc is a tokenized version of Brent crude oil on the Comdex platform. Each BRNc token represents 1 Barrel of physical Brent crude oil.',
                        contract: '0x2553c055F3502da728cE42B2956605a2f7520F2E',
                        icon: (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-sm transition-all duration-500 bg-[#216477]">
                                O
                            </div>
                        )
                    }
                ]
            }
        ],
        badge: 'Commodities'
    },

    'CUSD (Comdex USD)': {
        title: 'CUSD (Comdex USD)',
        type: 'rich',
        content: `CUSD functions as the primary settlement currency and the foundational liquidity engine of the Comdex protocol. Designed to bridge the gap between traditional finance and DeFi, it serves as the universal "Value Bridge" across the Comdex Exchange. All commodity trades involving physical-backed assets are conducted exclusively through CUSD to ensure maximum capital efficiency.`,
        sections: [
            {
                heading: 'CUSD Ecosystem Pillars',
                items: [
                    {
                        title: '1:1 Liquidity Gateway',
                        desc: 'CUSD is 1:1 convertible with major stablecoins including USDC, USDT, and USD1, providing an institutional-grade gateway for seamless entry and exit into commodity markets.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 21l-4-4 4-4M17 3l4 4-4 4M3 17h18M21 7H3"></path></svg>
                    },
                    {
                        title: 'Mint & Burn Equilibrium',
                        desc: 'CUSD is minted on commodity purchase and burned on redemption, maintaining perfect 1:1 backing and treasury balance through dynamic stability.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                    },
                    {
                        title: 'Revenue & Distribution Hub',
                        desc: 'All Participation Pool revenues are distributed exclusively in CUSD, ensuring a consistent and high-quality yield for ecosystem contributors.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8M8 12h8"></path></svg>
                    },
                    {
                        title: 'Zero-Slippage Trading',
                        desc: 'By serving as the primary pair, CUSD eliminates price friction and allows traders to move between various metal tokens with near-instant finality.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                    }
                ]
            },
            {
                heading: 'Vault & Treasury Control',
                items: [
                    {
                        title: 'CUSD (Tokenized Stable USD)',
                        desc: 'The official Comdex USD contract address on the Binance Smart Chain. Fully backed and convertible 1:1 with institutional stable assets.',
                        contract: '0x99EBb9BFa6AF26E483fD55F92715321EB4C93aa9',
                        icon: (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-sm transition-all duration-500 bg-[#8B5CF6]">
                                C
                            </div>
                        )
                    }
                ]
            }
        ],
        badge: 'Settlement'
    },

    'Participation Pools': {
        title: 'Participation Pools: Monetizing Assets & Revenue Sharing',
        type: 'rich',
        content: 'Comdex Participation Pools offer a sophisticated mechanism where users turn their physical metal holdings into active yield-bearing instruments. By depositing metal-backed assets into these pools, users provide the essential collateral that powers the ecosystem and participate in the protocol’s global success.',
        sections: [
            {
                heading: '1. Metal-to-Liquidity Mechanism',
                items: [
                    {
                        title: 'Asset Vaulting',
                        desc: 'Participants deposit metal tokens (XAUc, XAGc, etc.) directly into Participation Pools, unlocking the latent value of physical metals without requiring a sale.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    },
                    {
                        title: 'Collateral Rewards',
                        desc: 'In exchange for providing high-grade collateral, users are rewarded with CUSD, which can be used for further trading or as a liquid cash-out option.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8M9 12h6"></path></svg>
                    }
                ]
            },
            {
                heading: '2. Institutional Revenue Sharing',
                items: [
                    {
                        title: 'Transaction Fee Distribution',
                        desc: 'A significant percentage of every trade executed on the Comdex Exchange is redirected directly to Participation Pool contributors.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                    },
                    {
                        title: 'Premium Vaulting Yield',
                        desc: 'Revenue generated from storage fees and minting/redemption premiums is shared proportionally among metal depositors.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    },
                    {
                        title: 'Real Yield Performance',
                        desc: 'Participants receive shares in CUSD, creating a continuous stream of yield derived from actual market activity, not inflationary printing.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                    }
                ]
            },
            {
                heading: '3. Capital Efficiency (Double-Benefit)',
                layout: 'segments-grid',
                items: [
                    {
                        title: 'Physical Asset Exposure',
                        desc: 'Users maintain full exposure to the price appreciation of the physical metal (e.g., gold price increases) while it is vaulted.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    },
                    {
                        title: 'Active Revenue Stream',
                        desc: 'Earn a share of the protocol revenue Sharing in CUSD, maximizing the capital efficiency of your idle physical assets.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    }
                ]
            },
            {
                heading: 'Revenue Sources Powering the Participation Program',
                layout: 'grid',
                items: [
                    {
                        title: 'Trading & Swap Fees',
                        desc: 'A small percentage of every transaction on the Comdex Commodities Exchange is allocated to the participation pool.',
                        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"></path><path d="M8 21H3v-5"></path><path d="M21 3l-7.5 7.5"></path><path d="M10.5 13.5L3 21"></path></svg>
                    },
                    {
                        title: 'Treasury & Ecosystem Revenue',
                        desc: 'A portion of ecosystem-wide income, including platform fees, contributes to yield distribution.',
                        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18 17l-6-6-4 4-5-5"></path></svg>
                    },
                    {
                        title: 'Arbitrage & Market Operations',
                        desc: 'Real-time hedging and price-balancing mechanisms generate consistent profits by capturing market inefficiencies.',
                        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5M9 7l3-3 3 3M9 17l3 3 3-3M8 12H4M20 12h-4"></path></svg>
                    },
                    {
                        title: 'Institutional Services',
                        desc: 'Enterprise clients and liquidity partners accessing Comdex’s RWA infrastructure generate additional B2B income streams.',
                        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3"></path><path d="M19 21v-4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"></path></svg>
                    }
                ]
            }
        ],
        badge: 'Real Yield'
    },

    'How to Trade': {
        title: 'Step-by-Step Trading Guide',
        type: 'rich',
        content: 'Follow these simple steps to start trading institutional-grade commodities and energy tokens on the Comdex Exchange.',
        sections: [
            {
                heading: 'Platform Onboarding & Execution',
                items: [
                    {
                        title: '1. Connect Your Wallet',
                        desc: 'Begin by connecting a compatible Web3 wallet (such as MetaMask or Trust Wallet) to the Comdex platform. Ensure your network is set to BNB Chain to benefit from high-speed transactions and ultra-low gas fees.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1"></path><path d="M16 12h5"></path><circle cx="18" cy="12" r="2"></circle></svg>
                    },
                    {
                        title: '2. Prepare Your Liquidity',
                        desc: 'CUSD is the exclusive settlement currency. To begin trading, swap your existing stablecoins (USDT, USDC, or USD1) into CUSD directly through our integrated swap interface for a seamless transition.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 21l-4-4 4-4M17 3l4 4-4 4M3 17h18M21 7H3"></path></svg>
                    },
                    {
                        title: '3. Execute Commodity & Energy Trades',
                        desc: 'Navigate to the trade dashboard and select your target asset. Execute your swaps with institutional-grade precision, minimal slippage, and near-instant finality.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                    },
                    {
                        title: '4. Maximize Your Holdings',
                        desc: 'Move your tokenized commodities or energy assets into the Participation Pools. contribute to liquidity and unlock Real-Yield rewards paid out directly in CUSD.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8M9 12h6"></path></svg>
                    }
                ]
            }
        ],
        badge: 'Guide'
    },

    'Price Oracles': {
        title: 'High-Performance Triple-Oracle Architecture',
        type: 'rich',
        content: 'Price accuracy and manipulation resistance are the core pillars of Comdex’s institutional-grade trading ecosystem. Comdex utilizes a robust Triple-Oracle Architecture that cross-references global data with proprietary safety protocols.',
        sections: [
            {
                heading: 'The Triple-Feed Infrastructure',
                items: [
                    {
                        title: '1. Pyth Network',
                        desc: 'Institutional-grade, low-latency price feeds directly from top-tier financial institutions, ensuring precious metal and energy markets align with real-time global spot prices.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
                    },
                    {
                        title: '2. RedStone Oracle',
                        desc: 'High-frequency update model optimized for commodities, providing a secondary layer of price validation that remains resilient even during extreme market volatility.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    },
                    {
                        title: '3. Comdex Proprietary Oracle',
                        desc: 'An internal "Anti-Manipulation" filter that cross-references external feeds against internal liquidity parameters to block unfair execution attempts.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    }
                ]
            },
            {
                heading: 'Anti-Manipulation Guard',
                content: 'If a discrepancy is detected between the three data sources, advanced safety buffers protect traders from unfair execution. This triple-check system significantly reduces the risk of price manipulation during low liquidity or high volatility periods, ensuring that Comdex remains the most secure platform for hard asset trading.',
                layout: 'default'
            }
        ],
        badge: 'Technical'
    },

    'Vault & Compliance': {
        title: 'Compliance: Institutional Integrity & Ethical Finance',
        type: 'rich',
        content: 'Comdex operates with the highest standards of security and ethical finance, bridging institutional-grade custody with decentralized accessibility. Our model is built on the pillars of physical transparency and Shariah-compliant principles.',
        sections: [
            {
                heading: '1. Institutional-Grade Vaulting (Dubai/DMCC)',
                layout: 'segments-grid',
                items: [
                    {
                        title: '1:1 Physical Backing',
                        desc: 'Every asset tokenized on Comdex is backed 1:1 by physical inventory held in professional, insured vaults.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    },
                    {
                        title: ' Strategic Dubai Jurisdiction',
                        desc: 'Assets are stored in world-class vaults in Dubai (DMCC), the global epicenter of gold trade, ensuring top-tier security and legal clarity.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    }
                ]
            },
            {
                heading: '2. Shariah Compliance',
                layout: 'segments-grid',
                items: [
                    {
                        title: 'Tangibility',
                        desc: 'We do not deal in "paper" gold; every trade is rooted in actual vault-stored assets, ensuring genuine ownership.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    },
                    {
                        title: 'Profit & Risk Sharing (No Riba)',
                        desc: 'Our ecosystem eliminates interest-based mechanics. Participation Pools are governed by ethical profit and risk-sharing models.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    },
                    {
                        title: 'Anti-Speculative Model',
                        desc: 'By focusing strictly on 1:1 backing, we eliminate the speculative "Gharar" associated with synthetic or interest-based derivatives.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    }
                ]
            },
            {
                heading: '3. Ethical & Verified Transparency',
                layout: 'segments-grid',
                items: [
                    {
                        title: 'Regular Independent Audits',
                        desc: 'Continuous verification of vault inventory in Dubai ensures that on-chain supply always matches physical reserves.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    },
                    {
                        title: 'Triple-Check Integration',
                        desc: 'Proprietary monitoring through our Triple-Oracle architecture provides a constant bridge between physical vaults and the digital ledger.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                    }
                ]
            }
        ],
        badge: 'Compliance'
    },

    'Roadmap': {
        title: 'Strategic Roadmap 2025 - 2026',
        type: 'rich',
        content: 'A strategic timeline for Comdex\'s evolution into the leading decentralized commodity exchange, bridging physical vaults with institutional-grade blockchain infrastructure.',
        sections: [
            {
                heading: 'Q1 2025: Platform Genesis [Completed]',
                layout: 'segments-grid',
                items: [
                    {
                        title: 'Official Launch',
                        desc: 'Comdex Exchange goes live on BNB Chain with high-speed execution.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    },
                    {
                        title: 'Asset Deployment',
                        desc: 'Launch of XAUc (Gold) and XAGc (Silver) tokenized assets.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    },
                    {
                        title: 'Oracle & Settlement',
                        desc: 'Pyth Network integration and CUSD settlement engine activation.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    }
                ]
            },
            {
                heading: 'Q2 2025: Liquidity & Pools [Completed]',
                layout: 'segments-grid',
                items: [
                    {
                        title: 'Revenue Sharing',
                        desc: 'Launch of Participation Pools with CUSD reward distribution.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    },
                    {
                        title: 'Efficiency Engine',
                        desc: 'Optimization of "Mint & Burn" mechanism for zero-slippage trading.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    },
                    {
                        title: 'Asset Expansion',
                        desc: 'Introduction of XPDc (Palladium) and XPTc (Platinum) markets.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    }
                ]
            },
            {
                heading: 'Q3 2025: Sector Focus [Completed]',
                layout: 'segments-grid',
                items: [
                    {
                        title: 'Energy Expansion',
                        desc: 'Launch of Natural Gas and key energy commodity tokens.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    },
                    {
                        title: 'Stable Gateway',
                        desc: 'Seamless 1:1 swaps between CUSD and USDC, USDT, USD1.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    }
                ]
            },
            {
                heading: 'Q4 2025: Global Entry [Completed]',
                layout: 'segments-grid',
                items: [
                    {
                        title: 'Institutional Push',
                        desc: 'Regional marketing focusing on professional commodity traders.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    },
                    {
                        title: 'Global Interface',
                        desc: 'Full localization of the platform for global trading hubs.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    }
                ]
            },
            {
                heading: 'Q1 2026: Evolution & Compliance [Completed]',
                layout: 'segments-grid',
                items: [
                    {
                        title: 'Triple-Oracle Architecture',
                        desc: 'Full activation of Pyth + RedStone + Comdex Proprietary Guard. [On Progress]',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="3"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 12c0-4.4 3.6-8 8-8 3.3 0 6.2 2 7.4 5M22 12c0 4.4-3.6 8-8 8-3.3 0-6.2-2-7.4-5"></path></svg>
                    },
                    {
                        title: 'MENA Strategy',
                        desc: 'Official Shariah certification and regional partnership rollout. [On Progress]',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="3"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 12c0-4.4 3.6-8 8-8 3.3 0 6.2 2 7.4 5M22 12c0 4.4-3.6 8-8 8-3.3 0-6.2-2-7.4-5"></path></svg>
                    }
                ]
            },
            {
                heading: 'Q2 2026: Institutional Scale [Upcoming]',
                layout: 'segments-grid',
                items: [
                    {
                        title: 'Dubai/DMCC Links',
                        desc: 'Finalizing formal custody integrations with Dubai physical vaults.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    },
                    {
                        title: 'Commodity Index (ACI)',
                        desc: 'Launch of diversified basket tokens (Gold, Silver, and Oil).',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    }
                ]
            },
            {
                heading: 'Q3 2026: Enterprise Hub [Upcoming]',
                layout: 'segments-grid',
                items: [
                    {
                        title: 'Institutional API',
                        desc: 'Enterprise-grade tools for professional brokers and commodity firms.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    },
                    {
                        title: 'Liquidity Expansion',
                        desc: 'Scaling institutional market-making across global commodity pairs.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    }
                ]
            },
            {
                heading: 'Q4 2026 & Beyond: Global Expansion & Market Leadership [Upcoming]',
                layout: 'segments-grid',
                items: [
                    {
                        title: 'Mass-Market Marketing Campaign',
                        desc: 'Large-scale global offensive targeting institutional and high-net-worth investors across MENA, SEA, and Europe.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    },
                    {
                        title: 'Global Presence',
                        desc: 'Establishing "Comdex Nodes" in major financial hubs, expanding from Dubai to worldwide markets.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    },
                    {
                        title: 'RWA Ecosystem Dominance',
                        desc: 'Onboarding wider industrial and energy assets to become a top-3 global RWA platform.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    },
                    {
                        title: 'Secondary Market Liquidity',
                        desc: '24/7 global secondary market trading with institutional-grade stability.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    },
                    {
                        title: 'Global Shariah Compliance Certification',
                        desc: 'Finalizing comprehensive Shariah certification across the entire tokenized RWA ecosystem for global ethical standards.',
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M12 15l-2 5L9 9l11 4-5 2zm0 0l4 8"></path><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"></path></svg>
                    }
                ]
            }
        ],
        badge: 'Roadmap'
    }
};

export const DOCS_STRUCTURE = [
    {
        title: 'Documentation',
        items: ['Overview', 'Tokenized Assets', 'CUSD (Comdex USD)', 'Participation Pools', 'How to Trade', 'Price Oracles', 'Vault & Compliance', 'Roadmap']
    }
];
