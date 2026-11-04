"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import GerakToggle from "@/components/site/GerakToggle";
import { useMedia, useNow } from "@/features/langit-laut/hooks/useBrowser";
import { useResource } from "@/features/langit-laut/hooks/useResource";
import type { FramesResponse, PerairanResponse } from "@/features/langit-laut/lib/api-types";
import type { KartuMural, Perhentian } from "./data";
import KartuMuseum from "./KartuMuseum";
import { cahayaBatam, jamWib } from "./lib/cahaya";
import {
  berikutnya,
  LABEL_FERI,
  lompatMenit,
  perjalananAktif,
  SINGKATAN_ZONA,
  type BarisJadwal,
  type Zona,
} from "./lib/feri";
import { keadaanHujan, teksHujan } from "./lib/hujan";
import { keadaanOmbak, teksOmbak } from "./lib/ombak";
import {
  bacaProgres,
  hitungTemuan,
  tandaiTemuan,
  teksProgres,
  tulisProgres,
  type Progres,
  type Quest,
} from "./lib/quest";
import type { PenampilApi } from "./Penampil";

const Penampil = dynamic(() => import("./Penampil"), {
  ssr: false,
  loading: () => (
    <div className="mural-penampil">
      <p className="mural-pesan" role="status">
        Itik sedang berbaris…
      </p>
    </div>
  ),
});

const noop = () => () => {};

// Progres quest: satu sumber di memori, disalin ke localStorage. Kalau penyimpanan ditolak, tetap jalan selama
// halaman terbuka.
const KOSONG: Progres = {};
let progresKini: Progres | null = null;
const pendengar = new Set<() => void>();
const penyimpanan = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};
const bacaKini = () => (progresKini ??= bacaProgres(penyimpanan()));
const setelProgres = (p: Progres) => {
  progresKini = p;
  tulisProgres(penyimpanan(), p);
  pendengar.forEach((f) => f());
};
const langganProgres = (f: () => void) => {
  pendengar.add(f);
  return () => pendengar.delete(f);
};

const langganGerak = (f: () => void) => {
  window.addEventListener("bch-gerak", f);
  return () => window.removeEventListener("bch-gerak", f);
};
const bacaTenangSitus = () => document.documentElement.dataset.gerak === "tenang";

const SEGAR_RADAR_MS = 2 * 60 * 1000;
const SEGAR_OMBAK_MS = 30 * 60 * 1000;
const DETIK_30 = 30 * 1000;

const formatJam = (jam: string) => jam.replace(":", ".");
/** "08.15 SGT (07.15 WIB)". Jam WIB tidak diulang. */
const jamAsal = (jam: string, zona: Zona, instan: number) =>
  zona === "Asia/Jakarta"
    ? `${formatJam(jam)} WIB`
    : `${formatJam(jam)} ${SINGKATAN_ZONA[zona]} (${jamWib(new Date(instan))})`;
