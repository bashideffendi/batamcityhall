"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { MAPPED_CAMS, type Cam } from "@/features/langit-laut/lib/cctv";
import { reduceMotion } from "@/features/langit-laut/lib/client";
import { geserKeDalam, kePaddingMapLibre, pikselDunia, type Padding } from "@/features/langit-laut/lib/peta-lapisan";
import { CCTV_MAX_ZOOM } from "@/features/langit-laut/lib/radar";
import { CAM_PATH_A, CAM_PATH_B } from "./icons";
import { usePeta } from "./PetaLangit";
import PetaMarker from "./PetaMarker";

// Pin kamera di peta. Stream baru jalan pas kamera dipilih (lihat CctvPlayer).
//
// Varian visual: biasa · perkiraan (ring putus-putus; koordinatnya bisa meleset ratusan
// meter) · gagal diputar tadi (abu; dari sesi ini, bukan hardcode) · KELOMPOK (lingkaran
// berangka). Area sentuh 44×44 (WCAG 2.5.8) walau visualnya lebih kecil.

// Beberapa kamera duduk di satu titik yang sama (dua kamera satu simpang, beda arah
// hadap). Dikipas di RUANG LAYAR saat render (bukan mengarang koordinat di data): tiap
// anggota digeser 24 px mengelilingi titik aslinya, dengan garis rambut ke titik asli.
const FAN_PX = 24;

// Pengelompokan per UNIT = kamera-kamera di satu koordinat (dihitung dari titik ASLI, tanpa
// offset kipas), supaya kamera kembar tidak pernah terbelah antara gelembung dan pin. Unit
// yang jaraknya di layar ≤ 28 px digabung; jangkar TETAP dan dipilih dari unit terpadat
// (bobot = jumlah kamera). Unit yang tak bergabung tampil sebagai pin (terkipas kalau kembar).
const CLUSTER_PX = 28;
// Kelompok sampai 9 kamera → ketuk = daftar di panel. Lebih dari itu (cuma kalau
// pengguna zoom keluar sendiri) → ketuk memperbesar peta.
export const LIST_MAX = 9;
const BIG_GROUP_ZOOM = 11;

type Placed = { cam: Cam; pos: [number, number]; off: [number, number]; site: string };
type Group = { key: string; members: Placed[]; center: [number, number] };

export type CamGroup = { key: string; cams: Cam[] };
export type CctvApi = {
  /** terbangkan peta ke kamera-kamera ini (bounds titik asli) */
  zoomToCams: (cams: Cam[], maxZoom: number) => void;
  /** fokuskan gelembung kelompok (sesudah daftar ditutup) */
  focusGroup: (key: string) => void;
};

function fanOut(cams: Cam[]): Placed[] {
  const groups = new Map<string, Cam[]>();
  for (const c of cams) {
    const key = `${c.lat!.toFixed(5)},${c.lng!.toFixed(5)}`;
    const g = groups.get(key);
    if (g) g.push(c);
    else groups.set(key, [c]);
  }
  const out: Placed[] = [];
  for (const [site, g] of groups) {
    g.forEach((c, i) => {
      const pos: [number, number] = [c.lat as number, c.lng as number];
      if (g.length === 1) {
        out.push({ cam: c, pos, off: [0, 0], site });
        return;
      }
      const a = (2 * Math.PI * i) / g.length - Math.PI / 2; // mulai dari atas
      out.push({ cam: c, pos, off: [FAN_PX * Math.cos(a), FAN_PX * Math.sin(a)], site });
    });
  }
  return out;
}

