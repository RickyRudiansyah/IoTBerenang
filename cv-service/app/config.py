from functools import lru_cache
from pathlib import Path
from typing import Literal

import yaml
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Stable anchors derived from this file's location, independent of CWD.
# config.py lives at <repo>/cv-service/app/config.py
CV_SERVICE_ROOT = Path(__file__).resolve().parents[1]  # <repo>/cv-service
REPO_ROOT = Path(__file__).resolve().parents[2]  # <repo>


def resolve_repo_path(value: str) -> Path:
    """Resolve a configured path deterministically, independent of CWD.

    - Absolute paths are returned unchanged (env overrides stay honoured).
    - Repo-relative defaults such as ``cv-service/config`` resolve against the
      repository root so running from either the repo root or ``cv-service/``
      never produces doubled paths like ``cv-service/cv-service/config``.
    - A path that starts with ``cv-service`` is repo-root relative; any other
      relative path is treated as ``cv-service``-relative.
    """
    path = Path(value)
    if path.is_absolute():
        return path
    parts = path.parts
    if parts and parts[0] == "cv-service":
        return (REPO_ROOT / path).resolve()
    return (CV_SERVICE_ROOT / path).resolve()


class Settings(BaseSettings):
    mode: Literal["mock", "video", "camera"] = Field("mock", alias="CV_MODE")
    camera_source: str | None = Field(None, alias="CV_CAMERA_SOURCE")
    camera_id: str = Field("POOL-CAM-01", alias="CV_CAMERA_ID")
    model_path: str = Field("cv-service/models/best.pt", alias="CV_MODEL_PATH")
    config_dir: str = Field("cv-service/config", alias="CV_CONFIG_DIR")
    allowed_origins: str = Field(
        "http://localhost:5173,http://127.0.0.1:5173", alias="CV_ALLOWED_ORIGINS"
    )
    host: str = Field("127.0.0.1", alias="CV_HOST")
    port: int = Field(8000, alias="CV_PORT")
    log_level: str = Field("INFO", alias="CV_LOG_LEVEL")

    # Anchor the .env file to the cv-service root so it loads regardless of CWD.
    model_config = SettingsConfigDict(
        env_file=CV_SERVICE_ROOT / ".env", extra="ignore"
    )

    @property
    def origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def config_path(self) -> Path:
        return resolve_repo_path(self.config_dir)

    @property
    def resolved_model_path(self) -> Path:
        return resolve_repo_path(self.model_path)

    @property
    def thresholds_path(self) -> Path:
        return self.config_path / "thresholds.yaml"

    @property
    def zones_path(self) -> Path:
        return self.config_path / "zones.example.json"


@lru_cache
def get_settings() -> Settings:
    return Settings()


def load_thresholds(settings: Settings) -> dict:
    with settings.thresholds_path.open("r", encoding="utf-8") as handle:
        loaded = yaml.safe_load(handle) or {}
    if not isinstance(loaded, dict):
        raise ValueError("thresholds.yaml must contain a mapping")
    return loaded
