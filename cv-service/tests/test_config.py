import os
import subprocess
import sys
from pathlib import Path

from app.config import (
    CV_SERVICE_ROOT,
    REPO_ROOT,
    Settings,
    load_thresholds,
    resolve_repo_path,
)

CHECK_SCRIPT = (
    "from app.config import get_settings; "
    "s = get_settings(); "
    "print(s.thresholds_path.exists(), s.zones_path.exists())"
)


def test_default_config_paths_resolve_without_doubling():
    settings = Settings()
    assert settings.thresholds_path.exists()
    assert settings.zones_path.exists()
    # Guard against the cv-service/cv-service/config regression.
    assert "cv-service" + os.sep + "cv-service" not in str(settings.thresholds_path)


def test_load_thresholds_reads_events_section():
    thresholds = load_thresholds(Settings())
    assert thresholds["events"]["heartbeat_ms"] == 3000
    assert thresholds["events"]["mock_event_ms"] == 1000


def test_absolute_env_override_is_preserved():
    absolute = REPO_ROOT / "cv-service" / "config"
    assert resolve_repo_path(str(absolute)) == absolute
    # An arbitrary absolute path is returned unchanged.
    marker = Path("/tmp/some/absolute/path").resolve()
    assert resolve_repo_path(str(marker)).is_absolute()


def _run_check(cwd: Path) -> str:
    result = subprocess.run(
        [sys.executable, "-c", CHECK_SCRIPT],
        cwd=cwd,
        env={**os.environ, "PYTHONPATH": str(CV_SERVICE_ROOT)},
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr
    return result.stdout.strip()


def test_config_resolves_from_repo_root_cwd():
    assert _run_check(REPO_ROOT) == "True True"


def test_config_resolves_from_cv_service_cwd():
    assert _run_check(CV_SERVICE_ROOT) == "True True"
