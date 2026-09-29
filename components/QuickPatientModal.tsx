"use client";

import { useState } from "react";
import { X, UserPlus, Phone, Activity, MapPin, Stethoscope, Sparkles } from "lucide-react";

const CONDITIONS = [
  "Lower Back Pain / Sciatica",
  "Cervical Spondylosis & Neck Stiffness",
  "Slip Disc / L4-L5 Herniation",
  "Frozen Shoulder & Rotator Cuff",
  "Knee Osteoarthritis",
  "Postural Kyphosis & Scoliosis",
  "Sports Injury & Muscle Rehab",
  "Osteopathic Whole-Body Alignment",
];

const DOCTORS = [
  "Dr. Ashok P. Kota (Master of Chiropractic)",
  
  "Senior Physiotherapy Specialist (Patia Centre)",
];

const PACKAGES = [
  { name: "Initial Assessment Only", price: 800, sessions: 1 },
  { name: "5-Session Targeted Pain Relief", price: 4500, sessions: 5 },
  { name: "10-Session Complete Spine Alignment & Decompression", price: 8500, sessions: 10 },
  { name: "15-Session Advanced Chronic Rehab & Posture", price: 12000, sessions: 15 },
];

export default function QuickPatientModal({
  isOpen,
  onClose,
  onPatientCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Bhubaneswar (Patia)",
    condition: CONDITIONS[0],
    painScore: 7,
    leadSource: "Walk-in",
    assignedDoctor: DOCTORS[0],
    packageName: PACKAGES[0].name,
    packagePrice: PACKAGES[0].price,
    sessionsTotal: PACKAGES[0].sessions,
    notes: "",
    sendWelcomeWhatsApp: true,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        if (onPatientCreated) onPatientCreated();
        onClose();
      } else {
        alert(data.error || "Failed to add patient");
      }
    } catch (err) {
      alert("Error submitting patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-black border border-orange-500/40 p-0.5 overflow-hidden shrink-0">
              <img src="/logo.jpg" alt="ActiveRehab" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-base">Register Patient at ActiveRehab</h3>
              <p className="text-xs text-orange-300">Walk-in / Phone Call / WhatsApp Registration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Ramesh Chandra Das"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number *</label>
              <input
                required
                type="tel"
                placeholder="e.g. 9861012345"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic Centre Location</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
              >
                <option value="Bhubaneswar (Patia)">Patia, Bhubaneswar Centre</option>
                <option value="Cuttack (CDA Sector VI)">CDA Sector VI, Cuttack Centre</option>
                <option value="Hyderabad (Kondapur)">Kondapur, Hyderabad Centre</option>
                <option value="Hyderabad (Kompally)">Kompally, Hyderabad Centre</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Source</label>
              <select
                value={formData.leadSource}
                onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Walk-in">Walk-in at Patia / Cuttack</option>
                <option value="Phone Call Enquiry">Phone Call Enquiry</option>
                <option value="WhatsApp Direct">WhatsApp Direct</option>
                <option value="Facebook Ads">Facebook / Instagram Ads</option>
                <option value="Website (activerehab.in)">Website (activerehab.in)</option>
                <option value="Google Business Profile">Google Maps / Search</option>
                <option value="Doctor Referral">Doctor Referral</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Condition / Chief Complaint *</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-slate-800"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Initial Pain Score (VAS scale 1 - 10)</label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                formData.painScore >= 8 ? "bg-red-100 text-red-700" : formData.painScore >= 5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                Pain: {formData.painScore}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.painScore}
              onChange={(e) => setFormData({ ...formData, painScore: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Doctor</label>
              <select
                value={formData.assignedDoctor}
                onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-xs font-medium"
              >
                {DOCTORS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Care Package / Plan</label>
              <select
                value={formData.packageName}
                onChange={(e) => {
                  const sel = PACKAGES.find((p) => p.name === e.target.value);
                  setFormData({
                    ...formData,
                    packageName: e.target.value,
                    packagePrice: sel ? sel.price : 0,
                    sessionsTotal: sel ? sel.sessions : 0,
                  });
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-xs font-medium"
              >
                {PACKAGES.map((pkg) => (
                  <option key={pkg.name} value={pkg.name}>
                    {pkg.name} (₹{pkg.price.toLocaleString("en-IN")})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Notes & Symptoms</label>
            <textarea
              rows={2}
              placeholder="e.g. Radiating sciatica pain, L4-L5 disc protrusion on MRI..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-800 font-bold text-xs">
                📲 Send Instant WhatsApp Welcome Message via ActiveRehab
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.sendWelcomeWhatsApp}
              onChange={(e) => setFormData({ ...formData, sendWelcomeWhatsApp: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white font-bold rounded-lg shadow-md hover:from-blue-700 hover:to-orange-600 transition disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? "Saving..." : "Register & Start WhatsApp Journey"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
