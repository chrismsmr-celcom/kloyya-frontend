export interface StatItem {
  label: string;
  value: string;
  sub: string;
  color?: string;
  delta?: string;
  deltaColor?: string;
}

export function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="flex gap-px bg-border1 border border-border1 rounded-[11px] overflow-hidden">
      {items.map((i) => (
        <div key={i.label} className="flex-1 bg-white p-[17px] px-5">
          <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-muted6">
            {i.label}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className="text-[26px] font-semibold tracking-tight"
              style={{ color: i.color ?? "#14161A" }}
            >
              {i.value}
            </span>
            {i.delta && (
              <span
                className="text-[11.5px] font-mono"
                style={{ color: i.deltaColor ?? "#8C877E" }}
              >
                {i.delta}
              </span>
            )}
          </div>
          <div className="text-[11.5px] text-muted4 mt-0.5">{i.sub}</div>
        </div>
      ))}
    </div>
  );
}
