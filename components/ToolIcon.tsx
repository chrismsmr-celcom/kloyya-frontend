import type { ToolRef } from "@/lib/types";

export function ToolIcon({ tool, size = 17 }: { tool: ToolRef; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-md bg-white border border-[#EAE6DE] flex-shrink-0"
      style={{ width: size, height: size }}
      title={tool.name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tool.icon}
        alt={tool.name}
        style={{ width: size * 0.55, height: size * 0.55, objectFit: "contain" }}
      />
    </span>
  );
}
