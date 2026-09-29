"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Target,
  Smartphone,
  Globe,
  Stethoscope,
} from "lucide-react";
import QuickPatientModal from "./QuickPatientModal";
import Link from "next/link";

export default function Header({
  onOpenSimulator,
  onRefreshData,
}: {
  onOpenSimulator?: () => void;
  onRefreshData?: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs">
        {/* Search Bar */}
        <div className="flex items-center gap-3 w-96">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patients by name, phone (+91), or condition..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 border border-slate-200 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Action Controls & Simulator Toggle */}
        <div className="flex items-center gap-3">
          {/* ActiveRehab Website Link */}
          <a
            href="https://activerehab.in"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>activerehab.in</span>
          </a>

          {/* Facebook Lead Generator Fast Link */}
          <Link
            href="/facebook-leads"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition shadow-xs"
          >
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>Simulate FB Lead</span>
          </Link>

          {/* WhatsApp Mobile Simulator Button */}
          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition shadow-xs animate-pulse-subtle"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open WhatsApp Phone</span>
            </button>
          )}

          {/* Quick Register Patient */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-900/10 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Patient</span>
          </button>

          {/* Doctor Profile */}
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800 font-bold text-xs">
              AK
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-none">Dr. Ashok P. Kota</p>
              <p className="text-[10px] text-orange-600 font-semibold leading-tight">Master of Chiropractic</p>
            </div>
          </div>
        </div>
      </header>

      <QuickPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatientCreated={onRefreshData}
      />
    </>
  );
}
