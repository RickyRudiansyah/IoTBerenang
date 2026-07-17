import type { CSSProperties } from "react";
import type { PageId } from "../types";
import { useLang } from "../i18n/LangContext";
import {
  Button,
  StatusPill,
  IconWristband,
  IconCamera,
  IconSiren,
  IconMonitor,
  IconArrowRight,
} from "../components/ui";

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

const stepIcons = [IconWristband, IconCamera, IconSiren, IconMonitor];

function delay(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms` };
}

/* pratinjau kolam 4 zona (dekoratif) — foreshadow halaman Map */
function PoolPreview() {
  const { t } = useLang();
  const L = t.landing;

  const dots: Record<number, { x: string; y: string }[]> = {
    1: [
      { x: "30%", y: "40%" },
      { x: "68%", y: "66%" },
    ],
    2: [{ x: "55%", y: "35%" }],
    4: [
      { x: "40%", y: "58%" },
      { x: "72%", y: "30%" },
    ],
  };

  return (
    <div
      className="animate-fade-up rounded-panel border border-line bg-panel p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]"
      style={delay(250)}
      aria-hidden="true"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-dim">
          {L.preview}
        </span>
        <StatusPill status="danger" label="ALARM" pulse />
      </div>

      <div className="grid aspect-[4/3] grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-line bg-line">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="relative bg-water">
            <span className="num absolute left-2 top-1.5 text-[9px] tracking-[0.2em] text-ink-dim/70">
              {t.zone(n).toUpperCase()}
            </span>

            {(dots[n] ?? []).map((d, i) => (
              <span
                key={i}
                className="absolute size-2 rounded-full bg-safe/80"
                style={{ left: d.x, top: d.y }}
              />
            ))}

            {n === 3 && (
              <span className="absolute left-[45%] top-[48%] text-danger">
                <span className="block size-2.5 animate-pulse-dot rounded-full bg-danger" />
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-ink-dim">{L.previewCaption}</span>
        <span className="num text-sm font-semibold text-danger">00:06</span>
      </div>
    </div>
  );
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { t } = useLang();
  const L = t.landing;

  return (
    <div className="mx-auto w-full max-w-[1240px] px-6">
      {/* ============ HERO ============ */}
      <section className="relative grid grid-cols-[1.15fr_1fr] items-center gap-12 py-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(640px_360px_at_28%_18%,rgba(45,108,223,0.16),transparent_70%)]"
          aria-hidden="true"
        />

        <div>
          <span
            className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-dim"
            style={delay(0)}
          >
            <span className="size-1.5 rounded-full bg-accent" />
            {L.badge}
          </span>

          <h2
            className="mt-5 animate-fade-up text-5xl font-extrabold leading-[1.08] tracking-tight text-ink"
            style={delay(80)}
          >
            {L.title1}
            <br />
            <span className="text-accent">{L.title2}</span>
          </h2>

          <p
            className="mt-5 max-w-[52ch] animate-fade-up text-[15px] leading-relaxed text-ink-dim"
            style={delay(160)}
          >
            {L.sub}
          </p>

          <div
            className="mt-7 animate-fade-up border-l-2 border-danger pl-4"
            style={delay(240)}
          >
            <div className="flex items-baseline gap-2">
              <span className="num text-5xl font-bold text-danger">
                {L.statValue}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-danger">
                {L.statUnit}
              </span>
            </div>
            <p className="mt-1.5 max-w-[48ch] text-[13px] leading-relaxed text-ink-dim">
              {L.statDesc}
            </p>
          </div>

          <div className="mt-8 flex animate-fade-up items-center gap-3" style={delay(320)}>
            <Button onClick={() => onNavigate("simulation")}>
              {L.cta}
              <IconArrowRight width={16} height={16} />
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {L.ctaHow}
            </Button>
          </div>
        </div>

        <PoolPreview />
      </section>

      {/* ============ MASALAH ============ */}
      <section className="py-12">
        <h3 className="text-2xl font-bold tracking-tight text-ink">
          {L.problem.title}
        </h3>
        <p className="mt-1.5 text-sm text-ink-dim">{L.problem.lead}</p>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {L.problem.cards.map((card, i) => (
            <div
              key={i}
              className="rounded-panel border border-line bg-panel p-5 transition-colors duration-150 hover:border-accent/50"
            >
              <span className="num text-xs font-semibold text-accent">
                0{i + 1}
              </span>
              <h4 className="mt-3 text-[15px] font-semibold text-ink">
                {card.title}
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CARA KERJA ============ */}
      <section id="how-it-works" className="scroll-mt-6 py-12">
        <h3 className="text-2xl font-bold tracking-tight text-ink">
          {L.how.title}
        </h3>
        <p className="mt-1.5 text-sm text-ink-dim">{L.how.lead}</p>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {L.how.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div
                key={i}
                className="relative rounded-panel border border-line bg-panel p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-9 items-center justify-center rounded-panel border border-line bg-bg text-accent">
                    <Icon />
                  </span>
                  <span className="num text-xs font-semibold text-ink-dim">
                    0{i + 1}
                  </span>
                </div>
                <h4 className="mt-4 text-sm font-semibold text-ink">
                  {step.title}
                </h4>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">
                  {step.body}
                </p>

                {i < 3 && (
                  <IconArrowRight
                    className="absolute -right-[14px] top-7 z-10 text-ink-dim/50"
                    width={14}
                    height={14}
                  />
                )}
              </div>
            );
          })}
        </div>

        <figure className="mt-6 rounded-panel border border-line border-l-2 border-l-accent bg-panel/60 p-5">
          <figcaption className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-dim">
            {L.how.quoteLabel}
          </figcaption>
          <blockquote className="mt-2 max-w-[90ch] text-sm leading-relaxed text-ink">
            “{L.how.quote}”
          </blockquote>
        </figure>
      </section>

      {/* ============ CTA BAWAH ============ */}
      <section className="py-12">
        <div className="flex items-center justify-between gap-8 rounded-panel border border-line bg-[linear-gradient(135deg,var(--color-panel),var(--color-bg))] p-8">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-ink">
              {L.ctaBottom.title}
            </h3>
            <p className="mt-1.5 text-sm text-ink-dim">{L.ctaBottom.body}</p>
          </div>
          <Button onClick={() => onNavigate("simulation")} className="shrink-0">
            {L.ctaBottom.button}
            <IconArrowRight width={16} height={16} />
          </Button>
        </div>
      </section>

      <footer className="border-t border-line py-6 text-center text-xs text-ink-dim">
        {L.footer}
      </footer>
    </div>
  );
}
