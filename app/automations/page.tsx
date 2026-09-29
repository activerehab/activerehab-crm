"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Plus,
  MessageSquare,
  Globe,
  CheckCircle2,
  Zap,
  Activity,
} from "lucide-react";

export default function AutomationsPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [canned, setCanned] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("rules"); // "rules" or "canned"
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resR, resC] = await Promise.all([
        fetch("/api/automations"),
        fetch("/api/canned-responses"),
      ]);
      const dataR = await resR.json();
      const dataC = await resC.json();
      if (dataR.success) setRules(dataR.data);
      if (dataC.success) setCanned(dataC.data);
    } catch (err) {
      console.error("Error loading automations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" /> WhatsApp Bot & Auto-Responders
          </h2>
          <p className="text-xs text-slate-500">
            Keyword-based instant responses, 24/7 enquiry handling, and multilingual Odia/English/Hindi canned snippets
          </p>
        </div>

        <div className="flex bg-slate-200 p-1 rounded-xl text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("rules")}
            className={`px-4 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "rules" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Keyword Bot Rules ({rules.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("canned")}
            className={`px-4 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "canned" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Canned Snippets ({canned.length})</span>
          </button>
        </div>
      </div>

      {activeTab === "rules" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" /> {rule.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Trigger Keywords:{" "}
                      <span className="font-mono text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 font-semibold">
                        {rule.triggerKeyword}
                      </span>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {rule.responseText}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {canned.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{c.title}</span>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                  {c.language} ({c.shortcut})
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold">{c.category}</p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-line leading-relaxed text-slate-700">
                {c.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
