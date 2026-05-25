"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SeekerRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Frontend structural validation check
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMsg("Please enter a valid email address format (e.g., name@domain.com).");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Account created successfully! Redirecting to login page...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setErrorMsg(data.message || "Registration failed.");
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
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create Candidate Account</h1>
          <p className="text-gray-400 text-xs">Join our platform to safely apply for open positions.</p>
        </div>

        {errorMsg && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs text-center font-medium">⚠️ {errorMsg}</div>}
        {successMsg && <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-xs text-center font-medium">✅ {successMsg}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">Email Address</label>
            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@gmail.com" className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">Choose Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" disabled={loading} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all disabled:bg-gray-400">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 font-medium pt-2">
          Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}