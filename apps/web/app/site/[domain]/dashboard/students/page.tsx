import { getStudentsList } from "../actions";
import { StudentsPageClient } from "@/components/dashboard/students-page-client";

export default async function StudentsPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const { students, coach } = await getStudentsList(domain);

  return (
    <StudentsPageClient
      domain={domain}
      students={students}
      maxStudents={coach.package.maxStudents}
    />
  );
}
