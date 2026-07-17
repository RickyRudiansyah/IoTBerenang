import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Lang } from "../types";
import { strings } from "./strings";
import type { Strings } from "./strings";

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Strings;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("id");

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t: strings[lang] }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}
