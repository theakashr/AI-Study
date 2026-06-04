import { ReactNode } from "react";
import { LayoutDashboard, BookOpen, Upload, ClipboardList, BarChart3, Settings, Bell, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0B0F19] text-white overflow-hidden font-sans">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative z-0 overflow-y-auto">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Student Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,1)]" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] cursor-pointer hover:scale-105 transition-transform">
                AI
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
