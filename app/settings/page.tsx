"use client";

import { useState } from "react";
import {
  Settings,
  Smartphone,
  Target,
  Copy,
  ExternalLink,
  CheckCircle2,
  Stethoscope,
  Globe,
  MapPin,
  Phone,
} from "lucide-react";

export default function SettingsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const webhookUrl = typeof window !== "undefined" ? `${window.location.origin}/api/webhooks/whatsapp` : "http://localhost:3000/api/webhooks/whatsapp";
  const fbWebhookUrl = typeof window !== "undefined" ? `${window.location.origin}/api/webhooks/facebook-leads` : "http://localhost:3000/api/webhooks/facebook-leads";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-xs">
      {/* Header with ActiveRehab Branding */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" /> ActiveRehab WhatsApp & Clinic Settings
          </h2>
          <p className="text-slate-500">
            Configure Meta WhatsApp Cloud API credentials, Facebook Lead Webhooks, and ActiveRehab Odisha Centre details
          </p>
        </div>
        <a
          href="https://activerehab.in"
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1.5 shadow-xs"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" /> activerehab.in <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Meta WhatsApp Cloud API Credentials */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Smartphone className="w-5 h-5 text-emerald-600" /> Meta WhatsApp Cloud API
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Connect ActiveRehab's official WhatsApp Business number (+91 8260229039) via Meta Graph API.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp Phone Number ID
              </label>
              <input
                type="text"
                placeholder="e.g. 104829384729182"
                defaultValue="109823485729103"
                className="w-full px-3 py-2 border rounded-xl outline-none font-mono text-xs bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp Business Account ID (WABA)
              </label>
              <input
                type="text"
                placeholder="e.g. 293847291029384"
                defaultValue="293847291029384"
                className="w-full px-3 py-2 border rounded-xl outline-none font-mono text-xs bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Permanent System User Access Token
              </label>
              <input
                type="password"
                placeholder="EAAG..."
                defaultValue="EAAG_activerehab_permanent_system_token_prod_key"
                className="w-full px-3 py-2 border rounded-xl outline-none font-mono text-xs bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Webhook Verify Token
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="activerehab_clinic_secret"
                  className="flex-1 px-3 py-2 border rounded-xl font-mono text-xs bg-slate-100 text-slate-700 select-all"
                />
                <button
                  onClick={() => copyToClipboard("activerehab_clinic_secret", "verify")}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border rounded-xl font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied === "verify" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Webhook Callback URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="flex-1 px-3 py-2 border rounded-xl font-mono text-xs bg-slate-100 text-slate-700 select-all truncate"
                />
                <button
                  onClick={() => copyToClipboard(webhookUrl, "callback")}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border rounded-xl font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied === "callback" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Facebook Lead Ads Webhook Setup & ActiveRehab Locations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
            <Target className="w-5 h-5 text-blue-600" /> Facebook Lead Ads Ingestion
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Subscribe ActiveRehab's Facebook Lead Ad forms to this webhook for instant lead capture and automated WhatsApp triggers.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Facebook Leadgen Webhook URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={fbWebhookUrl}
                  className="flex-1 px-3 py-2 border rounded-xl font-mono text-xs bg-slate-100 text-slate-700 select-all truncate"
                />
                <button
                  onClick={() => copyToClipboard(fbWebhookUrl, "fb_callback")}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border rounded-xl font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied === "fb_callback" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-[11px] text-blue-950">
              <span className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> Webhook Setup:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-blue-900 leading-relaxed">
                <li>Go to developers.facebook.com ➔ Webhooks ➔ Page</li>
                <li>Subscribe to <code className="bg-blue-100 px-1 rounded">leadgen</code> event</li>
                <li>Paste the Webhook Callback URL and Verify Token</li>
              </ol>
            </div>
          </div>

          {/* ActiveRehab Official Centres & Doctor Profile */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-blue-600" /> ActiveRehab Odisha Centres
            </h4>
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-2 text-slate-700">
              <div>
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" /> Bhubaneswar Centre:
                </p>
                <p className="text-slate-600 pl-4">
                  1st Floor, Pramila Tower, behind Pantaloons, Sishu Vihar, Patia, Bhubaneswar, Odisha 751024
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> Cuttack Centre:
                </p>
                <p className="text-slate-600 pl-4">
                  Vishwas Rehab Centre, Plot-C-1348/28, CDA Sector VI, Cuttack, Odisha 753014
                </p>
              </div>

              <div className="pt-1 border-t border-slate-200/80 flex items-center justify-between text-slate-800 font-medium">
                <span>📞 Odisha Helpline: +91 8260229039</span>
                <span>⏰ 9:00 AM – 9:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
