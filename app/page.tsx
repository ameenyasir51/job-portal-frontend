"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, DollarSign, Search } from "lucide-react";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  
  // Pagination State Trackers
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Pass both search queries and current page to the backend
      const res = await fetch(
        `http://localhost:5000/api/jobs?title=${searchTitle}&location=${searchLocation}&page=${currentPage}&limit=9`
      );
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to collect open entries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 whenever user types a new search query
  const handleSearchChange = (type: "title" | "location", value: string) => {
    setCurrentPage(1);
    if (type === "title") setSearchTitle(value);
    if (type === "location") setSearchLocation(value);
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTitle, searchLocation]);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      
      {/* BRAND HEADING SECTION */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Find Your Dream Technical Role
        </h1>
        <p className="text-gray-400 text-sm font-medium">
          Explore open career openings across production frameworks and verified teams.
        </p>
      </div>

      {/* INTERACTIVE SEARCH FILTER BAR */}
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-xl rounded-3xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => handleSearchChange("title", e.target.value)}
            placeholder="Search job title, keywords, skills..."
            className="w-full pl-11 p-3 text-sm font-medium bg-gray-50/10 rounded-2xl border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative flex items-center w-full">
          <MapPin className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => handleSearchChange("location", e.target.value)}
            placeholder="Filter by city, region, or 'Remote'..."
            className="w-full pl-11 p-3 text-sm font-medium bg-gray-50/10 rounded-2xl border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* JOBS LISTINGS DISPLAY GRID */}
      {loading ? (
        <div className="text-center text-gray-400 font-medium py-16">Loading positions...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-gray-400 font-medium py-16">No open positions matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job: any) => (
            <div key={job._id} className="p-6 bg-white border border-gray-100/70 shadow-lg rounded-3xl flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50">
                    🚀 Active Opening
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-lg mt-3 tracking-tight">{job.title}</h3>
                  <p className="text-xs font-semibold text-gray-400 mt-0.5">{job.company}</p>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 pt-2 border-t border-gray-50">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-gray-400" /> {job.salary}</span>
                </div>
              </div>
              
              <Link href={`/jobs/${job._id}`} className="mt-6 w-full text-center p-3 bg-gray-950 text-white font-bold rounded-xl text-xs hover:bg-gray-800 transition-colors shadow-sm">
                View Complete Details
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION NAVIGATION ACTIONS BAR */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100 max-w-md mx-auto">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          
          <span className="text-xs font-bold text-gray-500">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

    </div>
  );
}