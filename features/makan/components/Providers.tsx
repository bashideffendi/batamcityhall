"use client";

import type { ReactNode } from "react";
import { htmlLang, useI18n } from "../lib/i18n";
import MakanNav from "./MakanNav";

// Kerangka bagian Makan di dalam layout situs. Saringan dipasang per halaman (lib/filters.tsx).
export default function Providers({ children }: { children: ReactNode }) {
  const { lang } = useI18n();
  return (
    <div className="mk-akar" lang={htmlLang(lang)}>
      <MakanNav />
      {children}
    </div>
  );
}
