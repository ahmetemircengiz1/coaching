"use client";

import { useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface RealtimeMessage {
  id: string;
  studentId: string;
  senderId: string;
  senderRole: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface UseRealtimeMessagesOptions {
  studentId: string;
  onNewMessage: (message: RealtimeMessage) => void;
}

export function useRealtimeMessages({ studentId, onNewMessage }: UseRealtimeMessagesOptions) {
  const handleNewMessage = useCallback(onNewMessage, [onNewMessage]);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;

    channel = supabase
      .channel(`messages:${studentId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `studentId=eq.${studentId}`,
        },
        (payload) => {
          const msg = payload.new as Record<string, unknown>;
          handleNewMessage({
            id: msg.id as string,
            studentId: msg.studentId as string,
            senderId: msg.senderId as string,
            senderRole: msg.senderRole as string,
            content: msg.content as string,
            isRead: msg.isRead as boolean,
            createdAt: msg.createdAt as string,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId, handleNewMessage]);
}

// Okunmamış mesaj sayısı için realtime hook
interface UseRealtimeUnreadOptions {
  coachId: string;
  onUpdate: (count: number) => void;
  currentCount: number;
}

export function useRealtimeUnread({ coachId, onUpdate, currentCount }: UseRealtimeUnreadOptions) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`unread:${coachId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `senderRole=eq.student`,
        },
        () => {
          // Yeni öğrenci mesajı geldiğinde sayacı artır
          onUpdate(currentCount + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coachId, onUpdate, currentCount]);
}
