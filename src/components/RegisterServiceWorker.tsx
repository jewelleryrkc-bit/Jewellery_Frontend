"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/static/service-worker.js")
        .then(() => console.log("✅ Service Worker registered"))
        .catch((err) => console.warn("❌ Service Worker registration failed", err));
    }
  }, []);

  return null; // No UI needed
}
