// Kampung Tua dari data/kampung_tua/. Hanya untuk server: browser cuma menerima daftar penanda yang sudah ringkas.
// Aturan tertinggi (prompt bagian 6, panduan_etika.md): tanpa batas, luas, atau status lahan. Saringannya ada di
// sini, bukan di halaman, supaya bisa dites tanpa membuka browser.
import raw from "@/data/kampung_tua/kampung_tua.json";
import jumlahRaw from "@/data/kampung_tua/sumber_jumlah.json";
import legalitasRaw from "@/data/kampung_tua/kronologi_legalitas.json";
import { cariTempat, type Nada, type Place } from "@/features/direktori/data";
import { rapiTeks } from "@/features/sejarah/rapi";
import type { Pihak } from "./rempang";

type EntriMentah = {
  id: string;
  nama: string;
  nama_populer: string | null;
  kecamatan: string | null;
  kelurahan: string | null;
  lat: number | null;
  lng: number | null;
  akurasi_koordinat: string;
  asal_usul_nama: string | null;
  suku_awal: string | null;
  masa_berdiri: string | null;
  ringkasan: string;
  yang_bisa_dilihat: string[];
  cerita_rakyat: string | null;
  sumber_url: string[];
  status_verifikasi: string;
};

export type LapisanId = "daratan" | "rempang" | "hinterland";

export const LAPISAN: { id: LapisanId; awalan: string; nama: string; kicker: string; lede: string }[] = [
  {
    id: "daratan",
    awalan: "kt-",
    nama: "Daratan Batam",
    kicker: "Kampung tua, daftar 37",
    lede: "Daftar 37 versi Ranperda DPRD 2019 dan surat RKWB 2016.",
  },
  {
    id: "rempang",
    awalan: "rg-",
    nama: "Rempang dan Galang",
    kicker: "Kampung tua, 16 nama versi Ombudsman RI",
    lede: "Enam belas nama versi Ombudsman RI. Kartu di lapisan ini hanya memuat sejarah dan budaya.",
  },
  {
    id: "hinterland",
    awalan: "hl-",
    nama: "Situs dan Kampung Lama",
    kicker: "Situs dan kampung lama, bukan klaim kampung tua resmi",
    lede: "Tiga tempat di pulau sekitar. Belum ada daftar terbuka untuk wilayah ini, jadi kami tidak menyebutnya kampung tua resmi.",
  },
];

export const lapisanDari = (id: string) => LAPISAN.find((l) => id.startsWith(l.awalan)) ?? LAPISAN[0];

// Hal yang tidak boleh tampil apa adanya di kartu. Istilah etnis lama diparafrasekan (prompt bagian 6), dan topik
// relokasi dikeluarkan dari kartu per kampung: tempatnya di halaman Rempang yang bertanggal.
const GANTI: Record<string, Partial<Pick<EntriMentah, "ringkasan" | "cerita_rakyat" | "sumber_url">>> = {
  "kt-panau": {
    cerita_rakyat:
      "Penghuni pertamanya disebut sepasang suami istri. Sang istri berpenyakit kulit panau. Sang suami berkulit gelap dan dikenal dengan panggilan lama yang kini kami hindari karena bisa merendahkan.",
  },
  "rg-tanjung-banon": {
    ringkasan: "Disebut dalam SK 105/2004 menurut Ombudsman.",
    sumber_url: ["https://www.tempo.co/ekonomi/soroti-sejarah-hukum-kampung-tua-di-rempang-ombudsman-ini-unik-138618"],
  },
  // Catatan kerja di kolom ringkasan dan cerita rakyat. Faktanya tetap, kalimat untuk penyusun dibuang.
  "rg-sijantung": { ringkasan: "Masuk daftar 16 versi Ombudsman RI." },
  "kt-seranggong": { ringkasan: "Entri ke-37 di daftar Ranperda 2019, tanpa kelurahan dan kecamatan." },
  "kt-tanjung-piayu-laut": { cerita_rakyat: "Jalur penyamaran Sultan Sulaiman" },
};

