"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Kanban,
  Phone,
  MessageSquare,
  Activity,
  Plus,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Clock,
  Sparkles,
  MapPin,
} from "lucide-react";

const STAGES = [
  { id: "NEW_ENQUIRY", title: "1. New Enquiry", color: "border-blue-500", bg: "bg-blue-50/60" },
  { id: "ASSESSMENT_BOOKED", title: "2. Assessment Booked", color: "border-amber-500", bg: "bg-amber-50/60" },
  { id: "ASSESSMENT_COMPLETED", title: "3. Assessment Done", color: "border-purple-500", bg: "bg-purple-50/60" },
  { id: "ACTIVE_TREATMENT", title: "4. Active Package", color: "border-emerald-500", bg: "bg-emerald-50/60" },
  { id: "COMPLETED_RECOVERY", title: "5. Recovered & Review", color: "border-cyan-500", bg: "bg-cyan-50/60" },
  { id: "NO_SHOW_FOLLOWUP", title: "6. Follow-up Needed", color: "border-slate-500", bg: "bg-slate-50/60" },
];

export default function PipelinePage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients");
      const data = await res.json();
      if (data.success) {
        setPatients(data.data);
      }
    } catch (err) {
      console.error("Error fetching pipeline", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    const interval = setInterval(fetchPatients, 3000);
    return () => clearInterval(interval);
  }, []);

  const moveStage = async (patientId: string, newStage: string) => {
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPatients();
      }
    } catch (err) {
      console.error("Failed to move stage", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Activity className="w-5 h-5 text-cyan-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Kanban className="w-5 h-5 text-cyan-600" /> Patient Care & Sales Pipeline
          </h2>
          <p className="text-xs text-slate-500">
            Track patient lifecycle from Facebook Lead Ad enquiry to full recovery & Google review
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border shadow-xs">
            Total Active Patients: <strong>{patients.length}</strong>
          </span>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto min-h-0 pb-2">
        {STAGES.map((stage, stageIndex) => {
          const stagePatients = patients.filter((p) => p.stage === stage.id);
          const stageValue = stagePatients.reduce((acc, p) => acc + (p.packagePrice || 0), 0);

          return (
            <div
              key={stage.id}
              className={`rounded-2xl border-t-4 ${stage.color} bg-white border border-slate-200 shadow-xs flex flex-col min-w-[260px]`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 rounded-t-xl">
                <div>
                  <h3 className="font-bold text-xs text-slate-800">{stage.title}</h3>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    ?{stageValue.toLocaleString("en-IN")}
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs">
                  {stagePatients.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 p-2 space-y-2.5 overflow-y-auto">
                {stagePatients.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-cyan-400 hover:shadow-md transition text-xs space-y-2 select-none group"
                  >
                    {/* Top Row: Name & Pain Score */}
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-slate-900 leading-tight">
                        {p.name}
                      </span>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.2 rounded shrink-0 ${
                          p.painScore >= 8
                            ? "bg-red-100 text-red-700"
                            : p.painScore >= 5
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        Pain: {p.painScore}/10
                      </span>
                    </div>

                    {/* Condition Tag */}
                    <div className="text-[10px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-1 rounded-md border border-cyan-100 truncate">
                      {p.condition}
                    </div>

                    {/* Package & Session Progress */}
                    {p.sessionsTotal > 0 && (
                      <div className="space-y-1 pt-1 border-t border-slate-100">
                        <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                          <span>Progress:</span>
                          <span className="font-bold text-emerald-700">
                            {p.sessionsDone}/{p.sessionsTotal} Sessions
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{ width: `${(p.sessionsDone / p.sessionsTotal) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Actions & WhatsApp button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <Link
                        href="/inbox"
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" /> Chat
                      </Link>

                      {/* Stage Shift Buttons */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        {stageIndex > 0 && (
                          <button
                            onClick={() => moveStage(p.id, STAGES[stageIndex - 1].id)}
                            title="Move back"
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {stageIndex < STAGES.length - 1 && (
                          <button
                            onClick={() => moveStage(p.id, STAGES[stageIndex + 1].id)}
                            title="Move next stage"
                            className="p-1 rounded bg-cyan-100 hover:bg-cyan-200 text-cyan-800 font-bold"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
