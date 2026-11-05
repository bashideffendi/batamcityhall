// Data mural yang aman dikirim ke klien. landmarks.json memuat brief ilustrator dan catatan penyusun, jadi berkas ini
// hanya dibaca di server dan yang keluar adalah bentuk publik di bawah.
import jadwalFeri from "@/data/feri/jadwal.json";
import ruteFeri from "@/data/feri/rute.json";
import ikonPrioritas from "@/data/mural/ikon_prioritas.json";
import landmarks from "@/data/mural/landmarks.json";
import segmenMural from "@/data/mural/segmen.json";
import indeksTempat from "@/data/places_id_index.json";
import { cariTempat, lencana, lokasiTeks, teksDicek, tautanAman, type Lencana } from "@/features/direktori/data";
import type { BarisJadwal, Zona } from "./lib/feri";
import { bolehJadiQuest, type Quest } from "./lib/quest";

/**
 * Segmen pertama. Laporan 02 merekomendasikan Barelang 1-6 atau Harbour Bay-Nagoya. Dipilih yang kedua: jadwal feri
 * sungguhan hanya ada di sini (Barelang tidak punya rute terjadwal, jadi lapisan feri akan kosong), dan titiknya tidak
 * bersinggungan dengan Rempang atau Galang. Jembatan IV sampai VI tidak boleh jadi permainan, jadi quest 6 jembatan
 * tidak bisa tuntas di satu segmen. Alasan lengkap: docs/MURAL.md.
 */
export const SEGMEN_AKTIF = "harbourbay-nagoya-jodoh";
export const DASAR_TILE = `/mural/${SEGMEN_AKTIF}`;

export type Perhentian = {
  id: string;
  urutan: number;
  label: string;
  batas: string;
  aktif: boolean;
  tempat: { id: string; nama: string }[];
};

type Landmark = (typeof landmarks)[number];

const idTempatDari = (l: Pick<Landmark, "id">) => (indeksTempat as Record<string, string>)[l.id] ?? l.id;

export const PERHENTIAN: Perhentian[] = [...segmenMural]
  .sort((a, b) => a.urutan - b.urutan)
  .map((s) => ({
    id: s.id,
    urutan: s.urutan,
    label: s.label,
    batas: s.batas,
    aktif: s.id === SEGMEN_AKTIF,
    tempat: s.landmark_ids.flatMap((id) => {
      const p = cariTempat((indeksTempat as Record<string, string>)[id] ?? id);
      return p ? [{ id: p.id, nama: p.nama }] : [];
    }),
  }));

/** Isi kartu ditulis dari research/03 bagian Segmen 2, fakta dan atribusinya sama dengan laporan. */
type IsiKartu = {
  kicker: string;
  judul: string;
  isi: string[];
  fakta?: { label: string; nilai: string }[];
  sumberTeks: string;
  rujukan?: { href: string; teks: string };
};

