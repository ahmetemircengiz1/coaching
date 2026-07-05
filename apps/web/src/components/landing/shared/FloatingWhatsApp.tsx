"use client";

import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  whatsappUrl: string;
  whatsappNumber?: string | null;
}

export function FloatingWhatsApp({ whatsappUrl, whatsappNumber }: FloatingWhatsAppProps) {
  if (!whatsappNumber) return null;
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed bottom-5 left-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full shadow-[0_12px_28px_rgba(37,211,102,0.45)] transition-transform hover:scale-110 hover:shadow-[0_16px_32px_rgba(37,211,102,0.6)] animate-[pulse_2.4s_ease-in-out_infinite]"
      style={{ backgroundColor: "#25D366", color: "#ffffff" }}
    >
      <MessageCircle size={26} strokeWidth={2.25} />
      <span className="absolute inset-0 rounded-full ring-2 ring-[#25D366]/50 animate-ping" aria-hidden="true" />
    </a>
  );
}
