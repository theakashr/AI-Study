import { ReactNode } from "react";
import { LayoutDashboard, BookOpen, Upload, ClipboardList, BarChart3, Settings, Bell, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0B0F19] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121622]/80 backdrop-blur-xl border-r border-white/5 flex flex-col">
        <div className="p-6 flex flex-col items-center border-b border-white/5">
          <BrainCircuit className="w-12 h-12 text-indigo-500 mb-2" />
          <h1 className="text-xl font-bold tracking-wide">CognitoAI</h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/modules" className="flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <BookOpen size={24} />
            <span className="text-xs">Modules</span>
          </Link>
          <Link href="/uploads" className="flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <Upload size={24} />
            <span className="text-xs">Uploads</span>
          </Link>
          <Link href="/quizzes" className="flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <ClipboardList size={24} />
            <span className="text-xs">Quizzes</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <BarChart3 size={24} />
            <span className="text-xs">Progress</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <Settings size={24} />
            <span className="text-xs">Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative z-0 overflow-y-auto">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-2xl font-medium tracking-wide">
            Student Dashboard <span className="text-gray-500 mx-2">|</span> <span className="text-gray-300">AI Study Assistant</span>
          </h2>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,1)]" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-sm font-bold">
                S.
              </div>
              <span className="text-sm font-medium">Sarah Jenkins</span>
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
