"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { barisFeriSingapura, hitungFeri, ringkasHariIni } from "@/features/jalan/feri-terakhir";
import { useEntriFeri } from "@/features/jalan/useFeri";
import { useMedia, useNow, useOffline } from "@/features/langit-laut/hooks/useBrowser";
import { useResource } from "@/features/langit-laut/hooks/useResource";
import { IconWarn } from "@/features/langit-laut/components/icons";
import type {
  EchoSummary,
  FramesResponse,
  GempaResponse,
  PerairanEntry,
  PerairanResponse,
  PeringatanResponse,
} from "@/features/langit-laut/lib/api-types";
import { gempaRelevan, ringkasGempa, sebutTsunami } from "@/features/langit-laut/lib/gempa";
import { rainyKec, type RainLevel } from "@/features/langit-laut/lib/kecamatan";
import { currentSlot, warnAt } from "@/features/langit-laut/lib/perairan";
import { statusUntukBatam } from "@/features/langit-laut/lib/peringatan-cuaca";
import { arahLengkap, fmtM, joinNames, ktToKmh, radarView, RADAR_OLD_MIN } from "@/features/langit-laut/lib/status";
import { setDiperbarui } from "@/lib/diperbarui";

const NOL = new Set<string>();
const SEGAR_MS = 2 * 60 * 1000;
const OMBAK_MS = 10 * 60 * 1000;
const PERINGATAN_MS = 2 * 60 * 1000;
const GEMPA_MS = 5 * 60 * 1000;
const TICK_MS = 30 * 1000;

const jamWib = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" })
    .format(Date.parse(iso))
    .replace(":", ".");

/** Kalimat laut di judul utama (PEDOMAN 3.11). Data gelombang tidak ada: kalimatnya dihapus. */
function kalimatLaut(e: PerairanEntry | null): string {
  const k = e?.waveCat?.trim().toLowerCase();
  if (!k) return "";
  return k === "tenang" ? "Laut tenang." : `Gelombang ${k}.`;
}

type Hujan = { nama: string[]; level: RainLevel; jumlah: number; deras: string };
function hujanBatam(echo: EchoSummary | null): Hujan | null {
  const r = rainyKec(echo?.kec);
  if (!r.length) return null;
  return { nama: r.map((k) => k.name), level: r[0].level, jumlah: r.length, deras: r[0].name };
}

function judulUtama(a: { peringatan: string | null; terputus: boolean; hujan: Hujan | null; adaEcho: boolean; laut: string }): string {
  if (a.peringatan) return `Peringatan gelombang ${a.peringatan} di perairan Batam.`;
  if (a.terputus) return ["Data radar belum diperbarui.", a.laut].filter(Boolean).join(" ");
  if (!a.adaEcho) return a.laut || "Memuat data";
  if (!a.hujan) return ["Belum ada hujan di Batam.", a.laut].filter(Boolean).join(" ");
  const depan =
    a.hujan.jumlah <= 3
      ? `Hujan ${a.hujan.level} di ${joinNames(a.hujan.nama)}.`
      : `Hujan di ${a.hujan.jumlah} kecamatan, paling deras di ${a.hujan.deras}.`;
  return [depan, a.laut].filter(Boolean).join(" ");
}

const kapital = (s: string) => s.replace(/^./, (c) => c.toUpperCase());

