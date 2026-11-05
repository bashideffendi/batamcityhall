"use client";

import { useMemo, useState } from "react";
import {
  bacaTempelan,
  csvHalte,
  csvTempat,
  jsonKoordinat,
  kunciIsian,
  tautanGoogleMaps,
  type Isian,
  type JenisTitik,
  type TitikKoordinat,
} from "../koordinat";
import PetaKoordinat from "./PetaKoordinat";

const KUNCI_DRAF = "bch-admin-koordinat";
const BATAS_DAFTAR = 150;

const NAMA_STATUS: Record<string, string> = {
  perlu_diisi_user: "Lokasi belum diisi",
  perlu_cek_ulang: "Lokasi perkiraan",
};

// Draf hanya kenyamanan: isian panjang tidak hilang saat halaman dimuat ulang. Sumber kebenaran tetap berkas unduhan.
function bacaDraf(): Isian {
  try {
    return JSON.parse(localStorage.getItem(KUNCI_DRAF) ?? "{}") as Isian;
  } catch {
    return {};
  }
}

function simpanDraf(isian: Isian) {
  try {
    localStorage.setItem(KUNCI_DRAF, JSON.stringify(isian));
  } catch {
    // Mode privat atau penyimpanan penuh: tetap jalan tanpa draf.
  }
}

