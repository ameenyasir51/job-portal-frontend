"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddJobPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // --- ROUTE PROTECTION SECURITY GUARD ---
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Job published successfully!", success: true });
        setFormData({ title: "", company: "", location: "", salary: "", description: "" });
        
        // Wait a brief moment so the user sees the success alert, then route back
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      } else {
        setMessage({ text: "Error saving job, success: false", success: false });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage({ text: "Error: Could not reach the backend server. Is it running?, success: false", success: false });
    } finally {
      setSubmitting(false);
    }
  };

  // Prevent layout flashing while security authorization is checking roles
  if (!isAuthorized) return null;

  return (
    <div className="max-w-3xl mx-auto p-10">
      <div className="flex justify-between items-center center font-semibold text-center hover:text-blue-600 transition-colors mb-8">
        <Link href="/admin/dashboard" className="text-blue-600 flex items-center gap-1 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Create New Job</h1>
        <p className="text-gray-500 text-sm mb-6">Fill in the details below to post a new position.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="e.g. MERN Stack Developer"
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Company Name</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={onChange}
                placeholder="e.g. Faircode Infotech"
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Location / Job Type</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onChange}
                placeholder="e.g. Kochi, Kerala"
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Salary Range</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={onChange}
              placeholder="e.g. ₹5,000 - ₹8,000"
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Describe the role and responsibilities..."
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium min-h-[150px]"
              required
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl text-center font-medium text-sm ${
                message.success
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all disabled:bg-gray-400 cursor-pointer"
          >
            {submitting ? "Publishing..." : "Publish Job"}
          </button>
        </form>
      </div>
    </div>
  );
}