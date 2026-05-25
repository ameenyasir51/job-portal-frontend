"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:5000/api/applications/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("adminEmail", data.user.email);
        localStorage.setItem("adminToken", data.token);
        
        // Let the Navbar and rest of app know an admin logged in
        window.dispatchEvent(new Event("authChange"));
        router.push("/admin/dashboard");
      } else {
        setErrorMsg(data.message || "Invalid Admin Credentials.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 🧠 CHANGED: Outer container background class flipped from 'bg-slate-900' to 'bg-white' */
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-white">
      
      {/* Dynamic Main Dark Login Box Container */}
      <div className="w-full max-w-md p-8 bg-slate-800 border border-slate-700 shadow-2xl rounded-3xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-red-400">🛡️ Admin Gateway</h1>
          <p className="text-slate-400 text-xs">Secure system infrastructure management console.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">System Admin Email</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 pointer-events-none" />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="System Admin Email" 
                className="w-full p-3 pl-11 border border-slate-700 rounded-xl text-sm bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Master Secret Key</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 pointer-events-none" />
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Master Secret Key" 
                className="w-full p-3 pl-11 border border-slate-700 rounded-xl text-sm bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer disabled:bg-slate-700 mt-2"
          >
            {loading ? "Verifying Token..." : "Authenticate Operations Hub"}
          </button>
        </form>
      </div>
    </div>
  );
}