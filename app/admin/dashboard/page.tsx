"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, UserCheck, Plus, ArrowRight, Trash2, Edit } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Analytics Metric States
  const [metrics, setMetrics] = useState({
    activeListings: 0,
    totalApplications: 0,
    shortlistedApplications: 0,
  });

  // Guard: Protect admin layout routing view
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Fetch Jobs & Analytics data from backend parallel streams
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Job Listings Array
        const jobsRes = await fetch("http://127.0.0.1:5000/api/jobs", { cache: "no-store" });
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);
        }

        // 2. Fetch Live Counting Analytics Metrics
        // To this updated version:
        const metricsRes = await fetch("http://127.0.0.1:5000/api/admin/analytics", { cache: "no-store" });
        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        }
      } catch (error) {
        console.error("Dashboard engine link data load failure:", error);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchDashboardData();
  }, [isAuthorized]);

  // Handle live job item deletion
  const handleJobDelete = async (jobId: string) => {
    if (confirm("Are you sure you want to permanently delete this job post position?")) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/jobs/${jobId}`, { method: "DELETE" });
        if (res.ok) {
          setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
          // Recalculate metrics counter minus one list index instantly
          setMetrics((prev) => ({ ...prev, activeListings: prev.activeListings - 1 }));
        }
      } catch (error) {
        console.error("Error running deletion process routing:", error);
      }
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Upper Welcome Header Section info content row */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage active listings and monitor incoming application metrics.</p>
        </div>
        <Link href="/admin/add-job">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 px-5 h-12 shadow-md">
            <Plus className="w-4 h-4" /> Post New Job
          </Button>
        </Link>
      </div>

      {/* --- DYNAMIC ADMIN ANALYTICS METRIC CARDS ROW SYSTEM --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1: Active Listings */}
        <Card className="p-6 rounded-3xl bg-white border border-gray-100 shadow-md flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Listings</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{metrics.activeListings}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
        </Card>

        {/* Card 2: Total Received Profiles Application index tracker */}
        <Link href="/admin/applications" className="block cursor-pointer group">
          <Card className="p-6 rounded-3xl bg-white border border-gray-100 shadow-md flex items-center justify-between hover:shadow-lg transition-all border-l-4 border-l-amber-400">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-amber-600 transition-colors">Total Applications</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-2 flex items-center gap-2">
                {metrics.totalApplications}
                <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-0.5 font-sans">
                  Review Profiles <ArrowRight className="w-3 h-3" />
                </span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
          </Card>
        </Link>

        {/* Card 3: Approved Pipeline Shortlisted Candidate metric item */}
        <Link href="/admin/applications" className="block cursor-pointer group">
          <Card className="p-6 rounded-3xl bg-white border border-gray-100 shadow-md flex items-center justify-between hover:shadow-lg transition-all border-l-4 border-l-green-400">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-green-600 transition-colors">Shortlisted Pipeline</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{metrics.shortlistedApplications}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 border border-green-100 flex items-center justify-center shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
          </Card>
        </Link>
      </div>

      {/* --- CORE BOTTOM JOB MANAGEMENT DATA ROW TABLE SECTION --- */}
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">📂 Active Corporate Positions</h2>
      
      {loadingJobs ? (
        <div className="text-center py-10 text-gray-400">Syncing database data grids...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-100 text-gray-400">
          No live positions found. Click "Post New Job" to begin.
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="p-5">Job Title</th>
                <th className="p-5">Company Name</th>
                <th className="p-5">Location Scope</th>
                <th className="p-5 text-right">Actions Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-5 font-semibold text-gray-900">{job.title}</td>
                  <td className="p-5 text-gray-500">{job.company}</td>
                  <td className="p-5"><span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-medium">{job.location}</span></td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/edit-job/${job._id}`}>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleJobDelete(job._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}