const FORMAT_TANGGAL = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });
function teksTanggalData(t: string) {
  const d = new Date(`${t}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? t : FORMAT_TANGGAL.format(d);
}

type Props = {
  dasar: string;
  kartu: KartuMural[];
  perhentian: Perhentian[];
  quest: Quest;
  jadwal: BarisJadwal[];
  ruteTakDigambar: string[];
  namaKecamatan: string[];
  spotAwal: string | null;
};

export default function MuralHalaman({
  dasar,
  kartu,
  perhentian,
  quest,
  jadwal,
  ruteTakDigambar,
  namaKecamatan,
  spotAwal,
}: Props) {
  const api = useRef<PenampilApi>(null);
  const [idKartu, setIdKartu] = useState<string | null>(() =>
    spotAwal && kartu.some((k) => k.id === spotAwal) ? spotAwal : null,
  );
  const [sorot, setSorot] = useState<string | null>(null);
  const [stopDipilih, setStopDipilih] = useState<string | null>(null);

  const terpasang = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const reduksi = useMedia("(prefers-reduced-motion: reduce)");
  const tenangSitus = useSyncExternalStore(langganGerak, bacaTenangSitus, () => false);
  const tenang = reduksi || tenangSitus;

  const progres = useSyncExternalStore(langganProgres, bacaKini, () => KOSONG);
  const { ditemukan, total, selesai, ada } = hitungTemuan(progres, quest);

  const now = useNow(DETIK_30);
  const frames = useResource<FramesResponse>("/api/frames", SEGAR_RADAR_MS, true, false);
  const perairan = useResource<PerairanResponse>("/api/perairan", SEGAR_OMBAK_MS, true, false);

  const cahaya = useMemo(() => cahayaBatam(new Date(now)), [now]);
  const hujan = useMemo(() => keadaanHujan(frames.data, frames.error, now), [frames.data, frames.error, now]);
  const ombak = useMemo(() => keadaanOmbak(perairan.data, perairan.error, now), [perairan.data, perairan.error, now]);
  const waktuFeri = tenang ? lompatMenit(now) : now;
  const kapal = useMemo(() => perjalananAktif(jadwal, waktuFeri), [jadwal, waktuFeri]);
  const kapalBerikut = useMemo(() => berikutnya(jadwal, waktuFeri), [jadwal, waktuFeri]);

  const berpin = useMemo(() => kartu.filter((k) => k.berpin), [kartu]);
  const nomorPin = useMemo(() => new Map(berpin.map((k, i) => [k.id, i + 1])), [berpin]);
  const pinPerkiraan = useMemo(
    () => new Set(kartu.filter((k) => k.lencana.some((l) => l.teks === "Lokasi perkiraan")).map((k) => k.id)),
    [kartu],
  );

  const kartuAktif = kartu.find((k) => k.id === idKartu) ?? null;

  const bukaKartu = useCallback(
    (id: string) => {
      setIdKartu(id);
      setSorot(null);
      setelProgres(tandaiTemuan(bacaKini(), quest, id));
      try {
        const u = new URL(window.location.href);
        u.searchParams.set("spot", id);
        window.history.replaceState(null, "", u);
      } catch {
        /* alamat tidak diperbarui, kartu tetap terbuka */
      }
      api.current?.panKe(id);
    },
    [quest],
  );

  const tutupKartu = useCallback(() => {
    setIdKartu(null);
    try {
      const u = new URL(window.location.href);
      u.searchParams.delete("spot");
      window.history.replaceState(null, "", u);
    } catch {
      /* abaikan */
    }
  }, []);

  // Tautan ?spot= saat halaman dibuka: temuan quest dihitung sama seperti klik.
  const spotDiproses = useRef(false);
  useEffect(() => {
    if (spotDiproses.current || !spotAwal) return;
    spotDiproses.current = true;
    if (kartu.some((k) => k.id === spotAwal)) setelProgres(tandaiTemuan(bacaKini(), quest, spotAwal));
  }, [spotAwal, kartu, quest]);

  const beriPetunjuk = () => {
    const sisa = quest.target.find((t) => !ada.has(t.id));
    if (!sisa) return;
    setSorot(sisa.id);
    api.current?.panKe(sisa.id);
  };

  const ulangQuest = () => {
    setelProgres({ ...bacaKini(), [quest.id]: [] });
    setSorot(null);
  };

  const catatanQuest = (() => {
    if (!kartuAktif || !quest.target.some((t) => t.id === kartuAktif.id)) return null;
    return `Ditemukan untuk quest ${quest.judul}: ${ditemukan} dari ${total}.`;
  })();

  const perhentianDipilih = perhentian.find((p) => p.id === stopDipilih && !p.aktif) ?? null;

  return (
    <>
      <section className="mural-panggung" aria-label="Mural">
        <Penampil
          dasar={dasar}
          nomorPin={nomorPin}
          pinPerkiraan={pinPerkiraan}
          jadwal={jadwal}
          hujan={hujan.status === "tersedia" ? hujan.perKecamatan : null}
          ombak={ombak.status === "tersedia" ? ombak.parameter : null}
          fase={terpasang ? cahaya.fase : "siang"}
          sorot={sorot}
          tenang={tenang}
          fokusAwal={spotAwal}
          onPilih={bukaKartu}
          apiRef={api}
        />
        <p className="mural-label mural-label-atas">Ilustrasi placeholder, bukan posisi tepat</p>
        <p className="mural-label mural-label-feri">Feri: {LABEL_FERI}</p>
        <div className="mural-kontrol" role="group" aria-label="Kendali tampilan">
          <button type="button" className="bch-btn" aria-label="Perbesar" onClick={() => api.current?.zoom(1.5)}>
            +
          </button>
          <button type="button" className="bch-btn" aria-label="Perkecil" onClick={() => api.current?.zoom(1 / 1.5)}>
            −
          </button>
          <button type="button" className="bch-btn" onClick={() => api.current?.pulang()}>
            Awal
          </button>
        </div>
      </section>

      <nav className="mural-strip" aria-label="Perhentian mural">
        <ol>
          {perhentian.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                data-perhentian={p.id}
                aria-current={p.aktif ? "true" : undefined}
                aria-expanded={p.aktif ? undefined : stopDipilih === p.id}
                onClick={() => {
                  if (p.aktif) {
                    setStopDipilih(null);
                    api.current?.pulang();
                  } else {
                    setStopDipilih((s) => (s === p.id ? null : p.id));
                  }
                }}
              >
                <span className="mural-strip-nomor">{p.urutan}</span>
                <span className="mural-strip-nama">{p.label}</span>
                <span className="mural-strip-status">{p.aktif ? "sedang dilihat" : "segera"}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="bch-page mural-bawah">
        {perhentianDipilih && (
          <div className="bch-note mural-segera" role="status" data-segera={perhentianDipilih.id}>
            <p className="m-0">
              <strong>{perhentianDipilih.label}: segera.</strong> {perhentianDipilih.batas}. Bagian ini belum digambar.
            </p>
            {perhentianDipilih.tempat.length > 0 && (
              <p className="mural-segera-tempat">
                Sementara, tempatnya ada di direktori:{" "}
                {perhentianDipilih.tempat.map((t, i) => (
                  <span key={t.id}>
                    {i > 0 && ", "}
                    <Link href={`/info/tempat/${t.id}`} prefetch={false}>
                      {t.nama}
                    </Link>
                  </span>
                ))}
                .
              </p>
            )}
          </div>
        )}

        <div className="mural-kolom">
          <section aria-labelledby="judul-daftar">
            <h2 id="judul-daftar">Daftar tempat di bagian ini</h2>
            <p className="bch-sel-kecil">Nomor sama dengan pin di gambar. Enter membuka kartu.</p>
            <ol className="mural-daftar">
              {kartu.map((k) => {
                const nomor = nomorPin.get(k.id);
                return (
                  <li key={k.id}>
                    <button type="button" data-spot={k.id} onClick={() => bukaKartu(k.id)}>
                      <span className="mural-daftar-nomor">{nomor ?? "·"}</span>
                      <span className="mural-daftar-nama">
                        {k.nama}
                        <span className="bch-sel-kecil">
                          {k.kicker}.{" "}
                          {pinPerkiraan.has(k.id) ? "Lokasi perkiraan." : "Lokasi terverifikasi, gambar tetap skema."}
                          {!nomor && " Tanpa pin: titiknya sama dengan Pasar Jodoh."}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="mural-sisi">
            <section className="bch-card mural-quest" aria-labelledby="judul-quest" data-quest={quest.id}>
              <p className="bch-kicker-row bch-kicker m-0">
                <span>Quest</span>
                <span data-lencana-quest>{terpasang ? `Cari! ${ditemukan}/${total}` : `Cari! 0/${total}`}</span>
              </p>
              <h2 id="judul-quest">{quest.judul}</h2>
              <p className="m-0">{quest.lede}</p>
              <p className="m-0 mural-quest-progres" aria-live="polite" data-progres-quest>
                {terpasang ? teksProgres(quest, ditemukan, total) : teksProgres(quest, 0, total)}
                {terpasang && selesai && ` Lencana: ${quest.lencana}.`}
              </p>
              <ul className="mural-quest-target">
                {quest.target.map((t) => {
                  const sudah = terpasang && ada.has(t.id);
                  return (
                    <li key={t.id} data-target-quest={t.id} data-sudah={sudah}>
                      <span className="bch-badge" data-tone={sudah ? "ok" : undefined}>
                        {sudah ? "Ditemukan" : "Belum"}
                      </span>{" "}
                      {t.petunjuk}
                    </li>
                  );
                })}
              </ul>
              <p className="mural-quest-tombol">
                <button type="button" className="bch-btn" onClick={beriPetunjuk} disabled={terpasang && selesai}>
                  Tunjukkan petunjuk
                </button>
                <button type="button" className="bch-btn" onClick={ulangQuest}>
                  Mulai lagi
                </button>
              </p>
              <p className="bch-sel-kecil">
                Progres hanya tersimpan di peramban ini. Kampung tua dan titik sejarah yang berat tidak masuk permainan.
              </p>
            </section>

            <section className="bch-card mural-keadaan" aria-labelledby="judul-keadaan">
              <h2 id="judul-keadaan">Keadaan di mural</h2>
              {terpasang ? (
                <dl className="bch-kartu-fakta">
                  <div data-keadaan-cahaya={cahaya.fase}>
                    <dt>Cahaya</dt>
                    <dd>
                      {cahaya.label}, {jamWib(new Date(now))}. Dihitung dari posisi matahari di Batam.
                    </dd>
                  </div>
                  <div data-keadaan-hujan={hujan.status}>
                    <dt>Hujan</dt>
                    <dd>{teksHujan(hujan, namaKecamatan)}</dd>
                  </div>
                  <div data-keadaan-ombak={ombak.status}>
                    <dt>Ombak</dt>
                    <dd>{teksOmbak(ombak)}</dd>
                  </div>
                  <div data-keadaan-feri={kapal.length}>
                    <dt>Feri</dt>
                    <dd>
                      <strong>Posisi perkiraan, bukan AIS.</strong> Dihitung dari jadwal di sepanjang garis skema.{" "}
                      {kapal.length > 0 ? (
                        <>
                          {kapal.map((k) => (
                            <span key={k.id} className="bch-sel-kecil">
                              {k.operator}, {k.arah}. Berangkat {jamAsal(k.jam, k.zona, k.berangkat)}, perkiraan tiba{" "}
                              {jamWib(new Date(k.tiba))}.
                            </span>
                          ))}
                        </>
                      ) : (
                        <span className="bch-sel-kecil">
                          Menurut jadwal, tidak ada feri di jalur ini sekarang.
                          {kapalBerikut &&
                            ` Berikutnya ${kapalBerikut.arah}, ${jamAsal(kapalBerikut.jam, kapalBerikut.zona, kapalBerikut.berangkat)}.`}
                        </span>
                      )}
                      {jadwal[0] && (
                        <span className="bch-sel-kecil">
                          Jadwal {jadwal[0].operator} per {teksTanggalData(jadwal[0].tanggalData)}.{" "}
                          {jadwal[0].sumber && (
                            <a href={jadwal[0].sumber} rel="noreferrer noopener" target="_blank">
                              Cek ke operator
                            </a>
                          )}
                        </span>
                      )}
                      {ruteTakDigambar.length > 0 && (
                        <span className="bch-sel-kecil">
                          Tidak digambar karena durasinya belum pasti: {ruteTakDigambar.join(", ")}.
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="m-0">Menghitung…</p>
              )}
              <p className="bch-sel-kecil">
                Semua ini perkiraan dari data berkala. <GerakToggle />
              </p>
            </section>
          </div>
        </div>

        <p className="bch-note mural-catatan-bawah">
          Gambar ini placeholder buatan skrip, menunggu ilustrasi asli.{" "}
          <Link href="/mural/cara-dibuat" prefetch={false}>
            Cara mural ini dibuat
          </Link>
          . Mencari tempat tertentu lebih cepat lewat{" "}
          <Link href="/" prefetch={false}>
            Mode Peta
          </Link>
          .
        </p>
      </div>

      <KartuMuseum kartu={kartuAktif} catatanQuest={catatanQuest} onTutup={tutupKartu} />
    </>
  );
}
