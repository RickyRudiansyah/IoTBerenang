import { useLang } from "../i18n/LangContext";
import { PagePlaceholder } from "./PagePlaceholder";

export function HomePage() {
  const { t } = useLang();
  return <PagePlaceholder title={t.page.home.title} desc={t.page.home.desc} />;
}
