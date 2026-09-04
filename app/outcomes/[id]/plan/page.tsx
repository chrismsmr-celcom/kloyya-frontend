"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ToolIcon } from "@/components/ToolIcon";
import { api } from "@/lib/api";
import type { OutcomePlan } from "@/lib/types";

export default function PlanReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [plan, setPlan] = useState<OutcomePlan | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    api.outcomes.plan(id).then(setPlan);
  }, [id]);

  async function answer(optionIndex: number) {
    const updated = await api.outcomes.answerClarifyingQuestion(id, optionIndex);
    setPlan(updated);
  }

  async function run() {
    setStarting(true);
    await api.outcomes.startRun(id);
    router.push(`/outcomes/${id}/run`);
  }

  if (!plan) {
    return (
      <AppShell>
        <div className="p-8 text-[13px] text-muted4">Loading plan…</div>
      </AppShell>
    );
  }

  const answered = !!plan.clarifyingQuestion?.answeredAt;

  return (
    <AppShell>
      <div className="h-[52px] border-b border-border2 flex items-center px-6 gap-2.5 bg-cream flex-shrink-0">
        <span className="text-[13px] text-muted4">Outcomes /</span>
        <span className="text-[13px] font-medium">{plan.title.split("—")[0].trim()}</span>
        <span className="font-mono text-[10px] tracking-wide px-1.5 py-0.5 rounded bg-warn-soft text-warn">
          PLAN · NOT RUN
        </span>
        <div className="ml-auto flex gap-2">
          <button className="text-[12.5px] text-muted1 bg-white border border-border3 px-3.5 py-1.5 rounded-md">
            Save as template
          </button>
          <button
            onClick={run}
            disabled={starting}
            className="text-[12.5px] font-semibold text-white bg-accent px-3.5 py-1.5 rounded-md disabled:opacity-60"
          >
            {starting ? "Starting…" : `Run ${plan.steps.length} steps →`}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[1fr_320px] min-h-0">
        <div className="overflow-y-auto px-10 pt-8 pb-14">
          <div className="max-w-[720px]">
            <div className="text-[26px] tracking-tight font-semibold leading-snug">
              {plan.title}
            </div>

            {plan.clarifyingQuestion && (
              <div className="mt-6 border border-[#DFE7F7] rounded-[11px] bg-[#FAFCFF] px-5 py-4.5">
                <div className="font-mono text-[10px] tracking-[0.09em] uppercase text-accent">
                  Kloyya asked first
                </div>
                <div className="font-serif italic text-[18px] leading-relaxed text-[#1D2026] mt-2.5">
                  &quot;{plan.clarifyingQuestion.question}&quot;
                </div>
                <div className="flex gap-2 mt-3.5 items-center flex-wrap">
                  {plan.clarifyingQuestion.options.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => answer(i)}
                      className={`text-[12.5px] px-3 py-1.5 rounded-lg font-medium ${
                        i === 0
                          ? "bg-accent text-white"
                          : "bg-white border border-[#DDE5F4] text-muted2"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                  {answered && (
                    <span className="ml-auto text-[11.5px] text-muted5 self-center">
                      answered 2m ago
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-baseline justify-between mt-8">
              <div className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-muted6">
                The plan · edit anything before it runs
              </div>
              <a href="#" className="text-[12px]">
                + Add a step
              </a>
            </div>

            <div className="mt-3.5 flex flex-col gap-2">
              {plan.steps.map((p) => (
                <div
                  key={p.id}
                  className="border border-border1 bg-white rounded-[10px] px-4.5 py-3.5 flex gap-3.5 items-start"
                >
                  <div className="w-[22px] h-[22px] rounded-md flex-shrink-0 flex items-center justify-center font-mono text-[11px] font-medium bg-white border border-border3 text-muted2">
                    {p.index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium tracking-tight leading-snug">
                      {p.title}
                    </div>
                    <div className="text-[12.5px] text-muted3 mt-1.5 leading-relaxed">
                      {p.detail}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      {p.tools.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-1.5 pl-0.5 pr-2 py-0.5 border border-border1 rounded-full bg-white text-[11px] text-muted1"
                        >
                          <ToolIcon tool={t} size={14} />
                          {t.name}
                        </span>
                      ))}
                      <span className="font-mono text-[10px] tracking-wide px-1.5 py-0.5 rounded bg-[#F2EEE6] text-muted2">
                        {p.tag}
                      </span>
                    </div>
                  </div>
                  <button className="text-muted6 text-[14px] px-1">⋯</button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3 items-start px-4.5 py-3.5 border border-border1 rounded-[10px] bg-panel">
              <span className="text-[13px] mt-0.5">⚑</span>
              <div className="text-[12.5px] leading-relaxed text-[#57534C]">
                <span className="font-semibold text-ink">Two things I can&apos;t do without you.</span>{" "}
                I&apos;ll stop at step {plan.steps.length} rather than send anything. And I have
                no read access to your Zendesk tickets — without them my read on{" "}
                <span className="font-mono text-[11.5px]">Northwind</span> will be thin.{" "}
                <a href="#">Connect Zendesk</a> or let me run without it.
              </div>
            </div>
          </div>
        </div>

        <div className="border-l border-border2 bg-panel-alt overflow-y-auto px-5.5 pt-6.5 pb-10">
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted6">
            Scope
          </div>
          <div className="flex flex-col gap-2.5 mt-3.5">
            {plan.scope.map((s) => (
              <div key={s.label} className="flex justify-between text-[12.5px]">
                <span className="text-muted3">{s.label}</span>
                <span className="font-medium text-ink font-mono text-[12px]">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted6 mt-7">
            Reading from
          </div>
          <div className="flex flex-col gap-0.5 mt-3">
            {plan.sources.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white border border-[#EFEBE3]"
              >
                <ToolIcon tool={{ id: s.id, name: s.name, icon: s.icon }} />
                <span className="text-[12.5px] font-medium">{s.name}</span>
                <span className="ml-auto font-mono text-[10.5px] text-muted5">{s.detail}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 p-3.5 border border-border1 rounded-[9px] bg-white">
            <div className="text-[12.5px] font-semibold">Approval checkpoint</div>
            <div className="text-[12px] text-muted3 leading-relaxed mt-1.5">
              Nothing leaves your workspace until you press send. Kloyya drafts; you decide.
            </div>
            <div className="flex items-center gap-2 mt-3 text-[12px] text-good">
              <span className="w-1.5 h-1.5 rounded-full bg-good" />
              Write access: {plan.writeAccess ? "on" : "off"} for this run
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
