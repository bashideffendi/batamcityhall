"use client";

import { useState } from "react";
import { Kolom } from "@/features/tukang/Kolom";
import { buatSlug } from "../skema";
import type { BarisFoto } from "../store";
import type { BarisUbahan } from "../ubahan";
import AdminFoto from "./AdminFoto";
import { KolomArea, KolomPilih, KolomTeks, Pesan, useKirim } from "./Bersama";

export type TempatForm = {
  id: string;
  name: string;
  category: string;
  kategori_lain: string[];
  food_court: string;
  area: string;
  halal: string;
  desc_id: string;
  signature: string;
  price_tier: string;
  price_idr: string;
  address: string;
  hours: string;
  phone: string;
  instagram: string;
  gmaps: string;
};

type Pilihan = { nilai: string; nama: string };
type Isian = Omit<TempatForm, "id"> & { lat: string; lng: string };

const KOSONG: Isian = {
  name: "",
  category: "",
  kategori_lain: [],
  food_court: "",
  area: "",
  halal: "muslim-friendly",
  desc_id: "",
  signature: "",
  price_tier: "$",
  price_idr: "",
  address: "",
  hours: "",
  phone: "",
  instagram: "",
  gmaps: "",
  lat: "",
  lng: "",
};

const BARU = "__baru";

