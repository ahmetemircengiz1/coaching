"use client";

import React, { useState } from "react";
import type { BlockDefinition } from "@/src/components/landing/blocks/manifest";
import { getCategoryColor } from "@/src/components/landing/blocks/manifest";

interface BlockThumbnailProps {
  block: BlockDefinition;
  className?: string;
}

/** Block thumbnail: gerçek PNG yüklenemezse kategori-renkli SVG placeholder gösterir. */
export function BlockThumbnail({ block, className }: BlockThumbnailProps) {
  const [errored, setErrored] = useState(false);
  const colors = getCategoryColor(block.category);

  if (errored) {
    return (
      <div
        className={className}
        style={{
          background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}cc 100%)`,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "8%",
            right: "8%",
            height: "8px",
            borderRadius: "4px",
            backgroundColor: colors.accent,
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "8%",
            width: "60%",
            height: "12px",
            borderRadius: "3px",
            backgroundColor: "#ffffff",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: "8%",
            width: "40%",
            height: "8px",
            borderRadius: "3px",
            backgroundColor: "#ffffff",
            opacity: 0.25,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            left: "8%",
            width: "30%",
            height: "20px",
            borderRadius: "6px",
            backgroundColor: colors.accent,
            opacity: 0.85,
          }}
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={block.thumbnailUrl}
      alt={block.name}
      className={className}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      onError={() => setErrored(true)}
    />
  );
}
