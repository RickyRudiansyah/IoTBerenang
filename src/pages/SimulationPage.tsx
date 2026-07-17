import { useLang } from "../i18n/LangContext";
import { PagePlaceholder } from "./PagePlaceholder";

export function SimulationPage() {
  const { t } = useLang();
  return (
    <PagePlaceholder
      title={t.page.simulation.title}
      desc={t.page.simulation.desc}
    />
  );
}
