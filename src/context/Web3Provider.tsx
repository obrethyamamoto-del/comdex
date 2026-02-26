'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { bsc, mainnet } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'

// 1. Get projectId from https://cloud.reown.com
// Buraya kendi Project ID'nizi eklemelisiniz. 
// Şimdilik boş bırakıyorum veya env üzerinden alacak şekilde ayarlıyorum.
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'b56e18d47c72ab683b10817fe9485c60'

if (typeof window !== 'undefined') {
    if (!projectId) {
        console.warn("DEBUG: NEXT_PUBLIC_PROJECT_ID is missing!");
    } else {
        console.log("DEBUG: AppKit initializing with Project ID (first 4):", projectId.slice(0, 4));
    }
}


// 2. Create a metadata object
const metadata = {
    name: 'Comdex Pro',
    description: 'Tokenized Commodities Exchange',
    url: 'https://comdex.pro',
    icons: ['https://comdex.pro/images/comdex-logo.svg']
}

// 3. Set the networks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const networks = [mainnet, bsc] as [any, ...any[]]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true
})

// 5. Create modal
createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: {
        analytics: true
    },
    themeMode: 'light',
    themeVariables: {
        '--w3m-accent': '#000000',
        '--w3m-border-radius-master': '1px'
    }
})

const queryClient = new QueryClient()

export default function Web3Provider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            'appkit-button': any
        }
    }
}
