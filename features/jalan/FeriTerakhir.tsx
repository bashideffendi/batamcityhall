"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useNow } from "@/features/langit-laut/hooks/useBrowser";
import {
  catatanJadwalLama,
  dariTerminal,
  hitungFeri,
  jamTitik,
  kapital,
  kelompokRute,
  keSingapura,
  singkatanZona,
  teksInterval,
  teksStatus,
  type HasilFeri,
  type KelompokRute,
} from "./feri-terakhir";
import { useEntriFeri } from "./useFeri";

const TICK_MS = 30 * 1000;
const TANPA_JAM = new Set(["belum_tersedia"]);

/** "23:30 kemarin" menjadi "23.30 WIB kemarin". */
const teksJamWib = (jamWib: string) =>
  `${jamTitik(jamWib.replace(" kemarin", ""))} WIB${jamWib.endsWith("kemarin") ? " kemarin" : ""}`;

/** Satu baris keterangan di bawah jam. Jadwal lama dan jadwal yang diragukan memakai kalimat yang sama (pedoman 3.6). */
function metaBaris(h: HasilFeri): string {
  if (TANPA_JAM.has(h.status)) return "";
  const zona = h.zona ? ` ${singkatanZona(h.zona)}` : "";
  const bagian: string[] = [];
  if (h.dataLama || h.perluCek) bagian.push(catatanJadwalLama(h.tanggalData));
  if (h.perkiraan && h.operasi) {
    bagian.push(
      h.operasi.interval
        ? `Kapal berangkat ${teksInterval(h.operasi.interval)} sampai jam tutup operasi.`
        : "Jam ini adalah jam tutup operasi.",
    );
  }
  // Jam dari satu contoh hari tidak boleh terbaca sebagai jadwal tetap.
  if (h.contoh && h.hariTeks && !h.perkiraan) bagian.push(`${kapital(h.hariTeks)}.`);
  if (h.berikutnya) bagian.push(`Berikutnya pukul ${jamTitik(h.berikutnya)}${zona}.`);
  if (h.catatanTrip) bagian.push(`${kapital(h.catatanTrip)}.`);
  return bagian.join(" ");
}

function Baris({ h, k }: { h: HasilFeri; k: KelompokRute }) {
  const adaJam = h.jam !== null;
  // Satu label per baris: gangguan mengalahkan status jam.
  const label = h.terganggu ? "Terganggu" : adaJam ? teksStatus(h) : null;
  const meta = metaBaris(h);
  return (
    <tr className="jl-feri-baris" data-status={h.status} data-rute={h.ruteId}>
      <td data-label="Rute">
        {k.asal}—{k.tujuan}
      </td>
      <td data-label="Operator">{h.operator ?? ""}</td>
      <td data-label="Terakhir hari ini" className="jl-feri-sel">
        {adaJam ? (
          <span className="jl-feri-jam">
            {h.perkiraan ? "sekitar " : ""}
            {jamTitik(h.jam as string)} {h.zona && singkatanZona(h.zona)}
            {h.jamWib && <span className="jl-feri-wib">{teksJamWib(h.jamWib)}</span>}
          </span>
        ) : (
          <span className="jl-feri-teks">{teksStatus(h)}</span>
        )}
        {label && (
          <span className="bch-status" data-tone={h.terganggu ? "danger" : h.status === "masih_ada" ? "ok" : undefined}>
            {label}
          </span>
        )}
        {meta && <span className="jl-feri-meta">{meta}</span>}
      </td>
    </tr>
  );
}

/** Tabel: Rute · Operator · Terakhir hari ini (PEDOMAN 3.6). */
function TabelFeri({ kelompok }: { kelompok: KelompokRute[] }) {
  return (
    <div className="bch-table-wrap">
      <table className="bch-table bch-tabel-tumpuk jl-feri-tabel">
        <thead>
          <tr>
            <th scope="col">Rute</th>
            <th scope="col">Operator</th>
            <th scope="col">Terakhir hari ini</th>
          </tr>
        </thead>
        <tbody>
          {kelompok.flatMap((k) =>
            k.baris.map((h, i) => <Baris key={`${k.ruteId}-${k.asal}-${k.tujuan}-${h.operator}-${i}`} h={h} k={k} />),
          )}
        </tbody>
      </table>
    </div>
  );
}

