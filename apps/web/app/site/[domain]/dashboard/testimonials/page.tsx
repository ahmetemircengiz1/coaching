import { getTestimonials } from "./actions";
import TestimonialsPageClient from "@/components/dashboard/testimonials-page-client";

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const testimonials = await getTestimonials(domain);

  return (
    <TestimonialsPageClient domain={domain} testimonials={testimonials} />
  );
}