// Tanda "perlu dicek" di kolom data adalah catatan kerja (pedoman 2.9), jadi tidak ikut tampil.
const tanpaCatatan = (s: string) =>
  s
    .replace(/\s*—\s*perlu dicek/gi, "")
    .replace(/\s*\((?:perlu dicek|perlu cek lapangan)\)/gi, "")
    .trim();

/** Nilai satu kolom untuk pembaca. Yang isinya hanya catatan kerja menjadi kosong, lalu barisnya tidak tampil. */
function nilaiTampil(s: string | null): string | null {
  if (!s) return null;
  const t = tanpaCatatan(s);
  return !t || /^perlu dicek$/i.test(t) ? null : rapiTeks(t);
}

const MASA_BERDIRI: Record<string, string | null> = {
  "Pra-1970": "Sebelum 1970",
  "Pra-Otorita Batam": "Sebelum Otorita Batam",
  "Tak pasti": null,
};

const masaBerdiri = (s: string | null) => (s !== null && s in MASA_BERDIRI ? MASA_BERDIRI[s] : nilaiTampil(s));

export type Kampung = EntriMentah & { lapisan: LapisanId; tempat: Place | null };

export const KAMPUNG: Kampung[] = (raw as EntriMentah[]).map((k) => {
  const g = GANTI[k.id];
  return {
    ...k,
    kecamatan: nilaiTampil(k.kecamatan),
    kelurahan: nilaiTampil(k.kelurahan),
    asal_usul_nama: nilaiTampil(k.asal_usul_nama),
    suku_awal: nilaiTampil(k.suku_awal),
    masa_berdiri: masaBerdiri(k.masa_berdiri),
    ringkasan: rapiTeks(g?.ringkasan ?? k.ringkasan),
    cerita_rakyat: nilaiTampil(g?.cerita_rakyat ?? k.cerita_rakyat),
    yang_bisa_dilihat: k.yang_bisa_dilihat.map((y) => rapiTeks(tanpaCatatan(y))),
    sumber_url: g?.sumber_url ?? k.sumber_url,
    lapisan: lapisanDari(k.id).id,
    tempat: cariTempat(k.id) ?? null,
  };
});
export const kampungPerId = new Map(KAMPUNG.map((k) => [k.id, k]));

/** Kartu Cerita untuk satu tempat direktori. Hanya kalau id-nya cocok: entri laporan 03 tidak ikut dipetakan. */
export function idKartuKampung(p: Pick<Place, "id" | "id_alias">): string | null {
  if (kampungPerId.has(p.id)) return p.id;
  return p.id_alias.find((a) => kampungPerId.has(a)) ?? null;
}

/** Koordinat kanonik dari places.json, supaya titiknya sama dengan peta beranda. */
export function titikKampung(k: Kampung): { lat: number; lng: number; perkiraan: boolean } | null {
  const p = k.tempat;
  if (!p || p.lat == null || p.lng == null || p.status_koordinat === "perlu_diisi_user") return null;
  return { lat: p.lat, lng: p.lng, perkiraan: p.status_koordinat !== "terverifikasi" };
}

/** Kelurahan dan kecamatan. Kosong bila data tidak menyebutnya: barisnya tidak tampil. */
export const lokasiKampung = (k: Pick<Kampung, "kelurahan" | "kecamatan">) =>
  [k.kelurahan, k.kecamatan].filter(Boolean).join(", ");

export type PenandaKampung = {
  id: string;
  nama: string;
  lat: number;
  lng: number;
  lapisan: LapisanId;
  perkiraan: boolean;
  lokasi: string;
};

export function daftarPenanda(): PenandaKampung[] {
  return KAMPUNG.flatMap((k) => {
    const t = titikKampung(k);
    return t ? [{ id: k.id, nama: k.nama, ...t, lapisan: k.lapisan, lokasi: lokasiKampung(k) }] : [];
  });
}

