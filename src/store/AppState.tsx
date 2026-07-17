import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Alarm, Swimmer, Zone, ZoneId } from "../types";

/* ---------- seed (mock, in-memory) ---------- */

const seedZones: Zone[] = [1, 2, 3, 4].map((id) => ({
  id: id as ZoneId,
  label: `Zona ${id}`,
  riskCount: 0,
}));

const seedSwimmers: Swimmer[] = [
  { id: "SW-01", name: "Perenang A", zoneId: null, status: "idle", submersionSec: 0, battery: 92 },
  { id: "SW-02", name: "Perenang B", zoneId: null, status: "idle", submersionSec: 0, battery: 87 },
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
  addAlarm: (alarm: Omit<Alarm, "id" | "timestamp" | "resolved">) => Alarm;
  updateSwimmer: (id: string, patch: Partial<Swimmer>) => void;
  resolveAlarm: (id: string, responseSec: number) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [zones] = useState<Zone[]>(seedZones);
  const [swimmers, setSwimmers] = useState<Swimmer[]>(seedSwimmers);
  const [alarms, setAlarms] = useState<Alarm[]>(seedAlarms);

  const value = useMemo<AppStateValue>(
    () => ({
      zones,
      swimmers,
      alarms,

      addAlarm(partial) {
        const alarm: Alarm = {
          ...partial,
          id: `AL-${String(Date.now()).slice(-6)}`,
          timestamp: Date.now(),
          resolved: false,
        };
        setAlarms((prev) => [alarm, ...prev]);
        return alarm;
      },

      updateSwimmer(id, patch) {
        setSwimmers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        );
      },

      resolveAlarm(id, responseSec) {
        setAlarms((prev) =>
          prev.map((a) => (a.id === id ? { ...a, resolved: true, responseSec } : a)),
        );
      },
    }),
    [zones, swimmers, alarms],
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within <AppStateProvider>");
  return ctx;
}
