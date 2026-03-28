import { getProgramsList } from "../actions";
import ProgramsPageClient from "@/components/dashboard/programs-page-client";

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const { programs } = await getProgramsList(domain);

  return <ProgramsPageClient domain={domain} programs={programs} />;
}
