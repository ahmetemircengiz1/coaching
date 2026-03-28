"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useNotifications(userId: string, initialCount = 0) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `recipientId=eq.${userId}`,
        },
        () => {
          setCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const resetCount = () => setCount(0);

  return { count, resetCount };
}
