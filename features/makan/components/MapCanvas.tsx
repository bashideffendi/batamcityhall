"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useFilters } from "@/features/makan/lib/filters";
import { categoryMap, ferries } from "@/features/makan/lib/data";

const CENTER: [number, number] = [1.11, 104.04];

function pinIcon(color: string, emoji: string, selected: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="bb-pin ${selected ? "bb-pin-selected" : ""}" style="background:${color}"><span>${emoji}</span></div>`,
    iconSize: selected ? [40, 40] : [30, 30],
    iconAnchor: selected ? [20, 38] : [15, 29],
  });
}

const ferryIcon = L.divIcon({
  className: "",
  html: `<div style="display:grid;place-items:center;width:26px;height:26px;border-radius:8px;background:#0e7c7b;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);font-size:13px">⛴</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#2D9CDB;border:3px solid #fff;box-shadow:0 0 0 4px rgba(45,156,219,.3)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FlyToUser({ loc }: { loc: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (loc) map.flyTo([loc.lat, loc.lng], 14, { duration: 0.6 });
  }, [loc, map]);
  return null;
}

function FlyTo({ id }: { id: string | null }) {
  const map = useMap();
  const { results } = useFilters();
  useEffect(() => {
    if (!id) return;
    const p = results.find((r) => r.id === id);
    if (p) map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 14), { duration: 0.5 });
  }, [id, map, results]);
  return null;
}

function FitResults() {
  const map = useMap();
  const { results, state } = useFilters();
  // Refit only when the active filter signature changes (not on every selection).
  const sig = JSON.stringify({
    c: state.cats,
    a: state.areas,
    h: state.halal,
    t: state.tiers,
    l: state.labels,
    f: state.ferry,
    o: state.openNow,
    q: state.query,
  });
  useEffect(() => {
    if (results.length === 0) return;
    if (results.length === 1) {
      map.setView([results[0].lat, results[0].lng], 15);
      return;
    }
    const bounds = L.latLngBounds(results.map((r) => [r.lat, r.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  return null;
}

export default function MapCanvas() {
  const { results, selectedId, setSelectedId, state } = useFilters();

  const markers = useMemo(
    () =>
      results.map((p) => {
        const cat = categoryMap[p.category];
        return (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={pinIcon(cat?.color ?? "#e2552b", cat?.emoji ?? "🍽️", selectedId === p.id)}
            eventHandlers={{ click: () => setSelectedId(p.id) }}
            zIndexOffset={selectedId === p.id ? 1000 : 0}
          />
        );
      }),
    [results, selectedId, setSelectedId],
  );

  return (
    <MapContainer
      center={CENTER}
      zoom={12}
      zoomControl={false}
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        maxZoom={19}
      />
      {ferries.map((f) => (
        <Marker key={f.id} position={[f.lat, f.lng]} icon={ferryIcon} />
      ))}
      {markers}
      {state.userLoc && (
        <Marker position={[state.userLoc.lat, state.userLoc.lng]} icon={userIcon} />
      )}
      <FlyTo id={selectedId} />
      <FlyToUser loc={state.userLoc} />
      <FitResults />
    </MapContainer>
  );
}
