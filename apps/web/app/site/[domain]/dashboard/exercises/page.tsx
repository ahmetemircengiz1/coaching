import { getExercises, getExerciseCategories } from "./actions";
import ExercisesPageClient from "@/components/dashboard/exercises-page-client";

export default async function ExercisesPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const [exercises, categories] = await Promise.all([
    getExercises(domain),
    getExerciseCategories(domain),
  ]);

  return (
    <ExercisesPageClient
      domain={domain}
      exercises={exercises}
      categories={categories}
    />
  );
}
