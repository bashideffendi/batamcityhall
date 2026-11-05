"use client";

import type { Map as MapLibre } from "maplibre-gl";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { IkonLingkaran, JENIS_PETA, KELOMPOK_PETA, KELOMPOK_URUT } from "@/components/map/icons";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { useMedia, useNow } from "@/features/langit-laut/hooks/useBrowser";
import { useOfs } from "@/features/langit-laut/hooks/useOfs";
import { useResource } from "@/features/langit-laut/hooks/useResource";
import CctvLayer, { type CamGroup, type CctvApi } from "@/features/langit-laut/components/CctvLayer";
import CctvPlayer from "@/features/langit-laut/components/CctvPlayer";
import LandMask from "@/features/langit-laut/components/LandMask";
import OfsField from "@/features/langit-laut/components/OfsField";
import PetaLangit, { usePeta } from "@/features/langit-laut/components/PetaLangit";
import PetaMarker from "@/features/langit-laut/components/PetaMarker";
import RadarLayer from "@/features/langit-laut/components/RadarLayer";
import { Sakelar } from "@/features/langit-laut/components/panel/Controls";
import type { FramesResponse } from "@/features/langit-laut/lib/api-types";
import type { Cam } from "@/features/langit-laut/lib/cctv";
import { ageMinutesOf } from "@/features/langit-laut/lib/radar";
import { RADAR_OLD_MIN } from "@/features/langit-laut/lib/status";
import { cariPin, type PesanLokasi } from "./CariPeta";
import { bacaPilihan, jenisDari, jenisPenting, simpanPilihan } from "./jenis-tempat";
import KartuPin from "./KartuPin";
import LapisanTempat, { type FiturPin } from "./LapisanTempat";
import type { PinPeta } from "./lapisan";
import { MAP_BOUNDS } from "./style";
import "@/features/langit-laut/langit-laut.css";
import "@/features/langit-laut/cuaca.css";
import "./peta.css";

/** Tampilan awal Peta Tempat: Pulau Batam, seperti contoh tampilan. Rempang dan Galang terlihat setelah digeser. */
const TAMPILAN_TEMPAT: [[number, number], [number, number]] = [
  [103.8, 0.975],
  [104.18, 1.205],
];

function Panah() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="m3 4.5 3 3 3-3" />
    </svg>
  );
}

const JENIS = new Map(JENIS_PETA.map((j) => [j.id, j]));
const ID_JENIS = JENIS_PETA.map((j) => j.id);
const WARNA_URUT = KELOMPOK_URUT.map((k) => KELOMPOK_PETA[k].warna);

type PinBerjenis = PinPeta & { jenis: string };

const gerakTenang = () =>
  document.documentElement.dataset.gerak === "tenang" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function keFitur(p: PinBerjenis): FiturPin {
  const j = JENIS.get(p.jenis);
  const k = j?.kelompok ?? "makan";
  return {
    id: p.id,
    nama: p.nama,
    lat: p.lat,
    lng: p.lng,
    glyph: j?.glyph ?? "",
    warna: KELOMPOK_PETA[k].warna,
    perkiraan: p.perkiraan,
    idx: KELOMPOK_URUT.indexOf(k),
    penting: jenisPenting(p.jenis),
  };
}

/** Tombol + dan − di kanan atas, dan akses peta untuk kendali di luar kanvas. */
function KendaliPeta({ onMap }: { onMap: (m: MapLibre) => void }) {
  const map = usePeta();
  useEffect(() => onMap(map), [map, onMap]);
  return (
    <div className="br-zoom">
      <button type="button" aria-label="Perbesar peta" onClick={() => map.zoomIn({ animate: !gerakTenang() })}>
        +
      </button>
      <button type="button" aria-label="Perkecil peta" onClick={() => map.zoomOut({ animate: !gerakTenang() })}>
        −
      </button>
    </div>
  );
}

