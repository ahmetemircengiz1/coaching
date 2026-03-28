"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendMessage } from "@/app/site/[domain]/student/actions";
import { useRealtimeMessages, type RealtimeMessage } from "@/lib/hooks/use-realtime-messages";

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export default function MessagesClient({
  domain,
  messages: initialMessages,
  coachName,
  studentId,
}: {
  domain: string;
  messages: Message[];
  coachName: string;
  studentId: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime: yeni mesaj geldiğinde ekle
  const handleNewMessage = useCallback((msg: RealtimeMessage) => {
    setMessages((prev) => {
      // Duplicate kontrolü (optimistic update'ten gelen veya zaten var olan)
      if (prev.some((m) => m.id === msg.id)) return prev;
      // Temp mesajı kaldır (kendi gönderdiğimiz)
      const filtered = prev.filter((m) => !m.id.startsWith("temp-"));
      return [...filtered, {
        id: msg.id,
        senderId: msg.senderId,
        senderRole: msg.senderRole,
        content: msg.content,
        createdAt: msg.createdAt,
        isRead: msg.isRead,
      }];
    });
  }, []);

  useRealtimeMessages({ studentId, onNewMessage: handleNewMessage });

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setInput("");

    // Optimistic update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      senderId: "me",
      senderRole: "student",
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await sendMessage(domain, content);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] py-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            backgroundColor: "var(--dashboard-card-bg)",
            color: "var(--dashboard-main-text)",
          }}
        >
          {coachName.charAt(0)}
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold" style={{ color: "var(--dashboard-main-text)" }}>{coachName}</h1>
          <p className="text-[11px] text-green-400">Çevrimiçi</p>
        </div>
      </div>

      {/* Messages Area */}
      <Card
        className="flex-1 mb-4 overflow-hidden"
        style={{
          backgroundColor: "color-mix(in srgb, var(--dashboard-card-bg) 60%, var(--dashboard-main-bg))",
          borderColor: "var(--dashboard-card-border)",
        }}
      >
        <CardContent className="h-full overflow-y-auto p-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center" style={{ color: "var(--dashboard-main-text-muted)" }}>
                <p className="text-4xl mb-3">💬</p>
                <p className="text-sm">Henüz mesaj yok.</p>
                <p className="text-xs mt-1">Koçunla iletişime geç!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderRole === "student" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      msg.senderRole === "student"
                        ? "rounded-br-md"
                        : "rounded-bl-md"
                    } ${msg.id.startsWith("temp-") ? "opacity-70" : ""}`}
                    style={
                      msg.senderRole === "student"
                        ? {
                            backgroundColor: "var(--dashboard-accent)",
                            color: "var(--dashboard-accent-text)",
                          }
                        : {
                            backgroundColor: "var(--dashboard-card-bg)",
                            color: "var(--dashboard-main-text)",
                          }
                    }
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p
                      className="text-[10px] mt-1"
                      style={{
                        opacity: 0.5,
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..."
          className="flex-1"
          style={{
            backgroundColor: "var(--dashboard-card-bg)",
            borderColor: "var(--dashboard-card-border)",
            color: "var(--dashboard-main-text)",
          }}
          disabled={sending}
          autoFocus
        />
        <Button
          type="submit"
          disabled={sending || !input.trim()}
          className="font-semibold px-6 disabled:opacity-50 hover:opacity-90"
          style={{
            backgroundColor: "var(--dashboard-accent)",
            color: "var(--dashboard-accent-text)",
          }}
        >
          {sending ? "..." : "Gönder"}
        </Button>
      </form>
    </div>
  );
}
