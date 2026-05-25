"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SeekerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSeekerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // MENTOR SPECIFICATION: Frontend structural check to catch simple text blocks like '12345'
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMsg("Invalid email format syntax (e.g., username@gmail.com).");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userRole", "user");
        localStorage.setItem("userEmail", data.user.email);
        
        // Broadcast updates to synchronize Navbar triggers
        window.dispatchEvent(new Event("authChange"));
        router.push("/"); 
      } else {
        // Displays precise response error context messages ('Incorrect password', etc.)
        setErrorMsg(data.message || "Invalid authentication criteria.");
      }
    } catch (err) {
      console.error("Login route error:", err);
      setErrorMsg("Server processing failure. Check your backend status link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50/40">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Candidate Portal Login</h1>
          <p className="text-gray-400 text-xs">Sign in to find positions and manage your applications.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs text-center font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSeekerLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">Candidate Email</label>
            <input 
              type="text" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="user@gmail.com" 
              className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">Account Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Sign In to Apply"}
          </button>
        </form>

        {/* MENTOR SPECIFICATION: Direct pipeline navigation route shortcut accessing registration forms */}
        <div className="text-center text-xs text-gray-400 font-medium pt-4 border-t border-gray-100 mt-4">
          New to the platform? <Link href="/register" className="text-blue-600 font-bold hover:underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
}