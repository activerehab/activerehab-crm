"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import WhatsAppSimulator from "../components/WhatsAppSimulator";
import MobileBottomNav from "../components/MobileBottomNav";
import InstallPwaModal from "../components/InstallPwaModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [activePatientId, setActivePatientId] = useState<string | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Global Realtime SSE connection
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/events");
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (["NEW_MESSAGE", "FACEBOOK_LEAD_RECEIVED", "PATIENT_CREATED", "PATIENT_UPDATED"].includes(data.event)) {
            setRefreshTrigger((prev) => prev + 1);
          }
        } catch (e) {
          console.error("SSE parse error", e);
        }
      };
    } catch (err) {
      console.error("SSE initialization error", err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>ActiveRehab CRM | Chiropractic & Osteopathy Centre</title>
        <meta name="description" content="ActiveRehab Chiropractic & Osteopathy Centre - Patient Care & WhatsApp Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="theme-color" content="#0284C7" />
        
        {/* PWA Settings */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ActiveRehab" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-900 pb-16 md:pb-0">
        {/* Sidebar (Desktop) */}
        <div className="hidden md:flex shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onRefreshData={() => setRefreshTrigger((prev) => prev + 1)}
          />

          <main className="flex-1 overflow-y-auto bg-slate-50 relative">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar (Phones) */}
        <MobileBottomNav />

        {/* In-App PWA Install Banner */}
        <InstallPwaModal />

        {/* Global Interactive Mobile WhatsApp Simulator */}
        <WhatsAppSimulator
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          activePatientId={activePatientId}
        />
      </body>
    </html>
  );
}
