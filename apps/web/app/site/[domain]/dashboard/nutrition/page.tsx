import { getNutritionPlans } from "./actions";
import NutritionPageClient from "@/components/dashboard/nutrition-page-client";

export default async function NutritionPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const plans = await getNutritionPlans(domain);

  return (
    <NutritionPageClient domain={domain} plans={plans} />
  );
}
