"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { StatGrid } from "@/components/StatGrid";
import { api } from "@/lib/api";
import type { OutcomeDetail } from "@/lib/types";

export default function OutcomeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<OutcomeDetail | null>(null);

  useEffect(() => {
    api.outcomes.detail(id).then(setDetail);
  }, [id]);

  if (!detail) {
    return (
      <AppShell>
        <div className="p-8 text-[13px] text-muted4">Loading…</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="h-[52px] border-b border-border2 flex items-center px-6 gap-2.5 bg-cream flex-shrink-0">
        <span className="text-[13px] text-muted4">Outcomes /</span>
        <span className="text-[13px] font-medium">{detail.title}</span>
        <span className="font-mono text-[10px] tracking-wide px-2 py-0.5 rounded bg-good-soft text-good">
          DELIVERED · {detail.minutesTaken} MIN
        </span>
        <div className="ml-auto flex gap-2">
          <button className="text-[12.5px] text-muted1 bg-white border border-border3 px-3.5 py-1.5 rounded-md">
            Share
          </button>
          <button className="text-[12.5px] font-semibold text-white bg-accent px-3.5 py-1.5 rounded-md">
            Approve 5 save plays
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[1fr_340px] min-h-0">
        <div className="overflow-y-auto px-10 pt-8 pb-16">
          <div className="max-w-[760px]">
            <div className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-muted6">
              The answer
            </div>
            <div className="text-[26px] md:text-[31px] tracking-tight font-semibold leading-tight mt-3">
              {detail.headline}
            </div>
            <div className="font-serif italic text-[19px] leading-relaxed text-[#3A3E45] mt-4.5">
              &quot;{detail.narration}&quot;
            </div>

            <div className="mt-7">
              <StatGrid items={detail.stats.map((s) => ({ ...s }))} />
            </div>

            <div className="flex items-baseline justify-between mt-9">
              <div className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-muted6">
                Ranked by what you&apos;d lose
              </div>
              <div className="flex gap-3.5 text-[12px] text-muted4">
                <span className="text-ink font-medium border-b-[1.5px] border-ink pb-0.5">
                  Accounts
                </span>
                <span>Shared cause</span>
                <span>Save plays</span>
              </div>
            </div>

            <div className="mt-3.5 border border-border1 rounded-[11px] bg-white overflow-hidden">
              <div className="grid grid-cols-[1.5fr_.8fr_1fr_1.9fr] gap-4 px-4.5 py-2.5 bg-panel-alt border-b border-border2 font-mono text-[10px] tracking-[0.07em] uppercase text-muted5">
                <span>Account</span>
                <span>ARR</span>
                <span>Risk</span>
                <span>Why</span>
              </div>
              {detail.accounts.map((a) => (
                <div
                  key={a.name}
                  className="grid grid-cols-[1.5fr_.8fr_1fr_1.9fr] gap-4 px-4.5 py-3.5 border-b border-[#F4F0E8] items-center"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-[22px] h-[22px] rounded-md text-white inline-flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                      style={{ background: a.color }}
                    >
                      {a.initial}
                    </span>
                    <span className="text-[13px] font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                      {a.name}
                    </span>
                  </div>
                  <div className="font-mono text-[12.5px] text-[#3F3C36]">{a.arr}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-[38px] h-1 rounded-full bg-border2 overflow-hidden inline-block">
                      <span
                        className="block h-1 rounded-full"
                        style={{
                          width: `${a.riskPercent}%`,
                          background: a.riskPercent > 70 ? "#A8412C" : "#8C5A13",
                        }}
                      />
                    </span>
                    <span
                      className="font-mono text-[11.5px]"
                      style={{ color: a.riskPercent > 70 ? "#A8412C" : "#8C5A13" }}
                    >
                      {a.riskLabel}
                    </span>
                  </div>
                  <div className="text-[12.5px] text-muted3 overflow-hidden text-ellipsis whitespace-nowrap">
                    {a.why}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border border-[#F0DEBF] bg-[#FFFBF4] rounded-[10px] px-4.5 py-4 flex gap-3.5 items-start">
              <span className="text-[13px] mt-0.5">⚠</span>
              <div>
                <div className="text-[13px] font-semibold text-ink">
                  I&apos;m not confident about Northwind.
                </div>
                <div className="text-[12.5px] leading-relaxed text-[#6B5C42] mt-1.5 max-w-[70ch]">
                  Their Slack channel has been quiet for three weeks and I have no ticket
                  history to corroborate the usage drop. That could be a quiet renewal or a
                  silent exit — I genuinely can&apos;t tell. This one wants a human phone call,
                  not a save play.
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-[12px] font-medium text-white bg-ink px-3 py-1.5 rounded-md">
                    Book the call
                  </button>
                  <button className="text-[12px] text-muted1 bg-white border border-[#E9DCC4] px-3 py-1.5 rounded-md">
                    Connect Zendesk to be sure
                  </button>
                </div>
              </div>
            </div>

            <div className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-muted6 mt-10">
              How I got here
            </div>
            <div className="mt-3.5 flex flex-col">
              {detail.trail.map((t, i) => (
                <div key={i} className="flex gap-3.5 pb-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span className="w-4 h-4 rounded-md bg-white border border-[#EAE6DE]" />
                    {i < detail.trail.length - 1 && (
                      <span className="flex-1 w-px bg-border1 mt-1.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] leading-relaxed text-[#25282D]">
                      <span className="font-semibold">{t.source}</span> — {t.what}
                    </div>
                    <div className="font-mono text-[11px] text-muted5 mt-1">{t.ref}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-l border-border2 bg-panel-alt overflow-y-auto px-5.5 pt-6.5 pb-12">
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted6">
            Artifacts
          </div>
          <div className="flex flex-col gap-2 mt-3.5">
            {detail.artifacts.map((a) => (
              <div key={a.name} className="border border-border1 bg-white rounded-[9px] px-3.5 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9.5px] tracking-wide px-1.5 py-0.5 rounded bg-accent-soft text-accent">
                    {a.kind}
                  </span>
                  <span className="ml-auto font-mono text-[10.5px] text-muted6">{a.size}</span>
                </div>
                <div className="text-[13px] font-medium leading-snug mt-2.5">{a.name}</div>
                <div className="text-[11.5px] text-muted4 mt-1">{a.dest}</div>
              </div>
            ))}
          </div>

          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted6 mt-7">
            Waiting on you
          </div>
          <div className="mt-3.5 border border-[#DFE7F7] bg-[#FAFCFF] rounded-[9px] p-3.5">
            <div className="text-[12.5px] leading-relaxed text-[#3A3E45]">
              5 save-play emails are drafted and unsent. I matched each one to how that account
              actually talks — Northwind&apos;s is deliberately shorter.
            </div>
            <button className="w-full mt-3 font-semibold text-white bg-accent text-[12.5px] py-2 rounded-md">
              Review drafts
            </button>
          </div>

          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted6 mt-7">
            What I learned
          </div>
          <div className="mt-3 p-3.5 border border-dashed border-border3 rounded-[9px] text-[12.5px] leading-relaxed text-[#57534C]">
            Week-two onboarding is now a churn signal I&apos;ll watch by default.{" "}
            <a href="#">Undo</a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