const ISI: Record<string, IsiKartu> = {
  "harbour-bay": {
    kicker: "Pelabuhan",
    judul: "Gerbang kuliner laut",
    isi: [
      "Terminal feri internasional ke Singapura. Sekelilingnya restoran seafood, hotel, dan kafe.",
      "Di mural, kapal yang keluar dari sini dihitung dari jadwal, jadi posisinya perkiraan.",
    ],
    fakta: [{ label: "Rute ke Singapura", nilai: "HarbourFront, Horizon, sekitar 50 menit" }],
    sumberTeks: "Batam Pos; jadwal Horizon per 4 November 2026",
  },
  "kawasan-nagoya": {
    kicker: "Kawasan Ruko",
    judul: "Nagoya yang bukan di Jepang",
    isi: [
      "Nama Nagoya mulai dipakai sekitar 1978, berasal dari pekerja Jepang perusahaan infrastruktur.",
      "Nama resmi kawasannya Sungai Jodoh atau Lubuk Baja. Ini menurut kesaksian Machmur Ismail, mantan Ketua LAM Batam.",
    ],
    fakta: [{ label: "Sejak", nilai: "Sekitar 1978, menurut kesaksian" }],
    sumberTeks: "Terasbatam",
  },
  "nagoya-hill-mall": {
    kicker: "Pusat belanja",
    judul: "Nagoya Hill",
    isi: ["Salah satu mal utama di pusat niaga Nagoya.", "Tahun bukanya belum kami pastikan."],
    sumberTeks: "Wikipedia EN, Nagoya, Batam",
  },
  "pasar-jodoh": {
    kicker: "Pasar",
    judul: "Dari tukar-barang ke pasar seken",
    isi: [
      "Ada sejak 1970-an. Sekarang dikenal sebagai pasar barang seken dan thrift.",
      "Sumber berbeda soal kecamatannya: Batu Ampar atau Lubuk Baja.",
    ],
    fakta: [{ label: "Sejak", nilai: "1970-an" }],
    sumberTeks: "Tribun Batam; jurnal Historia UNRIKA",
  },
  "pelantar-sungai-jodoh-hilang": {
    kicker: "Batam yang Hilang",
    judul: "Perkampungan pelantar Sungai Jodoh",
    isi: [
      "Sebelum 1980 kawasan ini perkampungan pelantar di sungai. Pedagang dari Indragiri Hilir dan Rengat berdagang di sini.",
      "Terbakar 1980, lalu pasar daratnya terbakar lagi 1987. Kini tersisa drainase induk.",
      "Titiknya sama dengan Pasar Jodoh, jadi tidak diberi pin sendiri.",
    ],
    fakta: [{ label: "Keadaan", nilai: "Sudah tidak ada" }],
    sumberTeks: "Tribun Batam",
  },
  "kopi-harum-manis": {
    kicker: "Kedai Kopi",
    judul: "Kopitiam sejak 1985",
    isi: ["Kedai Kopi Harum Manis berdiri 1985 di Lubuk Baja."],
    fakta: [{ label: "Sejak", nilai: "1985" }],
    sumberTeks: "detikFood",
  },
  "tanjung-uma": {
    kicker: "Kampung Tua",
    judul: "Kampung Tua Tanjung Uma",
    isi: [
      "Termasuk daftar kampung tua Batam. Perkampungan pesisir.",
      "Di mural ini hanya penanda. Tulisan lengkapnya ada di modul Kampung Tua.",
    ],
    sumberTeks: "Kepri Post, Pikiran Rakyat",
    rujukan: { href: "/cerita/kampung-tua", teks: "Baca di modul Kampung Tua" },
  },
  "pelabuhan-batu-ampar": {
    kicker: "Pelabuhan Kargo",
    judul: "Pelabuhan Batu Ampar",
    isi: [
      "Pelabuhan kargo utama yang mendorong industri manufaktur.",
      "Sumbernya masih umum. Sumber primer belum kami temukan.",
    ],
    sumberTeks: "Traveloka, sumber umum",
  },
  "trans-batam": {
    kicker: "Ikon keseharian",
    judul: "Trans Batam",
    isi: [
      "Trans Batam resmi beroperasi 18 Juli 2005. Koridor pertamanya Sekupang sampai Batam Centre.",
      "Gambar bus ini ikon, bukan letak halte tertentu.",
    ],
    fakta: [{ label: "Beroperasi", nilai: "18 Juli 2005" }],
    sumberTeks: "Wikipedia ID",
  },
};

export type KartuMural = {
  id: string;
  nama: string;
  kicker: string;
  judul: string;
  lokasi: string;
  isi: string[];
  fakta: { label: string; nilai: string }[];
  lencana: Lencana[];
  sumberTeks: string;
  sumberUrl: string | null;
  dicek: string;
  idTempat: string | null;
  bisaDiPeta: boolean;
  rujukan: { href: string; teks: string } | null;
  /** Punya pin di gambar. Pelantar Sungai Jodoh berbagi titik dengan Pasar Jodoh, jadi hanya ada di daftar. */
  berpin: boolean;
  bolehQuest: boolean;
};

const urutanIkon = new Map(ikonPrioritas.flatMap((i) => i.id_landmark.map((id) => [id, i.urutan] as const)));

