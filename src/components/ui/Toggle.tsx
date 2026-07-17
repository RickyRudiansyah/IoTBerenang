interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleProps<T extends string> {
  options: [ToggleOption<T>, ToggleOption<T>];
  value: T;
  onChange: (value: T) => void;
  "aria-label"?: string;
}

/** Toggle segmented dua pilihan (dipakai a.l. untuk ID/EN). */
export function Toggle<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: ToggleProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex rounded-panel border border-line bg-bg p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-[4px] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors duration-150 ${
              active
                ? "bg-accent text-ink"
                : "text-ink-dim hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
