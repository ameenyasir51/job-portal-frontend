"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SeekerRegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.includes("@") || !email.includes(".")) {
      setErrorMsg("Please enter a valid email address format (e.g., name@domain.com).");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // 🧠 FIXED: Linked dynamic backend environment endpoint template
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          email,
          phoneNumber,
          password,
          role: "student"
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Account created successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setErrorMsg(data.message || "Registration failed framework steps.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMsg("Connection error hitting identity authorization server pipeline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white border border-gray-100 shadow-xl rounded-3xl space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Create Student Profile</h2>
        <p className="text-gray-400 text-xs mt-1">Register to join the recruitment platform pipeline framework clusters.</p>
      </div>

      {errorMsg && <div className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{errorMsg}</div>}
      {successMsg && <div className="text-xs font-bold text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">{successMsg}</div>}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600">Full Name</label>
          <input type="text" required placeholder="Raees Rehman" value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600">Email Address</label>
          <input type="email" required placeholder="raees@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600">Phone Number</label>
          <input type="tel" required placeholder="9539963533" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600">Choose Password</label>
          <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit" disabled={loading} className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-md shadow-green-100 cursor-pointer disabled:bg-gray-400 mt-2">
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-50">
        Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
      </div>
    </div>
  );
}