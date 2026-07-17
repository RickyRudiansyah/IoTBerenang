import { useLang } from "../i18n/LangContext";
import { PagePlaceholder } from "./PagePlaceholder";

export function MapPage() {
  const { t } = useLang();
  return <PagePlaceholder title={t.page.map.title} desc={t.page.map.desc} />;
}
