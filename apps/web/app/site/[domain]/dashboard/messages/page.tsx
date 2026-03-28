import { getMessagesList } from "../actions";
import { getConversationMessages } from "./actions";
import ChatClient from "@/components/dashboard/chat-client";

export default async function MessagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ student?: string }>;
}) {
  const { domain } = await params;
  const { student: selectedStudentId } = await searchParams;
  const { conversations } = await getMessagesList(domain);

  // Seçili öğrenci varsa mesajları getir
  let initialMessages: { id: string; senderId: string; senderRole: string; content: string; createdAt: string; isRead: boolean }[] = [];
  const targetStudentId = selectedStudentId || conversations[0]?.studentId || null;

  if (targetStudentId) {
    const data = await getConversationMessages(domain, targetStudentId);
    initialMessages = data.messages;
  }

  return (
    <div className="h-full">
      <h1 className="font-heading text-2xl font-bold mb-4">Mesajlar</h1>
      <ChatClient
        domain={domain}
        conversations={conversations}
        selectedStudentId={targetStudentId}
        initialMessages={initialMessages}
      />
    </div>
  );
}
