"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import type { PlaceWithGeo } from "@/features/makan/lib/types";

function numIcon(n: number, color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:${color};color:#fff;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);font-weight:800;font-size:13px">${n}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function Fit({ stops }: { stops: PlaceWithGeo[] }) {
  const map = useMap();
  useEffect(() => {
    if (stops.length === 0) return;
    if (stops.length === 1) {
      map.setView([stops[0].lat, stops[0].lng], 14);
      return;
    }
    map.fitBounds(L.latLngBounds(stops.map((s) => [s.lat, s.lng])), {
      padding: [40, 40],
      maxZoom: 14,
    });
  }, [stops, map]);
  return null;
}

export default function TrailMap({
  stops,
  color,
}: {
  stops: PlaceWithGeo[];
  color: string;
}) {
  if (stops.length === 0) return null;
  const line: [number, number][] = stops.map((s) => [s.lat, s.lng]);

  return (
    <MapContainer
      center={[stops[0].lat, stops[0].lng]}
      zoom={13}
      zoomControl={false}
      scrollWheelZoom={false}
      className="h-56 w-full"
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />
      <Polyline
        positions={line}
        pathOptions={{ color, weight: 4, opacity: 0.8, dashArray: "2 8" }}
      />
      {stops.map((s, i) => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={numIcon(i + 1, color)} />
      ))}
      <Fit stops={stops} />
    </MapContainer>
  );
}
