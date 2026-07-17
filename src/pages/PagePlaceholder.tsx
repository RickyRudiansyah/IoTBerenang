import { Panel, StatusPill } from "../components/ui";
import { useLang } from "../i18n/LangContext";

interface PagePlaceholderProps {
  title: string;
  desc: string;
}

export function PagePlaceholder({ title, desc }: PagePlaceholderProps) {
  const { t } = useLang();

  return (
    <div className="mx-auto w-full max-w-[1400px] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
          <p className="mt-1 text-sm text-ink-dim">{desc}</p>
        </div>
        <StatusPill status="warn" label={t.comingSoon} />
      </div>

      <Panel title={title}>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-ink-dim">{t.comingSoon}</p>
        </div>
      </Panel>
    </div>
  );
}
