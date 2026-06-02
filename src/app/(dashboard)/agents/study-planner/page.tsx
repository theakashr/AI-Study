"use client";

import { useState } from "react";
import { Clock, Loader2, PlayCircle, CalendarDays, BookA, Timer } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remarkGfm";

export default function StudyPlannerAgentPage() {
  const [subjects, setSubjects] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjects.trim() || !examDate || !hoursPerDay) {
      toast.error("Please fill out all fields.");
      return;
    }

    setIsGenerating(true);
    setSchedule(null);
    try {
      const res = await fetch("/api/agents/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjects, examDate, hoursPerDay }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to generate schedule");
      
      setSchedule(data.schedule);
      toast.success("Study schedule generated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden min-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Study Planner</h1>
              <p className="text-gray-400 text-sm">Generate an optimized Pomodoro-based timetable for your upcoming exams.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Input Form */}
          <div className="col-span-1 space-y-6">
            <form onSubmit={handleGenerate} className="space-y-5 bg-[#0B0F19] p-6 rounded-xl border border-white/10">
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <BookA className="w-4 h-4 text-emerald-400" /> Subjects / Topics
                </label>
                <input 
                  type="text" 
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  placeholder="e.g. Physics, Calc, Bio"
                  className="w-full px-4 py-2.5 bg-[#121622] border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <CalendarDays className="w-4 h-4 text-emerald-400" /> Exam Date
                </label>
                <input 
                  type="date" 
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#121622] border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm [color-scheme:dark]"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Timer className="w-4 h-4 text-emerald-400" /> Study Hours / Day
                </label>
                <input 
                  type="number" 
                  min="1"
                  max="16"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  placeholder="e.g. 4"
                  className="w-full px-4 py-2.5 bg-[#121622] border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  required
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Planning...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      Build Schedule
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Render Area */}
          <div className="col-span-2 bg-[#0B0F19] rounded-xl border border-white/10 p-6 h-[600px] overflow-y-auto custom-scrollbar">
            {!schedule && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <Clock className="w-12 h-12 opacity-20" />
                <p>Fill out your details to see your optimized schedule.</p>
              </div>
            )}

            {isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-emerald-400 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="animate-pulse">Analyzing timeframe & distributing subjects...</p>
              </div>
            )}

            {schedule && (
              <div className="prose prose-invert prose-emerald max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {schedule}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
