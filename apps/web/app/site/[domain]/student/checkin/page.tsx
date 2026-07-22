import { getStudentOrGuest } from "../actions";
import { GuestPreview } from "@/components/student/guest-preview";
import { StudentCheckInClient } from "./checkin-client";

// Server kapı: misafirler salt-okunur örnek içerik görür, öğrenciler
// gerçek check-in formunu (client bileşeni) kullanır.
export default async function StudentCheckInPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const gate = await getStudentOrGuest(domain);
  if (gate.kind === "guest") {
    return (
      <div className="py-6">
        <GuestPreview page="checkin" />
      </div>
    );
  }
  return <StudentCheckInClient />;
}