/** Bagian pertama beranda: judul utama, paragraf pembuka, baris angka, dan Peta Hari Ini. */
export default function HariIni() {
  const offline = useOffline();
  const now = useNow(TICK_MS);
  const frames = useResource<FramesResponse>("/api/frames", SEGAR_MS, true, false);
  const perairan = useResource<PerairanResponse>("/api/perairan", OMBAK_MS, true, false);
  const cuaca = useResource<PeringatanResponse>("/api/peringatan-cuaca", PERINGATAN_MS, true, false);
  const gempa = useResource<GempaResponse>("/api/gempa", GEMPA_MS, true, false);
  const feri = useEntriFeri();
  const hasilFeri = useMemo(() => (feri.data ? hitungFeri(feri.data, new Date(now)) : null), [feri.data, now]);
  const baris = hasilFeri ? barisFeriSingapura(hasilFeri) : null;
  const ringkasFeri = hasilFeri ? ringkasHariIni(hasilFeri) : null;

  const daftar = frames.data?.frames ?? [];
  const rv = radarView({
    frames: daftar,
    idx: Math.max(0, daftar.length - 1),
    status: frames.error && !daftar.length ? "error" : daftar.length ? "ok" : "loading",
    offline,
    now,
    broken: NOL,
  });
  const jam = rv.latest?.time ?? "";
  const terputus = (frames.error && !daftar.length) || (rv.latestAge !== null && rv.latestAge > RADAR_OLD_MIN);
  useEffect(() => setDiperbarui(jam), [jam]);

  const echo = terputus ? null : (frames.data?.echo ?? null);
  const hujan = hujanBatam(echo);
  const slot = currentSlot(perairan.data, now).entry;
  const { current } = warnAt(perairan.data?.warns, now);
  const tingkatPeringatan = current.status === "ok" && current.text ? current.text.replace(/^Peringatan gelombang /, "") : null;

  const judul = judulUtama({ peringatan: tingkatPeringatan, terputus, hujan, adaEcho: !!echo, laut: kalimatLaut(slot) });
  const tinggi = slot?.waveM != null ? fmtM(slot.waveM) : null;
  const kecAngin = slot?.windKt != null ? ktToKmh(slot.windKt) : null;
  const arahAngin = slot?.windFrom ? arahLengkap(slot.windFrom) : "";
  const paragrafLaut =
    tinggi && kecAngin !== null
      ? `Gelombang ${tinggi} m di perairan Batam, angin ${kecAngin} km/jam${arahAngin ? ` dari ${arahAngin}` : ""}.`
      : "";
  const paragrafFeri = baris?.jam
    ? `Feri terakhir ke Singapura pukul ${baris.jam} WIB.`
    : ringkasFeri
      ? ringkasFeri.judul
      : "";

  const sCuaca = statusUntukBatam(cuaca.data, cuaca.error, now);
  const relevan = gempaRelevan(gempa.data?.gempa, now);
  const rGempa = relevan ? ringkasGempa(relevan, now) : null;

  const barisPeringatan =
    !perairan.data && !perairan.error
      ? null
      : current.status !== "ok"
        ? "Peringatan gelombang: status belum dapat dimuat."
        : current.text
          ? `${current.text} untuk perairan Batam${current.until ? ` sampai pukul ${jamWib(current.until)} WIB` : ""}.`
          : "Peringatan gelombang: tidak ada untuk perairan Batam.";

  return (
    <section className="br-pertama" aria-labelledby="br-judul">
      <div className="br-hari">
        <p className="bch-kicker bch-penanda-biru m-0">Hari ini di Batam{jam && ` · Pukul ${jam} WIB`}</p>
        <h1 id="br-judul" className="br-judul">
          {judul}
        </h1>
        {(paragrafLaut || paragrafFeri) && <p className="br-pembuka">{[paragrafLaut, paragrafFeri].filter(Boolean).join(" ")}</p>}
        {sCuaca.jenis === "aktif" && (
          <p className="bch-note br-peringatan" data-tone="danger" data-baris="cuaca">
            <Link href="/cuaca/peringatan" prefetch={false}>
              Peringatan dini: {sCuaca.teks}
            </Link>
          </p>
        )}
        {sCuaca.jenis === "gagal" && (
          <p className="br-catatan" data-baris="cuaca">
            {sCuaca.teks}
          </p>
        )}
      </div>

      <PetaHariIni hujan={hujan} jam={jam} jamFeri={baris?.jam ?? null} />

      <div className="br-angka">
        <dl>
          <div data-baris="hujan">
            <dt>Hujan</dt>
            <dd className="nilai">{terputus ? "Terputus" : hujan ? kapital(hujan.level) : echo ? "Tidak ada" : "Memuat"}</dd>
            <dd className="ket">
              {terputus && jam
                ? `Radar terakhir pukul ${jam} WIB`
                : hujan
                  ? hujan.jumlah <= 3
                    ? joinNames(hujan.nama)
                    : `${hujan.jumlah} dari 12 kecamatan`
                  : jam
                    ? `Radar pukul ${jam} WIB`
                    : "Memuat data"}
            </dd>
          </div>
          <div data-baris="gelombang">
            <dt>Gelombang</dt>
            <dd className="nilai">{tinggi ? `${tinggi} m` : perairan.error ? "Belum ada" : "Memuat"}</dd>
            <dd className="ket">
              {slot
                ? `${kapital((slot.waveCat || "").trim())}, sampai pukul ${jamWib(slot.validTo)} WIB`
                : perairan.error
                  ? "Data belum dapat dimuat"
                  : "Memuat data"}
            </dd>
          </div>
          <div data-baris="angin">
            <dt>Angin</dt>
            <dd className="nilai">{kecAngin !== null ? `${kecAngin} km/jam` : perairan.error ? "Belum ada" : "Memuat"}</dd>
            <dd className="ket">{arahAngin ? `Dari ${arahAngin}` : "Perairan Batam"}</dd>
          </div>
          <div data-baris="feri">
            <dt>Feri terakhir ke Singapura</dt>
            <dd className="nilai">{feri.gagal ? "Belum ada" : baris?.jam ? baris.jam : ringkasFeri ? "Habis" : "Memuat"}</dd>
            <dd className="ket">
              {feri.gagal
                ? "Jadwal belum dapat dimuat"
                : baris?.jam
                  ? baris.terminal
                  : baris?.besok
                    ? `Besok mulai pukul ${baris.besok} WIB`
                    : ringkasFeri
                      ? ringkasFeri.rincian
                      : "Memuat data"}
            </dd>
          </div>
          {relevan && rGempa && (
            <div data-baris="gempa">
              <dt>
                <Link href="/cuaca/gempa" prefetch={false}>
                  {sebutTsunami(relevan.potensi) && <IconWarn className="bch-ikon-status" />}
                  Gempa
                </Link>
              </dt>
              <dd className="ket" style={{ gridColumn: "1 / -1" }}>
                {rGempa.judul} {rGempa.rincian}
              </dd>
            </div>
          )}
        </dl>
        {barisPeringatan && <p className="br-catatan">{barisPeringatan}</p>}
        <p className="m-0">
          <Link href="/cuaca" className="bch-aksi">
            Buka Cuaca dan Laut →
          </Link>
        </p>
      </div>
    </section>
  );
}

