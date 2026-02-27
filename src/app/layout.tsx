import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Comdex Pro | Tokenized Commodities Exchange",
  description: "Trade real-world commodity-backed tokens on BNB Chain. Gold, silver, platinum, palladium, copper, and crude oil — each backed 1:1 by physical reserves.",
};

import Navbar from "@/components/Navbar";
import Web3Provider from "@/context/Web3Provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-display antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Web3Provider>
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                style: {
                  borderRadius: '16px',
                  border: '1px solid var(--toast-border, #f1f5f9)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  fontFamily: 'var(--font-inter)',
                  padding: '16px',
                  background: 'var(--toast-bg, #fff)',
                  color: 'var(--toast-color, #0f172a)'
                },
              }}
            />
            <div className="flex flex-col h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden transition-colors duration-300">
              <Navbar />
              {children}
            </div>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
