"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  Users,
  Target,
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Inbox", href: "/inbox", icon: MessageSquare, badge: true },
    { name: "Pipeline", href: "/pipeline", icon: Kanban },
    { name: "Patients", href: "/patients", icon: Users },
    { name: "FB Leads", href: "/facebook-leads", icon: Target },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950 border-t border-slate-800 flex items-center justify-around px-2 z-40 shadow-2xl safe-area-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isActive
                ? "text-blue-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              {item.badge && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
