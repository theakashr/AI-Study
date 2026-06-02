"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Upload, ClipboardList, BarChart3, Settings, BrainCircuit } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", layout: "horizontal" },
    { href: "/modules", icon: BookOpen, label: "Modules", layout: "vertical" },
    { href: "/uploads", icon: Upload, label: "Uploads", layout: "vertical" },
    { href: "/quizzes", icon: ClipboardList, label: "Quizzes", layout: "vertical" },
    { href: "/progress", icon: BarChart3, label: "Progress", layout: "vertical" },
    { href: "/settings", icon: Settings, label: "Settings", layout: "vertical" },
  ];

  return (
    <aside className="w-64 bg-[#121622]/80 backdrop-blur-xl border-r border-white/5 flex flex-col">
      <div className="p-6 flex flex-col items-center border-b border-white/5">
        <BrainCircuit className="w-12 h-12 text-indigo-500 mb-2" />
        <h1 className="text-xl font-bold tracking-wide">CognitoAI</h1>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          if (item.layout === "horizontal") {
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl relative transition-colors ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />}
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          } else {
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl transition-colors relative ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                 {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />}
                <item.icon size={24} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          }
        })}
      </nav>
    </aside>
  );
}
