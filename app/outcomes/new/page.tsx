"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ToolIcon } from "@/components/ToolIcon";
import { api } from "@/lib/api";
import { TOOLS } from "@/lib/mock-data";

const SUGGESTIONS = [
  {
    title: "Find our Q4 churn risk among renewing accounts",
    why: "212 accounts renew before Dec 31 — 9 look shaky",
    tools: [TOOLS.hubspot, TOOLS.zendesk],
  },
  {
    title: "Summarize what changed in the product roadmap this week",
    why: "14 Linear issues moved status since Monday",
    tools: [TOOLS.linear, TOOLS.notion],
  },
  {
    title: "Draft replies to the 6 open support escalations",
    why: "Average response time slipped to 11h this week",
    tools: [TOOLS.zendesk, TOOLS.gmail],
  },
  {
    title: "Tell me which deals are falling out of forecast",
    why: "3 deals had no activity in 10+ days",
    tools: [TOOLS.salesforce, TOOLS.slack],
  },
];

export default function NewOutcomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(text: string) {
    const value = text.trim();
    if (!value || submitting) return;
    setSubmitting(true);
    const plan = await api.outcomes.create(value);
    router.push(`/outcomes/${plan.outcomeId}/plan`);
  }

  return (
    <AppShell>
      <div className="h-[52px] border-b border-border2 flex items-center px-6 gap-3 bg-cream flex-shrink-0">
        <span className="text-[13px] font-medium">New outcome</span>
        <span className="font-mono text-[11px] text-muted6">/ untitled</span>
        <div className="ml-auto flex items-center gap-1.5 text-[12px] text-muted2">
          <span className="w-1.5 h-1.5 rounded-full bg-good" /> 11 of 14 tools connected
        </div>
      </div>

      <div className="flex-1 flex justify-center px-6 pt-[70px] pb-10 overflow-y-auto">
        <div className="w-full max-w-[760px]">
          <div className="font-serif italic text-[30px] tracking-tight text-ink">
            Evening, Amara.
          </div>
          <div className="text-[15px] text-muted2 mt-2">
            What do you want to be true by the end of the week?
          </div>

          <div className="mt-6 border border-border3 rounded-[13px] bg-white shadow-[0_1px_2px_rgba(20,22,26,0.04),0_12px_32px_-22px_rgba(20,22,26,0.3)] overflow-hidden">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(query);
                }
              }}
              rows={3}
              placeholder={
                'Describe the outcome, not the task. "Get me out of the Q4 renewal hole" works better than "list renewals".'
              }
              className="w-full border-none resize-none bg-transparent text-[17.5px] leading-snug text-ink px-5 pt-5 pb-1.5 tracking-tight"
            />
            <div className="flex items-center gap-2 px-4 py-3.5 border-t border-[#F2EEE6] bg-paper">
              <button className="text-[12px] font-medium px-2.5 py-1 rounded-md border border-border3 bg-white inline-flex gap-1.5 items-center">
                <span className="text-[11px]">●</span>
                <span>Speak it</span>
              </button>
              <button className="text-[12px] text-muted1 bg-white border border-border3 px-2.5 py-1 rounded-md">
                ◎ All tools
              </button>
              <button className="text-[12px] text-muted1 bg-white border border-border3 px-2.5 py-1 rounded-md">
                ⇪ Attach
              </button>
              <button className="text-[12px] text-muted1 bg-white border border-border3 px-2.5 py-1 rounded-md">
                ◷ Deep dig · 20 min
              </button>
              <button
                onClick={() => submit(query)}
                disabled={submitting}
                className="ml-auto text-[12.5px] font-semibold text-white bg-accent px-3.5 py-1.5 rounded-md disabled:opacity-60"
              >
                {submitting ? "Drafting…" : "Draft a plan ⏎"}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2.5 mt-4 p-3.5 border border-border1 rounded-[9px] bg-panel">
            <span className="text-[12px] mt-0.5">↺</span>
            <div className="text-[12.5px] leading-relaxed text-[#57534C]">
              <span className="font-semibold text-ink">I still remember:</span> paused seats
              don&apos;t count as churn risk — you decided that in the March QBR. And you like
              the money number before the story.
              <a href="#" className="ml-1.5 text-[12px]">
                Edit memory
              </a>
            </div>
          </div>

          <div className="mt-11 font-mono text-[10.5px] tracking-[0.1em] uppercase text-muted6">
            Because of what changed in your data this week
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-3.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.title}
                onClick={() => submit(s.title)}
                className="text-left border border-border1 bg-white rounded-[10px] px-4 py-3.5 flex flex-col gap-1.5 hover:border-[#C9D9F5] hover:shadow-[0_4px_14px_-8px_rgba(20,22,26,0.25)]"
              >
                <div className="text-[14px] font-medium tracking-tight leading-snug text-ink">
                  {s.title}
                </div>
                <div className="text-[12px] leading-relaxed text-muted4">{s.why}</div>
                <div className="flex items-center gap-1 mt-1">
                  {s.tools.map((t) => (
                    <ToolIcon key={t.id} tool={t} size={15} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
