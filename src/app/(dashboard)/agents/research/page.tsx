"use client";

import { useState } from "react";
import { Search, Loader2, PlayCircle, FileText, Download } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/lib/useAuth";
import { saveAgentData } from "@/lib/db";
import { useCooldown } from "@/hooks/useCooldown";

export default function ResearchAgentPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const { cooldown, startCooldown } = useCooldown();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter a research topic.");
      return;
    }

    setIsGenerating(true);
    setReport(null);
    try {
      const res = await fetch("/api/agents/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to generate report");
      
      setReport(data.report);
      
      if (user) {
        try {
          await saveAgentData("researchReports", user.uid, {
            query,
            content: data.report
          });
        } catch(e) {
          console.error("Failed to save research report to database:", e);
        }
      }

      toast.success("Research report generated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
      startCooldown(15);
    }
  };

  const downloadPDF = () => {
    // Basic text export for now since window.print() is the easiest way to "Export PDF" in browser natively without heavy client-side libs
    toast("Press Ctrl+P (or Cmd+P) and select 'Save as PDF'", { icon: "🖨️" });
    setTimeout(() => window.print(), 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden min-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
              <Search className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Research Agent</h1>
              <p className="text-gray-400 text-sm">Deep-dive into any topic. Let AI generate a comprehensive academic report with citations.</p>
            </div>
          </div>
          
          {report && (
             <button 
               onClick={downloadPDF}
               className="px-4 py-2 border border-white/10 hover:bg-white/5 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
             >
               <Download className="w-4 h-4" /> Export PDF
             </button>
          )}
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Input Form */}
          <div className="col-span-1 lg:col-span-1 space-y-6">
            <form onSubmit={handleGenerate} className="space-y-5 bg-[#0B0F19] p-6 rounded-xl border border-white/10 sticky top-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Search className="w-4 h-4 text-indigo-400" /> Research Topic
                </label>
                <textarea 
                  rows={4}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. The impact of Quantum Computing on modern cryptography..."
                  className="w-full px-4 py-3 bg-[#121622] border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none custom-scrollbar"
                  required
                />
              </div>

                <button 
                  type="submit"
                  disabled={isGenerating || cooldown > 0}
                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-500/50 text-white font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Researching...
                    </>
                  ) : cooldown > 0 ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Cooldown ({cooldown}s)
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Render Area */}
          <div className="col-span-1 lg:col-span-3 bg-[#0B0F19] rounded-xl border border-white/10 p-8 h-[600px] overflow-y-auto custom-scrollbar print:h-auto print:border-none print:bg-white print:text-black">
            {!report && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <FileText className="w-12 h-12 opacity-20" />
                <p>Your comprehensive research report will be generated here.</p>
              </div>
            )}

            {isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-indigo-400 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="animate-pulse">Scouring databases and compiling research...</p>
              </div>
            )}

            {report && (
              <div className="prose prose-invert prose-indigo max-w-none print:prose-p:text-black print:prose-h1:text-black print:prose-h2:text-black print:prose-h3:text-black">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {report}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