// ---- Peta Hari Ini (PEDOMAN 5.1) ----
type Bingkai = { w: number; h: number; lon: [number, number]; lat: [number, number]; gambar: string; skala: number };
const DESKTOP: Bingkai = { w: 760, h: 780, lon: [103.8, 104.26], lat: [0.7703, 1.2424], gambar: "/grafis/peta-hari-ini-dasar.webp", skala: 9.77 };
const PONSEL: Bingkai = { w: 358, h: 400, lon: [103.84, 104.16], lat: [0.895, 1.2525], gambar: "/grafis/peta-hari-ini-ponsel-dasar.webp", skala: 14.04 };

const proyeksi = (b: Bingkai, lat: number, lon: number) => ({
  x: ((lon - b.lon[0]) / (b.lon[1] - b.lon[0])) * b.w,
  y: ((b.lat[1] - lat) / (b.lat[1] - b.lat[0])) * b.h,
});

// Letak label dibalik dari persen di contoh tampilan (bingkai desktop), supaya bisa dipakai di kedua bingkai.
const dariPersen = (x: number, y: number) => ({
  lon: DESKTOP.lon[0] + (x / 100) * (DESKTOP.lon[1] - DESKTOP.lon[0]),
  lat: DESKTOP.lat[1] - (y / 100) * (DESKTOP.lat[1] - DESKTOP.lat[0]),
});
const LABEL = [
  { nama: "Batam Centre", ...dariPersen(55.48, 23.62) },
  { nama: "Harbour Bay", ...dariPersen(42.85, 18.75) },
  { nama: "Sekupang", ...dariPersen(27.24, 23.51) },
  { nama: "Nongsapura", ...dariPersen(64.11, 11.44) },
  { nama: "Bandara Hang Nadim", lat: 1.12083, lon: 104.11861 },
];
const GEO = [
  { nama: "Pulau Batam", kelas: "geo", ...dariPersen(50, 35.46) },
  { nama: "Rempang", kelas: "geo", ...dariPersen(69.57, 71.47) },
  { nama: "Selat Singapura", kelas: "laut", ...dariPersen(43.48, 1.57) },
];
/** Tempat catatan berbingkai, dalam persen bingkai. */
const SLOT: Record<"desktop" | "ponsel", { x: number; y: number }[]> = {
  desktop: [
    { x: 3, y: 62 },
    { x: 2, y: 27 },
    { x: 3, y: 80 },
  ],
  ponsel: [
    { x: 2, y: 62 },
    { x: 2, y: 30 },
    { x: 2, y: 80 },
  ],
};

type DataPeta = Record<string, { d: string; label: [number, number] }>;

