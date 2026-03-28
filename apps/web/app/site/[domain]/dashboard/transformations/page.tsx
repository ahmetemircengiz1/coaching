import { getTransformations } from "./actions";
import TransformationsPageClient from "@/components/dashboard/transformations-page-client";

export default async function TransformationsPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const transformations = await getTransformations(domain);

  return (
    <TransformationsPageClient domain={domain} transformations={transformations} />
  );
}