export const KARTU: KartuMural[] = landmarks
  .filter((l) => l.segmen === SEGMEN_AKTIF)
  .sort((a, b) => (urutanIkon.get(a.id) ?? 99) - (urutanIkon.get(b.id) ?? 99))
  .map((l) => {
    const isi = ISI[l.id];
    if (!isi) throw new Error(`Isi kartu mural belum ditulis: ${l.id}`);
    const p = cariTempat(idTempatDari(l));
    return {
      id: l.id,
      nama: p?.nama ?? l.nama,
      kicker: isi.kicker,
      judul: isi.judul,
      lokasi: p ? lokasiTeks(p) : "Kecamatan belum diketahui",
      isi: isi.isi,
      fakta: isi.fakta ?? [],
      lencana: p ? lencana(p) : [{ teks: "Lokasi perkiraan", nada: "info" as const }],
      sumberTeks: isi.sumberTeks,
      sumberUrl: tautanAman(l.sumber_url) ? l.sumber_url : null,
      dicek: p ? teksDicek(p) : "Belum dicek ulang sejak riset Nov 2026",
      idTempat: p?.id ?? null,
      bisaDiPeta: typeof p?.lat === "number" && typeof p?.lng === "number",
      rujukan: isi.rujukan ?? null,
      berpin: l.kategori !== "batam-yang-hilang",
      bolehQuest: bolehJadiQuest(l),
    };
  });

/** Quest segmen ini. Tiap temuan membuka kartu, jadi bukan sekadar centang. */
export const QUEST_AKTIF: Quest = {
  id: "jejak-pusat-niaga",
  judul: "Jejak pusat niaga",
  lede: "Lima titik yang menjelaskan kenapa bagian kota ini jadi pusat dagang.",
  lencana: "Jejak Lengkap",
  target: [
    { id: "harbour-bay", petunjuk: "Tempat feri ke Singapura bersandar, dikelilingi meja seafood." },
    { id: "pelabuhan-batu-ampar", petunjuk: "Pelabuhan dengan crane, bukan untuk penumpang." },
    { id: "kawasan-nagoya", petunjuk: "Kawasan ruko yang namanya berasal dari pekerja Jepang." },
    { id: "pasar-jodoh", petunjuk: "Pasar sejak 1970-an yang kini dikenal karena barang seken." },
    { id: "kopi-harum-manis", petunjuk: "Kopitiam yang berdiri 1985." },
  ],
};

const OPERATOR_TAK_DIGAMBAR = (r: { id: string; tujuan: string }) => `Harbour Bay dan ${r.tujuan}`;

type Mentah = (typeof jadwalFeri)["jadwal"][number];

const ZONA_SAH: Zona[] = ["Asia/Jakarta", "Asia/Singapore", "Asia/Kuala_Lumpur"];

/** Jadwal rute yang digambar di segmen ini. Baris yang durasi atau zonanya tidak jelas tidak dipakai. */
function jadwalSegmen(ruteId: string, namaTerminal: string): BarisJadwal[] {
  const rute = ruteFeri.rute.find((r) => r.id === ruteId);
  if (!rute?.durasi_menit) return [];
  const hasil: BarisJadwal[] = [];
  for (const b of jadwalFeri.jadwal.filter((j) => j.rute_id === ruteId) as Mentah[]) {
    const zona = b.zona_waktu as Zona | null;
    if (!zona || !ZONA_SAH.includes(zona) || !b.hari || !b.jam_berangkat.length) continue;
    hasil.push({
      ruteId,
      arah: b.arah.replace(/\s*\(.*\)\s*$/, "").replace("->", "ke"),
      operator: b.operator ?? rute.operator[0] ?? "",
      zona,
      jam: b.jam_berangkat,
      hari: b.hari,
      tanggalData: b.tanggal_data ?? "",
      sumber: b.sumber_url?.[0] ?? null,
      durasiMenit: rute.durasi_menit,
      menujuTerminal: !b.arah.startsWith(namaTerminal),
    });
  }
  return hasil;
}

export const JADWAL_MURAL: BarisJadwal[] = jadwalSegmen("hb-hfc", "Harbour Bay");

/** Rute dari terminal yang sama tetapi tidak digambar, dengan alasannya. Durasi kosong: posisi tidak bisa dihitung. */
export const RUTE_TAK_DIGAMBAR: string[] = ruteFeri.rute
  .filter((r) => r.asal_id === "hb" && r.id !== "hb-hfc" && !r.durasi_menit)
  .map(OPERATOR_TAK_DIGAMBAR);
