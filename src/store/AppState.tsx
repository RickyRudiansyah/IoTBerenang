import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Alarm, Swimmer, Zone, ZoneId } from "../types";
import { buzzer } from "../audio/buzzer";

/** ambang konfirmasi submersi sebelum alarm (detik) */
export const SUBMERSION_THRESHOLD = 6;
/** durasi fase meronta (ms) */
export const STRUGGLE_MS = 2000;

/* ---------- seed (mock, in-memory) ---------- */

const seedRisk: Record<ZoneId, number> = { 1: 1, 2: 1, 3: 2, 4: 0 };

const seedZones: Zone[] = ([1, 2, 3, 4] as ZoneId[]).map((id) => ({
  id,
  label: `Zona ${id}`,
  riskCount: seedRisk[id],
}));

const DECK_SPOTS = [
  { x: 10, y: 26 },
  { x: 10, y: 46 },
  { x: 10, y: 66 },
  { x: 10, y: 86 },
  { x: 17, y: 36 },
  { x: 17, y: 56 },
];

const seedSwimmers: Swimmer[] = [
  { id: "SW-01", name: "Perenang A", zoneId: null, status: "idle", submersionSec: 0, battery: 92, pos: DECK_SPOTS[0] },
  { id: "SW-02", name: "Perenang B", zoneId: null, status: "idle", submersionSec: 0, battery: 87, pos: DECK_SPOTS[1] },
];

const h = 60 * 60 * 1000;
const now = Date.now();

const seedAlarms: Alarm[] = [
  { id: "AL-001", timestamp: now - 26 * h, zoneId: 3, swimmerId: "SW-11", responseSec: 18, resolved: true },
  { id: "AL-002", timestamp: now - 8 * h, zoneId: 1, swimmerId: "SW-07", responseSec: 12, resolved: true },
  { id: "AL-003", timestamp: now - 5 * h, zoneId: 3, swimmerId: "SW-04", responseSec: 25, resolved: true },
  { id: "AL-004", timestamp: now - 2 * h, zoneId: 2, swimmerId: "SW-09", responseSec: 9, resolved: true },
];

/* ---------- context ---------- */

interface AppStateValue {
  zones: Zone[];
  swimmers: Swimmer[];
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, "id" | "timestamp" | "resolved">) => void;
  updateSwimmer: (id: string, patch: Partial<Swimmer>) => void;
  resolveAlarm: (id: string, responseSec: number) => void;
  /** urutan demo: meronta → diam → countdown → alarm (jalan terus walau pindah tab) */
  triggerDrowning: (swimmerId: string) => void;
  /** hentikan sekuens/alarm swimmer, catat waktu respons */
  rescueSwimmer: (swimmerId: string) => void;
  addSwimmer: () => void;
  resetSimulation: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [zones, setZones] = useState<Zone[]>(seedZones);
  const [swimmers, setSwimmers] = useState<Swimmer[]>(seedSwimmers);
  const [alarms, setAlarms] = useState<Alarm[]>(seedAlarms);

  const swimmersRef = useRef(swimmers);
  useEffect(() => {
    swimmersRef.current = swimmers;
  }, [swimmers]);

  /** timer aktif per swimmer (timeout fase meronta + interval countdown) */
  const timersRef = useRef(new Map<string, number[]>());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const ids of timers.values()) ids.forEach((t) => window.clearTimeout(t));
      timers.clear();
      buzzer.stop();
    };
  }, []);

  const value = useMemo<AppStateValue>(() => {
    const updateSwimmer = (id: string, patch: Partial<Swimmer>) => {
      setSwimmers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      );
    };

    const clearTimers = (id: string) => {
      timersRef.current.get(id)?.forEach((t) => window.clearTimeout(t));
      timersRef.current.delete(id);
    };

    const fireAlarm = (swimmerId: string, zoneId: ZoneId) => {
      const alarm: Alarm = {
        id: `AL-${String(Date.now()).slice(-6)}`,
        timestamp: Date.now(),
        zoneId,
        swimmerId,
        resolved: false,
      };
      setAlarms((prev) => [alarm, ...prev]);
      setZones((prev) =>
        prev.map((z) =>
          z.id === zoneId ? { ...z, riskCount: z.riskCount + 1 } : z,
        ),
      );
      buzzer.start();
    };

    return {
      zones,
      swimmers,
      alarms,
      updateSwimmer,

      addAlarm(partial) {
        fireAlarm(partial.swimmerId, partial.zoneId);
      },

      resolveAlarm(id, responseSec) {
        setAlarms((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, resolved: true, responseSec } : a,
          ),
        );
      },

      triggerDrowning(swimmerId) {
        const sw = swimmersRef.current.find((s) => s.id === swimmerId);
        if (!sw || sw.zoneId === null) return;
        if (sw.status !== "swimming" && sw.status !== "rescued") return;

        clearTimers(swimmerId);
        updateSwimmer(swimmerId, { status: "struggling", submersionSec: 0 });

        const t = window.setTimeout(() => {
          updateSwimmer(swimmerId, { status: "drowning" });

          const iv = window.setInterval(() => {
            const cur = swimmersRef.current.find((s) => s.id === swimmerId);
            if (!cur || cur.status !== "drowning") {
              window.clearInterval(iv);
              return;
            }
            const next = cur.submersionSec + 1;
            updateSwimmer(swimmerId, { submersionSec: next });
            if (next >= SUBMERSION_THRESHOLD && cur.zoneId !== null) {
              window.clearInterval(iv);
              fireAlarm(swimmerId, cur.zoneId);
            }
          }, 1000);

          timersRef.current.get(swimmerId)?.push(iv);
        }, STRUGGLE_MS);

        timersRef.current.set(swimmerId, [t]);
      },

      rescueSwimmer(swimmerId) {
        clearTimers(swimmerId);
        updateSwimmer(swimmerId, { status: "rescued", submersionSec: 0 });

        const otherOpen = alarms.some(
          (a) => !a.resolved && a.swimmerId !== swimmerId,
        );
        if (!otherOpen) buzzer.stop();

        const t = Date.now();
        setAlarms((prev) =>
          prev.map((a) =>
            a.swimmerId === swimmerId && !a.resolved
              ? { ...a, resolved: true, responseSec: Math.max(1, Math.round((t - a.timestamp) / 1000)) }
              : a,
          ),
        );
      },

      addSwimmer() {
        setSwimmers((prev) => {
          const n = prev.length + 1;
          const letter = String.fromCharCode(64 + n);
          return [
            ...prev,
            {
              id: `SW-${String(n).padStart(2, "0")}`,
              name: `Perenang ${letter}`,
              zoneId: null,
              status: "idle",
              submersionSec: 0,
              battery: 70 + Math.floor(Math.random() * 30),
              pos: DECK_SPOTS[(n - 1) % DECK_SPOTS.length],
            },
          ];
        });
      },

      resetSimulation() {
        for (const [id] of timersRef.current) clearTimers(id);
        buzzer.stop();

        const t = Date.now();
        setAlarms((prev) =>
          prev.map((a) =>
            a.resolved
              ? a
              : { ...a, resolved: true, responseSec: Math.max(1, Math.round((t - a.timestamp) / 1000)) },
          ),
        );
        setSwimmers((prev) =>
          prev.map((s, i) => ({
            ...s,
            zoneId: null,
            status: "idle",
            submersionSec: 0,
            pos: DECK_SPOTS[i % DECK_SPOTS.length],
          })),
        );
      },
    };
  }, [zones, swimmers, alarms]);

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within <AppStateProvider>");
  return ctx;
}
