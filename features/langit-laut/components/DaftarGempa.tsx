"use client";

import { useNow } from "@/features/langit-laut/hooks/useBrowser";
import { useResource } from "@/features/langit-laut/hooks/useResource";
import type { Gempa, GempaResponse } from "@/features/langit-laut/lib/api-types";
import { sebutTsunami, teksLalu, teksLetak, teksMagnitudo } from "@/features/langit-laut/lib/gempa";
import { waktuWib } from "@/features/langit-laut/lib/peringatan-cuaca";
import { IconWarn } from "./icons";

const POLL_MS = 2 * 60 * 1000;
const TICK_MS = 30 * 1000;

const kedalaman = (g: Gempa) => (g.kedalamanKm === null ? "Belum tercatat" : `${g.kedalamanKm} km`);
const waktuBmkg = (g: Gempa) => [g.tanggal, g.jam].filter(Boolean).join(", ");

function Terbaru({ g, now }: { g: Gempa; now: number }) {
  const tsunami = sebutTsunami(g.potensi);
  return (
    <section aria-labelledby="gempa-terbaru" className="bch-card mt-5" data-gempa-terbaru>
      <h2 id="gempa-terbaru" className="bch-kicker m-0">
        Gempa terbaru
      </h2>
      <p className="bch-gempa-angka mt-2 mb-0">{teksMagnitudo(g.magnitudo)}</p>
      <p className="mt-1 mb-0">{g.wilayah}</p>
      <p className="bch-card-meta mt-2 mb-0">
        {waktuBmkg(g)} · {teksLalu(g.waktu, now)}
      </p>
      <hr className="bch-card-rule" />
      <dl className="bch-daftar m-0">
        <dt>Kedalaman</dt>
        <dd>{kedalaman(g)}</dd>
        {g.jarakKm !== null && (
          <>
            <dt>Dari Batam</dt>
            <dd>{teksLetak(g)}</dd>
          </>
        )}
        {g.dirasakan && (
          <>
            <dt>Dirasakan</dt>
            <dd>{g.dirasakan}</dd>
          </>
        )}
        {g.potensi && (
          <>
            <dt>Keterangan</dt>
            <dd>{g.potensi}</dd>
          </>
        )}
      </dl>
      {tsunami && (
        <p className="bch-note mt-4 mb-0" data-tone="danger" data-tsunami>
          <IconWarn className="bch-ikon-status" />
          BMKG menyatakan gempa ini berpotensi tsunami. Ikuti arahan petugas setempat. Situs ini tidak menilai apakah
          Batam terdampak.
        </p>
      )}
    </section>
  );
}

function Tabel({ daftar, now }: { daftar: Gempa[]; now: number }) {
  return (
    <div className="bch-table-wrap">
      <table className="bch-table bch-tabel-tumpuk" role="table">
        <caption className="sr-only">Daftar gempa dari BMKG, terbaru di atas</caption>
        <thead>
          <tr>
            <th scope="col">Waktu</th>
            <th scope="col">Magnitudo</th>
            <th scope="col">Kedalaman</th>
            <th scope="col">Pusat gempa</th>
            <th scope="col">Dari Batam</th>
            <th scope="col">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {daftar.map((g) => (
            <tr key={`${g.waktu}-${g.lat}-${g.lon}`} role="row" data-gempa>
              <td role="cell" data-label="Waktu" className="bch-data">
                {waktuBmkg(g)}
                <span className="bch-sel-kecil">{teksLalu(g.waktu, now)}</span>
              </td>
              <td role="cell" data-label="Magnitudo" className="bch-data">
                {teksMagnitudo(g.magnitudo)}
              </td>
              <td role="cell" data-label="Kedalaman" className="bch-data">
                {kedalaman(g)}
              </td>
              <td role="cell" data-label="Pusat gempa">
                {g.wilayah || "Belum tercatat"}
              </td>
              <td role="cell" data-label="Dari Batam">
                {teksLetak(g) || "Koordinat tidak terbaca"}
              </td>
              <td role="cell" data-label="Keterangan">
                {g.dirasakan && <>Dirasakan: {g.dirasakan}</>}
                {g.dirasakan && g.potensi && <br />}
                {g.potensi}
                {!g.dirasakan && !g.potensi && "Tidak ada keterangan"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DaftarGempa() {
  const now = useNow(TICK_MS);
  const { data, error, load } = useResource<GempaResponse>("/api/gempa", POLL_MS, true, false);
  const daftar = data?.gempa ?? [];
  const lamaAda = data?.status === "basi" || (error && !!data);

  return (
    <div data-daftar-gempa>
      {!data && !error && <p className="mt-5">Memuat data</p>}
      {!data && error && (
        <p className="mt-5" data-status="gagal">
          Data gempa belum dapat dimuat.{" "}
          <button type="button" className="bch-tautan-tombol" onClick={() => void load()}>
            Muat ulang
          </button>
        </p>
      )}
      {lamaAda && (
        <p className="mt-5" data-status="basi">
          Data terbaru belum dapat dimuat, jadi gempa
          {data?.diambil ? ` sesudah pukul ${waktuWib(data.diambil, now)}` : " yang lebih baru"} belum masuk.
        </p>
      )}
      {data?.status === "sebagian" && !error && (
        <p className="mt-5" data-status="sebagian">
          Sebagian data belum dapat dimuat, jadi daftar mungkin belum lengkap.
        </p>
      )}

      {daftar[0] && <Terbaru g={daftar[0]} now={now} />}
      {daftar.length > 1 && (
        <section aria-labelledby="gempa-daftar">
          <h2 id="gempa-daftar" className="mt-7 mb-3">
            Gempa Sebelumnya
          </h2>
          <Tabel daftar={daftar.slice(1)} now={now} />
        </section>
      )}
      {data && !daftar.length && !error && data.status !== "gagal" && (
        <p className="mt-5">Belum ada data gempa.</p>
      )}

      <section aria-labelledby="gempa-cara-baca">
        <h2 id="gempa-cara-baca" className="mt-7 mb-3">
          Cara Membaca
        </h2>
        <ul className="bch-prose">
          <li>
            Daftar berisi gempa terbaru, 15 gempa bermagnitudo 5,0 ke atas, dan 15 gempa yang dirasakan. Gempa kecil yang
            tidak dirasakan biasanya tidak masuk, kecuali yang terbaru.
          </li>
          <li>
            Angka Romawi pada kolom Dirasakan adalah skala MMI, kekuatan guncangan di tempat itu.
          </li>
          <li>
            Jarak dari Batam adalah garis lurus dari Batam Kota, dibulatkan ke 10 km.
          </li>
          <li>
            Beranda hanya menyebut gempa 24 jam terakhir yang dirasakan di Kepulauan Riau, berpusat dalam 300 km dari
            Batam, bermagnitudo 6 ke atas dalam 1.000 km, atau berpotensi tsunami.
          </li>
        </ul>
      </section>
    </div>
  );
}
