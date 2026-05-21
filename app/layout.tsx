import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "പണിപ്പുര | Job Portal",
  description: "Production ready MERN + Next.js recruitment infrastructure platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50/20 text-gray-900`}>
        {/* Global Navigation Header bar */}
        <Navbar />

        {/* Main core view page content pipeline rendering */}
        <main className="flex-grow">
          {children}
        </main>

        {/* --- GLOBAL FOOTER WITH ADMINISTRATIVE ACCESS HOOK --- */}
        <footer className="w-full bg-white border-t border-gray-100 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs font-semibold text-gray-400">
              © {new Date().getFullYear()} പണിപ്പുര. All rights reserved.
            </div>
            
            {/* Subtle administrative access portal link */}
            <Link 
              href="/admin-login" 
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors bg-gray-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-transparent hover:border-blue-100/40"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Administrative Portal
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}