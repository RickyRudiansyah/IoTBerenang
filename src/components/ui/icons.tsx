import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconHome(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </Base>
  );
}

export function IconMap(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </Base>
  );
}

export function IconWaves(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
      <path d="M2 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
      <path d="M2 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
    </Base>
  );
}

export function IconChart(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 16v-5M12 16V8M16 16v-3M20 16V6" />
    </Base>
  );
}

export function IconVolume(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a9 9 0 0 1 0 12" />
    </Base>
  );
}

export function IconWristband(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="8" y="7" width="8" height="10" rx="2.5" />
      <path d="M10 7V3.5h4V7M10 17v3.5h4V17" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconCamera(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="m15 10.5 6-3v9l-6-3" />
    </Base>
  );
}

export function IconSiren(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2 7.5 2 7.5H4S6 15 6 9" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </Base>
  );
}

export function IconMonitor(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </Base>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Base>
  );
}

export function IconVolumeMuted(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </Base>
  );
}
