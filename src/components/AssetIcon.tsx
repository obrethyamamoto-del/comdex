"use client";

import TetherLogo from "@/components/icons/TetherLogo";
import { ALTAI_MARK_SRC, ICON_SIZES } from "@/lib/constants";

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
            className={`${s.container} ${s.radius} flex items-center justify-center text-white shadow-sm shrink-0 ${className}`}
            style={{ backgroundColor: color || "#f1f5f9" }}
        >
            {symbol === "USDT" ? (
                <TetherLogo className={`${s.img}`} />
            ) : (
                <img
                    src={ALTAI_MARK_SRC}
                    className={`${s.img} object-contain`}
                    alt={symbol}
                />
            )}
        </div>
    );
}
