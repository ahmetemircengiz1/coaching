"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppFabProps {
  whatsappNumber: string | null;
  brandName: string;
}

export function WhatsAppFab({ whatsappNumber, brandName }: WhatsAppFabProps) {
  if (!whatsappNumber) return null;

  const cleanNumber = whatsappNumber.replace(/[^+\d]/g, "").replace(/^\+/, "");
  const message = `Merhaba, ${brandName} koçluk hizmeti hakkında bilgi almak istiyorum.`;
  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl lg:bottom-6 lg:right-6"
      style={{ backgroundColor: "#25D366" }}
      title="WhatsApp ile Kocunuza Ulasin"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </a>
  );
}
