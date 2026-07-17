import asyncio
import json
from collections.abc import AsyncIterator
from datetime import datetime, timezone

from app.config import Settings, load_thresholds
from app.schemas import HeartbeatEvent, VisualEvidenceEvent
from app.state import SseEvent

# Fallbacks used only when thresholds config is missing/unreadable.
DEFAULT_HEARTBEAT_MS = 3000
DEFAULT_MOCK_EVENT_MS = 1000


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def event_intervals(settings: Settings) -> tuple[float, float]:
    """Read heartbeat and mock-event cadence (seconds) from thresholds config."""
    heartbeat_ms = DEFAULT_HEARTBEAT_MS
    mock_event_ms = DEFAULT_MOCK_EVENT_MS
    try:
        events = load_thresholds(settings).get("events", {}) or {}
        heartbeat_ms = int(events.get("heartbeat_ms", heartbeat_ms))
        mock_event_ms = int(events.get("mock_event_ms", mock_event_ms))
    except Exception:
        pass
    return heartbeat_ms / 1000.0, mock_event_ms / 1000.0


def mock_visual_evidence(settings: Settings, sequence: int = 0) -> VisualEvidenceEvent:
    zone_id = (sequence % 4) + 1
    is_watch = sequence % 2 == 0
    return VisualEvidenceEvent(
        timestamp=utc_now(),
        cameraId=settings.camera_id,
        trackId=7 + sequence,
        zoneId=zone_id,
        rawClass="distress_candidate" if is_watch else "normal_swimming",
        detectionConfidence=0.84 if is_watch else 0.76,
        motionState="low" if is_watch else "normal",
        lowMotionDurationMs=2800 if is_watch else 0,
        classPersistenceMs=2200 if is_watch else 400,
        visibility="clear",
        visualState="suspected_distress" if is_watch else "normal",
        evidence=(
            ["persistent_distress_appearance", "limited_displacement"]
            if is_watch
            else ["normal_swimming_appearance"]
        ),
    )


def heartbeat(settings: Settings) -> HeartbeatEvent:
    return HeartbeatEvent(timestamp=utc_now(), cameraId=settings.camera_id, mode=settings.mode)


def encode_sse(event: SseEvent, payload: object) -> str:
    if hasattr(payload, "model_dump_json"):
        data = payload.model_dump_json()
    else:
        data = json.dumps(payload)
    return f"event: {event.value}\ndata: {data}\n\n"


async def mock_event_stream(settings: Settings) -> AsyncIterator[str]:
    heartbeat_s, mock_event_s = event_intervals(settings)
    tick = min(heartbeat_s, mock_event_s)

    # Emit both once immediately so a fresh connection has data right away.
    yield encode_sse(SseEvent.heartbeat, heartbeat(settings))
    yield encode_sse(SseEvent.visual_evidence, mock_visual_evidence(settings, 0))

    sequence = 1
    since_heartbeat = 0.0
    since_mock = 0.0
    while True:
        await asyncio.sleep(tick)
        since_heartbeat += tick
        since_mock += tick
        if since_heartbeat + 1e-9 >= heartbeat_s:
            yield encode_sse(SseEvent.heartbeat, heartbeat(settings))
            since_heartbeat = 0.0
        if since_mock + 1e-9 >= mock_event_s:
            yield encode_sse(SseEvent.visual_evidence, mock_visual_evidence(settings, sequence))
            sequence += 1
            since_mock = 0.0
