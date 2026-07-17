# CV Service

Contract-first mock SSE service for visual evidence events.

## Setup

```powershell
python -m venv cv-service/.venv
cv-service\.venv\Scripts\python.exe -m pip install --upgrade pip
cv-service\.venv\Scripts\python.exe -m pip install -r cv-service\requirements.txt
```

## Run (canonical command)

Run from the **repository root** using the local virtual-environment interpreter:

```powershell
cv-service\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir cv-service --host 127.0.0.1 --port 8000
```

- **Expected working directory:** the repository root (the folder that contains
  `cv-service/`). `--app-dir cv-service` puts `app` on the import path.
- **Path resolution:** configuration paths are resolved from stable anchors
  derived from the source location (not the current working directory), so the
  service also works if launched from inside `cv-service/`. Relative defaults
  such as `cv-service/config` resolve against the repository root, and paths
  that do not start with `cv-service` resolve against the `cv-service/` root.
  Absolute paths in environment variables are honoured unchanged.
- **Override the config directory:** set `CV_CONFIG_DIR` (relative to the repo
  root, or an absolute path). `thresholds.yaml` and `zones.example.json` are
  read from there. The `.env` file is loaded from `cv-service/.env`.

Endpoints:

- `GET /status`
- `GET /events`

### Expected `/status` in valid mock configuration

```json
{
  "service": "cv-service",
  "mode": "mock",
  "ready": true,
  "thresholdsLoaded": true
}
```

### Events and cadence

`GET /events` is a Server-Sent Events stream emitting two named events:

- `heartbeat` — cadence controlled by `events.heartbeat_ms` in
  `config/thresholds.yaml` (default 3000 ms).
- `visual_evidence` — deterministic mock evidence, cadence controlled by
  `events.mock_event_ms` (default 1000 ms). Heartbeat and mock evidence are
  emitted on independent schedules.

Patch 1 runs in mock mode only. Real camera, YOLO, ByteTrack, and motion
processing are later phases.

## Tests

```powershell
cv-service\.venv\Scripts\python.exe -m pytest -q
```

Tests run from either the repository root or `cv-service/` — path resolution is
covered explicitly for both working directories.
