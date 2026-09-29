"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  Users,
  Target,
  Send,
  Bot,
  Settings,
  Activity,
  Sparkles,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Live WhatsApp Inbox", href: "/inbox", icon: MessageSquare, badge: "Live" },
    { name: "Patient Pipeline", href: "/pipeline", icon: Kanban },
    { name: "Patients Directory", href: "/patients", icon: Users },
    { name: "Facebook Lead Ads", href: "/facebook-leads", icon: Target, badge: "Instant" },
    { name: "Broadcasts & Recall", href: "/campaigns", icon: Send },
    { name: "Bot & Automations", href: "/automations", icon: Bot },
    { name: "Clinic Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-100 flex flex-col shrink-0 border-r border-slate-800/80 select-none">
      {/* Clinic Brand Header with Logo */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-black border border-slate-700/80 p-1 flex items-center justify-center shrink-0 shadow-md shadow-blue-950/40 overflow-hidden">
          <img
            src="/logo.jpg"
            alt="ActiveRehab Logo"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        <div className="min-w-0">
          <h1 className="font-extrabold text-sm tracking-tight text-white leading-tight truncate">
            ActiveRehab
          </h1>
          <p className="text-[10px] text-orange-400 font-semibold truncate">
            Chiro & Osteopathy Centre
          </p>
          <div className="flex items-center gap-1 text-[9px] text-emerald-400 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Odisha Clinic Live</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
          Clinical Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-900/40 border border-blue-400/30"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    item.badge === "Live"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Clinic Location & Verified Status */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-300 mb-1">
          <span className="font-bold text-white text-[11px]">Bhubaneswar Centre</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          ActiveRehab Chiropractic & Osteopathy
        </p>
        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
          <span className="text-orange-400 font-bold">WhatsApp API Connected</span>
          <span className="text-slate-400">Odisha</span>
        </div>
      </div>
    </aside>
  );
}
