import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { buzzer } from "./buzzer";

interface SoundContextValue {
  muted: boolean;
  toggleMuted: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    buzzer.setMuted(muted);
  }, [muted]);

  const value = useMemo<SoundContextValue>(
    () => ({ muted, toggleMuted: () => setMuted((m) => !m) }),
    [muted],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within <SoundProvider>");
  return ctx;
}
