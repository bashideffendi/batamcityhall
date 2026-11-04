"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { places as ALL, haversineKm } from "./data";
import { isOpenNow } from "./format";
import type { HalalStatus, PriceTier, RecLabel, PlaceWithGeo } from "./types";

export type SortKey = "featured" | "rating" | "ferry" | "az" | "nearby";
export interface LatLng {
  lat: number;
  lng: number;
}

export interface FilterState {
  query: string;
  cats: string[];
  areas: string[];
  halal: HalalStatus[];
  tiers: PriceTier[];
  labels: RecLabel[];
  ferry: string | null;
  openNow: boolean;
  sort: SortKey;
  userLoc: LatLng | null;
}

const EMPTY: FilterState = {
  query: "",
  cats: [],
  areas: [],
  halal: [],
  tiers: [],
  labels: [],
  ferry: null,
  openNow: false,
  sort: "featured",
  userLoc: null,
};

interface FilterCtx {
  state: FilterState;
  set: (patch: Partial<FilterState>) => void;
  toggle: <K extends "cats" | "areas" | "halal" | "tiers" | "labels">(
    key: K,
    value: FilterState[K][number],
  ) => void;
  reset: () => void;
  results: PlaceWithGeo[];
  activeCount: number;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const Ctx = createContext<FilterCtx | null>(null);

function matches(p: PlaceWithGeo, s: FilterState): boolean {
  if (s.cats.length && !s.cats.includes(p.category)) return false;
  if (s.areas.length && !s.areas.includes(p.area)) return false;
  if (s.halal.length && !s.halal.includes(p.halal)) return false;
  if (s.tiers.length && !s.tiers.includes(p.price_tier)) return false;
  if (s.labels.length && !s.labels.some((l) => p.labels.includes(l)))
    return false;
  if (s.ferry && (p.nearestFerryId !== s.ferry || p.nearestFerryKm > 6))
    return false;
  if (s.openNow && isOpenNow(p.hours) !== true) return false;
  if (s.query.trim()) {
    const q = s.query.toLowerCase();
    const hay = [
      p.name,
      p.signature,
      p.desc_id,
      p.desc_en,
      p.desc_zh ?? "",
      p.address,
      ...p.subcategory,
      ...p.tags,
      p.category,
      p.area,
    ]
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function sortPlaces(
  list: PlaceWithGeo[],
  sort: SortKey,
  userLoc: LatLng | null,
): PlaceWithGeo[] {
  const arr = [...list];
  switch (sort) {
    case "rating":
      return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "ferry":
      return arr.sort((a, b) => a.nearestFerryKm - b.nearestFerryKm);
    case "nearby":
      if (!userLoc) return arr;
      return arr.sort(
        (a, b) =>
          haversineKm(userLoc.lat, userLoc.lng, a.lat, a.lng) -
          haversineKm(userLoc.lat, userLoc.lng, b.lat, b.lng),
      );
    case "az":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return arr.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (b.rating ?? 0) - (a.rating ?? 0);
      });
  }
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FilterState>(EMPTY);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const set = useCallback((patch: Partial<FilterState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggle = useCallback(
    <K extends "cats" | "areas" | "halal" | "tiers" | "labels">(
      key: K,
      value: FilterState[K][number],
    ) => {
      setState((prev) => {
        const cur = prev[key] as string[];
        const next = cur.includes(value as string)
          ? cur.filter((v) => v !== value)
          : [...cur, value as string];
        return { ...prev, [key]: next };
      });
    },
    [],
  );

  const reset = useCallback(
    () => setState((prev) => ({ ...EMPTY, userLoc: prev.userLoc })),
    [],
  );

  const results = useMemo(
    () => sortPlaces(ALL.filter((p) => matches(p, state)), state.sort, state.userLoc),
    [state],
  );

  const activeCount = useMemo(() => {
    let n = 0;
    if (state.query.trim()) n++;
    n += state.cats.length;
    n += state.areas.length;
    n += state.halal.length;
    n += state.tiers.length;
    n += state.labels.length;
    if (state.ferry) n++;
    if (state.openNow) n++;
    return n;
  }, [state]);

  return (
    <Ctx.Provider
      value={{ state, set, toggle, reset, results, activeCount, selectedId, setSelectedId }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}
