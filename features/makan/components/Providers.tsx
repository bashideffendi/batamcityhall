"use client";

import type { ReactNode } from "react";
import { FilterProvider } from "../lib/filters";
import { htmlLang, useI18n } from "../lib/i18n";
import MakanNav from "./MakanNav";

// Kerangka Loket Makan di dalam layout situs. Service worker dan manifest milik situs, bukan loket ini.
export default function Providers({ children }: { children: ReactNode }) {
  const { lang } = useI18n();
  return (
    <FilterProvider>
      <div className="mk-akar" lang={htmlLang(lang)}>
        <MakanNav />
        {children}
      </div>
    </FilterProvider>
  );
}
