"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Target,
  Zap,
  Sparkles,
  Phone,
  MessageSquare,
  CheckCircle2,
  Activity,
  ArrowRight,
  Send,
  Smartphone,
} from "lucide-react";

export default function FacebookLeadsPage() {
  const [loading, setLoading] = useState(false);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [testLead, setTestLead] = useState({
    name: "Manoj Kumar Samal",
    phone: "9861234567",
    city: "Bhubaneswar",
    condition: "Lower Back Pain / Sciatica",
    painScore: 8,
    campaignName: "Sciatica & L4-L5 Non-Surgical Relief - Odisha Ads",
  });

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/patients?leadSource=Facebook Ads");
      const data = await res.json();
      if (data.success) {
        setRecentLeads(data.data.filter((p: any) => p.leadSource.includes("Facebook")));
      }
    } catch (err) {
      console.error("Error loading leads", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSimulateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/webhooks/facebook-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testLead),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`? Lead captured from Facebook! Instant WhatsApp welcome message sent to ${testLead.name} (${testLead.phone}).`);
        fetchLeads();
      } else {
        alert(data.error || "Failed to simulate lead");
      }
    } catch (err) {
      alert("Error simulating lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" /> Facebook & Instagram Lead Ads Hub
          </h2>
          <p className="text-xs text-slate-500">
            Real-time webhook ingestion with automated &lt;5 second WhatsApp welcome triggers
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Webhook Active: /api/webhooks/facebook-leads
          </span>
        </div>
      </div>

      {/* Simulator Card */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-blue-800/40">
        <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Zap className="w-4 h-4 text-amber-400" /> Test Ingestion Engine
        </div>
        <h3 className="text-lg font-bold">Simulate Incoming Facebook Lead Ad</h3>
        <p className="text-xs text-slate-300 mt-1 mb-5">
          Submit a simulated Facebook ad form. The CRM will automatically capture the lead, add them to the pipeline, and fire an instant WhatsApp welcome message!
        </p>

        <form onSubmit={handleSimulateLead} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Patient Name</label>
            <input
              type="text"
              required
              value={testLead.name}
              onChange={(e) => setTestLead({ ...testLead, name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">WhatsApp Mobile</label>
            <input
              type="tel"
              required
              value={testLead.phone}
              onChange={(e) => setTestLead({ ...testLead, phone: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Condition / Pain Area</label>
            <select
              value={testLead.condition}
              onChange={(e) => setTestLead({ ...testLead, condition: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400 font-medium"
            >
              <option value="Lower Back Pain / Sciatica">Lower Back Pain / Sciatica</option>
              <option value="Cervical Spondylosis & Neck Stiffness">Cervical & Neck Pain</option>
              <option value="Slip Disc / L4-L5 Herniation">Slip Disc / Herniation</option>
              <option value="Frozen Shoulder & Rotator Cuff">Frozen Shoulder</option>
              <option value="Knee Osteoarthritis">Knee Osteoarthritis</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">Facebook Campaign Name</label>
            <input
              type="text"
              value={testLead.campaignName}
              onChange={(e) => setTestLead({ ...testLead, campaignName: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <Activity className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Trigger FB Lead & Auto WhatsApp
                </>
              )}
            </button>
          </div>
        </form>

        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
            <span>{successMessage}</span>
            <Link href="/inbox" className="font-bold underline text-white hover:text-emerald-200">
              View in Live Inbox ?
            </Link>
          </div>
        )}
      </div>

      {/* Captured Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">
            Captured Facebook Leads ({recentLeads.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">Automatic speed-to-lead status</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {recentLeads.map((lead) => (
            <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center border border-blue-200">
                  FB
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{lead.name}</h4>
                  <p className="text-slate-500 text-[11px]">{lead.phone} • {lead.city || "Odisha"}</p>
                  <p className="text-blue-700 font-semibold text-[10px] mt-0.5">
                    Campaign: {lead.campaignName || "Spine Health Odisha"}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                    {lead.condition}
                  </span>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">
                    ? WhatsApp Welcome Dispatched
                  </p>
                </div>

                <Link
                  href="/inbox"
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg font-bold flex items-center gap-1 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
