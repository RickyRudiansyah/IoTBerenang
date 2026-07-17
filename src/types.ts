export type ZoneId = 1 | 2 | 3 | 4;

export type SwimmerStatus =
  | "idle"
  | "swimming"
  | "struggling"
  | "drowning"
  | "rescued";

export interface Swimmer {
  id: string;
  name?: string;
  /** null = di deck (luar kolam) */
  zoneId: ZoneId | null;
  status: SwimmerStatus;
  submersionSec: number;
  battery: number;
}

export interface Zone {
  id: ZoneId;
  label: string;
  riskCount: number;
}

export interface Alarm {
  id: string;
  timestamp: number;
  zoneId: ZoneId;
  swimmerId: string;
  responseSec?: number;
  resolved: boolean;
}

export type PageId = "home" | "map" | "simulation" | "report";
export type Lang = "id" | "en";
