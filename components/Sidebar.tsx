"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/outcomes", label: "Outcomes", icon: "◆", badge: "3" },
  { href: "/connections", label: "Connections", icon: "◎", badge: "11" },
];

const RECENTS = [
  { id: "churn-q4", label: "Churn risk — Q4 renewals", dot: "#2C7A55" },
  { id: "onboarding-drop", label: "Why week-two onboarding stalls", dot: "#2159C5" },
  { id: "pipeline-review", label: "Weekly pipeline review", dot: "#A8A296" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[230px] flex-shrink-0 bg-panel border-r border-border1 flex flex-col p-3">
      <div className="flex items-center gap-2 px-2 pt-1.5 pb-4">
        <span className="w-5 h-5 rounded bg-accent text-white text-[10px] font-bold inline-flex items-center justify-center">
          K
        </span>
        <span className="text-[15.5px] font-semibold tracking-tight">Kloyya</span>
        <span className="ml-auto text-[10.5px] font-mono text-muted6 border border-border3 px-1.5 py-0.5 rounded">
          ⌘K
        </span>
      </div>

      <Link
        href="/outcomes/new"
        className="cursor-pointer border-none bg-accent text-white text-[13px] font-semibold px-3 py-2.5 rounded-md text-left flex items-center gap-2 shadow-[0_1px_2px_rgba(33,89,197,0.25)]"
      >
        <span className="text-[15px] leading-none -mt-px">+</span> New outcome
      </Link>

      <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted6 pt-[22px] pb-2 px-2">
        Workspace
      </div>
      {NAV.map((n) => {
        const active = pathname?.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-2 py-1.5 px-2 rounded-md text-[13px] mb-px ${
              active ? "bg-white font-medium text-ink" : "text-muted2 font-normal"
            }`}
          >
            <span className="w-[15px] text-center text-[12px] opacity-85">{n.icon}</span>
            {n.label}
            <span className="ml-auto font-mono text-[10px] text-muted6 bg-white px-1.5 py-0.5 rounded">
              {n.badge}
            </span>
          </Link>
        );
      })}

      <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted6 pt-6 pb-2 px-2">
        Recent
      </div>
      {RECENTS.map((r) => (
        <Link
          key={r.id}
          href={`/outcomes/${r.id}`}
          className="flex items-center gap-2 py-1.5 px-2 rounded-md text-[12.5px] text-muted2 leading-snug mb-px"
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: r.dot }}
          />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{r.label}</span>
        </Link>
      ))}

      <div className="mt-auto pt-4 border-t border-border1 flex items-center gap-2">
        <div className="w-[26px] h-[26px] rounded-md bg-accent text-white flex items-center justify-center text-[11px] font-semibold">
          AO
        </div>
        <div className="leading-tight">
          <div className="text-[12.5px] font-medium">Amara Okonjo</div>
          <div className="text-[11px] text-muted4">Lattice · Head of CS</div>
        </div>
      </div>
    </div>
  );
}