export type LencanaKampung = { teks: string; nada: Nada; ceritaRakyat?: boolean };

/**
 * Satu label untuk satu kartu (pedoman 3.7). Status di data bisa bercabang, misalnya
 * "terverifikasi (sejarah); tahun wafat Nong Isa perlu_cek_ulang": yang dipakai adalah bagian pertamanya.
 */
export function lencanaStatus(status: string): LencanaKampung {
  const utama = status.split(";")[0].trim();
  if (utama.startsWith("cerita_rakyat")) return { teks: "Cerita Rakyat", nada: "info", ceritaRakyat: true };
  if (utama.startsWith("terverifikasi")) return { teks: "Tercatat", nada: "ok" };
  return { teks: "Belum Terverifikasi", nada: "caution" };
}

/** Keterangan lokasi di daftar dan kartu. Tempat tanpa titik di peta tidak diberi teks (pedoman 3.1). */
export function labelLokasi(k: Kampung): string | null {
  const t = titikKampung(k);
  if (!t) return null;
  return t.perkiraan ? "Lokasi perkiraan" : "Lokasi terverifikasi";
}

/** Kalimat kartu Rempang dari research/04 bagian 4. Dipakai persis, jangan disunting tanpa pemilik proyek. */
export const KALIMAT_REMPANG =
  "Kampung-kampung di Pulau Rempang berada dalam kawasan yang direncanakan untuk Rempang Eco-City sejak 2023. Status dan pandangan para pihak masih berkembang; lihat sumber bertanggal.";

const STPN =
  "http://repository.stpn.ac.id/133/1/3%20menata%20tanah%20kota%20batam%20jalan%20penyelesaian%20penguasaan%20tanah%20kampung%20tua.pdf";

const URL_DI_TEKS = /https?:\/\/\S+/g;

export type BarisJumlah = { angka: string; sumber: string; konteks: string; tautan: string[]; konflik: boolean };

/** Sembilan baris jumlah kampung tua. Diktum SK soal Hak Pengelolaan adalah status lahan, jadi tidak tampil. */
export const JUMLAH: BarisJumlah[] = jumlahRaw.map((b) => {
  const tautan = b.konteks.match(URL_DI_TEKS) ?? [];
  const merujukStpn = /\((sumber sama|STPN, link di atas)\)/.test(b.konteks);
  const konteks = b.konteks
    .replace(URL_DI_TEKS, "")
    .replace(/\((sumber sama|STPN, link di atas)\)/, "")
    .replace(/Diktum kedua:[^.]*\./, "")
    .trim();
  return {
    angka: rapiTeks(b.angka.replace(/\*\*/g, "")),
    sumber: rapiTeks(b.sumber),
    konteks: rapiTeks(konteks),
    tautan: merujukStpn ? [STPN] : tautan,
    konflik: b.angka.includes("berdasarkan SK 105/2004"),
  };
});

export type ButirLegalitas = {
  /** Kunci dari data, sama dengan kolom `tanggal` di berkas JSON. */
  tanggal: string;
  /** Tanggal untuk pembaca: nama bulan lengkap. */
  tanggalTeks: string;
  peristiwa: string;
  siapa: string;
  pelaku: Pihak | null;
  disaring: boolean;
};

// Butir yang menyebut luas atau status lahan tidak tampil sama sekali (pedoman 3.7). Teks di sini hanya sisa yang
// aman dari butir yang tersaring sebagian, kalau kelak pemilik memutuskan butirnya tampil. null: seluruhnya status lahan.
const SARING_LEGALITAS: Record<string, string | null> = {
  "1 Apr 2019":
    "Menteri ATR/BPN mendengar aspirasi. RKWB (Makmur Ismail): 37 titik. LAM (Nyat Kadir): istilah kampung tua lahir dari masalah 2004.",
  "Akhir 2019": null,
  "Nov 2020": null,
  "Jul 2026": null,
  "16 Okt 2026":
    'Dalam silaturahmi RT/RW/LPM Kecamatan Lubuk Baja di Hotel AP Premier, Amsakar menyebut penyusunan "peraturan daerah khusus tentang Kampung Tua".',
};

