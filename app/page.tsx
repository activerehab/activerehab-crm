"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Target,
  Calendar,
  Activity,
  TrendingUp,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 4000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3 text-blue-700 font-semibold text-sm">
          <Activity className="w-5 h-5 animate-spin text-orange-500" />
          <span>Loading ActiveRehab Operations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner with ActiveRehab Branding */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-800/40">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-black border-2 border-orange-500/40 p-1 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/40 overflow-hidden">
            <img
              src="/logo.jpg"
              alt="ActiveRehab"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" /> ActiveRehab Chiropractic & Osteopathy Centre
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Clinical Patient Care & WhatsApp Growth Engine
            </h2>
            <p className="text-slate-300 text-xs mt-0.5">
              Live tracking for Facebook Ads enquiries, spine assessments, and multi-session rehabilitation packages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/facebook-leads"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Target className="w-4 h-4" /> Simulate FB Lead
          </Link>
          <Link
            href="/inbox"
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" /> Open WhatsApp Inbox
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Patients */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Patients</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.totalPatients}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Bhubaneswar & Odisha</span>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">New Enquiries</span>
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-orange-600">{stats.newEnquiries}</p>
          <span className="text-[11px] text-slate-500 font-medium">Speed-to-lead &lt; 5s</span>
        </div>

        {/* Assessments Scheduled */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Assessments Booked</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-600">{stats.assessmentBooked}</p>
          <span className="text-[11px] text-blue-600 font-medium">ActiveReminders</span>
        </div>

        {/* Active Care Packages */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Care Packages</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{stats.activeTreatments}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Multi-Session Tracking</span>
        </div>

        {/* Pipeline Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pipeline Value</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            ₹{stats.totalRevenue ? stats.totalRevenue.toLocaleString("en-IN") : "0"}
          </p>
          <span className="text-[11px] text-purple-600 font-semibold">{stats.conversionRate}% Conversion Rate</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Condition Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800">
                  Enquiries by Condition / Pain Area
                </h3>
                <p className="text-xs text-slate-500">ActiveRehab Chiropractic, Osteopathy & Rehab inquiries</p>
              </div>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Top: Sciatica & Disc
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(stats.conditionCounts || {}).map(([cond, count]: any) => {
                const percentage = Math.round((count / (stats.totalPatients || 1)) * 100);
                return (
                  <div key={cond} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{cond}</span>
                      <span className="text-slate-500">
                        {count} patients ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Patient Ingestion Channels</h3>
                <p className="text-xs text-slate-500">Where patient enquiries are originating from</p>
              </div>
              <Link href="/pipeline" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                View Kanban Pipeline <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {Object.entries(stats.sourceCounts || {}).map(([source, count]: any) => (
                <div key={source} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <p className="text-lg font-black text-slate-800">{count}</p>
                  <p className="text-[11px] font-medium text-slate-500 truncate">{source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Schedule */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-800">Upcoming Schedule</h3>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                ActiveRehab OPD
              </span>
            </div>

            <div className="space-y-3">
              {stats.upcomingAppointments && stats.upcomingAppointments.length > 0 ? (
                stats.upcomingAppointments.map((apt: any) => (
                  <div
                    key={apt.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{apt.patient?.name}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {apt.timeSlot}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">{apt.type}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span>{apt.doctorName.split("(")[0]}</span>
                      <span className="text-blue-600 font-semibold">{apt.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No upcoming appointments</p>
              )}
            </div>

            <Link
              href="/inbox"
              className="mt-4 block w-full text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 transition"
            >
              Open Live Appointment Coordinator
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-orange-50/40 to-slate-50 p-5 rounded-2xl border border-blue-200 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-orange-500" /> ActiveRehab Standards
            </h4>
            <ul className="space-y-2 text-slate-700 text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>Chiropractic adjustments & osteopathic mobilization</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <span>Speed-to-lead &lt;5s on Facebook Lead Ads</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Multilingual Odia, English & Hindi templates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