function clusterize(placed: Placed[], zoom: number): Group[] {
  const single = (p: Placed): Group => ({ key: p.cam.slug, members: [p], center: p.pos });
  if (zoom >= CCTV_MAX_ZOOM) return placed.map(single);
  // unit = kamera-kamera di satu koordinat
  const unitMap = new Map<string, Placed[]>();
  for (const p of placed) {
    const u = unitMap.get(p.site);
    if (u) u.push(p);
    else unitMap.set(p.site, [p]);
  }
  const units = [...unitMap.values()];
  const px = units.map((u) => pikselDunia(u[0].pos[0], u[0].pos[1], zoom));
  const r2 = CLUSTER_PX * CLUSTER_PX;
  const near = (i: number, j: number) => {
    const dx = px[i].x - px[j].x;
    const dy = px[i].y - px[j].y;
    return dx * dx + dy * dy <= r2;
  };
  // jangkar = unit dengan kamera tetangga terbanyak dulu → kelompok berpusat di titik terpadat
  const order = units
    .map((_, i) => ({ i, n: units.reduce((s, u, j) => s + (near(i, j) ? u.length : 0), 0) }))
    .sort((a, b) => b.n - a.n)
    .map((o) => o.i);
  const used = new Array<boolean>(units.length).fill(false);
  const out: Group[] = [];
  for (const i of order) {
    if (used[i]) continue;
    const idx = units.map((_, j) => j).filter((j) => !used[j] && near(i, j));
    for (const j of idx) used[j] = true;
    // satu unit saja → pin tunggal (kamera kembar tampil terkipas, bukan gelembung)
    if (idx.length === 1) {
      for (const p of units[idx[0]]) out.push(single(p));
      continue;
    }
    const members = idx.flatMap((j) => units[j]).sort((a, b) => a.cam.name.localeCompare(b.cam.name, "id"));
    out.push({
      key: members.map((m) => m.cam.slug).join("+"),
      members,
      center: [
        members.reduce((s, m) => s + m.pos[0], 0) / members.length,
        members.reduce((s, m) => s + m.pos[1], 0) / members.length,
      ],
    });
  }
  return out;
}

const PinIkon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={CAM_PATH_A} />
    <path d={CAM_PATH_B} />
  </svg>
);

type Props = {
  onPick: (cam: Cam) => void;
  /** slug → lastSeen (ms) kamera yang gagal diputar di sesi ini. */
  dead: ReadonlyMap<string, number | null>;
  /** ruang yang tertutup panel/topbar — supaya kelompok tidak tersembunyi. */
  getPadding: () => Padding;
  /** kelompok ≤9 diketuk (daftar tampil di panel) / seleksi hilang (null) */
  onCluster: (g: CamGroup | null) => void;
  selectedKey: string | null;
  apiRef: RefObject<CctvApi | null>;
  /** fokuskan jawaban panel (marker yang difokus hilang sesudah zoom) */
  focusPanel: () => void;
};

const onKey = (e: KeyboardEvent, activate: () => void) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
    activate();
  }
};

