"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, DollarSign, Briefcase } from "lucide-react";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // CHANGED TO LOCALHOST
        const response = await fetch("http://localhost:5000/api/jobs");
        if (response.ok) {
          const data = await response.json();
          setJobs(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Find Your Dream Job</h1>
          <p className="text-lg text-gray-600">Explore thousands of opportunities from top companies</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
            placeholder="Search jobs (React, Node, etc...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Fetching jobs from database...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                      <div className="flex flex-wrap gap-4 mt-2 text-gray-500">
                        <span className="flex items-center gap-1"><Briefcase size={16} /> {job.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign size={16} /> {job.salary}</span>
                      </div>
                    </div>
                    <Link href={`/jobs/${job._id}`}>
                      <button className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
                        Apply Now
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg font-medium">No jobs found. Try a different search or check back later!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}