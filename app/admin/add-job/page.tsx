"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default function AddJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: "", company: "", location: "", salary: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const actualToken = localStorage.getItem("token") || "mock-jwt-admin-token-string";
      
      // 🧠 FIXED: Dynamic API Environment Variable URL Connection
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${actualToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok || data.success) {
        setMessage({ text: "Job published successfully!", success: true });
        setTimeout(() => router.push("/admin/dashboard"), 1500);
      } else {
        setMessage({ text: data.message || "Error saving job vacancy profiles.", success: false });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Could not connect to backend networks.", success: false });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl mt-12">
      <Link href="/admin/dashboard" className="inline-flex items-center text-xs font-bold text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
      </Link>
      <h2 className="text-xl font-black text-gray-900 tracking-tight mb-6">Create New Job Listing</h2>

      {message && <div className={`p-3 rounded-xl text-xs font-bold mb-4 text-center ${message.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600">Job Title / Role</label>
          <input type="text" required placeholder="e.g., MERN Stack Developer" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600">Company Name</label>
          <input type="text" required placeholder="e.g., Faircode Infotech" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">Location</label>
            <input type="text" required placeholder="e.g., Kochi, Kerala" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">Salary Range</label>
            <input type="text" required placeholder="e.g., 4L - 7L" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600">Job Description</label>
          <textarea required rows={4} placeholder="Describe the core expectations..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        <button type="submit" disabled={submitting} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-100 cursor-pointer disabled:bg-gray-400">
          {submitting ? "Publishing..." : <><Send className="w-3.5 h-3.5" /> Publish Job Position</>}
        </button>
      </form>
    </div>
  );
}