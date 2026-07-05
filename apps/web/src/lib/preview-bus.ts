const CHANNEL_NAME = "coach-landing-preview";

let channel: BroadcastChannel | null = null;

// Bu sekmenin tabId'si — multi-tab conflict tespiti için
let _tabId: string | null = null;
export function getTabId(): string {
  if (typeof window === "undefined") return "ssr";
  if (!_tabId) {
    _tabId = `tab-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
  }
  return _tabId;
}

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!channel) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch {
      return null;
    }
  }
  return channel;
}

export interface PreviewBusMessage {
  type: "refresh";
  t: number;
  senderId: string;
}

export function notifyPreviewRefresh() {
  const ch = getChannel();
  const message: PreviewBusMessage = { type: "refresh", t: Date.now(), senderId: getTabId() };
  if (ch) {
    ch.postMessage(message);
  } else if (typeof window !== "undefined") {
    // Fallback: same-tab custom event
    window.dispatchEvent(new CustomEvent("coach-preview-refresh"));
  }
}

export function onPreviewRefresh(callback: (senderId?: string) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const ch = getChannel();
  const handler = (e: MessageEvent<PreviewBusMessage>) => {
    if (e.data?.type === "refresh") callback(e.data.senderId);
  };
  const eventHandler = () => callback();
  if (ch) ch.addEventListener("message", handler);
  window.addEventListener("coach-preview-refresh", eventHandler);
  return () => {
    if (ch) ch.removeEventListener("message", handler);
    window.removeEventListener("coach-preview-refresh", eventHandler);
  };
}
