"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

export default function MiniMap({
  lat,
  lng,
  color,
  emoji,
}: {
  lat: number;
  lng: number;
  color: string;
  emoji: string;
}) {
  const icon = L.divIcon({
    className: "",
    html: `<div class="bb-pin" style="background:${color}"><span>${emoji}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 29],
  });
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      attributionControl={false}
      className="h-40 w-full"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />
      <Marker position={[lat, lng]} icon={icon} />
    </MapContainer>
  );
}
