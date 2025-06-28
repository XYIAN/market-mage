import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrimeReactProvider } from "primereact/api";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Market-Mage - AI-Powered Stock Dashboard",
  description: "A modern stock dashboard with AI-powered trading insights, real-time market data, and portfolio management tools.",
  keywords: "stock dashboard, trading insights, AI trading, portfolio management, market data",
  authors: [{ name: "Market-Mage Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Market-Mage - AI-Powered Stock Dashboard",
    description: "A modern stock dashboard with AI-powered trading insights",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrimeReactProvider>
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}
