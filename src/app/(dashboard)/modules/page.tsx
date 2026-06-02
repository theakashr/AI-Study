"use client";

import { BookOpen } from "lucide-react";

export default function ModulesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50" />
        
        <div className="relative z-10 flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
            <BookOpen className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Study Modules</h1>
            <p className="text-gray-400 text-sm">Organize and track your learning materials.</p>
          </div>
        </div>

        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-white/5 text-gray-500">
          <BookOpen className="w-12 h-12 mb-4 opacity-50" />
          <p>No modules created yet.</p>
          <button className="mt-4 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            Create New Module
          </button>
        </div>
      </div>
    </div>
  );
}
