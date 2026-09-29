"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone, CheckCircle, Share, PlusSquare } from "lucide-react";

export default function InstallPwaModal() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Detect iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Chrome/Android PWA prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.log("Service Worker registration failed:", err);
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (isDismissed || (!isInstallable && !isIOS)) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-2 border-blue-500/40 text-white p-4 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-5 duration-300 text-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-orange-400 p-0.5 shrink-0 overflow-hidden shadow-md">
            <img src="/logo.jpg" alt="ActiveRehab" className="w-full h-full object-contain" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white leading-tight">
              Install ActiveRehab App
            </h4>
            <p className="text-[11px] text-blue-200 mt-0.5">
              Access WhatsApp CRM on your mobile home screen with 1 tap
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isIOS ? (
        <div className="mt-3 p-2.5 bg-blue-900/40 rounded-xl border border-blue-400/20 text-[11px] space-y-1 text-slate-200">
          <p className="font-semibold text-white">To install on iPhone/iPad:</p>
          <p className="flex items-center gap-1.5">
            1. Tap the <Share className="w-3.5 h-3.5 text-blue-400 inline" /> Share button in Safari
          </p>
          <p className="flex items-center gap-1.5">
            2. Scroll down & tap <PlusSquare className="w-3.5 h-3.5 text-blue-400 inline" /> <strong>"Add to Home Screen"</strong>
          </p>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold py-2 px-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Install App on Phone
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
          >
            Later
          </button>
        </div>
      )}
    </div>
  );
}
