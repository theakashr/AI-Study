"use client";

import { useState } from "react";
import { BookOpen, Plus, X } from "lucide-react";

interface ModuleData {
  id: string;
  name: string;
  description: string;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleDesc, setNewModuleDesc] = useState("");

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName.trim()) return;

    const newModule: ModuleData = {
      id: Date.now().toString(),
      name: newModuleName,
      description: newModuleDesc,
    };

    setModules([...modules, newModule]);
    setNewModuleName("");
    setNewModuleDesc("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Study Modules</h1>
              <p className="text-gray-400 text-sm">Organize and track your learning materials.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Module
          </button>
        </div>

        {modules.length === 0 ? (
          <div className="relative z-10 h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-white/5 text-gray-500">
            <BookOpen className="w-12 h-12 mb-4 opacity-50" />
            <p>No modules created yet.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)]"
            >
              Create New Module
            </button>
          </div>
        ) : (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <div key={mod.id} className="p-5 rounded-xl bg-[#121622]/90 border border-white/10 hover:border-indigo-500/50 transition-colors shadow-lg group">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{mod.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{mod.description || "No description provided."}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#161B29] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Create New Module</h2>
            
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Module Name</label>
                <input 
                  type="text" 
                  required
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Data Structures"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description (Optional)</label>
                <textarea 
                  rows={3}
                  value={newModuleDesc}
                  onChange={(e) => setNewModuleDesc(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="What is this module about?"
                />
              </div>
              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
