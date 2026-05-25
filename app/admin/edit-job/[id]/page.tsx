"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Briefcase, Building, MapPin, DollarSign, FileText } from "lucide-react";

export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams(); // Grabs the specific Job ID from the URL path
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Input States
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  // Route Protection Guard
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Fetch the existing job details to populate the form
  useEffect(() => {
    if (!isAuthorized || !id) return;

    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setCompany(data.company);
          setLocation(data.location);
          setSalary(data.salary);
          setDescription(data.description || "");
        } else {
          alert("Job position not found.");
          router.push("/admin/dashboard");
        }
      } catch (error) {
        console.error("Failed to fetch job data details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [isAuthorized, id, router]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, company, location, salary, description }),
      });

      if (response.ok) {
        alert("Job parameters updated successfully!");
        router.push("/admin/dashboard"); // Route back to control hub
      } else {
        alert("Failed to save changes onto the database.");
      }
    } catch (error) {
      console.error("Network submission error:", error);
      alert("Network exception connection error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthorized) return null;
  if (loading) return <div className="text-center py-16 text-gray-400">Loading original position schema...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <Card className="p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Modify Position Details</h1>
          <p className="text-gray-500 text-xs mt-1">Update operational parameters for this active corporate listing.</p>
        </div>

        <form onSubmit={handleEditSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">Job Position Title</label>
              <div className="relative flex items-center">
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                <Input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Software Engineer" className="pl-11 h-12 rounded-xl border-gray-100 bg-gray-50/30 text-sm font-medium focus-visible:ring-blue-500" />
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">Company Name</label>
              <div className="relative flex items-center">
                <Building className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                <Input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="M4 Tech" className="pl-11 h-12 rounded-xl border-gray-100 bg-gray-50/30 text-sm font-medium focus-visible:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Location Scope */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">Location Scope</label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                <Input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kerala (Remote)" className="pl-11 h-12 rounded-xl border-gray-100 bg-gray-50/30 text-sm font-medium focus-visible:ring-blue-500" />
              </div>
            </div>

            {/* Salary Budget */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">Salary Budget Bundle</label>
              <div className="relative flex items-center">
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                <Input type="text" required value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="3L - 5L per annum" className="pl-11 h-12 rounded-xl border-gray-100 bg-gray-50/30 text-sm font-medium focus-visible:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Detailed Job Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">Detailed Job Description</label>
            <div className="relative flex flex-col">
              <FileText className="w-4 h-4 text-gray-400 absolute left-4 top-3.5 pointer-events-none" />
              <Textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Outline core responsibilities, project scopes, and engineering stack expectations..." rows={5} className="pl-11 pt-3 rounded-xl border-gray-100 bg-gray-50/30 text-sm font-medium focus-visible:ring-blue-500 resize-none min-h-[120px]" />
            </div>
          </div>

          {/* Action Submit Row Links Buttons */}
          <div className="flex gap-4 pt-2">
            <Link href="/admin/dashboard" className="w-1/2">
              <Button type="button" variant="ghost" className="w-full h-12 rounded-xl border border-gray-100 text-xs font-bold">
                Discard Changes
              </Button>
            </Link>
            <Button type="submit" disabled={submitting} className="w-1/2 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md">
              {submitting ? "Saving Changes..." : "Apply Modification Update"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}