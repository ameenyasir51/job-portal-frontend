"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tab control state: "All" | "Pending" | "Shortlisted" | "Rejected"
  const [activeTab, setActiveTab] = useState<string>("All");

  const fetchApplications = async () => {
    try {
      const storedToken = localStorage.getItem("adminToken");
      const authHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (storedToken) {
        authHeaders["Authorization"] = `Bearer ${storedToken}`;
      }

      const res = await fetch("http://localhost:5000/api/applications", {
        method: "GET",
        credentials: "include",
        headers: authHeaders,
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error reading application data arrays:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const storedToken = localStorage.getItem("adminToken");
      const authHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (storedToken) {
        authHeaders["Authorization"] = `Bearer ${storedToken}`;
      }

      const res = await fetch(`http://localhost:5000/api/applications/${appId}`, {
        method: "PATCH",
        credentials: "include",
        headers: authHeaders,
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update local state array dynamically
        setApplications((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
      }
    } catch (error) {
      console.error("Failed to update status schema:", error);
    }
  };

  // --- THE FILTER LOGIC FILTER ENGINE ---
  const filteredApplications = applications.filter((app) => {
    if (activeTab === "All") return true;
    return app.status === activeTab;
  });

  return (
    <div className="max-w-5xl mx-auto p-8">
      <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Job Applications</h1>
          <p className="text-gray-500 text-sm mt-1">Review profiles and manage candidate pipeline streams.</p>
        </div>
        <span className="bg-blue-50 text-blue-600 font-bold px-4 py-1.5 rounded-full text-xs border border-blue-100">
          Total: {filteredApplications.length}
        </span>
      </div>

      {/* --- FILTER INTERACTIVE TABS ROW --- */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit mb-8 border border-gray-200/40">
        {["All", "Pending", "Shortlisted", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- APPLICATIONS LAYOUT CONTAINER DISPLAY LIST --- */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading candidate pipelines...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-3xl text-gray-400">
          No applicants match the current filter state criteria ("{activeTab}").
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app._id} className="p-6 bg-white border border-gray-100 shadow-md rounded-3xl flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="space-y-3">
                {/* Header Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" /> {app.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">
                    Applied Position: {app.jobId?.title || "Unknown Position"} at {app.jobId?.company || "Corporate Group"}
                  </p>
                </div>

                {/* Candidate contact channels details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {app.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {app.phone}</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> 
                    {new Date(app.appliedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>

                {/* Document viewing anchor links attachment wrapper */}
                {app.resume && (
                  <a
                    href={`http://localhost:5000/${app.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all w-fit mt-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Attached Credentials Resume
                  </a>
                )}
              </div>

              {/* Status control layout drop system items actions */}
              <div className="flex flex-col items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  app.status === "Shortlisted" ? "bg-green-50 border-green-100 text-green-700" :
                  app.status === "Rejected" ? "bg-red-50 border-red-100 text-red-700" :
                  "bg-amber-50 border-amber-100 text-amber-700"
                }`}>
                  {app.status}
                </span>

                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    onClick={() => handleStatusChange(app._id, "Shortlisted")}
                    disabled={app.status === "Shortlisted"}
                    className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
                    title="Shortlist Candidate"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(app._id, "Pending")}
                    disabled={app.status === "Pending"}
                    className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
                    title="Mark as Pending"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(app._id, "Rejected")}
                    disabled={app.status === "Rejected"}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
                    title="Reject Profile"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}