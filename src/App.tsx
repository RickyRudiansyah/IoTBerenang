import { useEffect, useState } from "react";
import type { PageId, VisualEvidenceEvent } from "./types";
import { LangProvider } from "./i18n/LangContext";
import { SoundProvider } from "./audio/SoundContext";
import { AppStateProvider } from "./store/AppState";
import { Topbar } from "./components/shell/Topbar";
import { NavTabs } from "./components/shell/NavTabs";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { SimulationPage } from "./pages/SimulationPage";
import { ReportPage } from "./pages/ReportPage";
import { connectCvEvents } from "./services/cvEvents";

function isLocalDevelopmentHost() {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

function CvDevConnectionProbe() {
  const [lastEvent, setLastEvent] = useState<VisualEvidenceEvent | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isLocalDevelopmentHost()) return;

    return connectCvEvents((event) => {
      setConnected(true);
      if (event.type === "visual_evidence") {
        console.debug("CV visual evidence event received", event.data);
        setLastEvent(event.data);
      }
    });
  }, []);

  if (!isLocalDevelopmentHost()) return null;

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-50 rounded-panel border border-line bg-panel/90 px-3 py-2 text-[11px] text-ink-dim shadow-lg">
      CV SSE: {connected ? "received" : "waiting"}
      {lastEvent && (
        <span className="num ml-2 text-accent">
          {lastEvent.cameraId} / Z{lastEvent.zoneId}
        </span>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<PageId>("home");

  return (
    <LangProvider>
      <SoundProvider>
        <AppStateProvider>
        <div className="flex min-h-screen flex-col">
          <Topbar />
          <NavTabs page={page} onNavigate={setPage} />
          <main className="flex-1">
            {page === "home" && <HomePage onNavigate={setPage} />}
            {page === "map" && <MapPage />}
            {page === "simulation" && <SimulationPage />}
            {page === "report" && <ReportPage />}
          </main>
          <CvDevConnectionProbe />
        </div>
        </AppStateProvider>
      </SoundProvider>
    </LangProvider>
  );
}
