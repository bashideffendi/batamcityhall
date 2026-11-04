import trailsRaw from "@/data/makan/trails.json";
import type { Trail, Lang, PlaceWithGeo } from "./types";
import { placeMap } from "./data";

export const trails = trailsRaw as Trail[];

export const trailMap: Record<string, Trail> = Object.fromEntries(
  trails.map((t) => [t.id, t]),
);

export function getTrail(id: string): Trail | undefined {
  return trailMap[id];
}

/** Resolve a trail's stop ids into place objects, dropping any unknown ids. */
export function trailStops(t: Trail): PlaceWithGeo[] {
  return t.stops.map((id) => placeMap[id]).filter(Boolean) as PlaceWithGeo[];
}

export function trailTitle(lang: Lang, t: Trail): string {
  return lang === "id" ? t.title_id : lang === "zh" ? t.title_zh : t.title_en;
}

export function trailSubtitle(lang: Lang, t: Trail): string {
  return lang === "id" ? t.subtitle_id : lang === "zh" ? t.subtitle_zh : t.subtitle_en;
}

export function trailDuration(lang: Lang, t: Trail): string {
  return lang === "id" ? t.duration_id : lang === "zh" ? t.duration_zh : t.duration_en;
}
