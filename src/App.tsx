import { useState } from "react";
import type { PageId } from "./types";
import { LangProvider } from "./i18n/LangContext";
import { SoundProvider } from "./audio/SoundContext";
import { AppStateProvider } from "./store/AppState";
import { Topbar } from "./components/shell/Topbar";
import { NavTabs } from "./components/shell/NavTabs";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { SimulationPage } from "./pages/SimulationPage";
import { ReportPage } from "./pages/ReportPage";

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
        </div>
        </AppStateProvider>
      </SoundProvider>
    </LangProvider>
  );
}
