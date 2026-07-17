import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-panel px-4 py-2 text-sm font-semibold " +
  "transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-ink hover:bg-[#3d7ceb] active:bg-[#2560c9]",
  ghost:
    "border border-line bg-transparent text-ink-dim hover:border-accent hover:text-ink",
  danger: "bg-danger text-ink hover:bg-[#f25b5b] active:bg-[#d93838]",
};

export function Button({
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}
