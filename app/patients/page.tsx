"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  MessageSquare,
  Activity,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";
import QuickPatientModal from "@/components/QuickPatientModal";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState("ALL");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients");
      const data = await res.json();
      if (data.success) {
        setPatients(data.data);
      }
    } catch (err) {
      console.error("Error fetching patients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const exportCSV = () => {
    const headers = ["Name", "Phone", "City", "Condition", "PainScore", "Stage", "LeadSource", "PackageName", "SessionsDone", "SessionsTotal"];
    const rows = patients.map((p) => [
      `"${p.name}"`,
      `"${p.phone}"`,
      `"${p.city || "Odisha"}"`,
      `"${p.condition}"`,
      p.painScore,
      `"${p.stage}"`,
      `"${p.leadSource}"`,
      `"${p.packageName || ""}"`,
      p.sessionsDone,
      p.sessionsTotal,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `odisha_spine_patients_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const filteredPatients = patients.filter((p) => {
    if (conditionFilter !== "ALL" && p.condition !== conditionFilter) return false;
    if (stageFilter !== "ALL" && p.stage !== stageFilter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const n = p.name.toLowerCase();
      const ph = p.phone;
      const cond = p.condition.toLowerCase();
      return n.includes(s) || ph.includes(s) || cond.includes(s);
    }
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600" /> Patient Directory & Care Records
          </h2>
          <p className="text-xs text-slate-500">
            Complete records of all enquiries, pain scores, and multi-session rehabilitation packages
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-900/10 transition"
          >
            <Plus className="w-4 h-4" /> + Register Patient
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700 text-xs"
          >
            <option value="ALL">All Conditions</option>
            <option value="Lower Back Pain / Sciatica">Lower Back Pain / Sciatica</option>
            <option value="Cervical Spondylosis & Neck Stiffness">Cervical & Neck Pain</option>
            <option value="Slip Disc / L4-L5 Herniation">Slip Disc / Herniation</option>
            <option value="Frozen Shoulder & Rotator Cuff">Frozen Shoulder</option>
            <option value="Knee Osteoarthritis">Knee Osteoarthritis</option>
          </select>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700 text-xs"
          >
            <option value="ALL">All Stages</option>
            <option value="NEW_ENQUIRY">1. New Enquiry</option>
            <option value="ASSESSMENT_BOOKED">2. Assessment Booked</option>
            <option value="ASSESSMENT_COMPLETED">3. Assessment Done</option>
            <option value="ACTIVE_TREATMENT">4. Active Treatment</option>
            <option value="COMPLETED_RECOVERY">5. Recovered / Reviews</option>
          </select>
        </div>
      </div>

      {/* Patient Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Condition & Pain</th>
                <th className="p-3.5">Care Package & Sessions</th>
                <th className="p-3.5">Current Stage</th>
                <th className="p-3.5">Lead Source</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  {/* Patient Info */}
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-cyan-600" /> {p.phone}
                    </div>
                    <div className="text-[10px] text-slate-400">{p.city || "Odisha"}</div>
                  </td>

                  {/* Condition & Pain Score */}
                  <td className="p-3.5">
                    <span className="font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                      {p.condition}
                    </span>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-medium">Pain Score:</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          p.painScore >= 8
                            ? "bg-red-100 text-red-700"
                            : p.painScore >= 5
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {p.painScore}/10
                      </span>
                    </div>
                  </td>

                  {/* Package & Progress */}
                  <td className="p-3.5">
                    {p.sessionsTotal > 0 ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-800 text-[11px] truncate max-w-[200px]">
                          {p.packageName}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full"
                              style={{ width: `${(p.sessionsDone / p.sessionsTotal) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700">
                            {p.sessionsDone}/{p.sessionsTotal} done
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Initial Assessment Phase</span>
                    )}
                  </td>

                  {/* Stage */}
                  <td className="p-3.5">
                    <span className="font-bold text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {p.stage.replace(/_/g, " ")}
                    </span>
                  </td>

                  {/* Lead Source */}
                  <td className="p-3.5">
                    <span className="text-slate-600 font-medium">{p.leadSource}</span>
                    {p.campaignName && (
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {p.campaignName}
                      </p>
                    )}
                  </td>

                  {/* WhatsApp Action */}
                  <td className="p-3.5 text-right">
                    <Link
                      href="/inbox"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-300 rounded-lg transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <QuickPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatientCreated={fetchPatients}
      />
    </div>
  );
}
