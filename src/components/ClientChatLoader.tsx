// src/components/ClientChatLoader.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// dynamic import keeps the widget off the server and out of the initial JS.
// ChatWidgetClient should be a client component (it probably is).
const ChatWidgetClient = dynamic(() => import("@/components/ChatWidgetClient"), {
  ssr: false,
  loading: () => null,
});

export default function ClientChatLoader() {
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    let idleId: number | null = null;

    if (typeof (window as any).requestIdleCallback === "function") {
      idleId = (window as any).requestIdleCallback(() => setShowChat(true), { timeout: 2000 });
    } else {
      idleId = window.setTimeout(() => setShowChat(true), 2000);
    }

    return () => {
      if (idleId !== null) {
        if (typeof (window as any).cancelIdleCallback === "function") {
          (window as any).cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId);
        }
      }
    };
  }, []);

  return showChat ? <ChatWidgetClient /> : null;
}
