"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, Phone, Briefcase, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  // Fetch all submitted student applications from database tracking arrays
  const fetchApplications = async () => {
    try {
      const storedToken = localStorage.getItem("token") || "mock-jwt-admin-token-string";
      const authHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${storedToken}`,
      };

      const res = await fetch("http://localhost:5000/api/applications", {
        method: "GET",
        headers: authHeaders,
      });

      if (res.ok) {
        const data = await res.json();
        // Fallback to safely catch nested application arrays if packed inside object
        setApplications(data.applications || data || []);
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

  // Modify individual profile registration status values (Shortlisted, Rejected, Pending)
  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const storedToken = localStorage.getItem("token") || "mock-jwt-admin-token-string";
      const authHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${storedToken}`,
      };

      const res = await fetch(`http://localhost:5000/api/applications/${appId}`, {
        method: "PATCH",
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
    return app.status?.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 transition text-sm flex items-center gap-1 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Job Applications</h1>
          <p className="text-gray-400 text-xs font-medium mt-1">
            Review profiles and manage candidate pipeline streams.
          </p>
        </div>
        <span className="bg-blue-50 text-blue-600 font-bold text-xs px-4 py-1.5 rounded-full border border-blue-100">
          Total: {filteredApplications.length}
        </span>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
        {["All", "Pending", "Shortlisted", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* APPLICATIONS LAYOUT CONTAINER DISPLAY LIST */}
      {loading ? (
        <div className="text-center text-gray-400 py-10 font-medium text-sm">Loading candidate pipelines...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="border-2 border-dashed border-gray-100 bg-white p-12 text-center rounded-3xl text-gray-400 font-medium text-sm">
          No applicants match the current filter state criteria (&quot;{activeTab}&quot;).
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div key={app._id} className="bg-white border border-gray-100 shadow-md rounded-3xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-lg transition-shadow">
              
              {/* Candidate Info */}
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {app.name || "Anonymous Candidate"}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    Applied Position: <span className="text-gray-700 font-bold">{app.jobId?.title || "Corporate Position"}</span>
                  </p>
                </div>

                {/* Contact channels details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" /> {app.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" /> {app.phone || "No phone provided"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "Recent"}
                  </div>
                </div>

                {/* Document viewing anchor attachments */}
                {app.resume && (
                  <div className="pt-2">
                    <a
                      href={`http://localhost:5000/uploads/${app.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 h-8 rounded-lg transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Attached Credentials Resume
                    </a>
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-row md:flex-col justify-between md:justify-center items-end gap-3 min-w-[140px] border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border ${
                  app.status === "shortlisted" 
                    ? "bg-green-50 text-green-700 border-green-100" 
                    : app.status === "rejected" 
                    ? "bg-red-50 text-red-700 border-red-100" 
                    : "bg-amber-50 text-amber-700 border-amber-100"
                }`}>
                  {app.status === "shortlisted" && <CheckCircle className="w-3 h-3" />}
                  {app.status === "rejected" && <XCircle className="w-3 h-3" />}
                  {app.status === "pending" && <Clock className="w-3 h-3" />}
                  {app.status || "pending"}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(app._id, "shortlisted")}
                    disabled={app.status === "shortlisted"}
                    className="p-2 text-green-600 bg-green-50 hover:bg-green-100 border border-green-100/30 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
                    title="Shortlist Candidate"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(app._id, "rejected")}
                    disabled={app.status === "rejected"}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100/30 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
                    title="Reject Profile"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}