function unduh(nama: string, isi: string, tipe: string) {
  const url = URL.createObjectURL(new Blob([isi], { type: tipe }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nama;
  a.click();
  URL.revokeObjectURL(url);
}

export default function IsiKoordinat({ titik, tanggal }: { titik: TitikKoordinat[]; tanggal: string }) {
  const [isian, setIsian] = useState<Isian>(bacaDraf);
  const [kunci, setKunci] = useState<string | null>(null);
  const [jenis, setJenis] = useState<"" | JenisTitik>("");
  const [status, setStatus] = useState("");
  const [cari, setCari] = useState("");
  const [tempelan, setTempelan] = useState("");
  const [galat, setGalat] = useState("");

  const cocok = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return titik.filter(
      (t) =>
        (!jenis || t.jenis === jenis) &&
        (!status || t.statusKoordinat === status) &&
        (!q || `${t.nama} ${t.alamat ?? ""} ${t.kecamatan ?? ""} ${t.id}`.toLowerCase().includes(q)),
    );
  }, [titik, jenis, status, cari]);

  const aktif = titik.find((t) => kunciIsian(t) === kunci) ?? null;
  const nilai = kunci ? (isian[kunci] ?? null) : null;

  const ubah = (k: string, v: { lat: number; lng: number } | null) => {
    setIsian((lama) => {
      const baru = { ...lama };
      if (v) baru[k] = v;
      else delete baru[k];
      simpanDraf(baru);
      return baru;
    });
  };

  const jumlah = (j: JenisTitik) => titik.filter((t) => t.jenis === j && isian[kunciIsian(t)]).length;
  const nTempat = jumlah("tempat");
  const nHalte = jumlah("halte");

  function pakaiTempelan() {
    if (!kunci) return;
    const hasil = bacaTempelan(tempelan);
    if (!hasil) {
      setGalat("Tulis lintang, bujur. Contoh susunan: 1.12, 104.05. Harus berada di wilayah Batam.");
      return;
    }
    setGalat("");
    ubah(kunci, hasil);
    setTempelan("");
  }

  return (
    <div className="bch-adm-koordinat">
      <div>
        <div className="bch-adm-saring">
          <label className="bch-field">
            Cari
            <input
              className="bch-input"
              type="search"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              data-cari-titik
            />
          </label>
          <label className="bch-field">
            Jenis
            <select
              className="bch-select"
              value={jenis}
              onChange={(e) => setJenis(e.target.value as "" | JenisTitik)}
              data-saring-jenis
            >
              <option value="">Tempat dan halte</option>
              <option value="tempat">Tempat</option>
              <option value="halte">Halte</option>
            </select>
          </label>
          <label className="bch-field">
            Status
            <select className="bch-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Semua Status</option>
              <option value="perlu_diisi_user">Lokasi belum diisi</option>
              <option value="perlu_cek_ulang">Lokasi perkiraan</option>
            </select>
          </label>
        </div>

        <p className="bch-data mt-3 mb-0" data-jumlah-titik={cocok.length}>
          {cocok.length} titik
          {cocok.length > BATAS_DAFTAR ? `, ${BATAS_DAFTAR} pertama ditampilkan. Persempit dengan pencarian.` : ""}
        </p>
        <ul className="bch-adm-titik">
          {cocok.slice(0, BATAS_DAFTAR).map((t) => {
            const k = kunciIsian(t);
            return (
              <li key={k}>
                <button
                  type="button"
                  aria-current={k === kunci ? "true" : undefined}
                  onClick={() => {
                    setKunci(k);
                    setGalat("");
                  }}
                >
                  {t.nama}
                  <br />
                  <span className="bch-card-meta">
                    {t.jenis === "halte" ? "Halte" : t.kelompok}, {t.kecamatan ?? "kecamatan belum diketahui"}.{" "}
                    {isian[k] ? "Sudah diisi." : (NAMA_STATUS[t.statusKoordinat] ?? t.statusKoordinat)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <PetaKoordinat
          terpilih={aktif}
          nilai={nilai}
          onKlik={(lat, lng) => {
            if (kunci) ubah(kunci, { lat, lng });
          }}
        />

        {aktif ? (
          <div className="bch-card mt-3" data-titik-aktif={kunciIsian(aktif)}>
            <p className="bch-kicker m-0">
              {aktif.jenis === "halte" ? `Halte ${aktif.koridor ?? ""}` : aktif.kelompok}
            </p>
            <h2 className="m-0">{aktif.nama}</h2>
            <p className="bch-card-loc">{aktif.alamat ?? "Alamat belum diketahui"}</p>
            <p className="m-0">
              <a href={tautanGoogleMaps(aktif)} target="_blank" rel="noreferrer noopener">
                Cari di Google Maps
              </a>
            </p>
            <p className="bch-data mt-2 mb-0" role="status" data-nilai-titik>
              {nilai ? `${nilai.lat}, ${nilai.lng}` : "Belum ada isian. Klik peta untuk mengisi."}
            </p>
            {aktif.lat !== null && aktif.lng !== null && (
              <p className="bch-card-meta m-0">
                Titik lama, belum dicek: {aktif.lat}, {aktif.lng}
              </p>
            )}
            <div className="bch-adm-form">
              <label className="bch-field">
                Atau tempel dari Google Maps
                <input
                  className="bch-input"
                  value={tempelan}
                  onChange={(e) => setTempelan(e.target.value)}
                  inputMode="decimal"
                  data-tempel-titik
                />
              </label>
              <button type="button" className="bch-btn" data-variant="ghost" onClick={pakaiTempelan}>
                Pakai
              </button>
            </div>
            {galat && (
              <p className="bch-tk-galat mb-0" role="alert">
                {galat}
              </p>
            )}
            <div className="bch-adm-aksi">
              {aktif.lat !== null && aktif.lng !== null && (
                <button
                  type="button"
                  className="bch-btn"
                  data-variant="ghost"
                  onClick={() => ubah(kunciIsian(aktif), { lat: aktif.lat as number, lng: aktif.lng as number })}
                >
                  Titik lama sudah benar
                </button>
              )}
              {nilai && (
                <button
                  type="button"
                  className="bch-btn"
                  data-variant="ghost"
                  onClick={() => ubah(kunciIsian(aktif), null)}
                >
                  Hapus isian
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="bch-note">
            Pilih satu titik di daftar dulu. Klik di peta baru tercatat setelah ada yang dipilih.
          </p>
        )}

        <h2 className="mt-5 mb-2">Unduh hasil</h2>
        <p className="m-0" data-jumlah-isian={nTempat + nHalte}>
          {nTempat} tempat dan {nHalte} halte terisi. Draf tersimpan di browser ini saja.
        </p>
        <div className="bch-adm-unduh">
          <button
            type="button"
            className="bch-btn"
            disabled={!nTempat}
            onClick={() => unduh("koordinat_perlu_diisi.csv", csvTempat(titik, isian), "text/csv;charset=utf-8")}
          >
            CSV tempat
          </button>
          <button
            type="button"
            className="bch-btn"
            disabled={!nHalte}
            onClick={() => unduh("halte_koordinat_perlu_diisi.csv", csvHalte(titik, isian), "text/csv;charset=utf-8")}
          >
            CSV halte
          </button>
          <button
            type="button"
            className="bch-btn"
            data-variant="ghost"
            disabled={!nTempat}
            onClick={() =>
              unduh("koordinat_user.json", jsonKoordinat(titik, "tempat", isian, tanggal), "application/json")
            }
          >
            JSON tempat
          </button>
          <button
            type="button"
            className="bch-btn"
            data-variant="ghost"
            disabled={!nHalte}
            onClick={() =>
              unduh("koordinat_halte.json", jsonKoordinat(titik, "halte", isian, tanggal), "application/json")
            }
          >
            JSON halte
          </button>
        </div>
        <p className="bch-card-meta mt-2 mb-0">
          CSV dimasukkan dengan <code>python3 tools/import_koordinat.py berkas.csv</code>. Importer mengisi{" "}
          <code>data/koordinat_user.json</code> sendiri untuk tempat. JSON halte hanya cadangan, jangan digabung ke
          berkas itu: id halte punya namespace sendiri.
        </p>
      </div>
    </div>
  );
}
