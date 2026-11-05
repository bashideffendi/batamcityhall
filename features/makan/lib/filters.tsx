"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { places as ALL } from "./data";
import { bacaAlamat, jumlahAktif, saring, tulisAlamat, type FilterState, type LatLng, type SortKey } from "./saring";
import type { PlaceWithGeo } from "./types";
import { useSekarang } from "./waktu";

export type { FilterState, SortKey } from "./saring";

type KunciDaftar = "cats" | "areas" | "halal" | "tiers" | "labels" | "waktu" | "bayar";

interface FilterCtx {
  state: FilterState;
  set: (patch: Partial<FilterState>) => void;
  toggle: <K extends KunciDaftar>(key: K, value: FilterState[K][number]) => void;
  reset: () => void;
  /** Semua tempat di halaman ini, sebelum saringan pembaca. */
  dasar: PlaceWithGeo[];
  results: PlaceWithGeo[];
  /** Jumlah hasil bila saringan ini ditambahkan, untuk angka di tombol. */
  hitung: (patch: Partial<FilterState>) => number;
  sekarang: number | null;
  activeCount: number;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const Ctx = createContext<FilterCtx | null>(null);

// Sumber kebenaran saringan adalah alamat halaman. Render server dan render pertama memakai alamat kosong,
// lalu React menyamakannya tanpa setState di dalam effect.
const pendengar = new Set<() => void>();
const kabari = () => pendengar.forEach((f) => f());
function langgan(f: () => void) {
  if (pendengar.size === 0) window.addEventListener("popstate", kabari);
  pendengar.add(f);
  return () => {
    pendengar.delete(f);
    if (pendengar.size === 0) window.removeEventListener("popstate", kabari);
  };
}
const ambil = () => window.location.search;
const ambilServer = () => "";

/**
 * Dipasang per halaman. `dasar` adalah cakupan halaman (satu hidangan, satu kawasan). Halaman yang tidak
 * memberi `dasar` mencakup 117 tempat.
 */
export function FilterProvider({
  dasar: saringDasar,
  urutAwal,
  children,
}: {
  dasar?: (p: PlaceWithGeo) => boolean;
  /** Urutan bila alamat tidak menyebutnya. */
  urutAwal?: SortKey;
  children: ReactNode;
}) {
  const search = useSyncExternalStore(langgan, ambil, ambilServer);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLoc, setUserLoc] = useState<LatLng | null>(null);
  const [urutDekat, setUrutDekat] = useState(false);
  const sekarang = useSekarang();

  const state = useMemo<FilterState>(() => {
    const dariAlamat = bacaAlamat(search);
    const s = urutAwal && dariAlamat.sort === "featured" ? { ...dariAlamat, sort: urutAwal } : dariAlamat;
    return userLoc ? { ...s, userLoc, sort: urutDekat ? "nearby" : s.sort } : s;
  }, [search, userLoc, urutDekat, urutAwal]);

  const set = useCallback(
    (patch: Partial<FilterState>) => {
      const { userLoc: lokasiBaru, ...sisa } = { ...state, ...patch };
      if ("userLoc" in patch) setUserLoc(lokasiBaru ?? null);
      if ("sort" in patch) setUrutDekat(patch.sort === "nearby");
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${tulisAlamat(sisa)}`);
      kabari();
    },
    [state],
  );

  const toggle = useCallback(
    <K extends KunciDaftar>(key: K, value: FilterState[K][number]) => {
      const cur = state[key] as string[];
      const next = cur.includes(value as string) ? cur.filter((v) => v !== value) : [...cur, value as string];
      set({ [key]: next } as Partial<FilterState>);
    },
    [state, set],
  );

  const reset = useCallback(() => {
    setUserLoc(null);
    setUrutDekat(false);
    window.history.replaceState(window.history.state, "", window.location.pathname);
    kabari();
  }, []);

  const dasar = useMemo(() => (saringDasar ? ALL.filter(saringDasar) : ALL), [saringDasar]);
  // Waktu hanya memicu saring ulang kalau saringan buka sekarang menyala.
  const waktuSaring = state.openNow ? sekarang : null;
  const results = useMemo(() => saring(dasar, state, waktuSaring), [dasar, state, waktuSaring]);
  const hitung = useCallback(
    (patch: Partial<FilterState>) => saring(dasar, { ...state, ...patch }, sekarang).length,
    [dasar, state, sekarang],
  );
  const activeCount = useMemo(() => jumlahAktif(state), [state]);

  return (
    <Ctx.Provider
      value={{ state, set, toggle, reset, dasar, results, hitung, sekarang, activeCount, selectedId, setSelectedId }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFilters harus di dalam FilterProvider");
  return ctx;
}

/** Isi alamat halaman, untuk bagian yang perlu membacanya di luar FilterProvider. */
export const useAlamat = () => useSyncExternalStore(langgan, ambil, ambilServer);

/** Sama seperti useFilters, tetapi null di luar FilterProvider. */
export const useFiltersOpsional = () => useContext(Ctx);
