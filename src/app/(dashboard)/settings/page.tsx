"use client";

import { useState } from "react";
import { Settings, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log("Attempting to sign out user...");
      await signOut(auth);
      console.log("User successfully signed out.");
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#161B29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-gray-500/20 border border-gray-500/30">
            <Settings className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Account Settings</h1>
            <p className="text-gray-400 text-sm">Manage your preferences and profile.</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10 max-w-2xl">
          {/* Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase ml-1">Preferences</h3>
            
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
              <div>
                <p className="font-medium text-white">Notifications</p>
                <p className="text-sm text-gray-400">Receive alerts for study reminders and updates.</p>
              </div>
              <div 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${notificationsEnabled ? 'bg-indigo-500' : 'bg-gray-700'}`}
              >
                <div 
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notificationsEnabled ? 'translate-x-7' : 'translate-x-1'}`} 
                />
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
              <div>
                <p className="font-medium text-white">Dark Mode</p>
                <p className="text-sm text-gray-400">Toggle dark mode theme across the application.</p>
              </div>
              <div 
                onClick={() => setDarkModeEnabled(!darkModeEnabled)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${darkModeEnabled ? 'bg-indigo-500' : 'bg-gray-700'}`}
              >
                <div 
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${darkModeEnabled ? 'translate-x-7' : 'translate-x-1'}`} 
                />
              </div>
            </div>
          </div>

          {/* Account Session Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase ml-1">Account Session</h3>
            
            <div className="p-6 bg-red-500/5 rounded-xl border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">Sign Out</p>
                <p className="text-sm text-gray-400 mt-1 max-w-sm">Sign out of your active session on this device. You will need to log back in to access your dashboard.</p>
              </div>
              <button 
                onClick={handleLogout}
                className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
