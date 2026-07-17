type Status = "safe" | "warn" | "danger";

interface StatusPillProps {
  status: Status;
  label: string;
  /** titik berdenyut — untuk status live */
  pulse?: boolean;
}

const styles: Record<Status, { text: string; dot: string; bg: string }> = {
  safe: { text: "text-safe", dot: "bg-safe", bg: "bg-safe/10 border-safe/30" },
  warn: { text: "text-warn", dot: "bg-warn", bg: "bg-warn/10 border-warn/30" },
  danger: {
    text: "text-danger",
    dot: "bg-danger",
    bg: "bg-danger/10 border-danger/30",
  },
};

export function StatusPill({ status, label, pulse = false }: StatusPillProps) {
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${s.bg} ${s.text}`}
    >
      <span
        className={`size-1.5 rounded-full ${s.dot} ${pulse ? "animate-pulse-dot" : ""}`}
      />
      {label}
    </span>
  );
}
