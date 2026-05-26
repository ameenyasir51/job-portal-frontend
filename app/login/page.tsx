"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SeekerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🧠 FIXED: Linked dynamic backend environment endpoint template
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user?.role || "student");
        localStorage.setItem("userEmail", data.user?.email || email);
        
        window.dispatchEvent(new Event("authChange"));
        router.push("/");
      } else {
        setError(data.message || "Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login failure:", err);
      setError("Failed to connect with authentication servers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white border border-gray-100 shadow-xl rounded-3xl space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Sign In to Student Account</h2>
        <p className="text-gray-400 text-xs mt-1">Welcome back! Access your profile data pipeline hooks.</p>
      </div>

      {error && <div className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600">Email Address</label>
          <input type="email" required placeholder="raees@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600">Password</label>
          <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit" disabled={loading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-100 cursor-pointer disabled:bg-gray-400 mt-2">
          {loading ? "Logging in..." : "Sign In to Apply"}
        </button>
      </form>

      <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-50">
        New to the platform? <Link href="/register" className="text-blue-600 font-bold hover:underline">Create an Account</Link>
      </div>
    </div>
  );
}