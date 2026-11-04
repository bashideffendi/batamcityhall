"use client";

import { useEffect, type ReactNode } from "react";
import { I18nProvider } from "@/features/makan/lib/i18n";
import { CurrencyProvider } from "@/features/makan/lib/currency";
import { FavoritesProvider } from "@/features/makan/lib/favorites";
import { FilterProvider } from "@/features/makan/lib/filters";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // Only register in production: in dev the SW caches hashed /_next chunks
    // and triggers a reload loop when Turbopack rebuilds. In dev, actively
    // unregister any SW left over from an earlier session so it self-heals.
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((rs) => rs.forEach((r) => r.unregister()))
        .catch(() => {});
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline support is best-effort */
    });
  }, []);

  return (
    <I18nProvider>
      <CurrencyProvider>
        <FavoritesProvider>
          <FilterProvider>{children}</FilterProvider>
        </FavoritesProvider>
      </CurrencyProvider>
    </I18nProvider>
  );
}
