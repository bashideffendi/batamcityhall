// Kampung Tua dari data/kampung_tua/. Hanya untuk server: browser cuma menerima daftar penanda yang sudah ringkas.
// Aturan tertinggi (prompt bagian 6, panduan_etika.md): tanpa batas, luas, atau status lahan. Saringannya ada di
// sini, bukan di halaman, supaya bisa dites tanpa membuka browser.
import raw from "@/data/kampung_tua/kampung_tua.json";
import jumlahRaw from "@/data/kampung_tua/sumber_jumlah.json";
import legalitasRaw from "@/data/kampung_tua/kronologi_legalitas.json";
import { cariTempat, tautanAman, teksDicek, type Nada, type Place } from "@/features/direktori/data";

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
    lede: "Daftar 37 versi Ranperda DPRD 2019 dan surat RKWB 2016. Ejaan dan sebagian nama masih perlu dicocokkan dengan lampiran SK.",
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
    nama: "Situs dan kampung lama",
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
};

export type Kampung = EntriMentah & { lapisan: LapisanId; tempat: Place | null };

export const KAMPUNG: Kampung[] = (raw as EntriMentah[]).map((k) => {
  const g = GANTI[k.id];
  return {
    ...k,
    ringkasan: g?.ringkasan ?? k.ringkasan,
    cerita_rakyat: g?.cerita_rakyat ?? k.cerita_rakyat,
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

export const lokasiKampung = (k: Pick<Kampung, "kelurahan" | "kecamatan">) =>
  [k.kelurahan, k.kecamatan].filter(Boolean).join(", ") || "Lokasi belum diisi";

export const dicekKampung = (k: Kampung) => (k.tempat ? teksDicek(k.tempat) : "Belum dicek ulang sejak riset Nov 2026");

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

const kapital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "terverifikasi (sejarah); tahun wafat Nong Isa perlu_cek_ulang" menjadi dua lencana berkata-kata. */
export function lencanaStatus(status: string): LencanaKampung[] {
  return status.split(";").map((bagian) => {
    const asli = bagian.trim();
    const teks = kapital(
      asli
        .replace("cerita_rakyat sumber_tunggal", "cerita rakyat, sumber tunggal")
        .replace("perlu_cek_ulang", "perlu dicek ulang")
        .replace("sumber_tunggal", "sumber tunggal")
        .replace("cerita_rakyat", "cerita rakyat")
        // Yang terverifikasi adalah keberadaannya. Titik di peta tetap perkiraan dan punya lencana sendiri.
        .replace(/^lokasi terverifikasi$/, "keberadaan kampung terverifikasi"),
    );
    if (asli.startsWith("cerita_rakyat")) return { teks, nada: "info", ceritaRakyat: true };
    if (/terverifikasi/.test(asli) && !/belum/.test(asli)) return { teks, nada: "ok" };
    return { teks, nada: "caution" };
  });
}

export function lencanaLokasi(k: Kampung): LencanaKampung {
  const t = titikKampung(k);
  if (!t) return { teks: "Lokasi belum diisi", nada: "info" };
  return t.perkiraan ? { teks: "Lokasi perkiraan", nada: "info" } : { teks: "Lokasi terverifikasi", nada: "ok" };
}

export const sumberKampung = (k: Pick<Kampung, "sumber_url">) => k.sumber_url.filter(tautanAman);

export const domain = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
};

/** Kalimat kartu Rempang dari research/04 bagian 4. Dipakai persis, jangan disunting tanpa pemilik proyek. */
export const KALIMAT_REMPANG =
  "Kampung-kampung di Pulau Rempang berada dalam kawasan yang direncanakan untuk Rempang Eco-City sejak 2023. Status dan pandangan para pihak masih berkembang; lihat sumber bertanggal.";

export const TAUTAN_REMPANG = [
  {
    label: "Ombudsman RI",
    url: "https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan",
  },
  {
    label: "BP Batam, via Bisnis",
    url: "https://sumatra.bisnis.com/read/20250721/533/1894791/update-proyek-rempang-eco-city-436-warga-tempati-tanjung-banon",
  },
];

const STPN =
  "http://repository.stpn.ac.id/133/1/3%20menata%20tanah%20kota%20batam%20jalan%20penyelesaian%20penguasaan%20tanah%20kampung%20tua.pdf";

const URL_DI_TEKS = /https?:\/\/\S+/g;

export type BarisJumlah = { angka: string; sumber: string; konteks: string; tautan: string[]; konflik: boolean };

/** Sembilan baris "Kenapa angkanya beda?". Diktum SK soal Hak Pengelolaan adalah status lahan, jadi tidak tampil. */
export const JUMLAH: BarisJumlah[] = jumlahRaw.map((b) => {
  const tautan = b.konteks.match(URL_DI_TEKS) ?? [];
  const merujukStpn = /\((sumber sama|STPN, link di atas)\)/.test(b.konteks);
  const konteks = b.konteks
    .replace(URL_DI_TEKS, "")
    .replace(/\((sumber sama|STPN, link di atas)\)/, "")
    .replace(/Diktum kedua:[^.]*\./, "")
    .trim();
  return {
    angka: b.angka.replace(/\*\*/g, ""),
    sumber: b.sumber,
    konteks,
    tautan: merujukStpn ? [STPN] : tautan,
    konflik: b.angka.includes("berdasarkan SK 105/2004"),
  };
});

export type ButirLegalitas = { tanggal: string; peristiwa: string; siapa: string; disaring: boolean };

export const TEKS_DISARING =
  "Isi butir ini menyangkut status lahan, jadi tidak kami tampilkan. Rujukannya tetap kami sebut.";

// Butir yang menyebut luas atau status lahan. null = seluruh isinya status lahan; teks = yang tersisa setelah disaring.
const SARING_LEGALITAS: Record<string, string | null> = {
  "1 Apr 2019":
    "Menteri ATR/BPN mendengar aspirasi. RKWB (Makmur Ismail): 37 titik. LAM (Nyat Kadir): istilah kampung tua lahir dari masalah 2004.",
  "Akhir 2019": null,
  "Nov 2020": null,
  "Jul 2026": null,
  "16 Okt 2026":
    'Dalam silaturahmi RT/RW/LPM Kecamatan Lubuk Baja di Hotel AP Premier, Amsakar menyebut penyusunan "peraturan daerah khusus tentang Kampung Tua".',
};

export const LEGALITAS: ButirLegalitas[] = legalitasRaw.map((b) => {
  const disaring = b.tanggal in SARING_LEGALITAS;
  const isi = disaring ? (SARING_LEGALITAS[b.tanggal] ?? TEKS_DISARING) : b.peristiwa;
  return { tanggal: b.tanggal, peristiwa: isi.replace(/\*\*/g, ""), siapa: b.siapa_bilang, disaring };
});

/** Tanggal halaman bertanggal ini terakhir disusun dari riset. Perbarui setiap isinya berubah. */
export const TERAKHIR_DIPERBARUI = "5 November 2026";
export const LABEL_DRAF = "Draf, menunggu tinjauan pemilik";

// panduan_etika.md, enam butir "Etika berkunjung". Dijaga sama oleh tests/unit/kampung-tua.test.ts.
export const ETIKA = [
  "Berpakaian sopan, terutama dekat masjid dan makam. Ucapkan salam.",
  "Makam dan perigi adalah tempat ziarah, bukan latar konten. Jangan duduk atau berdiri di atas nisan.",
  "Pelantar dan rumah panggung adalah ruang privat warga. Jangan masuk kolong atau teras tanpa diundang.",
  "Belanja di warung lokal dan bawa pulang sampahmu. (Pesan soal sampah juga pernah disampaikan Wali Kota di Tanjung Riau.)",
  "Jangan jadikan sengketa lahan bahan obrolan basa-basi dengan warga.",
  "Hormati jadwal kampung: Jumat siang dan bulan Ramadan punya ritme sendiri.",
];

const ANTARA_TOPONIM = "https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam";

/** "Kisah Nama Tempat": toponim lama yang bukan bagian daftar 37, jadi tidak diberi penanda di peta. */
export const KISAH_NAMA: { nama: string; kisah: string; sumber: string }[] = [
  { nama: "Jodoh", kisah: "Kisah Putri Mayang dan Pangeran Bugis.", sumber: ANTARA_TOPONIM },
  { nama: "Kabil", kisah: 'Dari "ma\'bul" atau "Kabul", ucapan Cik Awang asal Siak (1909).', sumber: ANTARA_TOPONIM },
  { nama: "Muka Kuning", kisah: "Dari ikan seriding kuning.", sumber: ANTARA_TOPONIM },
  { nama: "Sekupang", kisah: "Kisah asal namanya ada di sumber, belum kami rangkum.", sumber: ANTARA_TOPONIM },
  { nama: "Batu Aji", kisah: "Kisah asal namanya ada di sumber, belum kami rangkum.", sumber: ANTARA_TOPONIM },
];

// narasumber_arsip.md. Sengaja tanpa nama dan kontak narasumber: warga dihubungi lewat LAM atau RKWB.
export const RUJUKAN: { judul: string; butir: { nama: string; ket?: string; url?: string }[] }[] = [
  {
    judul: "Lembaga",
    butir: [
      { nama: "LAM Kota Batam", ket: "Pintu masuk ke tokoh tiap kampung." },
      { nama: "RKWB (Rumpun Khazanah Warisan Batam)", ket: "Pemegang daftar 37 titik, surat 047/RKWB/VIII/2016." },
      {
        nama: "Dinas Kebudayaan dan Pariwisata Kota Batam",
        ket: "Mengelola cagar budaya dan menerbitkan buku Nong Isa.",
        url: "https://disbudpar.batam.go.id",
      },
      { nama: "Tim Ahli Cagar Budaya Kota Batam" },
      {
        nama: "Balai Pelestarian Kebudayaan Wilayah IV",
        ket: "Dulu BPNB Kepri. Artikel Batu Besar dan makam Nong Isa.",
        url: "https://kebudayaan.kemdikbud.go.id/bpnbkepri/",
      },
      {
        nama: "Dinas Kebudayaan Provinsi Kepri",
        ket: 'Seri "asal-usul kampung tua".',
        url: "https://disbud.kepriprov.go.id/category/ragam-budaya/",
      },
      { nama: "Dinas Pertanahan Pemko Batam", ket: "Salinan SK 105/2004 dan SK 89/2006 beserta lampiran nama." },
      { nama: "Museum Raja Ali Haji Batam", ket: "Koleksi sketsa Nong Isa." },
    ],
  },
  {
    judul: "Arsip dan foto lama",
    butir: [
      {
        nama: "KITLV / Leiden University Digital Collections",
        ket: "Peta 1847 Kaart van de Noordkust van het Eiland Bantang dan foto kolonial. Punya ketentuan reproduksi sendiri.",
      },
      { nama: "ANRI (Arsip Riouw) dan Perpustakaan Nasional", ket: "Dokumen mandat Nong Isa dan catatan 1833." },
      { nama: "Arsip foto Otorita/BP Batam era 1970–80-an", ket: "Humas BP Batam." },
      { nama: "Repository STPN", ket: "Kajian 2013, 2015, 2016, berisi foto lapangan Bagan dan Tanjung Bemban." },
    ],
  },
  {
    judul: "Buku, jurnal, dan tulisan",
    butir: [
      {
        nama: "Nong Isa: Tonggak Awal Pemerintahan Batam",
        ket: "Ahmad Dahlan, Aswandi Syahri, Edi Sutrisno (Disbudpar Batam).",
      },
      { nama: "Eksistensi Kampung Tua Nongsa Pantai", ket: "Jurnal Kronologi UNP, 2025." },
      { nama: "Journal Historia UNRIKA", ket: "Piayu Laut." },
      { nama: "Journal of Architecture & Design UIB", ket: "Tanjung Riau, tipologi rumah Melayu." },
      { nama: "Jurnal Potensi Universitas Batam", ket: "Tanjung Riau sebagai kampung budaya." },
      { nama: "Jurnal SARGA Untag Semarang", ket: "Kampung Tua Tanjung Piayu." },
      { nama: "Tulisan Aswandi Syahri", ket: "Sejarawan, Tanjungpinang." },
      {
        nama: "Tulisan Bintoro Suryo",
        ket: "bintorosuryo.com, GoWest.id, Beplus: Nongsa, Batu Besar, Tanjung Bemban.",
      },
    ],
  },
];
