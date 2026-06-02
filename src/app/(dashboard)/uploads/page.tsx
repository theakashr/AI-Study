"use client";

import { Upload } from "lucide-react";

export default function UploadsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50" />
        
        <div className="relative z-10 flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
            <Upload className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Document Uploads</h1>
            <p className="text-gray-400 text-sm">Upload PDFs and let AI index them for study.</p>
          </div>
        </div>

        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-white/5 text-gray-500 hover:bg-white/10 transition-colors cursor-pointer group">
          <Upload className="w-12 h-12 mb-4 opacity-50 group-hover:text-cyan-400 group-hover:opacity-100 transition-colors" />
          <p className="font-medium">Drag & Drop PDFs Here</p>
          <p className="text-sm mt-1">or click to browse files</p>
        </div>
      </div>
    </div>
  );
}
