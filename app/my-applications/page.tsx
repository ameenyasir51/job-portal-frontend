"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, Calendar, Building, CheckCircle, Clock, XCircle, FileText } from "lucide-react";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        const storedToken = localStorage.getItem("token") || "";
        const userEmail = localStorage.getItem("userEmail") || "";

        const res = await fetch("http://localhost:5000/api/applications", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${storedToken}`,
            "Content-Type": "application/json"
          },
        });

        if (res.ok) {
          const data = await res.json();
          const allApps = data.applications || data || [];
          
          // 🧠 FILTER: Only keep applications matching this logged-in candidate's email
          const filtered = allApps.filter((app: any) => app.email === userEmail);
          setApplications(filtered);
        }
      } catch (error) {
        console.error("Failed to load personal pipeline streams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserApplications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 transition text-sm flex items-center gap-1 hover:underline font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Open Positions
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Tracked Applications</h1>
          <p className="text-gray-400 text-xs font-medium mt-1">
            Monitor the recruitment pipeline status for your submitted roles.
          </p>
        </div>
        <span className="bg-blue-50 text-blue-600 font-bold text-xs px-4 py-1.5 rounded-full border border-blue-100">
          Applied Roles: {applications.length}
        </span>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12 font-medium text-sm">Loading your submissions track...</div>
      ) : applications.length === 0 ? (
        <div className="border-2 border-dashed border-gray-100 bg-white p-12 text-center rounded-3xl text-gray-400 font-medium text-sm">
          You haven&apos;t submitted any applications yet!
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white border border-gray-100 shadow-md rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition-shadow">
              
              <div className="space-y-2">
                <h3 className="text-base font-bold text-gray-900">
                  {app.jobId?.title || "Corporate Position"}
                </h3>
                <div className="flex flex-col gap-1 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-gray-400" /> {app.jobId?.company || "Tech Team"}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "Recent"}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50 justify-between">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
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

                {app.resume && (
                  <a
                    href={`http://localhost:5000/uploads/${app.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Sent Resume
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}