from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.config import get_settings, load_thresholds
from app.pipeline import mock_event_stream
from app.schemas import StatusResponse

settings = get_settings()

app = FastAPI(title="CV Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/status", response_model=StatusResponse)
def status() -> StatusResponse:
    thresholds_loaded = True
    try:
        load_thresholds(settings)
    except Exception:
        thresholds_loaded = False

    return StatusResponse(
        mode=settings.mode,
        cameraId=settings.camera_id,
        ready=settings.mode == "mock" and thresholds_loaded,
        status="mock mode ready" if settings.mode == "mock" else "configured",
        modelPath=settings.model_path,
        configDir=settings.config_dir,
        thresholdsLoaded=thresholds_loaded,
        allowedOrigins=settings.origins,
        timestamp=datetime.now(timezone.utc),
    )


@app.get("/events")
async def events() -> StreamingResponse:
    return StreamingResponse(
        mock_event_stream(settings),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
