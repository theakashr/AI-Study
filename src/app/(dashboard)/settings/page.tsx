"use client";

import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-50" />
        
        <div className="relative z-10 flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gray-500/20 border border-gray-500/30">
            <Settings className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Account Settings</h1>
            <p className="text-gray-400 text-sm">Manage your preferences and profile.</p>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Notifications</p>
              <p className="text-sm text-gray-400">Receive alerts for study reminders.</p>
            </div>
            <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Dark Mode</p>
              <p className="text-sm text-gray-400">Toggle dark mode theme.</p>
            </div>
            <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
