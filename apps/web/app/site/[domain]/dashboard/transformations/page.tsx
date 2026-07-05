import { getTransformations } from "./actions";
import TransformationsPageClient from "@/components/dashboard/transformations-page-client";

export default async function TransformationsPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const transformations = await getTransformations(domain);

  // Prisma JsonValue tipini client'ın beklediği CustomStat[] | null'a daralt.
  // Geçersiz/eski JSON kayıtları null'a düşer; client zaten Array.isArray kontrolü yapar.
  const normalized = transformations.map((t) => ({
    ...t,
    customStats: Array.isArray(t.customStats)
      ? (t.customStats as { label: string; value: string }[])
      : null,
  }));

  return (
    <TransformationsPageClient domain={domain} transformations={normalized} />
  );
}
