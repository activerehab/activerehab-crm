"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Smartphone,
  CheckCheck,
  PhoneCall,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Bot,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function WhatsAppSimulator({
  isOpen,
  onClose,
  activePatientId,
}: {
  isOpen: boolean;
  onClose: () => void;
  activePatientId?: string;
}) {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all patients with conversations
  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients");
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setPatients(data.data);
        if (activePatientId) {
          setSelectedPatientId(activePatientId);
        } else if (!selectedPatientId) {
          setSelectedPatientId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load patients for simulator", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen, activePatientId]);

  // Fetch messages for selected patient
  const fetchMessages = async () => {
    if (!selectedPatientId) return;
    try {
      const patient = patients.find((p) => p.id === selectedPatientId);
      if (!patient?.conversation?.id) {
        const resP = await fetch(`/api/patients/${selectedPatientId}`);
        const dataP = await resP.json();
        if (dataP.data?.conversation?.id) {
          const resMsg = await fetch(`/api/conversations/${dataP.data.conversation.id}/messages`);
          const dataMsg = await resMsg.json();
          if (dataMsg.success) setMessages(dataMsg.data);
        }
        return;
      }

      const res = await fetch(`/api/conversations/${patient.conversation.id}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error("Error fetching simulator messages", err);
    }
  };

  useEffect(() => {
    if (selectedPatientId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedPatientId, patients]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const sendMessageAsPatient = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !selectedPatient) return;

    let convId = selectedPatient.conversation?.id;
    if (!convId) {
      const resP = await fetch(`/api/patients/${selectedPatientId}`);
      const dataP = await resP.json();
      convId = dataP.data?.conversation?.id;
    }

    if (!convId) return;

    setInputText("");
    setLoading(true);

    try {
      const res = await fetch(`/api/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSend,
          senderType: "PATIENT",
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to send simulator message", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-slate-800 w-full max-w-sm sm:max-w-md h-[92vh] flex flex-col overflow-hidden relative">
        {/* Mobile Phone Top Notch / Speaker bar */}
        <div className="bg-slate-900 py-2 px-6 flex items-center justify-between text-slate-400 text-xs select-none">
          <span className="font-semibold text-white">9:41</span>
          <div className="w-16 h-3.5 bg-slate-800 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          </div>
          <div className="flex items-center gap-1.5 text-white">
            <span className="text-[10px] bg-emerald-500 text-black px-1 rounded font-bold">5G</span>
            <span>100%</span>
            <button
              onClick={onClose}
              className="ml-2 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Patient Switcher Toolbar */}
        <div className="bg-slate-800 px-3 py-2 border-b border-slate-700 flex items-center justify-between text-xs text-white">
          <span className="text-slate-400 text-[11px] font-medium">Testing as Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="bg-slate-700 text-white rounded-md px-2 py-1 text-xs outline-none border border-slate-600 max-w-[200px] truncate"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.condition.split("/")[0]})
              </option>
            ))}
          </select>
        </div>

        {/* WhatsApp App Header with ActiveRehab Logo */}
        <div className="bg-[#075E54] px-4 py-2.5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-black border border-orange-400/40 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              <img
                src="/logo.jpg"
                alt="ActiveRehab"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs leading-tight flex items-center gap-1 truncate">
                ActiveRehab Chiro & Osteo
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
              </h4>
              <p className="text-[10px] text-teal-200 truncate">Official Verified Clinic Account</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-teal-100">
            <Video className="w-4 h-4" />
            <PhoneCall className="w-4 h-4" />
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        {/* WhatsApp Chat Messages Window */}
        <div className="flex-1 p-3 whatsapp-chat-bg overflow-y-auto space-y-2 text-xs">
          {/* Encryption Note */}
          <div className="text-center my-1">
            <span className="bg-[#FFEECD] text-[#54656F] text-[10px] px-2.5 py-1 rounded-md shadow-xs inline-block max-w-[90%] leading-tight font-medium">
              🔒 Messages and calls are end-to-end encrypted. No one outside of this chat can read them.
            </span>
          </div>

          {messages.map((m) => {
            const isPatient = m.senderType === "PATIENT";
            const isSystem = m.senderType === "SYSTEM";
            const isBot = m.senderType === "BOT";

            if (isSystem) {
              return (
                <div key={m.id} className="text-center my-1">
                  <span className="bg-slate-200/90 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-medium shadow-xs">
                    ℹ️ {m.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={m.id}
                className={`flex ${isPatient ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs shadow-xs relative ${
                    isPatient
                      ? "bg-[#D9FDD3] text-slate-900 rounded-br-xs"
                      : "bg-white text-slate-900 rounded-bl-xs"
                  }`}
                >
                  {!isPatient && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#00A884] mb-0.5">
                      {isBot ? (
                        <>
                          <Bot className="w-3 h-3 text-blue-600" />
                          <span>ActiveRehab Auto-Assistant</span>
                        </>
                      ) : (
                        <span>ActiveRehab Doctor / Staff</span>
                      )}
                    </div>
                  )}
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-500">
                    <span>
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isPatient && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Test Triggers */}
        <div className="bg-slate-100 p-2 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap select-none">
          <span className="text-slate-500 text-[10px] font-bold">Quick test:</span>
          <button
            onClick={() => sendMessageAsPatient("What are your fees and package pricing?")}
            className="px-2 py-1 bg-white border border-slate-300 rounded-full hover:bg-orange-50 hover:border-orange-400 text-slate-700 transition"
          >
            💰 "Fees & Packages?"
          </button>
          <button
            onClick={() => sendMessageAsPatient("Where is ActiveRehab clinic located in Bhubaneswar?")}
            className="px-2 py-1 bg-white border border-slate-300 rounded-full hover:bg-blue-50 hover:border-blue-400 text-slate-700 transition"
          >
            📍 "Clinic Location?"
          </button>
          <button
            onClick={() => sendMessageAsPatient("What are your Sunday clinic timings?")}
            className="px-2 py-1 bg-white border border-slate-300 rounded-full hover:bg-emerald-50 hover:border-emerald-400 text-slate-700 transition"
          >
            ⏰ "Timings?"
          </button>
          <button
            onClick={() => sendMessageAsPatient("How does Chiropractic & Osteopathy relieve severe Sciatica?")}
            className="px-2 py-1 bg-white border border-slate-300 rounded-full hover:bg-blue-50 hover:border-blue-400 text-slate-700 transition"
          >
            🦴 "Sciatica Relief?"
          </button>
        </div>

        {/* Patient Message Input Bar */}
        <div className="bg-[#F0F2F5] px-3 py-2 flex items-center gap-2 border-t border-slate-300">
          <Smile className="w-5 h-5 text-slate-500 cursor-pointer" />
          <Paperclip className="w-5 h-5 text-slate-500 cursor-pointer" />
          <input
            type="text"
            placeholder="Type message as patient..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessageAsPatient();
            }}
            className="flex-1 bg-white px-3 py-2 rounded-full text-xs outline-none border border-slate-200 focus:border-emerald-500"
          />
          {inputText.trim() ? (
            <button
              onClick={() => sendMessageAsPatient()}
              disabled={loading}
              className="p-2 rounded-full bg-[#00A884] text-white hover:bg-[#075E54] transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button className="p-2 rounded-full bg-[#00A884] text-white hover:bg-[#075E54] transition shadow-xs">
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
