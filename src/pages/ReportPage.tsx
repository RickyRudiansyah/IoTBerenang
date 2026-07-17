import { useLang } from "../i18n/LangContext";
import { PagePlaceholder } from "./PagePlaceholder";

export function ReportPage() {
  const { t } = useLang();
  return (
    <PagePlaceholder title={t.page.report.title} desc={t.page.report.desc} />
  );
}
