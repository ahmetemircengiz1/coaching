"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendCoachMessage } from "@/app/site/[domain]/dashboard/students/assign-actions";
import { useRealtimeMessages, type RealtimeMessage } from "@/lib/hooks/use-realtime-messages";

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  studentId: string;
  studentName: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export default function ChatClient({
  domain,
  conversations: initialConversations,
  selectedStudentId,
  initialMessages,
}: {
  domain: string;
  conversations: Conversation[];
  selectedStudentId: string | null;
  initialMessages: Message[];
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeStudentId, setActiveStudentId] = useState(selectedStudentId || conversations[0]?.studentId || null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showConversations, setShowConversations] = useState(!activeStudentId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewMessage = useCallback((msg: RealtimeMessage) => {
    if (msg.studentId !== activeStudentId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.studentId === msg.studentId
            ? { ...c, lastMessage: msg.content, lastMessageDate: msg.createdAt, unreadCount: c.unreadCount + 1 }
            : c
        )
      );
      return;
    }

    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
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
  }, [activeStudentId]);

  useRealtimeMessages({
    studentId: activeStudentId || "",
    onNewMessage: handleNewMessage,
  });

  const loadConversation = async (studentId: string) => {
    setActiveStudentId(studentId);
    setShowConversations(false);
    setLoadingMessages(true);

    try {
      const res = await fetch(`/api/coach/messages/${studentId}?domain=${domain}`);
      const data = await res.json();
      setMessages(data.messages || []);

      setConversations((prev) =>
        prev.map((c) => c.studentId === studentId ? { ...c, unreadCount: 0 } : c)
      );
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending || !activeStudentId) return;

    setSending(true);
    setInput("");

    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      senderId: "me",
      senderRole: "coach",
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.studentId === activeStudentId
          ? { ...c, lastMessage: content, lastMessageDate: new Date().toISOString() }
          : c
      )
    );

    try {
      await sendCoachMessage(domain, activeStudentId, content);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find((c) => c.studentId === activeStudentId);

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-4" style={{ color: "var(--dashboard-main-text)" }}>
      {/* Conversations List */}
      <div className={`${showConversations ? "block" : "hidden"} md:block w-full md:w-80 shrink-0`}>
        <Card className="h-full overflow-hidden flex flex-col" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
          <div className="p-4" style={{ borderBottom: "1px solid var(--dashboard-card-border)" }}>
            <h2 className="font-semibold text-sm">Sohbetler</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.length === 0 ? (
              <div className="p-6 text-center animate-fade-in">
                <p className="text-2xl mb-2">💬</p>
                <p className="text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>Henüz sohbet yok</p>
              </div>
            ) : (
              <div className="stagger-children">
              {conversations.map((conv) => (
                <button
                  key={conv.studentId}
                  onClick={() => loadConversation(conv.studentId)}
                  className="w-full text-left p-4 transition animate-fade-in"
                  style={{
                    borderBottom: "1px solid var(--dashboard-card-border)",
                    backgroundColor: activeStudentId === conv.studentId ? "color-mix(in srgb, var(--dashboard-accent) 10%, var(--dashboard-card-bg))" : "transparent",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 15%, var(--dashboard-card-bg))", color: "var(--dashboard-accent)" }}
                    >
                      {conv.studentName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{conv.studentName}</p>
                        {conv.unreadCount > 0 && (
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
                          >
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs truncate mt-0.5" style={{ color: "var(--dashboard-main-text-muted)" }}>{conv.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Chat Area */}
      <div className={`${!showConversations ? "block" : "hidden"} md:block flex-1 flex flex-col min-w-0`}>
        {!activeStudentId ? (
          <Card className="h-full flex items-center justify-center" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
            <CardContent className="text-center" style={{ color: "var(--dashboard-main-text-muted)" }}>
              <p className="text-4xl mb-3">💬</p>
              <p className="text-sm">Bir sohbet seçin</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 mb-3 px-1">
              <button
                onClick={() => setShowConversations(true)}
                className="md:hidden p-1.5 rounded-lg transition"
                style={{ color: "var(--dashboard-main-text-muted)" }}
              >
                ←
              </button>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-accent) 15%, var(--dashboard-card-bg))", color: "var(--dashboard-accent)" }}
              >
                {activeConv?.studentName.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-semibold text-sm">{activeConv?.studentName}</p>
                <p className="text-[11px] text-green-400">Çevrimiçi</p>
              </div>
            </div>

            {/* Messages */}
            <Card className="flex-1 overflow-hidden mb-3" style={{ backgroundColor: "var(--dashboard-card-bg)", borderColor: "var(--dashboard-card-border)" }}>
              <CardContent className="h-full overflow-y-auto p-4 custom-scrollbar">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse text-sm" style={{ color: "var(--dashboard-main-text-muted)" }}>Mesajlar yükleniyor...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center" style={{ color: "var(--dashboard-main-text-muted)" }}>
                      <p className="text-4xl mb-3">💬</p>
                      <p className="text-sm">Henüz mesaj yok</p>
                      <p className="text-xs mt-1">İlk mesajı gönderin!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderRole === "coach" ? "justify-end" : "justify-start"} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                            msg.senderRole === "coach"
                              ? "rounded-br-md"
                              : "rounded-bl-md"
                          } ${msg.id.startsWith("temp-") ? "opacity-70" : ""}`}
                          style={
                            msg.senderRole === "coach"
                              ? { backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }
                              : { backgroundColor: "color-mix(in srgb, var(--dashboard-main-text) 10%, var(--dashboard-card-bg))", color: "var(--dashboard-main-text)" }
                          }
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className="text-[10px] mt-1" style={{ opacity: 0.5 }}>
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

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
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
                style={{ backgroundColor: "var(--dashboard-accent)", color: "var(--dashboard-accent-text)" }}
              >
                {sending ? "..." : "Gönder"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
