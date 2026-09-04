"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import type { ConnectionGroup, ConnectionTool } from "@/lib/types";

const DOT: Record<ConnectionTool["status"], string> = {
  connected: "#2C7A55",
  not_connected: "#D9D4C8",
  attention: "#C88A2E",
};

const BORDER: Record<ConnectionTool["status"], string> = {
  connected: "#E7E3DB",
  not_connected: "#EDE9E1",
  attention: "#F0DEBF",
};

const STATE_LABEL: Record<ConnectionTool["status"], { text: string; color: string }> = {
  connected: { text: "CONNECTED", color: "#2C7A55" },
  not_connected: { text: "NOT CONNECTED", color: "#A8A296" },
  attention: { text: "PENDING", color: "#8C5A13" },
};

export default function ConnectionsPage() {
  const [groups, setGroups] = useState<ConnectionGroup[] | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    api.connections.list().then(setGroups);
  }, []);

  async function toggle(tool: ConnectionTool) {
    setPending(tool.id);
    if (tool.status === "connected") {
      await api.connections.disconnect(tool.id);
    } else {
      await api.connections.connect(tool.id);
    }
    setPending(null);
    api.connections.list().then(setGroups);
  }

  const total = groups?.reduce((n, g) => n + g.items.length, 0) ?? 0;
  const connected =
    groups?.reduce((n, g) => n + g.items.filter((t) => t.status === "connected").length, 0) ?? 0;

  return (
    <AppShell>
      <div className="h-[52px] border-b border-border2 flex items-center px-6 gap-2.5 bg-cream flex-shrink-0">
        <span className="text-[13px] font-medium">Connections</span>
        <span className="font-mono text-[11px] text-muted6">
          {groups ? `${connected} of ${total} live` : "…"}
        </span>
        <div className="ml-auto flex items-center gap-2 text-[12px] text-muted2">
          Read-only by default
          <span className="w-8 h-[18px] rounded-full bg-good relative inline-block">
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-white" />
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_350px] min-h-0">
        <div className="overflow-y-auto px-8 pt-7 pb-14">
          {groups === null && <div className="text-[13px] text-muted4">Loading…</div>}

          {groups?.map((g) => (
            <div key={g.name} className="mb-8">
              <div className="flex items-baseline gap-2.5">
                <div className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-muted6">
                  {g.name}
                </div>
                {g.note && <div className="text-[12px] text-muted5">{g.note}</div>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3.5">
                {g.items.map((t) => {
                  const state = STATE_LABEL[t.status];
                  return (
                    <div
                      key={t.id}
                      className="border bg-white rounded-[10px] px-4 py-3.5 flex flex-col gap-2.5"
                      style={{ borderColor: BORDER[t.status] }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md inline-flex items-center justify-center bg-white border border-[#EAE6DE]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={t.icon} alt={t.name} className="w-[15px] h-[15px] object-contain" />
                        </span>
                        <span className="text-[13.5px] font-medium">{t.name}</span>
                        <span
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          style={{ background: DOT[t.status] }}
                        />
                      </div>
                      <div className="text-[11.5px] text-muted4 leading-relaxed min-h-[34px]">
                        {t.reads}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] tracking-wide" style={{ color: state.color }}>
                          {state.text}
                        </span>
                        <button
                          onClick={() => toggle(t)}
                          disabled={pending === t.id}
                          className={`ml-auto text-[11.5px] font-medium px-2.5 py-1 rounded-md border disabled:opacity-60 ${
                            t.status === "connected"
                              ? "border-border3 bg-white text-muted1"
                              : "border-accent bg-accent text-white"
                          }`}
                        >
                          {pending === t.id ? "…" : t.actionLabel}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block border-l border-border2 bg-panel-alt overflow-y-auto px-5.5 pt-6.5 pb-12">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-md inline-flex items-center justify-center text-[12px] font-bold text-white bg-[#4A154B]">
              S
            </span>
            <div>
              <div className="text-[13.5px] font-semibold">Slack</div>
              <div className="text-[11.5px] text-muted4">Connected 4 months ago</div>
            </div>
          </div>

          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted6 mt-6.5">
            What Kloyya can see
          </div>
          <div className="flex flex-col gap-0.5 mt-3">
            {[
              { icon: "✓", color: "#2C7A55", label: "Public channels you've shared", meta: "12 channels" },
              { icon: "✓", color: "#2C7A55", label: "Messages that mention Kloyya", meta: "always" },
              { icon: "✕", color: "#A8412C", label: "Direct messages", meta: "never" },
              { icon: "✕", color: "#A8412C", label: "Private channels", meta: "never" },
            ].map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-2.5 px-2.5 py-2 bg-white border border-[#EFEBE3] rounded-md"
              >
                <span className="text-[11px]" style={{ color: p.color }}>
                  {p.icon}
                </span>
                <span className="text-[12.5px] text-[#3F3C36]">{p.label}</span>
                <span className="ml-auto font-mono text-[10.5px] text-muted5">{p.meta}</span>
              </div>
            ))}
          </div>

          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted6 mt-6.5">
            Never
          </div>
          <div className="mt-3 p-3.5 border border-dashed border-border3 rounded-[9px] text-[12.5px] leading-relaxed text-[#57534C]">
            DMs, private channels you haven&apos;t shared, and anything in{" "}
            <span className="font-mono text-[11.5px]">#exec-comp</span>. Kloyya never posts as
            you without an approval.
          </div>

          <button className="w-full mt-4.5 bg-white border border-border3 text-bad text-[12.5px] font-medium py-2.5 rounded-md">
            Disconnect Slack
          </button>
        </div>
      </div>
    </AppShell>
  );
}