// Pihak yang bertindak dalam peristiwa, menurut isi butirnya. Maklumat 2010 tidak menyebut penerbitnya di riset,
// jadi tidak diberi label. Pengelompokan ini perlu dibaca pemilik sebelum halamannya dibuka.
const PELAKU_LEGALITAS: Record<string, Pihak> = {
  "23 Mar 2004": "pemerintah",
  "2004": "pemerintah",
  "5 dan 25 Apr 2005": "pemerintah",
  "29 Mar 2006": "pemerintah",
  "2008": "warga",
  "19 Agu 2011": "pemerintah",
  "2012–2014": "bp_batam",
  "21 Apr 2015": "warga",
  "Nov 2016": "warga",
  "2021": "pemerintah",
  "25 Sep 2025": "bp_batam",
  "30 Apr 2026": "pemerintah",
  "15 Agu 2026": "pemerintah",
  "16 dan 22 Sep 2026": "pemerintah",
};

const isiLegalitas = (teks: string) =>
  rapiTeks(
    teks
      .replace(/\*\*/g, "")
      .replace(/\s*\(isi pasal belum dicek\)/, "")
      .replace("pada 16/9", "pada 16 September")
      .replace("lanjutan 22/9", "lanjutan 22 September"),
  );

export const LEGALITAS: ButirLegalitas[] = legalitasRaw.map((b) => {
  const disaring = b.tanggal in SARING_LEGALITAS;
  return {
    tanggal: b.tanggal,
    tanggalTeks: rapiTeks(b.tanggal),
    peristiwa: isiLegalitas(disaring ? (SARING_LEGALITAS[b.tanggal] ?? "") : b.peristiwa),
    siapa: rapiTeks(b.siapa_bilang),
    pelaku: PELAKU_LEGALITAS[b.tanggal] ?? null,
    disaring,
  };
});

/** Yang tampil ke pembaca. Butir yang isinya disaring tidak ditampilkan sama sekali. */
export const LEGALITAS_TAMPIL = LEGALITAS.filter((b) => !b.disaring);

/** Tanggal halaman bertanggal ini terakhir disusun dari riset. Perbarui setiap isinya berubah. */
export const TERAKHIR_DIPERBARUI = "5 November 2026";

// panduan_etika.md, enam butir "Etika berkunjung". Dijaga sama oleh tests/unit/kampung-tua.test.ts.
export const ETIKA = [
  "Berpakaian sopan, terutama dekat masjid dan makam. Ucapkan salam.",
  "Makam dan perigi adalah tempat ziarah, bukan latar konten. Jangan duduk atau berdiri di atas nisan.",
  "Pelantar dan rumah panggung adalah ruang privat warga. Jangan masuk kolong atau teras tanpa diundang.",
  "Belanja di warung lokal dan bawa pulang sampahmu. (Pesan soal sampah juga pernah disampaikan Wali Kota di Tanjung Riau.)",
  "Jangan jadikan sengketa lahan bahan obrolan basa-basi dengan warga.",
  "Hormati jadwal kampung: Jumat siang dan bulan Ramadan punya ritme sendiri.",
];

/** Toponim lama yang bukan bagian daftar 37, jadi tidak diberi penanda di peta. Yang belum dirangkum tidak tampil. */
export const KISAH_NAMA: { nama: string; kisah: string }[] = [
  { nama: "Jodoh", kisah: "Kisah Putri Mayang dan Pangeran Bugis." },
  { nama: "Kabil", kisah: "Dari “ma'bul” atau “Kabul”, ucapan Cik Awang asal Siak (1909)." },
  { nama: "Muka Kuning", kisah: "Dari ikan seriding kuning." },
];
