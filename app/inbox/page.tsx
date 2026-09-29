"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Paperclip,
  CheckCheck,
  Bot,
  User,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Plus,
  Sparkles,
  FileText,
  Video,
  ChevronRight,
  Flame,
  Clock,
  Globe,
  Tag,
  Stethoscope,
  Smile,
} from "lucide-react";

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [activePatient, setActivePatient] = useState<any>(null);
  const [cannedResponses, setCannedResponses] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL, UNREAD
  const [searchTerm, setSearchTerm] = useState("");
  const [showCannedPicker, setShowCannedPicker] = useState(false);
  const [cannedLanguage, setCannedLanguage] = useState("All");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch(`/api/conversations?filter=${filter}`);
      const data = await res.json();
      if (data.success) {
        setConversations(data.data);
        if (!activeConvId && data.data.length > 0) {
          setActiveConvId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading conversations", err);
    }
  };

  // Fetch canned responses
  const fetchCanned = async () => {
    try {
      const res = await fetch("/api/canned-responses");
      const data = await res.json();
      if (data.success) setCannedResponses(data.data);
    } catch (err) {
      console.error("Error loading canned responses", err);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchCanned();
  }, [filter]);

  // When active conversation changes, fetch its messages and patient details
  const fetchActiveChat = async () => {
    if (!activeConvId) return;
    try {
      const resMsg = await fetch(`/api/conversations/${activeConvId}/messages`);
      const dataMsg = await resMsg.json();
      if (dataMsg.success) {
        setMessages(dataMsg.data);
      }

      const conv = conversations.find((c) => c.id === activeConvId);
      if (conv?.patientId) {
        const resP = await fetch(`/api/patients/${conv.patientId}`);
        const dataP = await resP.json();
        if (dataP.success) setActivePatient(dataP.data);
      }
    } catch (err) {
      console.error("Error loading active chat", err);
    }
  };

  useEffect(() => {
    fetchActiveChat();
    const interval = setInterval(fetchActiveChat, 2500);
    return () => clearInterval(interval);
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message as Clinic
  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim() || !activeConvId) return;

    setInputText("");
    setShowCannedPicker(false);
    setLoading(true);

    try {
      const res = await fetch(`/api/conversations/${activeConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: content,
          senderType: "CLINIC",
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchActiveChat();
        fetchConversations();
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setLoading(false);
    }
  };

  // Increment completed session
  const handleAddSession = async () => {
    if (!activePatient) return;
    const nextDone = Math.min((activePatient.sessionsDone || 0) + 1, activePatient.sessionsTotal || 10);
    try {
      const res = await fetch(`/api/patients/${activePatient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionsDone: nextDone }),
      });
      const data = await res.json();
      if (data.success) {
        setActivePatient(data.data);
        // Automatically send progress celebration on WhatsApp
        if (nextDone === activePatient.sessionsTotal) {
          handleSendMessage(` Congratulations ${activePatient.name}! You have completed all ${activePatient.sessionsTotal} sessions of your treatment package. Our team will follow up for your maintenance checkup!`);
        } else {
          handleSendMessage(`? Session ${nextDone} of ${activePatient.sessionsTotal} marked complete today. Keep up the good work and follow the prescribed home stretches!`);
        }
      }
    } catch (err) {
      console.error("Error incrementing session", err);
    }
  };

  // Update stage
  const handleStageChange = async (newStage: string) => {
    if (!activePatient) return;
    try {
      const res = await fetch(`/api/patients/${activePatient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      const data = await res.json();
      if (data.success) {
        setActivePatient(data.data);
        fetchConversations();
      }
    } catch (err) {
      console.error("Error updating stage", err);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchTerm) return true;
    const name = c.patient?.name?.toLowerCase() || "";
    const phone = c.patient?.phone || "";
    const cond = c.patient?.condition?.toLowerCase() || "";
    const s = searchTerm.toLowerCase();
    return name.includes(s) || phone.includes(s) || cond.includes(s);
  });

  const filteredCanned = cannedResponses.filter((c) => {
    if (cannedLanguage === "All") return true;
    return c.language === cannedLanguage;
  });

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* 1. Left Column: Conversations List */}
      <div className="w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
        {/* Search & Filters */}
        <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patients or conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 rounded-lg outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold">
            <button
              onClick={() => setFilter("ALL")}
              className={`flex-1 py-1 rounded-md text-center transition ${
                filter === "ALL"
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Chats ({conversations.length})
            </button>
            <button
              onClick={() => setFilter("UNREAD")}
              className={`flex-1 py-1 rounded-md text-center transition ${
                filter === "UNREAD"
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConvId;
            const lastMsg = conv.messages?.[0];
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3 cursor-pointer transition flex items-start gap-3 select-none ${
                  isSelected
                    ? "bg-cyan-50/80 border-l-4 border-cyan-600"
                    : "hover:bg-slate-100/70"
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-cyan-800 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {conv.patient?.name
                    ? conv.patient.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .substring(0, 2)
                    : "PT"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {conv.patient?.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Condition Tag */}
                  <p className="text-[10px] font-semibold text-cyan-700 truncate mt-0.5">
                    {conv.patient?.condition}
                  </p>

                  {/* Last Message Snippet */}
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {lastMsg ? lastMsg.text : "No messages yet"}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Middle Column: Active WhatsApp Chat Window */}
      <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
        {activePatient ? (
          <>
            {/* Chat Top Bar */}
            <div className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {activePatient.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {activePatient.name}
                    </h3>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
                      {activePatient.phone}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-cyan-600" />
                    <span>{activePatient.city || "Odisha"}</span>
                    <span>•</span>
                    <span className="text-cyan-700 font-semibold">{activePatient.condition}</span>
                  </p>
                </div>
              </div>

              {/* Stage Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Stage:</span>
                <select
                  value={activePatient.stage}
                  onChange={(e) => handleStageChange(e.target.value)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-cyan-500 shadow-xs cursor-pointer"
                >
                  <option value="NEW_ENQUIRY">1. New Enquiry</option>
                  <option value="ASSESSMENT_BOOKED">2. Assessment Booked</option>
                  <option value="ASSESSMENT_COMPLETED">3. Assessment Completed</option>
                  <option value="ACTIVE_TREATMENT">4. Active Treatment Package</option>
                  <option value="COMPLETED_RECOVERY">5. Recovered / 5-Star Reviews</option>
                  <option value="NO_SHOW_FOLLOWUP">6. Follow-up Needed</option>
                </select>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 whatsapp-chat-bg overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => {
                const isClinic = m.senderType === "CLINIC";
                const isPatient = m.senderType === "PATIENT";
                const isBot = m.senderType === "BOT";
                const isSystem = m.senderType === "SYSTEM";

                if (isSystem) {
                  return (
                    <div key={m.id} className="text-center my-2">
                      <span className="bg-slate-200 text-slate-700 text-[11px] px-3 py-1 rounded-full font-medium shadow-xs inline-block">
                        ? {m.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className={`flex ${isClinic || isBot ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-xs relative ${
                        isClinic
                          ? "bg-[#D9FDD3] text-slate-900 rounded-br-xs"
                          : isBot
                          ? "bg-cyan-50 text-cyan-950 border border-cyan-200 rounded-br-xs"
                          : "bg-white text-slate-900 rounded-bl-xs"
                      }`}
                    >
                      {/* Message Author Label */}
                      <div className="flex items-center gap-1 text-[10px] font-bold mb-1">
                        {isClinic && <span className="text-[#00A884]">Clinic Staff / Dr. Mishra</span>}
                        {isBot && (
                          <span className="text-cyan-700 flex items-center gap-1">
                            <Bot className="w-3 h-3" /> Auto-Bot Reply
                          </span>
                        )}
                        {isPatient && <span className="text-slate-600">{activePatient.name}</span>}
                      </div>

                      <p className="whitespace-pre-line leading-relaxed text-slate-800">{m.text}</p>

                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                        <span>
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {(isClinic || isBot) && (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Odia / English Canned Responses Bar */}
            <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-x-auto select-none py-0.5">
                <span className="text-slate-500 font-bold text-[11px] shrink-0">
                  Quick Send:
                </span>
                <button
                  onClick={() => setShowCannedPicker(!showCannedPicker)}
                  className="px-2.5 py-1 bg-cyan-600 text-white rounded-lg font-bold text-[11px] hover:bg-cyan-700 transition flex items-center gap-1 shrink-0"
                >
                  <Globe className="w-3 h-3" /> Canned Snippets (?/Eng)
                </button>
                <button
                  onClick={() =>
                    handleSendMessage(
                      ` *Clinic Location:* Plot No. 420, Saheed Nagar, Bhubaneswar.\nGoogle Maps: https://maps.google.com/?q=Saheed+Nagar+Bhubaneswar`
                    )
                  }
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition shrink-0"
                >
                  ?Clinic Location
                </button>
                <button
                  onClick={() =>
                    handleSendMessage(
                      ` *Clinic Packages:* Initial Assessment: ?800 | 10-Session Decompression & Spine Alignment: ?8,500. Let us know when you would like to book.`
                    )
                  }
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition shrink-0"
                >
                   Pricing Packages
                </button>
                <button
                  onClick={() =>
                    handleSendMessage(
                      ` *Home Exercise Protocol:* Here is your guided lower back & sciatica stretch routine video: https://spinecare.odisha/rehab-exercises`
                    )
                  }
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition shrink-0"
                >
                   Home Exercises
                </button>
              </div>
            </div>

            {/* Canned Snippet Picker Dropdown Drawer */}
            {showCannedPicker && (
              <div className="bg-white border-t border-slate-300 p-4 max-h-56 overflow-y-auto animate-in slide-in-from-bottom-2 duration-150 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="font-bold text-xs text-slate-800">
                    Select 1-Click Clinic Response
                  </span>
                  <div className="flex gap-1 text-[10px]">
                    {["All", "Odia", "English", "Hindi"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setCannedLanguage(lang)}
                        className={`px-2 py-0.5 rounded font-semibold ${
                          cannedLanguage === lang
                            ? "bg-cyan-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredCanned.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSendMessage(c.message)}
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 cursor-pointer transition text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-800">{c.title}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          {c.language}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{c.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Composer Input */}
            <div className="bg-white p-3 border-t border-slate-200 flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a WhatsApp message to patient... (or click quick send buttons above)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                className="flex-1 bg-slate-100 px-4 py-2.5 rounded-xl text-xs outline-none border border-slate-200 focus:bg-white focus:border-cyan-500 transition"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !inputText.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-xs shadow-md hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Select a conversation to start chatting
          </div>
        )}
      </div>

      {/* 3. Right Column: Patient Clinical Summary Sheet */}
      {activePatient && (
        <div className="w-80 border-l border-slate-200 bg-white p-5 flex flex-col shrink-0 overflow-y-auto space-y-5 text-xs">
          {/* Header Card */}
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md mb-2">
              {activePatient.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .substring(0, 2)}
            </div>
            <h3 className="font-bold text-sm text-slate-900">{activePatient.name}</h3>
            <p className="text-[11px] text-slate-500">{activePatient.phone}</p>
            <p className="text-[11px] text-cyan-700 font-semibold mt-1">
              Source: {activePatient.leadSource}
            </p>
          </div>

          {/* Condition & Pain Score */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-600 text-[11px]">Condition</span>
              <span className="font-bold text-cyan-800 text-[11px]">
                {activePatient.condition}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
              <span className="font-semibold text-slate-600 text-[11px]">Pain Level (VAS)</span>
              <span
                className={`font-black text-xs px-2 py-0.5 rounded ${
                  activePatient.painScore >= 8
                    ? "bg-red-100 text-red-700"
                    : activePatient.painScore >= 5
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {activePatient.painScore}/10
              </span>
            </div>
          </div>

          {/* Treatment Package & Multi-Session Progress */}
          <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 text-xs">Care Package</span>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-800 leading-tight">
              {activePatient.packageName || "10 Sessions Spine Alignment"}
            </p>

            {/* Session Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-emerald-900">
                <span>Sessions Attended:</span>
                <span>
                  {activePatient.sessionsDone || 0} / {activePatient.sessionsTotal || 10}
                </span>
              </div>
              <div className="w-full bg-emerald-200/70 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((activePatient.sessionsDone || 0) /
                        (activePatient.sessionsTotal || 10)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <button
              onClick={handleAddSession}
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Mark Today's Session Completed
            </button>
          </div>

          {/* Doctor & Notes */}
          <div className="space-y-2 text-[11px]">
            <div>
              <span className="font-semibold text-slate-500">Assigned Doctor:</span>
              <p className="font-bold text-slate-800">{activePatient.assignedDoctor}</p>
            </div>

            <div>
              <span className="font-semibold text-slate-500">Clinical Notes:</span>
              <p className="text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1 leading-relaxed">
                {activePatient.notes || "No notes recorded yet."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
