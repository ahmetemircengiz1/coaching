import { notFound } from "next/navigation";
import { getBlock } from "@/src/components/landing/blocks/manifest";
import { SAMPLE_BLOCK_CONTENT, SAMPLE_GLOBAL_STYLES } from "./sample-data";

export const dynamic = "force-dynamic";

/**
 * İzole blok render route'u — sadece dev ortamında thumbnail yakalama için kullanılır.
 * /dev/block-preview/hero-cinematic gibi.
 *
 * Production'a deploy olmamalı; middleware/robots ile kapatılabilir, ama route
 * `dev/` altında olduğu için coach UI'sıyla karışmıyor.
 */
export default async function BlockPreviewPage({
  params,
}: {
  params: Promise<{ blockId: string }>;
}) {
  const { blockId } = await params;
  const block = getBlock(blockId);
  if (!block) notFound();

  const Component = block.component;
  return (
    <div style={{ width: "1280px", overflow: "hidden", isolation: "isolate" }} data-block-id={blockId}>
      <Component content={SAMPLE_BLOCK_CONTENT} config={SAMPLE_GLOBAL_STYLES} />
    </div>
  );
}
