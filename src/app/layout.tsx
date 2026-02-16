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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} font-display antialiased`}>
        <div className="flex flex-col h-screen bg-[#f8fafc] text-slate-900 overflow-hidden">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
