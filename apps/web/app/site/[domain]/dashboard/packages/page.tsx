import { getCoachPackages } from "./actions";
import PackagesPageClient from "@/components/dashboard/packages-page-client";

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const packages = await getCoachPackages(domain);

  return <PackagesPageClient domain={domain} packages={packages} />;
}
