import { useEffect, useState } from "react";
import { useLang } from "../../i18n/LangContext";
import { useSound } from "../../audio/SoundContext";
import { IconButton, Toggle, IconVolume, IconVolumeMuted } from "../ui";

function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return (
    <span className="num text-xs text-ink-dim">
      {hh}:{mm}
      <span className="text-ink-dim/50">:{ss}</span>
    </span>
  );
}

export function Topbar() {
  const { lang, setLang, t } = useLang();
  const { muted, toggleMuted } = useSound();

  return (
    <header className="flex h-14 items-center justify-between border-b border-line bg-panel/80 px-5 backdrop-blur-sm">
      {/* brand */}
      <div className="flex items-baseline gap-3">
        <h1 className="text-lg font-extrabold tracking-tight text-ink">
          Tirta<span className="text-accent">Jaga</span>
        </h1>
        <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-ink-dim lg:inline">
          {t.tagline}
        </span>
      </div>

      {/* controls */}
      <div className="flex items-center gap-3">
        <Clock />

        <span className="inline-flex items-center gap-1.5 rounded-full border border-safe/30 bg-safe/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-safe">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-safe" />
          {t.live}
        </span>

        <Toggle
          aria-label={t.langToggle}
          options={[
            { value: "id", label: "ID" },
            { value: "en", label: "EN" },
          ]}
          value={lang}
          onChange={setLang}
        />

        <IconButton
          aria-label={muted ? t.unmute : t.mute}
          active={muted}
          onClick={toggleMuted}
        >
          {muted ? <IconVolumeMuted /> : <IconVolume />}
        </IconButton>
      </div>
    </header>
  );
}
