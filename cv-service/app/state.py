from enum import Enum


class SseEvent(str, Enum):
    heartbeat = "heartbeat"
    visual_evidence = "visual_evidence"
