"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building, MapPin, DollarSign, Calendar, FileText, Send, AlertTriangle } from "lucide-react";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals Controller States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false); // Custom Shadcn replacement for alert()

  // Form Field Hooks
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchJobDetails = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        }
      } catch (error) {
        console.error("Error reading job specifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleApplyClick = () => {
    const userRole = localStorage.getItem("userRole");
    // If guest user, open our custom UI warning dialog box instead of browser alert()
    if (!userRole || userRole !== "user") {
      setIsWarningModalOpen(true);
      return;
    }
    setIsFormModalOpen(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("jobId", id as string);
    formData.append("resume", resumeFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/applications", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        setIsFormModalOpen(false);
        setName(""); setEmail(""); setPhone(""); setResumeFile(null);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-400 font-medium">Loading details...</div>;
  if (!job) return <div className="text-center py-16 text-red-500 font-semibold">Job position not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 relative">
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Open Positions
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">🚀 Active Opening</span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-4 tracking-tight">{job.title}</h1>
            <p className="text-gray-500 font-medium text-base mt-1 flex items-center gap-1">
              <Building className="w-4 h-4 text-gray-400" /> {job.company}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Position Description Overview</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line bg-gray-50/40 p-5 rounded-2xl border border-gray-100">
              {job.description || "No description provided."}
            </p>
          </div>
        </div>

        <div>
          <div className="p-6 bg-white border border-gray-100 shadow-xl rounded-3xl sticky top-24 space-y-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-50 pb-2">Listing Specs</h3>
            <div className="space-y-4 text-xs font-semibold text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400"><MapPin className="w-4 h-4" /></div>
                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Location Scope</p><p className="text-gray-800 mt-0.5">{job.location}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400"><DollarSign className="w-4 h-4" /></div>
                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Salary Budget</p><p className="text-gray-800 mt-0.5">{job.salary}</p></div>
              </div>
            </div>

            <button onClick={handleApplyClick} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-2 shadow-md transition-all cursor-pointer text-sm">
              Apply for this Position
            </button>
          </div>
        </div>
      </div>

      {/* --- MENTOR REQUIREMENT: CUSTOM SHADCN DIALOG BOX FOR GUEST AUTH WARNINGS --- */}
      {isWarningModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm p-6 bg-white border border-gray-100 shadow-2xl rounded-3xl text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Authentication Required</h3>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                You are not logged in! If you want to apply for this position, please sign in to your candidate account first.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsWarningModalOpen(false)} className="w-1/2 p-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={() => router.push("/login")} className="w-1/2 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer">
                Log In Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- APPLICATION FORM DIALOG MODAL OVERLAY --- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl relative space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Submit Your Application</h2>
              <p className="text-gray-500 text-xs mt-1">Applying for <span className="font-semibold text-blue-600">{job.title}</span></p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Full Legal Name</label>
                <input type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Contact Email</label>
                  <input type="email" required placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Phone Number</label>
                  <input type="tel" required placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Attach Resume / CV</label>
                <div className="border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col items-center justify-center relative hover:bg-gray-50">
                  <FileText className="w-6 h-6 text-gray-400 mb-1" />
                  <input type="file" required onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <span className="text-xs font-semibold text-gray-500 text-center truncate max-w-xs">{resumeFile ? resumeFile.name : "Click to attach document"}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="w-1/3 h-11 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submitting} className="w-2/3 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs shadow-md cursor-pointer disabled:bg-gray-400">
                  {submitting ? "Uploading..." : <><Send className="w-3.5 h-3.5" /> Submit Profile</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}