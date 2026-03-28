import { getProgram } from "../actions";
import { getExercises } from "../../exercises/actions";
import ProgramBuilder from "@/components/dashboard/program-builder";
import { notFound } from "next/navigation";

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ domain: string; programId: string }>;
}) {
  const { domain, programId } = await params;
  const [program, exercises] = await Promise.all([
    getProgram(domain, programId),
    getExercises(domain),
  ]);

  if (!program) {
    notFound();
  }

  return (
    <ProgramBuilder
      domain={domain}
      program={program}
      exercises={exercises.map((e) => ({
        id: e.id,
        name: e.name,
        category: e.category,
      }))}
    />
  );
}
