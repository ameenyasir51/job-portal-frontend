"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, BarChart3, Briefcase, FileText, CheckCircle, Trash2, Edit } from "lucide-react";

export default function AdminDashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({
    activeListings: 0,
    totalApplications: 0,
    shortlistedApplications: 0,
  });
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Structural route guard check validating administrative identity permissions
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      setIsAuthorized(false);
      window.location.href = "/admin-login"; // Kicks unauthenticated users to the hidden gateway
    } else {
      setIsAuthorized(true);
    }
  }, []);

  // Fetch Jobs & Analytics data from backend framework streams
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchDashboardData = async () => {
      try {
        // 🧠 FIXED: Correctly grab the actual validation token from localStorage
        const actualToken = localStorage.getItem("token") || "mock-jwt-admin-token-string";

        // 1. Fetch Job Listings Array
        const jobsRes = await fetch("http://localhost:5000/api/jobs", { cache: "no-store" });
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          // Safely extracts the array from data.jobs payload wrapper
          setJobs(jobsData.jobs || jobsData || []);
        }
        setLoadingJobs(false);

        // 2. FIXED FOR 500 ERROR: Pass clean authorization headers format structure to analytics endpoint
        const metricsRes = await fetch("http://localhost:5000/api/applications/analytics", { 
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${actualToken}`
          }
        });
        
        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        }
      } catch (error) {
        console.error("Dashboard engine link data load failure:", error);
        setLoadingJobs(false);
      }
    };

    fetchDashboardData();
  }, [isAuthorized]);

  // Handle live Job item deletion (FIXED FOR 401 ROUTE PROTECTION BLOCK)
  const handleDeleteJob = async (jobId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this job position?");
    if (!confirmDelete) return;

    try {
      const actualToken = localStorage.getItem("token") || "mock-jwt-admin-token-string";

      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${actualToken}`
        }
      });
      
      if (res.ok) {
        // Update local arrays state loops instantly upon success
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        setMetrics((prevMetrics: any) => ({
          ...prevMetrics,
          activeListings: Math.max(0, prevMetrics.activeListings - 1),
        }));
      }
    } catch (error) {
      console.error("Error running deletion process removing positions:", error);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="max-w-7xl mx-auto p-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" /> Admin Dashboard
          </h1>
          <p className="text-gray-400 text-xs font-medium mt-1">
            Overview metrics center tracking live post indicators and incoming applicant metrics data pipelines.
          </p>
        </div>

        <Link href="/admin/add-job" className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 h-11 px-5 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> Post New Job Position
        </Link>
      </div>

      {/* DYNAMIC ANALYTICS METRICS CARDS ROW ROW SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Active Openings Counter */}
        <div className="p-6 bg-white border border-gray-100 shadow-md rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Active Listings</p>
            <h3 className="text-3xl font-black text-gray-900">{metrics.activeListings}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 border border-blue-100/50 rounded-2xl flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Received Profiles Applications Index tracker */}
        <Link href="/admin/applications" className="p-6 bg-white border border-gray-100 shadow-md rounded-3xl flex items-center justify-between group hover:shadow-lg transition-shadow cursor-pointer">
          <div className="space-y-1">
            <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Total Applications</p>
            <h3 className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{metrics.totalApplications}</h3>
            <p className="text-[10px] text-blue-600 font-bold group-hover:underline flex items-center gap-0.5 pt-1">
              Review Profiles Portfolio &rarr;
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 border border-amber-100/50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
        </Link>

        {/* Card 3: Approved Pipeline Shortlisted candidate metric item */}
        <div className="p-6 bg-white border border-gray-100 shadow-md rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Shortlisted Candidates</p>
            <h3 className="text-3xl font-black text-gray-900">{metrics.shortlistedApplications}</h3>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 border border-green-100/50 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* CORE BOTTOM JOB MANAGEMENT DATA ROW TABLE SECTION */}
      <div className="pt-10 space-y-4">
        <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Active Corporate Positions ({jobs.length})</h2>

        {loadingJobs ? (
          <div className="text-center text-gray-400 py-12 font-medium">Syncing database data grids...</div>
        ) : jobs.length === 0 ? (
          <div className="border-2 border-dashed border-gray-100 bg-white p-12 text-center rounded-3xl text-gray-400 font-medium text-sm">
            No live positions found. Click button above to insert data records.
          </div>
        ) : (
          <div className="bg-white border border-gray-100/70 shadow-xl rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                    <th className="p-5 font-black">Job Title / Role</th>
                    <th className="p-5 font-black">Company Name / Hub</th>
                    <th className="p-5 font-black">Geographic Region</th>
                    <th className="p-5 font-black">Salary Bounds</th>
                    <th className="p-5 font-black text-center">Actions Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm text-gray-700 font-medium">
                  {jobs.map((job: any) => (
                    <tr key={job._id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="p-5 font-bold text-gray-900 text-sm">{job.title}</td>
                      <td className="p-5 text-gray-500 text-xs font-semibold">{job.company}</td>
                      <td className="p-5 text-gray-500 text-xs">{job.location}</td>
                      <td className="p-5 text-green-600 text-xs font-bold">{job.salary}</td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-3">
                          <Link href={`/admin/edit-job/${job._id}`} className="p-2 text-blue-600 bg-blue-50 border border-blue-100/30 rounded-xl hover:bg-blue-100/50 transition-colors cursor-pointer">
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => handleDeleteJob(job._id)} className="p-2 text-red-600 bg-red-50 border border-red-100/30 rounded-xl hover:bg-red-100/50 transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}