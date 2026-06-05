"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, Upload, Loader2, FileText, CheckCircle2, Maximize2, Minimize2, X } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/lib/useAuth";
import { saveAgentData } from "@/lib/db";
import { useCooldown } from "@/hooks/useCooldown";

export default function SummaryAgentPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [modificationRequest, setModificationRequest] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { cooldown, startCooldown } = useCooldown();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 4 * 1024 * 1024) {
        toast.error("File is too large. Please upload a PDF under 4MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type !== "application/pdf" && !droppedFile.name.endsWith('.pdf')) {
        toast.error("Please upload a PDF file.");
        return;
      }
      if (droppedFile.size > 4 * 1024 * 1024) {
        toast.error("File is too large. Please upload a PDF under 4MB.");
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      toast.error("Please upload a PDF first.");
      return;
    }
    
    setIsUploading(true);
    setSummary(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/agents/summary", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to generate summary");
      
      setSummary(data.summary);
      
      if (user) {
        try {
          await saveAgentData("summaries", user.uid, {
            filename: file.name,
            content: data.summary,
          });
        } catch (e) {
          console.error("Failed to save summary to database:", e);
        }
      }

      toast.success("Summary generated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
      startCooldown(15);
    }
  };

  return (
    <div className={`space-y-6 max-w-5xl mx-auto ${isFullscreen ? '' : 'animate-in fade-in slide-in-from-bottom-4 duration-500 relative'}`}>
      <div className={`bg-[#161B29]/80 rounded-2xl p-8 border border-white/5 min-h-[400px] ${isFullscreen ? '' : 'relative overflow-hidden backdrop-blur-xl'}`}>
        {!isFullscreen && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-50 pointer-events-none" />
        )}
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Summary Agent</h1>
              <p className="text-gray-400 text-sm">Upload a PDF chapter or notes to instantly generate an exam-ready summary.</p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Upload */}
          <div className="space-y-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              className={`h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all cursor-pointer group
                ${isDragging ? 'border-blue-400 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50'}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect} 
                accept=".pdf"
              />
              <Upload className={`w-10 h-10 mb-3 transition-colors ${isDragging ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'}`} />
              <p className={`font-medium ${isDragging ? 'text-blue-400' : 'text-white'}`}>
                {isDragging ? 'Drop PDF to extract' : 'Drag & Drop PDF Here'}
              </p>
            </div>

            {file && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-white text-sm truncate">{file.name}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={!file || isUploading || cooldown > 0}
              className="w-full py-3 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-white font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)] disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Extracting & Summarizing...
                </>
              ) : cooldown > 0 ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Cooldown ({cooldown}s)
                </>
              ) : (
                "Generate Exam Notes"
              )}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className={
            isFullscreen 
              ? "fixed inset-0 z-[9999] w-screen h-screen m-0 rounded-none bg-[#0B0F19] flex flex-col p-6 md:p-12 transition-all duration-300 overflow-y-auto"
              : "flex flex-col gap-4 h-[500px] relative transition-all duration-300"
          }>
            
            <div className={`bg-[#0B0F19] rounded-xl border border-white/5 flex-1 flex flex-col ${isFullscreen ? 'p-10 max-w-5xl mx-auto w-full shadow-2xl border-white/10' : 'p-6 overflow-y-auto custom-scrollbar'}`}>
              
              {/* Header with Fullscreen Toggle */}
              {(summary || isUploading) && (
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-semibold">{isFullscreen ? 'Fullscreen Reading Mode' : 'Generated Summary'}</h3>
                  </div>
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                    title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? (
                      <>
                        <span className="hidden md:inline">Exit</span>
                        <Minimize2 className="w-4 h-4" />
                      </>
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              {!summary && !isUploading && (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 m-auto">
                  <BookOpen className="w-12 h-12 opacity-20" />
                  <p>Your chapter-wise summary will appear here.</p>
                </div>
              )}
              
              {isUploading && (
                <div className="h-full flex flex-col items-center justify-center text-blue-400 space-y-4 m-auto">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="animate-pulse">AI is working...</p>
                </div>
              )}

              {summary && !isUploading && (
                <div className="prose prose-invert prose-blue max-w-none flex-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {summary}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            
            {/* AI Refiner Tool */}
            {summary && (
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!modificationRequest.trim() || isUploading) return;
                  
                  setIsUploading(true);
                  const formData = new FormData();
                  formData.append("modificationRequest", modificationRequest);
                  formData.append("currentSummary", summary);

                  try {
                    const res = await fetch("/api/agents/summary", { method: "POST", body: formData });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error);
                    
                    setSummary(data.summary);
                    setModificationRequest("");
                    toast.success("Summary modified successfully!");
                  } catch (err: any) {
                    toast.error(err.message || "Failed to modify summary");
                  } finally {
                    setIsUploading(false);
                  }
                }}
                className={`flex gap-2 shrink-0 ${isFullscreen ? 'max-w-5xl mx-auto w-full mt-4' : ''}`}
              >
                <input 
                  type="text" 
                  value={modificationRequest}
                  onChange={(e) => setModificationRequest(e.target.value)}
                  placeholder="Ask AI to simplify, expand, or format as a table..."
                  className="flex-1 px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors text-sm shadow-xl"
                  disabled={isUploading}
                />
                <button 
                  type="submit" 
                  disabled={isUploading || !modificationRequest.trim()}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-white font-medium rounded-xl transition-colors shrink-0 shadow-xl"
                >
                  Apply
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
