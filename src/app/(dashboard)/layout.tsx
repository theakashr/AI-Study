"use client";

import { ReactNode, useState } from "react";
import { LayoutDashboard, BookOpen, Upload, ClipboardList, BarChart3, Settings, Bell, BrainCircuit, Menu, X } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0B0F19] text-white overflow-hidden font-sans">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Header */}
        <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 bg-[#0B0F19]/50 backdrop-blur-md border-b border-white/5 md:border-none">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors md:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Student Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors hidden sm:block">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,1)]" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] cursor-pointer hover:scale-105 transition-transform">
                AI
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