export default function CctvLayer({ onPick, dead, getPadding, onCluster, selectedKey, apiRef, focusPanel }: Props) {
  const map = usePeta();
  const [zoom, setZoom] = useState(() => map.getZoom());
  const onClusterRef = useRef(onCluster);
  const selectedRef = useRef(selectedKey);
  useEffect(() => {
    onClusterRef.current = onCluster;
    selectedRef.current = selectedKey;
  });

  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    // ketuk peta kosong = tutup daftar kelompok. Ketukan pada pin ikut sampai ke sini lebih dulu,
    // lalu handler React pin membuka kembali kelompok yang diketuk.
    const onClick = () => {
      if (selectedRef.current) onClusterRef.current(null);
    };
    map.on("zoomend", onZoom);
    map.on("click", onClick);
    return () => {
      map.off("zoomend", onZoom);
      map.off("click", onClick);
    };
  }, [map]);

  const placed = useMemo(() => fanOut(MAPPED_CAMS), []);
  const groups = useMemo(() => clusterize(placed, zoom), [placed, zoom]);

  // API imperatif untuk panel (Perbesar Peta ke Sini, kembalikan fokus).
  useEffect(() => {
    apiRef.current = {
      zoomToCams: (cams, maxZoom) => {
        const pts = cams.filter((c) => c.lat != null && c.lng != null);
        if (!pts.length) return;
        const lats = pts.map((c) => c.lat as number);
        const lngs = pts.map((c) => c.lng as number);
        map.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: kePaddingMapLibre(getPadding()), maxZoom, animate: !reduceMotion(), duration: 600 },
        );
      },
      focusGroup: (key) => {
        map
          .getContainer()
          .querySelector<HTMLElement>(`[data-cam-key="${CSS.escape(key)}"]`)
          ?.focus({ preventScroll: true });
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, map, getPadding]);

  // Kelompok terpilih hilang (dipecah oleh zoom) → daftarnya ditutup.
  useEffect(() => {
    if (selectedKey && !groups.some((g) => g.key === selectedKey)) onClusterRef.current(null);
  }, [groups, selectedKey]);

  // Kelompok terpilih tetap terlihat di atas daftar: tunggu panel memanjang, lalu geser peta.
  useEffect(() => {
    if (!selectedKey) return;
    const g = groups.find((x) => x.key === selectedKey);
    if (!g) return;
    const t = window.setTimeout(() => {
      const pad = kePaddingMapLibre(getPadding());
      const el = map.getContainer();
      const p = map.project([g.center[1], g.center[0]]);
      const [dx, dy] = geserKeDalam(
        p,
        { w: el.clientWidth, h: el.clientHeight },
        { left: pad.left + 24, top: pad.top + 24, right: pad.right + 24, bottom: pad.bottom + 8 },
      );
      if (dx || dy) map.panBy([dx, dy], { animate: !reduceMotion() });
    }, 90);
    return () => window.clearTimeout(t);
    // groups sengaja tidak jadi dependensi: geser sekali saat kelompok dipilih
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, map, getPadding]);

  // Gelembung ≤9 → daftar di panel; lebih dari itu → perbesar peta. Lewat keyboard, fokus
  // dipindah ke panel sesudah zoom (gelembung yang difokus dilepas saat pecah).
  const openGroup = (g: Group, viaKey = false) => {
    const cams = g.members.map((m) => m.cam);
    if (cams.length > LIST_MAX) {
      onCluster(null);
      if (viaKey) map.once("moveend", () => window.setTimeout(focusPanel, 30));
      apiRef.current?.zoomToCams(cams, BIG_GROUP_ZOOM);
    } else {
      onCluster({ key: g.key, cams });
    }
  };

  return (
    <>
      {groups.map((g) => {
        if (g.members.length > 1) {
          const n = g.members.length;
          const allFailed = g.members.every((m) => dead.has(m.cam.slug));
          const hint = n > LIST_MAX ? "ketuk untuk memperbesar" : "ketuk untuk memilih";
          const cls = ["cam-cluster", allFailed ? "is-mati" : "", g.key === selectedKey ? "is-selected" : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <PetaMarker
              key={g.key}
              posisi={g.center}
              className={g.key === selectedKey ? "cam-marker is-top" : "cam-marker"}
            >
              <button
                type="button"
                className="cam-hit"
                data-cam-key={g.key}
                aria-label={`${n} kamera berdekatan, ${hint}`}
                onClick={() => openGroup(g)}
                onKeyDown={(e) => onKey(e, () => openGroup(g, true))}
              >
                <span className={cls}>{n}</span>
              </button>
            </PetaMarker>
          );
        }
        const { cam, pos, off } = g.members[0];
        const failed = dead.has(cam.slug);
        const [dx, dy] = off;
        const cls = ["cam-pin", cam.approx ? "is-approx" : "", failed ? "is-mati" : ""].filter(Boolean).join(" ");
        return (
          <PetaMarker key={g.key} posisi={pos} geser={off} className="cam-marker">
            <button
              type="button"
              className="cam-hit"
              data-cam-key={g.key}
              aria-label={`Kamera ${cam.name}${cam.approx ? ", lokasi perkiraan" : ""}${failed ? ", gagal diputar tadi" : ""}`}
              onClick={() => onPick(cam)}
              onKeyDown={(e) => onKey(e, () => onPick(cam))}
            >
              {/* Pin terkipas: garis rambut dari pusat pin ke titik asli kamera. */}
              {(dx !== 0 || dy !== 0) && (
                <i
                  className="cam-fan-line"
                  style={{
                    width: `${Math.hypot(dx, dy).toFixed(1)}px`,
                    transform: `rotate(${Math.atan2(-dy, -dx).toFixed(4)}rad)`,
                  }}
                />
              )}
              <span className={cls}>
                <PinIkon />
              </span>
              <span className="cam-label">
                {cam.name}
                {cam.approx ? " · Lokasi perkiraan" : ""}
                {failed ? " · Gagal diputar tadi" : ""}
              </span>
            </button>
          </PetaMarker>
        );
      })}
    </>
  );
}
