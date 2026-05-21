"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

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

    try {
      const response = await fetch("http://127.0.0.1:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userRole", "user");
        localStorage.setItem("userEmail", data.user.email);
        
        // Signal layout components to sync status
        window.dispatchEvent(new Event("authChange"));
        router.push("/"); // Standard seekers land back on home page
      } else {
        setErrorMsg(data.message || "Invalid candidate credentials.");
      }
    } catch (err) {
      setErrorMsg("Connection to server failed.");
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
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs text-center font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSeekerLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">Candidate Email</label>
            <input 
              type="email" 
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
      </div>
    </div>
  );
}