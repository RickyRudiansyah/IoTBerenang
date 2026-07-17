import type { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** wajib — tombol ikon tanpa teks harus punya nama untuk screen reader */
  "aria-label": string;
  active?: boolean;
}

export function IconButton({
  active = false,
  className = "",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex size-8 items-center justify-center rounded-panel border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        active
          ? "border-accent bg-accent-soft text-ink"
          : "border-line bg-transparent text-ink-dim hover:border-accent hover:text-ink"
      } ${className}`}
      {...rest}
    />
  );
}
