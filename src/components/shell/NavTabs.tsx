import type { ComponentType, SVGProps } from "react";
import type { PageId } from "../../types";
import { useLang } from "../../i18n/LangContext";
import { IconHome, IconMap, IconWaves, IconChart } from "../ui";

interface NavTabsProps {
  page: PageId;
  onNavigate: (page: PageId) => void;
}

const tabs: { id: PageId; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: "home", icon: IconHome },
  { id: "map", icon: IconMap },
  { id: "simulation", icon: IconWaves },
  { id: "report", icon: IconChart },
];

const labelKey: Record<PageId, "home" | "map" | "simulation" | "report"> = {
  home: "home",
  map: "map",
  simulation: "simulation",
  report: "report",
};

export function NavTabs({ page, onNavigate }: NavTabsProps) {
  const { t } = useLang();

  return (
    <nav
      aria-label="Main"
      className="flex items-center gap-1 border-b border-line bg-panel/50 px-5"
    >
      {tabs.map(({ id, icon: Icon }) => {
        const active = id === page;
        return (
          <button
            key={id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onNavigate(id)}
            className={`relative -mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors duration-150 ${
              active
                ? "border-accent text-ink"
                : "border-transparent text-ink-dim hover:text-ink"
            }`}
          >
            <Icon className={active ? "text-accent" : ""} />
            {t.nav[labelKey[id]]}
          </button>
        );
      })}
    </nav>
  );
}
