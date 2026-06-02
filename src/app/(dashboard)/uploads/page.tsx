"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
}

export default function UploadsPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFiles((prevFiles) => [
            ...prevFiles,
            { id: Date.now().toString(), name: file.name, size: formatSize(file.size) },
          ]);
          return 100;
        }
        return prev + 10;
      });
    }, 200); // 2-second total simulation
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
            <Upload className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Document Uploads</h1>
            <p className="text-gray-400 text-sm">Upload PDFs and let AI index them for study.</p>
          </div>
        </div>

        {/* Upload Area */}
        {!isUploading && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative z-10 h-64 mb-8 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all cursor-pointer group
              ${isDragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect} 
              accept=".pdf,.doc,.docx,.txt"
            />
            <Upload className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'}`} />
            <p className={`font-medium ${isDragging ? 'text-cyan-400' : 'text-white'}`}>
              {isDragging ? 'Drop file to upload' : 'Drag & Drop Documents Here'}
            </p>
            <p className="text-sm text-gray-400 mt-1">or click to browse files</p>
          </div>
        )}

        {/* Upload Progress Area */}
        {isUploading && (
          <div className="relative z-10 h-64 mb-8 flex flex-col items-center justify-center border border-white/10 rounded-xl bg-white/5">
            <Loader2 className="w-12 h-12 mb-4 text-cyan-400 animate-spin" />
            <p className="text-white font-medium mb-4">Indexing Document with AI...</p>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{uploadProgress}% Complete</p>
          </div>
        )}

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-4">Indexed Documents</h3>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 rounded-xl bg-[#121622]/90 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <FileText className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-xs text-gray-400">{file.size}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