function PanelTempat({
  pins,
  jumlahTanpaTitik,
  pilihan,
  ubah,
  onTutup,
}: {
  pins: PinBerjenis[];
  jumlahTanpaTitik: Record<string, number>;
  pilihan: ReadonlySet<string>;
  ubah: (ids: string[], nyala: boolean) => void;
  onTutup: () => void;
}) {
  const jumlah = useMemo(() => {
    const m = new Map<string, number>();
    // Tempat lain di titik yang sama ikut dihitung, supaya jumlahnya sama dengan keterangan di atas peta.
    for (const p of pins) m.set(p.jenis, (m.get(p.jenis) ?? 0) + 1 + p.lain.length);
    return m;
  }, [pins]);
  const adaTitik = (id: string) => (jumlah.get(id) ?? 0) > 0;
  return (
    <div className="br-panel" data-panel-tempat>
      <div className="br-panel-kepala">
        <b>Tempat</b>
        <button type="button" className="bch-tautan-tombol" onClick={() => ubah(ID_JENIS.filter(adaTitik), true)}>
          Pilih semua
        </button>
        <button type="button" className="br-panel-tutup" onClick={onTutup} aria-label="Tutup daftar tempat">
          ×
        </button>
      </div>
      <div className="br-panel-isi">
        {KELOMPOK_URUT.map((k) => {
          const anggota = JENIS_PETA.filter((j) => j.kelompok === k);
          const bisa = anggota.filter((j) => adaTitik(j.id));
          const nyala = bisa.filter((j) => pilihan.has(j.id));
          const total = anggota.reduce((n, j) => n + (jumlah.get(j.id) ?? jumlahTanpaTitik[j.id] ?? 0), 0);
          return (
            <fieldset key={k} className="br-kelompok">
              <legend className="sr-only">{KELOMPOK_PETA[k].nama}</legend>
              <label className="br-kelompok-kepala">
                <input
                  type="checkbox"
                  checked={bisa.length > 0 && nyala.length === bisa.length}
                  disabled={!bisa.length}
                  ref={(el) => {
                    if (el) el.indeterminate = nyala.length > 0 && nyala.length < bisa.length;
                  }}
                  onChange={(e) => ubah(bisa.map((j) => j.id), e.target.checked)}
                />
                <b>{KELOMPOK_PETA[k].nama}</b>
                <span className="bch-data">{total}</span>
              </label>
              {anggota.map((j) => {
                const ada = adaTitik(j.id);
                return (
                  <label key={j.id} className="br-jenis" data-kosong={ada ? undefined : ""}>
                    <input type="checkbox" checked={pilihan.has(j.id)} disabled={!ada} onChange={(e) => ubah([j.id], e.target.checked)} />
                    <IkonLingkaran glyph={j.glyph} warna={KELOMPOK_PETA[k].warna} ukuran={22} />
                    <span>
                      {j.nama}
                      {!ada && <small>Lokasi sedang dilengkapi</small>}
                    </span>
                    <span className="bch-data">{jumlah.get(j.id) ?? jumlahTanpaTitik[j.id] ?? 0}</span>
                  </label>
                );
              })}
            </fieldset>
          );
        })}
      </div>
    </div>
  );
}

function CariTempat({ pins, onPilih }: { pins: PinPeta[]; onPilih: (p: PinPeta) => void }) {
  const [q, setQ] = useState("");
  const idHasil = useId();
  const hasil = useMemo(() => cariPin(pins, q), [pins, q]);
  const ketik = q.trim().length >= 2;
  return (
    <div className="br-cari">
      <input
        className="bch-input"
        type="search"
        aria-label="Cari tempat atau kecamatan"
        placeholder="Cari tempat atau kecamatan"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-controls={idHasil}
      />
      {ketik && (
        <ul id={idHasil} className="br-cari-hasil">
          {hasil.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  onPilih(p);
                  setQ("");
                }}
              >
                {p.nama} <span>{p.lokasi}</span>
              </button>
            </li>
          ))}
          {!hasil.length && <li className="br-cari-kosong">Tidak ada hasil untuk “{q.trim()}”. Coba kata lain atau hapus saringan.</li>}
        </ul>
      )}
    </div>
  );
}

const SEGAR_MS = 2 * 60 * 1000;
const tanpaAksi = () => {};

