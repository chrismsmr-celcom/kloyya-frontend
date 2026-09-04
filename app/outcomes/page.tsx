"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ToolIcon } from "@/components/ToolIcon";
import { StatGrid } from "@/components/StatGrid";
import { api } from "@/lib/api";
import type { OutcomeSummary, OutcomeStatus } from "@/lib/types";

const STATUS_STYLE: Record<OutcomeStatus, { bg: string; fg: string; label: string }> = {
  draft: { bg: "#F2EEE6", fg: "#6B675F", label: "DRAFT" },
  planned: { bg: "#FDF4E7", fg: "#8C5A13", label: "PLANNED" },
  running: { bg: "#EDF2FD", fg: "#2159C5", label: "RUNNING" },
  delivered: { bg: "#EDF6F1", fg: "#2C7A55", label: "DELIVERED" },
  failed: { bg: "#FBEAE6", fg: "#A8412C", label: "FAILED" },
};

const IMPACT = [
  { label: "Outcomes this month", value: "12", sub: "+4 vs last month", delta: "▲ 33%", deltaColor: "#2C7A55" },
  { label: "Hours saved", value: "38", sub: "estimated", delta: "▲ 12%", deltaColor: "#2C7A55" },
  { label: "At risk found", value: "$412k", sub: "across 2 outcomes", delta: "", deltaColor: "" },
  { label: "Awaiting your review", value: "2", sub: "plans & drafts", delta: "", deltaColor: "" },
];

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.round(hr / 24)}d ago`;
}

export default function OutcomesDashboardPage() {
  const [outcomes, setOutcomes] = useState<OutcomeSummary[] | null>(null);

  useEffect(() => {
    api.outcomes.list().then(setOutcomes);
  }, []);

  return (
    <AppShell>
      <div className="h-[52px] border-b border-border2 flex items-center px-6 gap-2.5 bg-cream flex-shrink-0">
        <span className="text-[13px] font-medium">Outcomes</span>
        <span className="font-mono text-[11px] text-muted6">
          {outcomes ? `${outcomes.length} this month` : "…"}
        </span>
        <div className="ml-auto flex gap-1.5">
          <button className="text-[12.5px] text-muted1 bg-white border border-border3 px-3 py-1.5 rounded-md">
            ⌕ Search
          </button>
          <button className="text-[12.5px] text-muted1 bg-white border border-border3 px-3 py-1.5 rounded-md">
            Filter
          </button>
          <Link
            href="/outcomes/new"
            className="text-[12.5px] font-semibold text-white bg-accent px-3.5 py-1.5 rounded-md"
          >
            + New
          </Link>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 px-8 pt-7 pb-14">
        <StatGrid items={IMPACT} />

        <div className="grid grid-cols-[2.4fr_.9fr_1fr_1.1fr_.8fr] gap-4 px-3.5 py-2.5 mt-6 font-mono text-[10px] tracking-[0.07em] uppercase text-muted5">
          <span>Outcome</span>
          <span>Status</span>
          <span>Sources</span>
          <span>Result</span>
          <span>Updated</span>
        </div>

        {outcomes === null && (
          <div className="text-[13px] text-muted4 px-3.5 py-6">Loading…</div>
        )}

        {outcomes?.map((o) => {
          const s = STATUS_STYLE[o.status];
          return (
            <Link
              key={o.id}
              href={
                o.status === "delivered"
                  ? `/outcomes/${o.id}`
                  : o.status === "running"
                  ? `/outcomes/${o.id}/run`
                  : `/outcomes/${o.id}/plan`
              }
              className="grid grid-cols-[2.4fr_.9fr_1fr_1.1fr_.8fr] gap-4 px-3.5 py-3.5 items-center border-t border-[#EFEBE3] hover:bg-[#F6F4F0]"
            >
              <div className="min-w-0">
                <div className="text-[13.5px] font-medium tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
                  {o.title}
                </div>
                <div className="text-[11.5px] text-muted4 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                  {o.note}
                </div>
              </div>
              <div>
                <span
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wide px-2 py-0.5 rounded"
                  style={{ background: s.bg, color: s.fg }}
                >
                  <span className="w-[5px] h-[5px] rounded-full" style={{ background: s.fg }} />
                  {s.label}
                </span>
              </div>
              <div className="flex gap-1">
                {o.tools.map((t) => (
                  <ToolIcon key={t.id} tool={t} />
                ))}
              </div>
              <div className="text-[12.5px] font-medium">{o.result}</div>
              <div className="font-mono text-[11px] text-muted5">{timeAgo(o.updatedAt)}</div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
