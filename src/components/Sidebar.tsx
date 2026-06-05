"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Upload, ClipboardList, BarChart3, Settings, BrainCircuit, X } from "lucide-react";

export function Sidebar({ isOpen = true, setIsOpen }: { isOpen?: boolean; setIsOpen?: (v: boolean) => void }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/modules", icon: BookOpen, label: "Modules", layout: "vertical" },
    { href: "/uploads", icon: Upload, label: "Uploads", layout: "vertical" },
    { href: "/quizzes", icon: ClipboardList, label: "Quizzes", layout: "vertical" },
    { href: "/progress", icon: BarChart3, label: "Progress", layout: "vertical" },
    { href: "/settings", icon: Settings, label: "Settings", layout: "vertical" },
  ];

  return (
    <aside className={`w-64 bg-[#121622]/95 md:bg-[#121622]/80 backdrop-blur-xl border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex flex-col items-center flex-1">
          <BrainCircuit className="w-12 h-12 text-indigo-500 mb-2" />
          <h1 className="text-xl font-bold tracking-wide">CognitoAI</h1>
        </div>
        {setIsOpen && (
          <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-white absolute right-4 top-4">
            <X size={24} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          if (item.layout === "horizontal") {
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen && setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl relative transition-colors ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />}
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          } else {
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen && setIsOpen(false)} className={`flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-xl transition-colors relative ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
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
