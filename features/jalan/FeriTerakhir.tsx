"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useNow } from "@/features/langit-laut/hooks/useBrowser";
import {
  dariTerminal,
  hitungFeri,
  kelompokRute,
  keSingapura,
  singkatanZona,
  teksStatus,
  teksTanggal,
  waktuDiZona,
  type HasilFeri,
  type KelompokRute,
} from "./feri-terakhir";
import { useEntriFeri } from "./useFeri";

const TICK_MS = 30 * 1000;
const TANPA_JAM = new Set(["belum_tersedia"]);

function jamKeTeks(n: number) {
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
}

function Baris({ h }: { h: HasilFeri }) {
  const adaJam = h.jam !== null;
  return (
    <li className="jl-feri-baris" data-status={h.status} data-rute={h.ruteId}>
      <span className="jl-feri-operator">{h.operator ?? "operator belum tercatat"}</span>
      {adaJam ? (
        <span className="jl-feri-jam bch-data">
          {h.perkiraan ? "±" : ""}
          {h.jam} {h.zona && singkatanZona(h.zona)}
          {h.jamWib && <span className="jl-feri-wib"> = {h.jamWib} WIB</span>}
        </span>
      ) : (
        <span className="jl-feri-teks">{teksStatus(h)}</span>
      )}
      <span className="bch-badges jl-feri-lencana">
        {adaJam && (
          <span className="bch-badge" data-tone={h.status === "masih_ada" ? "ok" : undefined}>
            {teksStatus(h)}
          </span>
        )}
        {h.perluCek && (
          <span className="bch-badge" data-tone="caution">
            perlu cek ulang
          </span>
        )}
        {h.contoh && <span className="bch-badge">contoh</span>}
        {h.terganggu && (
          <span className="bch-badge" data-tone="danger">
            terganggu
          </span>
        )}
        {h.dataLama && !TANPA_JAM.has(h.status) && (
          <span className="bch-badge" data-tone="caution">
            data lama
          </span>
        )}
      </span>
      {!TANPA_JAM.has(h.status) && (
        <span className="jl-feri-meta">
          Data {teksTanggal(h.tanggalData)}
          {h.perkiraan && h.operasi ? `. Jam tutup operasi, ${h.operasi.interval ?? "tanpa jam kapal"}` : ""}
          {h.berikutnya ? `. Berikutnya ${h.berikutnya}` : ""}
          {h.catatanTrip ? `. ${h.catatanTrip}` : ""}
        </span>
      )}
    </li>
  );
}

function Kelompok({ k }: { k: KelompokRute }) {
  return (
    <section className="jl-feri-rute">
      <h4>
        {k.asal} → {k.tujuan}
      </h4>
      <ul>
        {k.baris.map((h, i) => (
          <Baris key={`${h.ruteId}-${h.operator}-${i}`} h={h} />
        ))}
      </ul>
      {k.link ? (
        <a href={k.link} target="_blank" rel="noopener" className="jl-tautan-resmi">
          Jadwal resmi operator
        </a>
      ) : (
        <p className="jl-feri-meta">Belum ada tautan jadwal resmi.</p>
      )}
    </section>
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
            {h.adaJadwalUsang ? " (yang ada hanya jadwal lama)" : ""}
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
    ? `Feri terakhir dari ${namaTerminal ?? "terminal terdekat"} hari ini`
    : "Feri terakhir hari ini";

  if (gagal) {
    return (
      <section className="jl-feri" aria-label={judul}>
        <h2>{judul}</h2>
        <p className="bch-note" data-tone="caution">
          Jadwal feri gagal dimuat. Cek langsung ke operator.
        </p>
      </section>
    );
  }
  if (!hasil) {
    return (
      <section className="jl-feri" aria-label={judul}>
        <h2>{judul}</h2>
        <p>Itik sedang berbaris…</p>
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
  const lama = adaJadwal.filter((h) => h.dataLama).length;
  const kini = waktuDiZona(new Date(nowMs), "Asia/Jakarta");

  return (
    <section className="jl-feri" aria-label={judul} data-varian={terminal ? "terminal" : varian}>
      <h2>{judul}</h2>
      <p className="jl-feri-kini bch-data">Sekarang {jamKeTeks(kini.menit)} WIB</p>
      <p className="bch-note">
        Jadwal bisa berubah, cek operator. Jam adalah waktu lokal pelabuhan asal. Status terakhir dihitung dari jadwal
        statis, bukan posisi kapal.
      </p>
      {lama > 0 && (
        <p className="bch-note" data-tone="caution" role="status">
          Jadwal mungkin sudah berubah. {lama} baris di bawah datanya lebih dari 60 hari.
        </p>
      )}
      {dariBatam.length > 0 && (
        <>
          <h3>Dari Batam</h3>
          <div className="jl-feri-grid">
            {dariBatam.map((k) => (
              <Kelompok key={`${k.ruteId}-${k.asal}-${k.tujuan}`} k={k} />
            ))}
          </div>
        </>
      )}
      {keBatam.length > 0 && (
        <>
          <h3>Dari luar Batam ke Batam</h3>
          <div className="jl-feri-grid">
            {keBatam.map((k) => (
              <Kelompok key={`${k.ruteId}-${k.asal}-${k.tujuan}`} k={k} />
            ))}
          </div>
        </>
      )}
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