/** Peta Tempat di beranda (PEDOMAN 3.2, 5.2, 5.3). */
export default function PetaTempat({ jumlahTanpaTitik }: { jumlahTanpaTitik: Record<string, number> }) {
  const theme = useSiteTheme();
  const lebar = useMedia("(min-width: 900px)");
  const [map, setMap] = useState<MapLibre | null>(null);
  const [semuaPin, setSemuaPin] = useState<PinBerjenis[] | null>(null);
  const [pinGagal, setPinGagal] = useState(false);
  const [panelBuka, setPanelBuka] = useState<boolean | null>(null);
  const [cuacaBuka, setCuacaBuka] = useState(false);
  const [lapisan, setLapisan] = useState({ radar: false, gelombang: false, kamera: false });
  const [pilihan, setPilihan] = useState<ReadonlySet<string> | null>(null);
  const [pilihId, setPilihId] = useState<string | null>(() => new URLSearchParams(window.location.search).get("tempat"));
  const [saya, setSaya] = useState<[number, number] | null>(null);
  const [pesan, setPesan] = useState<PesanLokasi>(null);
  const [kamera, setKamera] = useState<Cam | null>(null);
  const [mati, setMati] = useState<Map<string, number | null>>(() => new Map());
  const cctvApi = useRef<CctvApi | null>(null);
  const now = useNow(30_000);

  const frames = useResource<FramesResponse>("/api/frames", SEGAR_MS, lapisan.radar, false);
  const ofs = useOfs({ enabled: lapisan.gelombang, playing: false, onSweepEnd: tanpaAksi });
  const citra = frames.data?.frames?.at(-1);
  const umur = citra ? ageMinutesOf(citra.ts, now) : null;
  const urlRadar = citra && umur !== null && umur <= RADAR_OLD_MIN ? citra.url : null;
  const validOfs = ofs.ofs?.frames[ofs.idx];

  useEffect(() => {
    let hidup = true;
    fetch("/info/direktori/pin.json")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<(PinPeta & { s?: string | null })[]>;
      })
      .then((d) => {
        if (!hidup) return;
        const berjenis = d.flatMap((p) => {
          const jenis = jenisDari(p.k, p.s);
          return jenis ? [{ ...p, jenis }] : [];
        });
        setSemuaPin(berjenis);
        setPilihan(
          bacaPilihan(
            ID_JENIS,
            ID_JENIS.filter((id) => berjenis.some((p) => p.jenis === id)),
          ),
        );
      })
      .catch(() => hidup && setPinGagal(true));
    return () => {
      hidup = false;
    };
  }, []);

  const ubah = useCallback((ids: string[], nyala: boolean) => {
    setPilihan((lama) => {
      const baru = new Set(lama ?? []);
      for (const id of ids) {
        if (nyala) baru.add(id);
        else baru.delete(id);
      }
      simpanPilihan(baru);
      return baru;
    });
  }, []);

  const pilih = useMemo(() => semuaPin?.find((p) => p.id === pilihId) ?? null, [semuaPin, pilihId]);
  const tampil = useMemo(
    () => (semuaPin ?? []).filter((p) => pilihan?.has(p.jenis) || p.id === pilihId),
    [semuaPin, pilihan, pilihId],
  );

  const fitur = useMemo(() => tampil.map(keFitur), [tampil]);

  const ubahPilih = useCallback((id: string | null) => {
    setPilihId(id);
    const u = new URL(window.location.href);
    if (id) u.searchParams.set("tempat", id);
    else u.searchParams.delete("tempat");
    window.history.replaceState(null, "", u);
  }, []);

  // Tautan ?tempat=: bawa peta ke pin itu setelah data dan peta siap.
  const sudahBawa = useRef(false);
  useEffect(() => {
    if (!map || !pilih || sudahBawa.current) return;
    sudahBawa.current = true;
    map.easeTo({ center: [pilih.lng, pilih.lat], zoom: Math.max(map.getZoom(), 13), animate: !gerakTenang() });
  }, [map, pilih]);

  const keSekitar = () => {
    if (!navigator.geolocation) {
      setPesan({ teks: "Peramban ini tidak dapat memberi lokasi." });
      return;
    }
    setPesan({ teks: "Mencari lokasi" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const [[w, s], [e, n]] = MAP_BOUNDS;
        if (coords.longitude < w || coords.longitude > e || coords.latitude < s || coords.latitude > n) {
          setPesan({ teks: "Lokasimu berada di luar peta Batam." });
          return;
        }
        setSaya([coords.latitude, coords.longitude]);
        setPesan({ teks: "Titik lokasimu hanya ada di layar ini dan tidak dikirim ke mana pun." });
        map?.easeTo({ center: [coords.longitude, coords.latitude], zoom: Math.max(map.getZoom(), 14), animate: !gerakTenang() });
      },
      () => setPesan({ teks: "Lokasi tidak tersedia. Izinnya mungkin belum diberikan." }),
      { timeout: 10_000, maximumAge: 0 },
    );
  };

  // Panel terbuka di desktop, tertutup di ponsel, sampai pengguna memilih sendiri.
  const buka = panelBuka ?? lebar;
  const kelompokAktif = KELOMPOK_URUT.filter((k) => JENIS_PETA.some((j) => j.kelompok === k && pilihan?.has(j.id)));

  const onCluster = useCallback((g: CamGroup | null) => {
    if (g) cctvApi.current?.zoomToCams(g.cams, 15);
  }, []);
  const padding = useCallback(() => ({ paddingTopLeft: [24, 24] as [number, number], paddingBottomRight: [24, 24] as [number, number] }), []);
  const fokus = useCallback(() => {}, []);
  const onMati = useCallback((slug: string, lastSeen: number | null) => {
    setMati((m) => new Map(m).set(slug, lastSeen));
  }, []);

  return (
    <div className="br-tempat" data-pin-tampil={semuaPin ? tampil.length : undefined}>
      <div className="br-tombol">
        <button type="button" className="bch-btn" data-variant={buka ? undefined : "ghost"} aria-expanded={buka} onClick={() => setPanelBuka(!buka)}>
          Tempat <Panah />
        </button>
        <div className="br-cuaca">
          <button
            type="button"
            className="bch-btn"
            data-variant={cuacaBuka ? undefined : "ghost"}
            aria-expanded={cuacaBuka}
            onClick={() => setCuacaBuka((v) => !v)}
          >
            Cuaca dan laut <Panah />
          </button>
          {cuacaBuka && (
            <div className="br-cuaca-isi">
              <Sakelar label="Radar hujan" nyala={lapisan.radar} onUbah={(v) => setLapisan((l) => ({ ...l, radar: v }))} />
              <Sakelar label="Tinggi gelombang" nyala={lapisan.gelombang} onUbah={(v) => setLapisan((l) => ({ ...l, gelombang: v }))} />
              <Sakelar label="Kamera lalu lintas" nyala={lapisan.kamera} onUbah={(v) => setLapisan((l) => ({ ...l, kamera: v }))} />
            </div>
          )}
        </div>
        {semuaPin && <CariTempat pins={semuaPin} onPilih={(p) => {
          ubahPilih(p.id);
          map?.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 14), animate: !gerakTenang() });
        }} />}
        <button type="button" className="bch-btn br-sekitar" data-variant="ghost" aria-label="Di sekitar saya" onClick={keSekitar}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="2.2" fill="currentColor" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
          <span className="br-sekitar-teks">Di sekitar saya</span>
        </button>
      </div>
      {pesan && (
        <p className="br-pesan" role="status">
          {pesan.teks}
        </p>
      )}

      <div className="app-root br-peta">
        <PetaLangit theme={theme === "dark" ? "dark" : "light"} opsi={{ bounds: TAMPILAN_TEMPAT, maxBounds: MAP_BOUNDS, koperatif: true, selubung: true, tanpaAtribusi: true }}>
          <KendaliPeta onMap={setMap} />
          {semuaPin && <LapisanTempat fitur={fitur} warnaUrut={WARNA_URUT} pilihId={pilihId} onPilih={ubahPilih} />}
          {lapisan.radar && <RadarLayer url={urlRadar} opacity={0.85} onBroken={tanpaAksi} />}
          {lapisan.gelombang && ofs.ofs?.baserun && validOfs && (
            <OfsField baserun={ofs.ofs.baserun} valid={validOfs} opacity={0.4} onTilesDown={ofs.setTilesDown} />
          )}
          {lapisan.gelombang && <LandMask theme={theme === "dark" ? "dark" : "light"} onStatus={ofs.setMaskOk} />}
          {lapisan.kamera && (
            <CctvLayer onPick={setKamera} dead={mati} getPadding={padding} onCluster={onCluster} focusPanel={fokus} selectedKey={null} apiRef={cctvApi} />
          )}
          {saya && (
            <PetaMarker posisi={saya} className="br-saya-penanda">
              <i className="br-saya" aria-label="Lokasimu" />
            </PetaMarker>
          )}
        </PetaLangit>
        {buka && semuaPin && pilihan && (
          <PanelTempat pins={semuaPin} jumlahTanpaTitik={jumlahTanpaTitik} pilihan={pilihan} ubah={ubah} onTutup={() => setPanelBuka(false)} />
        )}
        {pilih && <KartuPin pin={pilih} onTutup={() => ubahPilih(null)} />}
        {pinGagal && <p className="br-pesan-peta">Data tempat tidak dapat dimuat. Coba muat ulang dalam beberapa saat.</p>}
      </div>

      {!lebar && pilihan && (
        <ul className="bch-daftar-polos br-chip">
          {kelompokAktif.map((k) => (
            <li key={k}>
              <IkonLingkaran glyph={JENIS_PETA.find((j) => j.kelompok === k)?.glyph ?? ""} warna={KELOMPOK_PETA[k].warna} ukuran={24} />
              {KELOMPOK_PETA[k].nama}
            </li>
          ))}
        </ul>
      )}

      <div className="br-legenda">
        <span>
          <IkonLingkaran glyph="seafood" warna={KELOMPOK_PETA.makan.warna} ukuran={18} /> Lokasi pasti
        </span>
        <span>
          <IkonLingkaran glyph="seafood" warna={KELOMPOK_PETA.makan.warna} ukuran={18} garis /> Lokasi perkiraan
        </span>
        <span>
          <i className="br-legenda-klaster">12</i> Beberapa tempat berdekatan; perbesar peta untuk melihatnya
        </span>
        <span className="br-legenda-osm">© OpenStreetMap · Protomaps</span>
      </div>

      {kamera && <CctvPlayer key={kamera.slug} cam={kamera} onClose={() => setKamera(null)} onDead={onMati} autoStart />}
    </div>
  );
}
