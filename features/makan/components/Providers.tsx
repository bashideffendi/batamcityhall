"use client";

import type { ReactNode } from "react";

// Kerangka bagian Makanan. Saringan dipasang per halaman (lib/filters.tsx), submenu datang dari kepala situs.
export default function Providers({ children }: { children: ReactNode }) {
  return <div className="mk-akar">{children}</div>;
}
