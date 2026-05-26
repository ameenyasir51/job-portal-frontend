"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Plus, Briefcase, FileText, CheckCircle, Trash2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ activeListings: 0, totalApplications: 0, shortlistedApplications: 0 });
  const [loading, setLoading] = useState(true);
  const [errorLog, setErrorLog] = useState("");

  const fetchDashboardData = async () => {
    try {
      const actualToken = localStorage.getItem("token") || "mock-jwt-admin-token-string";

      const jobsRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`, { cache: "no-store" });
      const metricsRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/analytics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${actualToken}`
        },
        cache: "no-store"
      });

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        // 🧠 FIXED: Safely unwraps the nested data response if it is returned inside an object envelope
        setJobs(Array.isArray(jobsData) ? jobsData : jobsData.jobs || jobsData || []);
      }
      
      if (metricsRes.ok) {
        setMetrics(await metricsRes.json());
      }
    } catch (error) {
      console.error(error);
      setErrorLog("Dashboard metadata linkages encountered error states.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to permanently delete this job position?")) return;
    try {
      const actualToken = localStorage.getItem("token") || "mock-jwt-admin-token-string";
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${actualToken}` }
      });

      if (res.ok) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        fetchDashboardData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-400 text-sm font-medium">Loading administrative dashboard frames...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 font-sans">
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600" /> Admin Dashboard
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">Review operations summary matrices tracking portal indicators metrics.</p>
        </div>
        <Link href="/admin/add-job" className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1">
          <Plus className="w-4 h-4" /> Post New Job Position
        </Link>
      </div>

      {errorLog && <div className="p-3 text-xs font-bold bg-red-50 text-red-600 border border-red-100 rounded-xl">{errorLog}</div>}

      {/* Analytics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex justify-between items-center">
          <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Active Listings</p><h3 className="text-2xl font-black text-gray-900 mt-1">{metrics.activeListings}</h3></div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Briefcase className="w-5 h-5" /></div>
        </div>
        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex justify-between items-center">
          <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Applications</p><h3 className="text-2xl font-black text-gray-900 mt-1">{metrics.totalApplications}</h3></div>
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5" /></div>
        </div>
        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex justify-between items-center">
          <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Shortlisted Candidates</p><h3 className="text-2xl font-black text-gray-900 mt-1">{metrics.shortlistedApplications}</h3></div>
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><CheckCircle className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Core Table Job Postings List */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/40"><h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">Active Corporate Postings Table ({jobs.length})</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/20 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Company / Hub</th>
                <th className="p-4">Job Title / Vacancy</th>
                <th className="p-4">Location</th>
                <th className="p-4">Salary Budget</th>
                <th className="p-4 text-center pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold text-gray-600 divide-y divide-gray-100">
              {/* 🧠 FIXED: Added defensive checks guaranteeing .map only runs when 'jobs' is a verified array layout */}
              {Array.isArray(jobs) && jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 pl-6 text-gray-900">{job.company}</td>
                  <td className="p-4 font-extrabold text-blue-600">{job.title}</td>
                  <td className="p-4 text-gray-500">{job.location}</td>
                  <td className="p-4 text-gray-800">{job.salary}</td>
                  <td className="p-4 text-center pr-6">
                    <button onClick={() => handleDeleteJob(job._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}