"use client";

import TetherLogo from "@/components/icons/TetherLogo";
import BnbLogo from "@/components/icons/BnbLogo";
import { COMDEX_MARK_SRC, ICON_SIZES } from "@/lib/constants";

interface AssetIconProps {
    symbol: string;
    avatar: string;
    color?: string;
    /** sm = stat items & rows, md = cards & pool cards, lg = detail header */
    size?: keyof typeof ICON_SIZES;
    className?: string;
}

/**
 * Single source of truth for rendering asset icons.
 * Every page that shows an asset icon should use this component
 * so that changing the logo, size, or radius in one place
 * propagates everywhere.
 */
export default function AssetIcon({ symbol, avatar, color, size = "md", className = "" }: AssetIconProps) {
    const s = ICON_SIZES[size];

    return (
        <div
            className={`${s.container} ${s.radius} flex items-center justify-center text-white shadow-sm shrink-0 relative ${className}`}
            style={{ backgroundColor: color || "#f1f5f9" }}
        >
            {symbol === "USDT" ? (
                <TetherLogo className={`${s.img}`} />
            ) : (
                <img
                    src={COMDEX_MARK_SRC}
                    className={`${s.img} object-contain`}
                    alt={symbol}
                />
            )}

            {/* Global Binance (BNB) Badge */}
            <div className="absolute -bottom-1 -right-1 w-[42%] h-[42%] bg-white rounded-full shadow-md z-10 flex items-center justify-center p-[2px] border border-white">
                <BnbLogo className="w-full h-full" />
            </div>
        </div>
    );
}
