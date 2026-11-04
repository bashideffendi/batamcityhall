"use client";

import { useSyncExternalStore } from "react";
import { readTheme, subscribeTheme } from "@/lib/theme";

// Tema dibaca dari <html>, bukan disimpan di state React. Sisi server selalu "day"; skrip di
// app/layout.tsx sudah memasang tema sebenarnya sebelum paint.
export function useSiteTheme() {
  return useSyncExternalStore(subscribeTheme, readTheme, () => "day" as const);
}
