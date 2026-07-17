import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Swimmer, SwimmerStatus, ZoneId } from "../types";
import { useLang } from "../i18n/LangContext";
import { useAppState, SUBMERSION_THRESHOLD } from "../store/AppState";
import { Button, Panel } from "../components/ui";

/* ---------- geometri arena (persen) — deck di kiri, kolam 2x2 ---------- */

const POOL = { left: 24, top: 10, right: 97, bottom: 90 };
const MID_X = (POOL.left + POOL.right) / 2;
const MID_Y = (POOL.top + POOL.bottom) / 2;

function zoneOf(x: number, y: number): ZoneId | null {
  if (x < POOL.left || x > POOL.right || y < POOL.top || y > POOL.bottom)
    return null;
  return ((y < MID_Y ? 0 : 2) + (x < MID_X ? 0 : 1) + 1) as ZoneId;
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/* ---------- visual ---------- */

const statusColor: Record<SwimmerStatus, string> = {
  idle: "var(--color-ink-dim)",
  swimming: "var(--color-safe)",
  struggling: "var(--color-warn)",
  drowning: "var(--color-alert)",
  rescued: "var(--color-accent)",
};

const chipClass: Record<SwimmerStatus, string> = {
  idle: "border-line bg-panel text-ink-dim",
  swimming: "border-safe/40 bg-safe/10 text-safe",
  struggling: "border-warn/40 bg-warn/10 text-warn",
  drowning: "border-alert/40 bg-alert/10 text-alert",
  rescued: "border-accent/40 bg-accent/10 text-accent",
};

function SwimmerFigure({ sw }: { sw: Swimmer }) {
  const inWater = sw.zoneId !== null;
  const color = statusColor[sw.status];
  const sunk = sw.status === "drowning";

  return (
    <svg viewBox="0 0 44 40" width={44} height={40} aria-hidden="true">
      <g transform={sunk ? "translate(0 7)" : undefined}>
        {/* lengan */}
        {sw.status === "swimming" && (
          <>
            <path d="M8 20q4-6 7-3" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M36 20q-4-6-7-3" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        )}
        {sw.status === "struggling" && (
          <>
            <path d="M12 6 16 14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M32 6 28 14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M6 12l3 1M38 12l-3 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </>
        )}
        {/* badan (hanya kelihatan di deck) */}
        {!inWater && (
          <rect x="16" y="22" width="12" height="14" rx="5" fill={color} opacity="0.85" />
        )}
        {/* kepala */}
        <circle cx="22" cy="15" r="8" fill="#f2c094" />
        {/* swim cap warna status */}
        <path d="M14 14a8 8 0 0 1 16 0l-1 1a14 14 0 0 0-14 0Z" fill={color} />
        {/* wajah */}
        <circle cx="19" cy="16" r="1.1" fill="#33261a" />
        <circle cx="25" cy="16" r="1.1" fill="#33261a" />
        <path
          d={sw.status === "struggling" || sunk ? "M20 20.5a2.5 2 0 0 1 4 0" : "M20 20a3 2.4 0 0 0 4 0"}
          stroke="#33261a"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* garis air di depan karakter */}
      {inWater && (
        <>
          <path
            d="M2 26c4 0 4-2.5 8-2.5s4 2.5 8 2.5 4-2.5 8-2.5 4 2.5 8 2.5 4-2.5 8-2.5"
            stroke="var(--color-accent)"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          <rect x="0" y="27" width="44" height="13" fill="var(--color-water)" opacity="0.82" />
        </>
      )}
    </svg>
  );
}

function Elapsed({ since }: { since: number }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <span className="num font-semibold">
      {fmt(Math.max(0, Math.floor((Date.now() - since) / 1000)))}
    </span>
  );
}

/* ---------- halaman ---------- */

export function SimulationPage() {
  const { t } = useLang();
  const {
    swimmers,
    alarms,
    updateSwimmer,
    triggerDrowning,
    rescueSwimmer,
    addSwimmer,
    resetSimulation,
  } = useAppState();

  const arenaRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const openAlarms = alarms.filter((a) => !a.resolved);

  const draggable = (s: SwimmerStatus) =>
    s === "idle" || s === "swimming" || s === "rescued";

  function onPointerDown(e: ReactPointerEvent<HTMLButtonElement>, sw: Swimmer) {
    if (!draggable(sw.status)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      id: sw.id,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>, sw: Swimmer) {
    const drag = dragRef.current;
    if (!drag || drag.id !== sw.id) return;
    if (
      !drag.moved &&
      Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < 6
    )
      return;
    drag.moved = true;

    const rect = arenaRef.current!.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 3, 97);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 6, 94);
    const zoneId = zoneOf(x, y);

    updateSwimmer(sw.id, {
      pos: { x, y },
      zoneId,
      status: zoneId === null ? "idle" : "swimming",
      submersionSec: 0,
    });
  }

  function onPointerUp(sw: Swimmer) {
    const drag = dragRef.current;
    if (!drag || drag.id !== sw.id) return;
    dragRef.current = null;
    if (drag.moved) return;

    // klik (tanpa geser) = pemicu
    if (sw.status === "swimming") triggerDrowning(sw.id);
    else if (sw.status === "rescued" && sw.zoneId !== null)
      updateSwimmer(sw.id, { status: "swimming" });
  }

  const zoneCount = (z: ZoneId) =>
    swimmers.filter((s) => s.zoneId === z).length;

  return (
    <div className="mx-auto w-full max-w-[1400px] p-6">
      {/* header halaman */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            {t.page.simulation.title}
          </h2>
          <p className="mt-1 text-sm text-ink-dim">{t.page.simulation.desc}</p>
        </div>
        <Button variant="ghost" onClick={resetSimulation}>
          {t.sim.reset}
        </Button>
      </div>

      {/* banner alarm aktif */}
      {openAlarms.length > 0 && (
        <div className="mb-4 space-y-2">
          {openAlarms.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-4 rounded-panel border border-danger/50 bg-danger/10 px-4 py-2.5"
            >
              <div className="flex items-center gap-3 text-danger">
                <span className="size-2 animate-pulse-dot rounded-full bg-danger" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  {t.sim.alarmActive}
                </span>
                <span className="num text-sm font-semibold">
                  {t.zone(a.zoneId)} · {a.swimmerId}
                </span>
                <Elapsed since={a.timestamp} />
              </div>
              <Button variant="danger" onClick={() => rescueSwimmer(a.swimmerId)}>
                {t.sim.rescue}
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[1fr_320px] items-start gap-4">
        {/* ============ ARENA ============ */}
        <div
          ref={arenaRef}
          className="relative aspect-[16/10] touch-none select-none overflow-hidden rounded-panel border border-line bg-panel"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent 0 12px, rgba(30,51,80,0.25) 12px 14px)",
          }}
        >
          <span className="num absolute left-3 top-2.5 text-[10px] font-semibold tracking-[0.3em] text-ink-dim/80">
            {t.sim.deck}
          </span>

          {/* kolam */}
          <div
            className="absolute overflow-hidden rounded-[5px] border border-accent/40 bg-water"
            style={{
              left: `${POOL.left}%`,
              top: `${POOL.top}%`,
              right: `${100 - POOL.right}%`,
              bottom: `${100 - POOL.bottom}%`,
            }}
          >
            <div className="grid h-full grid-cols-2 grid-rows-2">
              {([1, 2, 3, 4] as ZoneId[]).map((z) => (
                <div
                  key={z}
                  className={`relative ${z === 1 || z === 3 ? "border-r" : ""} ${
                    z <= 2 ? "border-b" : ""
                  } border-dashed border-line`}
                >
                  <span className="num absolute left-2.5 top-2 text-[10px] tracking-[0.2em] text-ink-dim/80">
                    {t.zone(z).toUpperCase()}
                    {zoneCount(z) > 0 && (
                      <span className="ml-1.5 text-accent">·{zoneCount(z)}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* perenang */}
          {swimmers.map((sw) => {
            const remaining = Math.max(0, SUBMERSION_THRESHOLD - sw.submersionSec);
            const alarmed = sw.status === "drowning" && remaining === 0;

            return (
              <button
                key={sw.id}
                type="button"
                aria-label={`${sw.id} — ${t.sim.status[sw.status]}`}
                onPointerDown={(e) => onPointerDown(e, sw)}
                onPointerMove={(e) => onPointerMove(e, sw)}
                onPointerUp={() => onPointerUp(sw)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 touch-none ${
                  draggable(sw.status)
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-default"
                } ${sw.status === "drowning" ? "z-20" : "z-10"}`}
                style={{ left: `${sw.pos?.x ?? 10}%`, top: `${sw.pos?.y ?? 30}%` }}
              >
                {/* label status di atas kepala */}
                <span
                  className={`absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2 py-px text-[10px] font-bold ${
                    alarmed
                      ? "border-danger/50 bg-danger/15 text-danger"
                      : chipClass[sw.status]
                  }`}
                >
                  {sw.status === "drowning"
                    ? alarmed
                      ? t.sim.alarmActive
                      : `${t.sim.status.drowning} · ${remaining}s`
                    : t.sim.status[sw.status]}
                </span>

                {/* cincin denyut saat countdown/alarm */}
                {sw.status === "drowning" && (
                  <span
                    className={`absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 animate-pulse-dot rounded-full ${
                      alarmed ? "text-danger" : "text-alert"
                    }`}
                  />
                )}

                <span
                  className={`block ${
                    sw.status === "swimming"
                      ? "animate-bob"
                      : sw.status === "struggling"
                        ? "animate-shake"
                        : ""
                  }`}
                >
                  <SwimmerFigure sw={sw} />
                </span>
              </button>
            );
          })}
        </div>

        {/* ============ SIDEBAR ============ */}
        <div className="space-y-4">
          <Panel
            title={t.sim.swimmersPanel}
            headerRight={
              <button
                type="button"
                onClick={addSwimmer}
                className="rounded-panel border border-line px-2 py-0.5 text-[11px] font-semibold text-ink-dim transition-colors hover:border-accent hover:text-ink"
              >
                {t.sim.addSwimmer}
              </button>
            }
          >
            <ul className="space-y-2.5">
              {swimmers.map((sw) => (
                <li key={sw.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ background: statusColor[sw.status] }}
                    />
                    <div>
                      <div className="num text-xs font-semibold text-ink">
                        {sw.id}
                        <span className="ml-2 font-sans font-normal text-ink-dim">
                          {sw.zoneId !== null ? t.zone(sw.zoneId) : t.sim.deckLabel}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-dim">
                        {t.sim.status[sw.status]}
                        {sw.status === "drowning" && (
                          <span className="num ml-1 text-alert">
                            · {t.sim.submersion} {sw.submersionSec}s
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="num text-[11px] text-ink-dim">
                    {t.sim.battery} {sw.battery}%
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title={t.sim.controls}>
            <ol className="space-y-3">
              {[t.sim.instrDrag, t.sim.instrClick, t.sim.instrConfirm].map(
                (line, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="num shrink-0 text-xs font-semibold text-accent">
                      0{i + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-ink-dim">
                      {line}
                    </p>
                  </li>
                ),
              )}
            </ol>
          </Panel>
        </div>
      </div>
    </div>
  );
}
