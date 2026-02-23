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
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '8e8e7c1c28f6eb6899b8b0e7d58f2378' // Örnek ID, lütfen kendi ID'nizle değiştirin

// 2. Create a metadata object
const metadata = {
    name: 'Altai Pro',
    description: 'Tokenized Commodities Exchange',
    url: 'https://altai.pro',
    icons: ['https://altai.pro/images/altai.svg']
}

// 3. Set the networks
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
    namespace JSX {
        interface IntrinsicElements {
            'appkit-button': any
        }
    }
}
