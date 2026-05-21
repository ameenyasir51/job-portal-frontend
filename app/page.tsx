"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, DollarSign, ArrowRight } from "lucide-react";

export default function PublicJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Input States
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Fetch jobs dynamically based on filtering keywords
  useEffect(() => {
    const fetchFilteredJobs = async () => {
      setLoading(true);
      try {
        // Build URL parameters using native URLSearchParams helper
        const params = new URLSearchParams();
        if (searchTitle) params.append("title", searchTitle);
        if (searchLocation) params.append("location", searchLocation);

        const response = await fetch(`http://127.0.0.1:5000/api/jobs?${params.toString()}`, {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Error connecting to backend filters:", error);
      } finally {
        setLoading(false);
      }
    };

    // Set up a minor debounce so it doesn't slam the API on every single keystroke character
    const delayDebounceFn = setTimeout(() => {
      fetchFilteredJobs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTitle, searchLocation]);

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Hero Welcome Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Find Your Dream Technical Role
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Explore open career openings across production frameworks and verified teams.
        </p>
      </div>

      {/* --- INTERACTIVE SEARCH & FILTERING BAR BAR CONTENT --- */}
      <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {/* Keyword Filter Input container */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search job title, keywords, skill tags..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="pl-12 h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus-visible:ring-blue-500 text-sm"
          />
        </div>

        {/* Location Filter Input container */}
        <div className="relative flex items-center">
          <MapPin className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
          <Input
            type="text"
            placeholder="Filter by city, region, or 'Remote'..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="pl-12 h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus-visible:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* --- JOBS RENDER DISPLAY PANEL --- */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 font-medium">Updating available positions...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-100">
          <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No active positions match your filter query settings.</p>
          <button 
            onClick={() => { setSearchTitle(""); setSearchLocation(""); }}
            className="mt-2 text-xs font-bold text-blue-600 hover:underline"
          >
            Clear Search Criteria
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card 
              key={job._id} 
              className="p-6 rounded-3xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50/60 w-fit px-2.5 py-1 rounded-xl mb-4">
                  🚀 Active Opening
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1">{job.company}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-600 font-medium mt-4 pt-4 border-t border-gray-50">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-gray-400" /> {job.salary}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link href={`/jobs/${job._id}`}>
                  <Button className="w-full bg-gray-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 h-11 transition-all">
                    View Complete Details <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}