"use client";

import { useState, useEffect } from "react";
import {
  Send,
  Sparkles,
  Users,
  CheckCircle,
  Eye,
  Activity,
  Plus,
  Calendar,
  MessageSquare,
  Globe,
} from "lucide-react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "Sunday Spine & Posture Assessment Camp - Bhubaneswar",
    targetCondition: "ALL",
    language: "en",
    messageTemplate:
      "Namaskar {{patient_name}} 🙏 ActiveRehab Chiropractic & Osteopathy Centre is organizing a *Complimentary Spine & Posture Assessment Camp* this Sunday at Saheed Nagar, Bhubaneswar. Limited slots. Reply 'CAMP' to reserve your appointment!",
  });

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      if (data.success) setCampaigns(data.data);
    } catch (err) {
      console.error("Error loading campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreating(false);
        fetchCampaigns();
      } else {
        alert(data.error || "Failed to launch broadcast");
      }
    } catch (err) {
      alert("Error creating broadcast");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-600" /> WhatsApp Broadcasts & Patient Recall
          </h2>
          <p className="text-xs text-slate-500">
            Send bulk announcements, health camp invites, and 3-month posture maintenance reminders
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/10 transition"
        >
          <Plus className="w-4 h-4" /> {isCreating ? "Cancel" : "New Broadcast Campaign"}
        </button>
      </div>

      {/* New Campaign Creator Drawer */}
      {isCreating && (
        <form
          onSubmit={handleCreateCampaign}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl space-y-4 animate-in slide-in-from-top-3 duration-200 text-xs"
        >
          <div className="border-b pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Configure Broadcast Campaign</h3>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Personalized with patient name
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Campaign Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Segment *</label>
              <select
                value={formData.targetCondition}
                onChange={(e) => setFormData({ ...formData, targetCondition: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="ALL">All Patients (General Broadcast)</option>
                <option value="Lower Back Pain / Sciatica">Lower Back Pain / Sciatica Patients</option>
                <option value="Cervical Spondylosis & Neck Stiffness">Cervical & Neck Pain Patients</option>
                <option value="Knee Osteoarthritis">Knee Osteoarthritis Patients</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">WhatsApp Message Template *</label>
            <textarea
              required
              rows={4}
              value={formData.messageTemplate}
              onChange={(e) => setFormData({ ...formData, messageTemplate: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              {submitting ? "Sending..." : " Launch & Send WhatsApp Broadcast"}
            </button>
          </div>
        </form>
      )}

      {/* Campaign List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp) => (
          <div key={camp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-tight">{camp.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Target: <span className="text-cyan-700 font-semibold">{camp.targetCondition || "All"}</span>
                </p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {camp.status}
              </span>
            </div>

            {/* Message Bubble Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
              {camp.messageTemplate}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-500 font-medium">Recipients</span>
                <p className="font-black text-slate-800">{camp.totalRecipients}</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800">
                <span className="text-[10px] font-medium">Delivered</span>
                <p className="font-black">{camp.deliveredCount}</p>
              </div>
              <div className="p-2 bg-cyan-50 rounded-lg text-cyan-800">
                <span className="text-[10px] font-medium">Read Rate</span>
                <p className="font-black">
                  {camp.totalRecipients > 0 ? Math.round((camp.readCount / camp.totalRecipients) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
