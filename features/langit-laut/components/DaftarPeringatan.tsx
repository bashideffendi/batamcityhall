"use client";

import { useNow } from "@/features/langit-laut/hooks/useBrowser";
import { useResource } from "@/features/langit-laut/hooks/useResource";
import type { PeringatanCuaca, PeringatanResponse } from "@/features/langit-laut/lib/api-types";
import { aktifPada, daftarNama, rapikanTeks, waktuWib } from "@/features/langit-laut/lib/peringatan-cuaca";
import { IconWarn } from "./icons";

const POLL_MS = 2 * 60 * 1000;
const TICK_MS = 30 * 1000;

// Peringatan ditulis lurus dan disalin dari penerbitnya. Status selalu ikon dan kata, tidak hanya warna.
function Kartu({ p, now }: { p: PeringatanCuaca; now: number }) {
  const belum = Date.parse(p.mulai) > now;
  return (
    <li className="bch-baris-peringatan" data-peringatan={p.kode}>
      <p className="bch-status m-0" data-tone="danger">
        <IconWarn className="bch-ikon-status" />
        {belum ? "Akan berlaku" : "Berlaku"}
      </p>
      <h3>{p.judul || p.kejadian}</h3>
      <p className="bch-card-meta mt-2 mb-0">
        {waktuWib(p.mulai, now)} sampai {waktuWib(p.sampai, now)}
      </p>
      {p.batam.length > 0 && (
        <p className="mt-3 mb-0">
          <strong>Kecamatan di Batam:</strong> {daftarNama(p.batam)}
        </p>
      )}
      {rapikanTeks(p.deskripsi)
        .split(/\n+/)
        .map((b) => b.trim())
        .filter(Boolean)
        .map((b) => (
          <p key={b} className="mt-3 mb-0">
            {b}
          </p>
        ))}
    </li>
  );
}

export default function DaftarPeringatan() {
  const now = useNow(TICK_MS);
  const { data, error, load } = useResource<PeringatanResponse>("/api/peringatan-cuaca", POLL_MS, true, false);
  const aktif = aktifPada(data?.peringatan, now);
  const batam = aktif.filter((p) => p.batam.length > 0);
  const lain = aktif.filter((p) => p.batam.length === 0);
  const lamaAda = data?.status === "basi" || (error && !!data);

  return (
    <div data-daftar-peringatan>
      {!data && !error && <p className="mt-5">Memuat data</p>}
      {!data && error && (
        <p className="mt-5" data-status="gagal">
          Peringatan cuaca belum dapat dimuat, jadi keadaannya belum diketahui.{" "}
          <button type="button" className="bch-tautan-tombol" onClick={() => void load()}>
            Muat ulang
          </button>
        </p>
      )}
      {lamaAda && (
        <p className="mt-5" data-status="basi">
          Data terbaru belum dapat dimuat. Yang tampil adalah data terakhir
          {data?.diambil ? ` pukul ${waktuWib(data.diambil, now)}` : ""}.
        </p>
      )}
      {data?.status === "sebagian" && !error && (
        <p className="mt-5" data-status="sebagian">
          Sebagian peringatan belum dapat dimuat, jadi daftar ini mungkin belum lengkap.
        </p>
      )}

      {data && (
        <>
          <section aria-labelledby="peringatan-batam">
            <h2 id="peringatan-batam" className="mt-6 mb-3">
              Untuk Batam
            </h2>
            {batam.length ? (
              <ul className="bch-daftar-polos">
                {batam.map((p) => (
                  <Kartu key={p.id} p={p} now={now} />
                ))}
              </ul>
            ) : (
              <p className="m-0">Tidak ada peringatan yang menyebut kecamatan di Batam saat ini.</p>
            )}
          </section>
          <section aria-labelledby="peringatan-kepri">
            <h2 id="peringatan-kepri" className="mt-7 mb-3">
              Kepulauan Riau Lainnya
            </h2>
            {lain.length ? (
              <ul className="bch-daftar-polos">
                {lain.map((p) => (
                  <Kartu key={p.id} p={p} now={now} />
                ))}
              </ul>
            ) : (
              <p className="m-0">Tidak ada peringatan lain untuk Kepulauan Riau saat ini.</p>
            )}
          </section>
        </>
      )}

      <p className="mt-6">Tidak ada peringatan tidak berarti cuaca pasti baik. Hujan lebat bisa datang tanpa peringatan.</p>
    </div>
  );
}
