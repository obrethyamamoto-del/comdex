import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Altai Pro | Tokenized Commodities Exchange",
  description: "Trade real-world commodity-backed tokens on BNB Chain. Gold, silver, platinum, palladium, copper, and crude oil — each backed 1:1 by physical reserves.",
};

import Navbar from "@/components/Navbar";
import Web3Provider from "@/context/Web3Provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} font-display antialiased`}>
        <Web3Provider>
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: '16px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                fontFamily: 'var(--font-inter)',
                padding: '16px'
              },
            }}
          />
          <div className="flex flex-col h-screen bg-[#f8fafc] text-slate-900 overflow-hidden">
            <Navbar />
            {children}
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