/** Satu halaman untuk mengelola tempat makan: data, kategori, food court, dan foto. */
export default function AdminMakan({
  tempat,
  hidangan,
  kawasan,
  foodCourt,
  ubahan,
  foto,
}: {
  tempat: TempatForm[];
  hidangan: Pilihan[];
  kawasan: Pilihan[];
  foodCourt: Pilihan[];
  ubahan: BarisUbahan[];
  foto: BarisFoto[];
}) {
  const [pilih, setPilih] = useState("");
  const [f, setF] = useState<Isian>(KOSONG);
  const { galat, pesan, sibuk, kirim } = useKirim();
  const atur = (k: Partial<Isian>) => setF((x) => ({ ...x, ...k }));
  // Tempat baru yang sudah tersimpan tetap tempat baru: id dan koordinatnya dipertahankan saat disimpan ulang.
  const tertunda = ubahan.find((u) => u.tempat_id === pilih);
  const baru = pilih === BARU || !!tertunda?.baru;

  // Tempat baru yang sudah disimpan ikut bisa dipilih, supaya fotonya bisa langsung ditambahkan.
  const tempatBaru: Pilihan[] = ubahan.filter((u) => u.baru).map((u) => ({ nilai: u.tempat_id, nama: `${u.data.name} (Baru)` }));
  const daftarTempat: Pilihan[] = [{ nilai: BARU, nama: "Tempat Baru" }, ...tempatBaru, ...tempat.map((t) => ({ nilai: t.id, nama: t.name }))];

  function gantiPilihan(v: string) {
    setPilih(v);
    const t = tempat.find((x) => x.id === v);
    const ubah = ubahan.find((u) => u.tempat_id === v);
    const titik = ubah?.data as { lat?: number; lng?: number } | undefined;
    setF({
      ...KOSONG,
      ...t,
      ...(ubah?.data as Partial<Isian>),
      food_court: ubah?.data.food_court ?? t?.food_court ?? "",
      lat: titik?.lat != null ? String(titik.lat) : "",
      lng: titik?.lng != null ? String(titik.lng) : "",
    });
  }

  return (
    <>
      <form
        className="bch-adm-lembar"
        onSubmit={(e) => {
          e.preventDefault();
          const { lat, lng, ...kolom } = f;
          const data = baru
            ? { baru: true, tempat_id: pilih === BARU ? buatSlug(f.name) : pilih, ...kolom, lat: Number(lat), lng: Number(lng) }
            : { baru: false, tempat_id: pilih, ...kolom };
          kirim({ aksi: "simpan_makan", data }, "Tersimpan. Tayang setelah Terbitkan Perubahan.", () => {
            setPilih("");
            setF(KOSONG);
          });
        }}
      >
        <h2 className="bch-judul-seksi">Tambah atau Ubah Tempat</h2>
        <KolomPilih nama="pilih" label="Tempat" nilai={pilih} kosong="Pilih Tempat" galat={galat.tempat_id} pilihan={daftarTempat} ubah={gantiPilihan} />
        {pilih && (
          <>
            <KolomTeks nama="name" label="Nama" nilai={f.name} wajib galat={galat.name} ubah={(v) => atur({ name: v })} />
            <div className="bch-adm-dua">
              <KolomPilih nama="category" label="Kategori Utama" nilai={f.category} kosong="Pilih Kategori" galat={galat.category} pilihan={hidangan} ubah={(v) => atur({ category: v })} />
              <KolomPilih nama="area" label="Kawasan" nilai={f.area} kosong="Pilih Kawasan" galat={galat.area} pilihan={kawasan} ubah={(v) => atur({ area: v })} />
              <KolomPilih nama="food_court" label="Food Court" nilai={f.food_court} kosong="Bukan di Food Court" galat={galat.food_court} pilihan={foodCourt} ubah={(v) => atur({ food_court: v })} />
              <KolomPilih
                nama="halal"
                label="Status Halal"
                nilai={f.halal}
                galat={galat.halal}
                pilihan={[
                  { nilai: "halal", nama: "Halal" },
                  { nilai: "muslim-friendly", nama: "Ramah Muslim" },
                  { nilai: "non-halal", nama: "Nonhalal" },
                ]}
                ubah={(v) => atur({ halal: v })}
              />
              <KolomPilih
                nama="price_tier"
                label="Tingkat Harga"
                nilai={f.price_tier}
                galat={galat.price_tier}
                pilihan={[
                  { nilai: "$", nama: "Rendah" },
                  { nilai: "$$", nama: "Menengah" },
                  { nilai: "$$$", nama: "Tinggi" },
                ]}
                ubah={(v) => atur({ price_tier: v })}
              />
              <KolomTeks nama="price_idr" label="Kisaran Harga" nilai={f.price_idr} petunjuk="Misalnya Rp25.000–50.000" galat={galat.price_idr} ubah={(v) => atur({ price_idr: v })} />
              <KolomTeks nama="hours" label="Jam Buka" nilai={f.hours} petunjuk="Misalnya 09.30–23.00" galat={galat.hours} ubah={(v) => atur({ hours: v })} />
              <KolomTeks nama="phone" label="Telepon" nilai={f.phone} galat={galat.phone} ubah={(v) => atur({ phone: v })} />
              <KolomTeks nama="instagram" label="Instagram" nilai={f.instagram} galat={galat.instagram} ubah={(v) => atur({ instagram: v })} />
            </div>
            <Kolom nama="kategori_lain" label="Kategori Lain" petunjuk="Tempat juga tampil di kategori ini" galat={galat.kategori_lain}>
              {() => (
                <div className="bch-adm-centang">
                  {hidangan
                    .filter((h) => h.nilai !== f.category)
                    .map((h) => (
                      <label key={h.nilai} className="bch-adm-cek">
                        <input
                          type="checkbox"
                          checked={f.kategori_lain.includes(h.nilai)}
                          onChange={(e) =>
                            atur({ kategori_lain: e.target.checked ? [...f.kategori_lain, h.nilai] : f.kategori_lain.filter((k) => k !== h.nilai) })
                          }
                        />
                        {h.nama}
                      </label>
                    ))}
                </div>
              )}
            </Kolom>
            <KolomTeks nama="address" label="Alamat" nilai={f.address} wajib galat={galat.address} ubah={(v) => atur({ address: v })} />
            <KolomArea nama="desc_id" label="Keterangan" nilai={f.desc_id} wajib galat={galat.desc_id} ubah={(v) => atur({ desc_id: v })} />
            <KolomTeks nama="signature" label="Menu Andalan" nilai={f.signature} galat={galat.signature} ubah={(v) => atur({ signature: v })} />
            <KolomTeks nama="gmaps" label="Tautan Google Maps" tipe="url" nilai={f.gmaps} galat={galat.gmaps} ubah={(v) => atur({ gmaps: v })} />
            {baru && (
              <div className="bch-adm-dua">
                <KolomTeks nama="lat" label="Lintang" tipe="number" nilai={f.lat} wajib petunjuk="Angka pertama di Google Maps" galat={galat.lat} ubah={(v) => atur({ lat: v })} />
                <KolomTeks nama="lng" label="Bujur" tipe="number" nilai={f.lng} wajib petunjuk="Angka kedua di Google Maps" galat={galat.lng} ubah={(v) => atur({ lng: v })} />
              </div>
            )}
            <div className="bch-adm-aksi">
              <button type="submit" className="bch-btn" disabled={sibuk}>
                Simpan Data
              </button>
            </div>
          </>
        )}
        <Pesan pesan={pesan} />
      </form>

      {pilih && pilih !== BARU && (
        <section className="bch-seksi-rapat" aria-label="Foto tempat ini">
          <AdminFoto tempat={daftarTempat.slice(1).map((t) => ({ id: t.nilai, nama: t.nama }))} baris={foto} tempatTetap={pilih} />
        </section>
      )}

      <section className="bch-seksi-rapat">
        <h2 className="bch-judul-seksi">Perubahan Tersimpan</h2>
        {ubahan.length === 0 && <p>Belum ada perubahan.</p>}
        <ul className="bch-adm-baris">
          {ubahan.map((u) => (
            <li key={u.tempat_id}>
              <div>
                <strong>{u.data.name}</strong>
                <span className="bch-data">{u.baru ? "Tempat Baru" : "Ubahan"}</span>
              </div>
              <div className="bch-adm-aksi">
                <button
                  type="button"
                  className="bch-btn"
                  data-variant="ghost"
                  disabled={sibuk}
                  onClick={() => {
                    if (window.confirm(`Buang perubahan "${u.data.name}"?`)) kirim({ aksi: "hapus_makan", tempat_id: u.tempat_id }, "Perubahan dibuang.");
                  }}
                >
                  Buang
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
