"use client";

import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from "react";
import { places as ALL } from "./data";
import { EMPTY, jumlahAktif, saring, type FilterState } from "./saring";
import type { PlaceWithGeo } from "./types";
import { useSekarang } from "./waktu";

export type { FilterState, SortKey } from "./saring";

type KunciDaftar = "cats" | "areas" | "halal" | "tiers" | "labels";

interface FilterCtx {
  state: FilterState;
  set: (patch: Partial<FilterState>) => void;
  toggle: <K extends KunciDaftar>(key: K, value: FilterState[K][number]) => void;
  reset: () => void;
  results: PlaceWithGeo[];
  activeCount: number;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const Ctx = createContext<FilterCtx | null>(null);

// Dipasang di app/makan/layout.tsx: layout bertahan saat pindah halaman, jadi daftar dan peta memakai
// hasil filter yang sama.
export function FilterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FilterState>(EMPTY);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sekarang = useSekarang();
  // Waktu hanya memicu saring ulang kalau filter buka sekarang menyala.
  const waktuFilter = state.openNow ? sekarang : null;

  const set = useCallback((patch: Partial<FilterState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggle = useCallback(<K extends KunciDaftar>(key: K, value: FilterState[K][number]) => {
    setState((prev) => {
      const cur = prev[key] as string[];
      const next = cur.includes(value as string) ? cur.filter((v) => v !== value) : [...cur, value as string];
      return { ...prev, [key]: next };
    });
  }, []);

  const reset = useCallback(() => setState((prev) => ({ ...EMPTY, userLoc: prev.userLoc })), []);

  const results = useMemo(() => saring(ALL, state, waktuFilter), [state, waktuFilter]);
  const activeCount = useMemo(() => jumlahAktif(state), [state]);

  return (
    <Ctx.Provider value={{ state, set, toggle, reset, results, activeCount, selectedId, setSelectedId }}>
      {children}
    </Ctx.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFilters harus di dalam FilterProvider");
  return ctx;
}