function PetaHariIni({ hujan, jam, jamFeri }: { hujan: Hujan | null; jam: string; jamFeri: string | null }) {
  const ponsel = useMedia("(max-width: 700px)");
  const b = ponsel ? PONSEL : DESKTOP;
  // Geometri kecamatan hanya dimuat kalau memang ada yang hujan.
  const [geo, setGeo] = useState<{ desktop: DataPeta; ponsel: DataPeta } | null>(null);
  const adaHujan = !!hujan;
  useEffect(() => {
    if (!adaHujan || geo) return;
    let hidup = true;
    import("./kecamatan-peta.json").then((m) => {
      if (hidup) setGeo(m.default as unknown as { desktop: DataPeta; ponsel: DataPeta });
    });
    return () => {
      hidup = false;
    };
  }, [adaHujan, geo]);
  const peta = geo ? (ponsel ? geo.ponsel : geo.desktop) : null;
  const nama = hujan?.nama ?? [];
  const catatan = nama.length > 3 ? [] : nama;
  const slot = SLOT[ponsel ? "ponsel" : "desktop"];
  const persen = (v: number, total: number) => `${(v / total) * 100}%`;

  return (
    <figure className="br-peta-hari" data-peta-hari-ini data-hujan={nama.length}>
      <div className="br-bingkai" style={{ aspectRatio: `${b.w} / ${b.h}` }}>
        <Image src={b.gambar} alt="" width={b.w} height={b.h} priority unoptimized className="bch-grafis" />
        <svg viewBox={`0 0 ${b.w} ${b.h}`} aria-hidden="true">
          <defs>
            <pattern id="br-arsir" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="5" stroke="#0078BF" strokeWidth="1.7" />
            </pattern>
          </defs>
          <g style={{ mixBlendMode: "multiply" }}>
            {peta && nama.map((n) => peta[n] && <path key={n} d={peta[n].d} fill="url(#br-arsir)" data-kecamatan={n} />)}
          </g>
          {peta &&
            catatan.map((n, i) => {
              const a = peta[n];
              if (!a) return null;
              return (
                <g key={n}>
                  <line x1={a.label[0]} y1={a.label[1]} x2={(slot[i].x / 100) * b.w + 46} y2={(slot[i].y / 100) * b.h} stroke="#161616" strokeWidth="1.2" />
                  <circle cx={a.label[0]} cy={a.label[1]} r="3" fill="#161616" />
                </g>
              );
            })}
        </svg>
        {LABEL.filter((l) => !(ponsel && l.nama.startsWith("Bandara"))).map((l) => {
          const p = proyeksi(b, l.lat, l.lon);
          if (p.x < 0 || p.x > b.w || p.y < 0 || p.y > b.h) return null;
          return (
            <span key={l.nama} className="br-lbl" style={{ left: persen(p.x, b.w), top: persen(p.y, b.h) }}>
              {l.nama}
            </span>
          );
        })}
        {GEO.map((g) => {
          const p = proyeksi(b, g.lat, g.lon);
          if (p.x < 0 || p.x > b.w || p.y < 0 || p.y > b.h) return null;
          return (
            <span key={g.nama} className={`br-${g.kelas}`} style={{ left: persen(p.x, b.w), top: persen(p.y, b.h) }}>
              {g.nama}
            </span>
          );
        })}
        {catatan.map((n, i) => (
          <div key={n} className="br-catatan-peta" style={{ left: `${slot[i].x}%`, top: `${slot[i].y}%` }}>
            <span>Hujan {hujan?.level}</span>
            <br />
            {n} · pukul {jam} WIB
          </div>
        ))}
        {nama.length > 3 && (
          <div className="br-catatan-peta" style={{ left: `${slot[0].x}%`, top: `${slot[0].y}%` }}>
            <span>Hujan di {nama.length} kecamatan</span>
          </div>
        )}
        {jamFeri && (
          <div className="br-catatan-peta" data-feri style={{ left: ponsel ? "52%" : "57%", top: "3%" }}>
            <span>Feri ke Singapura</span>
            <br />
            terakhir pukul {jamFeri} WIB
          </div>
        )}
        <div className="br-skala" style={{ width: `${b.skala}%` }}>
          <i />
          <span>5 km</span>
        </div>
      </div>
      <figcaption>
        <b className="bch-kicker">Peta</b> Arsiran biru: kecamatan yang hujan menurut radar
        {jam ? ` pukul ${jam} WIB` : ""}. Garis merah putus-putus: rute feri ke Singapura, skematis.
      </figcaption>
    </figure>
  );
}
