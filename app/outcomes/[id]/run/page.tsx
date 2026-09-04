"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ToolIcon } from "@/components/ToolIcon";
import { api } from "@/lib/api";
import type { OutcomeRun } from "@/lib/types";

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

const STEP_STYLE = {
  done: { border: "#DFEFE4", bg: "#FBFEFC", dotBg: "#EDF6F1", dotFg: "#2C7A55", dotBorder: "#DFEFE4", weight: "500", fg: "#14161A", icon: "✓" },
  active: { border: "#DFE7F7", bg: "#FAFCFF", dotBg: "#2159C5", dotFg: "#fff", dotBorder: "#2159C5", weight: "550", fg: "#14161A", icon: "●" },
  pending: { border: "#EDE9E1", bg: "#FBFAF8", dotBg: "#fff", dotFg: "#A8A296", dotBorder: "#E3DED4", weight: "450", fg: "#9A948A", icon: "○" },
} as const;

export default function LiveRunPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [run, setRun] = useState<OutcomeRun | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      const data = await api.outcomes.run(id);
      if (cancelled) return;
      setRun(data);
      if (data.status === "running") {
        timer = setTimeout(poll, 3000);
      } else if (data.status === "done") {
        router.push(`/outcomes/${id}`);
      }
    }
    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, router]);

  if (!run) {
    return (
      <AppShell>
        <div className="p-8 text-[13px] text-muted4">Loading run…</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="h-[52px] border-b border-border2 flex items-center px-6 gap-2.5 bg-cream flex-shrink-0">
        <span className="text-[13px] text-muted4">Outcomes /</span>
        <span className="text-[13px] font-medium">Churn risk — Q4 renewals</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wide px-2 py-0.5 rounded bg-accent-soft text-accent">
          <span className="w-[5px] h-[5px] rounded-full bg-accent animate-kl-pulse" />
          RUNNING
        </span>
        <div className="ml-auto flex gap-2 items-center">
          <span className="font-mono text-[11.5px] text-muted4">
            {fmt(run.elapsedSeconds)} elapsed · ~{Math.round(run.etaSeconds / 60)} min left
          </span>
          <button className="text-[12.5px] text-muted1 bg-white border border-border3 px-3.5 py-1.5 rounded-md">
            Pause
          </button>
          <button className="text-[12.5px] text-muted1 bg-white border border-border3 px-3.5 py-1.5 rounded-md">
            Take over
          </button>
        </div>
      </div>

      <div className="h-0.5 bg-border2 relative overflow-hidden flex-shrink-0">
        <div
          className="absolute inset-y-0 left-0 bg-accent"
          style={{ width: `${run.percent}%` }}
        />
      </div>

      <div className="flex-1 grid grid-cols-[1fr_400px] min-h-0">
        <div className="overflow-y-auto">
          <div className="relative overflow-hidden bg-dark px-10 pt-11 pb-10">
            <div className="relative flex items-start gap-10">
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.14em] uppercase text-[#7C93C9]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C93C9] animate-kl-pulse" />
                  Kloyya is working
                </div>
                <div className="text-[44px] md:text-[52px] leading-[1.02] tracking-tight font-semibold text-white mt-4 max-w-[17ch]">
                  {run.headline}
                </div>
                <div className="font-serif italic text-[21px] leading-relaxed text-[#B9BEC6] mt-4 max-w-[56ch]">
                  &quot;{run.narration}&quot;
                </div>
                <div className="flex items-center gap-2 mt-6 flex-wrap">
                  <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#6B7079] mr-1">
                    Reading now
                  </span>
                  {run.readingNow.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center gap-1.5 pl-0.5 pr-2.5 py-1 border border-[#2B3038] rounded-full bg-[#191C21] text-[11.5px] text-[#C4C8CE]"
                    >
                      <ToolIcon tool={t} size={18} />
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 text-right hidden sm:block">
                <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#6B7079]">
                  Step {run.currentStepIndex} of {run.totalSteps}
                </div>
                <div className="text-[76px] leading-none tracking-tight font-semibold text-white mt-2.5 tabular-nums">
                  {run.percent}
                  <span className="text-[34px] text-[#6B7079]">%</span>
                </div>
                <div className="font-mono text-[12px] text-[#8B9099] mt-3">
                  {fmt(run.elapsedSeconds)} elapsed
                </div>
                <div className="font-mono text-[12px] text-[#5C616A] mt-0.5">
                  ~{Math.round(run.etaSeconds / 60)} min left
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[700px] flex flex-col gap-2 px-10 pt-7 pb-14">
            {run.steps.map((r) => {
              const style = STEP_STYLE[r.state];
              return (
                <div
                  key={r.id}
                  className="border rounded-[10px] px-4 py-3.5 flex gap-3.5 items-start"
                  style={{ borderColor: style.border, background: style.bg }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-semibold border"
                    style={{ background: style.dotBg, color: style.dotFg, borderColor: style.dotBorder }}
                  >
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2.5">
                      <div
                        className="text-[13.5px] tracking-tight"
                        style={{ fontWeight: style.weight, color: style.fg }}
                      >
                        {r.title}
                      </div>
                      <div className="ml-auto font-mono text-[10.5px] text-muted5">{r.time}</div>
                    </div>
                    <div className="text-[12.5px] text-muted3 mt-1 leading-relaxed">
                      {r.detail}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="mt-4 border border-[#F0DEBF] bg-[#FFFBF4] rounded-[11px] px-5 py-4.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-[0.09em] uppercase text-warn">
                  Found something · mid-run
                </span>
                <span className="ml-auto font-mono text-[10.5px] text-[#B79A6A]">00:03:41</span>
              </div>
              <div className="font-serif italic text-[18px] leading-relaxed text-[#1D2026] mt-2.5">
                &quot;Six of the nine at-risk accounts stalled at the same place — they never
                finished week-two onboarding. I&apos;m going to keep going, but you&apos;ll
                probably want to act on that before the individual saves.&quot;
              </div>
              <div className="flex gap-2 mt-3.5">
                <button className="text-[12px] font-medium text-white bg-ink px-3.5 py-1.5 rounded-md">
                  Dig into that instead
                </button>
                <button className="text-[12px] text-muted1 bg-white border border-[#E9DCC4] px-3.5 py-1.5 rounded-md">
                  Note it and carry on
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-l border-border2 bg-dark overflow-y-auto px-5 pt-5 pb-10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#6B7079]">
              Activity log
            </span>
            <span className="ml-auto font-mono text-[10px] text-[#4E535B]">live</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4C8B6B] animate-kl-pulse" />
          </div>
          <div className="mt-3.5 flex flex-col gap-px">
            {run.log.map((l, i) => (
              <div key={i} className="flex gap-2.5 py-1 font-mono text-[11px] leading-relaxed">
                <span className="text-[#4E535B] flex-shrink-0">{l.time}</span>
                <span className="text-[#7C93C9] flex-shrink-0 w-[52px]">{l.tag}</span>
                <span className="text-[#A7ACB4] min-w-0">{l.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
