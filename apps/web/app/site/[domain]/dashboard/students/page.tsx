import { getStudentsList } from "../actions";
import { listRegistrationCodes } from "./actions";
import { StudentsPageClient } from "@/components/dashboard/students-page-client";

export default async function StudentsPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const [{ students, coach }, codes] = await Promise.all([
    getStudentsList(domain),
    listRegistrationCodes(domain),
  ]);

  return (
    <StudentsPageClient
      domain={domain}
      students={students}
      maxStudents={coach.package.maxStudents}
      packages={coach.coachPackages.map((p) => ({ id: p.id, name: p.name }))}
      codes={codes}
    />
  );
}
