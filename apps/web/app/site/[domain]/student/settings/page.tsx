import { getStudentOrGuest } from "../actions";
import { GuestPreview } from "@/components/student/guest-preview";
import { StudentSettingsClient } from "./settings-client";

// Server kapı: misafirler salt-okunur örnek içerik görür, öğrenciler
// gerçek ayarlar sayfasını (client bileşeni) kullanır.
export default async function StudentSettingsPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const gate = await getStudentOrGuest(domain);
  if (gate.kind === "guest") {
    return (
      <div className="py-6">
        <GuestPreview page="settings" />
      </div>
    );
  }
  return <StudentSettingsClient />;
}
