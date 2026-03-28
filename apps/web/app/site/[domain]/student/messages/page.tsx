import { getStudentMessages } from "../actions";
import MessagesClient from "@/components/student/messages-client";

export default async function StudentMessagesPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const { student, messages } = await getStudentMessages(domain);

  return (
    <MessagesClient
      domain={domain}
      messages={messages}
      coachName={student.coach.brandName || student.coach.name}
      studentId={student.id}
    />
  );
}
