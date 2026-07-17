import { useState } from "react";
import type { PageId } from "./types";
import { LangProvider } from "./i18n/LangContext";
import { AppStateProvider } from "./store/AppState";
import { Topbar } from "./components/shell/Topbar";
import { NavTabs } from "./components/shell/NavTabs";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { SimulationPage } from "./pages/SimulationPage";
import { ReportPage } from "./pages/ReportPage";

const pages: Record<PageId, () => React.JSX.Element> = {
  home: HomePage,
  map: MapPage,
  simulation: SimulationPage,
  report: ReportPage,
};

export default function App() {
  const [page, setPage] = useState<PageId>("home");
  const Page = pages[page];

  return (
    <LangProvider>
      <AppStateProvider>
        <div className="flex min-h-screen flex-col">
          <Topbar />
          <NavTabs page={page} onNavigate={setPage} />
          <main className="flex-1">
            <Page />
          </main>
        </div>
      </AppStateProvider>
    </LangProvider>
  );
}
