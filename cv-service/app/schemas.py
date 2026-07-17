from datetime import datetime
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field


class RawClass(str, Enum):
    normal_swimming = "normal_swimming"
    distress_candidate = "distress_candidate"
    out_of_water = "out_of_water"


class MotionState(str, Enum):
    normal = "normal"
    low = "low"
    unknown = "unknown"


class Visibility(str, Enum):
    clear = "clear"
    limited = "limited"
    lost = "lost"
    unavailable = "unavailable"


class VisualState(str, Enum):
    normal = "normal"
    watch = "watch"
    suspected_distress = "suspected_distress"
    suspected_inactivity = "suspected_inactivity"
    visibility_limited = "visibility_limited"
    track_lost = "track_lost"
    camera_unavailable = "camera_unavailable"


class VisualEvidenceEvent(BaseModel):
    timestamp: datetime
    cameraId: str
    trackId: int
    zoneId: Literal[1, 2, 3, 4]
    rawClass: RawClass
    detectionConfidence: float = Field(ge=0, le=1)
    motionState: MotionState
    lowMotionDurationMs: int = Field(ge=0)
    classPersistenceMs: int = Field(ge=0)
    visibility: Visibility
    visualState: VisualState
    evidence: list[str]


class HeartbeatEvent(BaseModel):
    timestamp: datetime
    cameraId: str
    mode: str
    status: Literal["ok"] = "ok"


class StatusResponse(BaseModel):
    service: Literal["cv-service"] = "cv-service"
    mode: str
    cameraId: str
    ready: bool
    status: str
    modelPath: str
    configDir: str
    thresholdsLoaded: bool
    allowedOrigins: list[str]
    timestamp: datetime
