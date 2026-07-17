import type { HTMLAttributes, ReactNode } from "react";

interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  /** slot kanan di header panel (badge, tombol, dsb.) */
  headerRight?: ReactNode;
}

export function Panel({
  title,
  headerRight,
  children,
  className = "",
  ...rest
}: PanelProps) {
  return (
    <section
      className={`rounded-panel border border-line bg-panel shadow-[0_1px_0_0_rgba(230,237,245,0.03)_inset] ${className}`}
      {...rest}
    >
      {(title || headerRight) && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-dim">
            {title}
          </h2>
          {headerRight}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
