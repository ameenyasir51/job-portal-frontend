"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, LayoutDashboard, Briefcase } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  // Synchronize state dynamically across components from localStorage parameters
  const syncAuthStatus = () => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
  };

  useEffect(() => {
    // 1. Initial configuration mapping pass execution on component initialization
    syncAuthStatus();

    // 2. Continuous observation loop binding targeting custom global authentication triggers
    window.addEventListener("authChange", syncAuthStatus);

    return () => {
      window.removeEventListener("authChange", syncAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("userEmail");

    // Inform all components to sync their UI layouts instantly
    window.dispatchEvent(new Event("authChange"));

    // Kick back to the public homepage gateway
    router.push("/");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
      {/* Brand Branding Core Link Anchor */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-100">
          പ
        </div>
        <span className="text-xl font-black text-gray-900 tracking-tight font-sans">
          പണിപ്പുര
        </span>
      </Link>

      {/* Dynamic Link & Action Controls Section */}
      <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <Link href="/" className="hover:text-gray-900 transition-colors">Find Jobs</Link>

        {/* Conditional Layout Injection targeting only authenticated Admin Sessions */}
        {role === "admin" && (
          <>
            <Link href="/admin/dashboard" className="text-blue-600 flex items-center gap-1.5 hover:underline">
              <LayoutDashboard className="w-4 h-4" /> Admin Panel
            </Link>
            <Link href="/admin/add-job" className="hover:text-gray-900 transition-colors flex items-center gap-1">
              Post a Job
            </Link>
          </>
        )}

        {/* Dynamic Auth Button Flow Render Engine Wrapper */}
        {role ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold cursor-pointer bg-red-50 hover:bg-red-100/70 px-4 py-2 rounded-xl transition-all border border-red-100/40 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        ) : (
          <Link href="/login">
            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg shadow-blue-100 text-xs cursor-pointer">
              <LogIn className="w-3.5 h-3.5" /> Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}