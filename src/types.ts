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
  /** posisi di arena simulasi, persen (0–100) — dipakai Simulasi & Map */
  pos?: { x: number; y: number };
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

export type VisualRawClass =
  | "normal_swimming"
  | "distress_candidate"
  | "out_of_water";

export type VisualMotionState = "normal" | "low" | "unknown";
export type VisualVisibility = "clear" | "limited" | "lost" | "unavailable";

export type VisualState =
  | "normal"
  | "watch"
  | "suspected_distress"
  | "suspected_inactivity"
  | "visibility_limited"
  | "track_lost"
  | "camera_unavailable";

export interface VisualEvidenceEvent {
  timestamp: string;
  cameraId: string;
  trackId: number;
  zoneId: ZoneId;
  rawClass: VisualRawClass;
  detectionConfidence: number;
  motionState: VisualMotionState;
  lowMotionDurationMs: number;
  classPersistenceMs: number;
  visibility: VisualVisibility;
  visualState: VisualState;
  evidence: string[];
}

export type PageId = "home" | "map" | "simulation" | "report";
export type Lang = "id" | "en";