function BelumTersedia({ baris }: { baris: HasilFeri[] }) {
  if (!baris.length) return null;
  return (
    <details className="jl-feri-kosong">
      <summary>Rute tanpa jadwal ({baris.length})</summary>
      <ul>
        {baris.map((h) => (
          <li key={`${h.ruteId}-${h.asal}`} data-rute={h.ruteId}>
            {h.asal} → {h.tujuan}: jadwal belum tersedia
          </li>
        ))}
      </ul>
    </details>
  );
}

type Props = {
  /** penuh: semua rute. ringkas: rute ke Singapura dan Telaga Punggur. */
  varian?: "penuh" | "ringkas";
  /** Id terminal di data/feri/terminal.json, untuk detail tempat makan. */
  terminal?: string | null;
  namaTerminal?: string;
};

export default function FeriTerakhir({ varian = "penuh", terminal, namaTerminal }: Props) {
  const nowMs = useNow(TICK_MS);
  const { data, gagal } = useEntriFeri();
  const hasil = useMemo(() => (data ? hitungFeri(data, new Date(nowMs)) : null), [data, nowMs]);
  const judul = terminal
    ? `Feri Terakhir dari ${namaTerminal ?? "Terminal Terdekat"} Hari Ini`
    : "Feri Terakhir Hari Ini";

  if (gagal) {
    return (
      <section className="jl-feri" aria-label={judul}>
        <h2>{judul}</h2>
        <p className="bch-note">Jadwal feri tidak dapat dimuat. Tanyakan kepada operator sebelum berangkat.</p>
      </section>
    );
  }
  if (!hasil) {
    return (
      <section className="jl-feri" aria-label={judul}>
        <h2>{judul}</h2>
        <p>Memuat data</p>
      </section>
    );
  }

  const pilih = terminal
    ? dariTerminal(hasil, terminal)
    : varian === "ringkas"
      ? hasil.filter((h) => keSingapura(h) || (h.arah === "dari_batam" && h.asal === "Telaga Punggur"))
      : hasil;
  const adaJadwal = pilih.filter((h) => h.status !== "belum_tersedia");
  const kosong = pilih.filter((h) => h.status === "belum_tersedia");
  const dariBatam = kelompokRute(adaJadwal.filter((h) => h.arah === "dari_batam"));
  const keBatam = kelompokRute(adaJadwal.filter((h) => h.arah === "ke_batam"));

  return (
    <section className="jl-feri" aria-label={judul} data-varian={terminal ? "terminal" : varian}>
      <h2>{judul}</h2>
      {dariBatam.length > 0 && (
        <>
          {keBatam.length > 0 && <h3>Dari Batam</h3>}
          <TabelFeri kelompok={dariBatam} />
        </>
      )}
      {keBatam.length > 0 && (
        <>
          <h3>Dari Luar Batam ke Batam</h3>
          <TabelFeri kelompok={keBatam} />
        </>
      )}
      <p className="bch-catatan-halaman">
        Jadwal dapat berubah. Tanyakan kepada operator sebelum berangkat. Jam mengikuti waktu setempat di pelabuhan asal,
        dan statusnya dihitung dari jadwal, bukan dari posisi kapal.
      </p>
      {!terminal && varian === "penuh" ? (
        <BelumTersedia baris={kosong} />
      ) : terminal && kosong.length > 0 ? (
        <p className="jl-feri-meta">{kosong.map((h) => h.tujuan).join(", ")}: jadwal belum tersedia.</p>
      ) : null}
      {(terminal || varian === "ringkas") && (
        <p className="m-0 mt-3">
          <Link href="/jalan/feri" prefetch={false} className="jl-tautan-resmi">
            Semua rute dan jadwal feri
          </Link>
        </p>
      )}
    </section>
  );
}
