// Data Trans Batam untuk halaman Loket 04. Semua data bertanggal 4 Nov 2026 dan sekunder (brief 10).
// Kolom catatan mentah memuat catatan penyusun, jadi teks untuk warga ditulis di sini.
import halteRaw from "@/data/trans_batam/halte.json";
import infoRaw from "@/data/trans_batam/info_praktis.json";
import koridorRaw from "@/data/trans_batam/koridor.json";

export type JumlahHalte = number | { nilai: number | number[]; status?: string; catatan?: string };

export type Koridor = {
  id: string;
  nama: string;
  warna: string;
  status: "aktif" | "rencana";
  mulai?: string;
  jam?: string;
  headway_menit?: { pagi_sibuk: number; siang_sore: number } | null;
  armada?: string;
  hari?: string;
  jeda_jumat?: string;
  berangkat_pertama?: { dari_nongsa: string; dari_punggur: string };
  jumlah_halte_sumber?: JumlahHalte;
  sumber_url?: string[];
  dari_tabel?: Record<string, string>;
};

export type ItemPola =
  | {
      jenis: "halte";
      nama_di_sumber: string;
      urut_di_daftar: number;
      halte_id: string;
    }
  | { jenis: "gap"; catatan?: string };

export type Pola = {
  id: string;
  koridor: string;
  arah: string;
  sumber: string;
  jumlah_halte_sumber: JumlahHalte | null;
  halte: ItemPola[];
  status_data: string | null;
};

export type Halte = {
  id: string;
  nama: string;
  kelompok: string;
  koridor: string[];
  kecamatan: string | null;
  lat: number | null;
  lng: number | null;
  status_koordinat: "terverifikasi" | "perlu_cek_ulang" | "perlu_diisi_user";
  catatan_koordinat?: string | null;
  catatan_urutan?: Record<string, string> | null;
};

export const KORIDOR = koridorRaw.koridor as unknown as Koridor[];
export const POLA = halteRaw.pola as unknown as Pola[];
export const HALTE = halteRaw.halte as unknown as Halte[];
export const TRANSIT = halteRaw.halte_transit as { halte: string; koridor: string; fungsi: string }[];
export const INFO = infoRaw;
export const VERSI_DATA = koridorRaw.meta.versi;

export const TEKS_TANGGAL_DATA = "per 4 Nov 2026";

export const slugKoridor = (id: string) => id.toLowerCase();
export const koridorDariSlug = (slug: string) => KORIDOR.find((k) => slugKoridor(k.id) === slug);

const halteId = new Map(HALTE.map((h) => [h.id, h]));
export const cariHalte = (id: string) => halteId.get(id);

// ---------- Warna ----------

function luminan(hex: string) {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function kontras(a: string, b: string) {
  const [x, y] = [luminan(a), luminan(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

function campurPutih(hex: string, t: number) {
  const n = hex.replace("#", "");
  const kanal = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16);
    return Math.round(c + (255 - c) * t)
      .toString(16)
      .padStart(2, "0");
  });
  return `#${kanal.join("")}`;
}

export const KERTAS_MALAM = "#0F1B2A";

/**
 * Varian malam warna koridor. Laporan 10 tidak menyediakannya (K1 hanya 2,03:1 terhadap #0F1B2A), jadi warna
 * asli dicampur putih secukupnya sampai kontras grafis 3:1 tercapai. Warna yang sudah cukup tidak diubah.
 */
export function warnaMalam(hex: string): string {
  for (let t = 0; t <= 1; t += 0.05) {
    const w = t === 0 ? hex : campurPutih(hex, t);
    if (kontras(w, KERTAS_MALAM) >= 3) return w;
  }
  return "#ffffff";
}

// ---------- Nama halte ----------

const anggotaKelompok = new Map<string, Halte[]>();
for (const h of HALTE) anggotaKelompok.set(h.kelompok, [...(anggotaKelompok.get(h.kelompok) ?? []), h]);

/** Sisi A/B digabung menjadi satu nama (brief 10). "Botania 2" tetap, karena tidak punya pasangan. */
export function namaKelompok(kelompok: string): string {
  const anggota = anggotaKelompok.get(kelompok) ?? [];
  const bersih = anggota.map((h) => {
    const t = h.nama.replace(/\s*\((A\/B|A\/2|A|B)\)$/, "").replace(/\s+[AB]$/, "");
    return anggota.length > 1 ? t.replace(/\s+2$/, "") : t;
  });
  return bersih.sort((a, b) => b.length - a.length)[0] ?? kelompok;
}

export const kelompokDariHalte = (id: string) => halteId.get(id)?.kelompok ?? id;

export function koridorDiKelompok(kelompok: string): string[] {
  const hasil = new Set((anggotaKelompok.get(kelompok) ?? []).flatMap((h) => h.koridor));
  return KORIDOR.map((k) => k.id).filter((id) => hasil.has(id));
}

// ---------- Teks koridor ----------

export const teksJam = (k: Koridor) => (k.jam ? `${k.jam.replace("-", "–")} WIB` : null);

export function teksHeadway(k: Koridor): { teks: string; perluCek: boolean } {
  if (k.headway_menit) {
    return {
      teks: `pagi sibuk ${k.headway_menit.pagi_sibuk} menit, siang sampai sore ${k.headway_menit.siang_sore} menit`,
      perluCek: false,
    };
  }
  const t = k.dari_tabel?.headway ?? "";
  if (/Moovit lama: 60/.test(t)) return { teks: "±60 menit menurut jadwal Moovit lama", perluCek: true };
  if (/Moovit lama/.test(t)) return { teks: "±20–35 menit menurut jadwal Moovit lama", perluCek: true };
  if (/jarang/.test(t)) return { teks: "jarang, 1 sampai 3 bus", perluCek: false };
  return { teks: "belum diketahui", perluCek: false };
}

export function teksJumlahHalte(k: Koridor): { teks: string; perluCek: boolean } | null {
  const j = k.jumlah_halte_sumber;
  if (j === undefined) return null;
  if (typeof j === "number") return { teks: `${j} halte menurut sumber`, perluCek: false };
  if (Array.isArray(j.nilai)) return { teks: `${j.nilai.join(" atau ")} halte, sumber berbeda`, perluCek: true };
  return { teks: `${j.nilai} halte${j.catatan ? `, ${j.catatan}` : ""}`, perluCek: false };
}

/** Angka total halte kalau tunggal. Bentuk {nilai:[41,65]} tidak bisa dipakai menghitung. */
export function totalHalte(j: JumlahHalte | null | undefined): number | null {
  if (typeof j === "number") return j;
  if (j && typeof j.nilai === "number") return j.nilai;
  return null;
}

export function lencanaKoridor(k: Koridor): { teks: string; nada?: "ok" | "caution" }[] {
  if (k.status === "rencana") return [{ teks: "rencana, belum beroperasi", nada: "caution" }];
  const hasil: { teks: string; nada?: "ok" | "caution" }[] = [{ teks: "sumber sekunder" }];
  const s = k.dari_tabel?.status_data ?? "";
  if (/^Jam terverifikasi/.test(s)) hasil.push({ teks: "jam dari berita", nada: "ok" });
  if (/Jumlah halte bertentangan/.test(s)) hasil.push({ teks: "jumlah halte bertentangan", nada: "caution" });
  if (/bandara perlu_cek_ulang/.test(s)) hasil.push({ teks: "urutan halte bandara perlu cek ulang", nada: "caution" });
  if (/Penomoran/.test(s)) hasil.push({ teks: "penomoran sempat tumpang tindih", nada: "caution" });
  return hasil;
}

/** Jeda Jumat: hanya dari jadwal Moovit lama, belum dikonfirmasi (koridor.json, jeda_jumat perlu_cek_ulang). */
export const JEDA_JUMAT: Record<string, string> = {
  K1: "Jadwal Moovit lama dari Batam Center melompat dari 10.55 ke 13.20 tiap Jumat. Dugaan jeda salat Jumat, belum dikonfirmasi.",
  K3: "Jadwal Moovit lama dari Jodoh melompat dari 11.10 ke 13.15 tiap Jumat. Dugaan jeda salat Jumat, belum dikonfirmasi.",
};

export const CATATAN_KORIDOR: Record<string, string> = {
  K7: "Mulai beroperasi lewat bandara 2 Juli 2026. Halte bandara ada di area pintu kedatangan. Bandara ke Batam Centre sekitar 30 menit. Tidak ada tarif tambahan ke bandara. Armada 5 bus dan 1 cadangan.",
  K9: "Berangkat pertama dari Nongsa 06:00, dari Punggur 06:40.",
};

/** Catatan arah per pola, ditulis ulang. Kolom pola.catatan memuat instruksi penyusun. */
const CATATAN_POLA: Record<string, string> = {
  K1_balik: "Arah balik lewat jalan berbeda: Green Land, Yos Sudarso, Cipta Puri, Sei Harapan.",
  K2_ke_tanjung_uncang: "Arah sebaliknya diawali Hidayatullah A menurut Moovit.",
  K3_balik:
    "Arah balik berbeda dari arah pergi: lewat Top 100 Jodoh, DC Mall SW, Pasar Induk, Windsor, Vihara, Penuin.",
  K4_ke_sekupang: "Daftar ringkas. Versi 2022 juga menyebut RSBP sebelum Sekupang.",
  K5_ke_jodoh_moovit: "Daftar Moovit, kemungkinan usang. Hanya untuk cek silang.",
  K5_ke_batam_center_moovit_ujung:
    "Daftar Moovit, kemungkinan usang. Hanya ujung rute, bagian awalnya tidak tercantum.",
  K7_pergi:
    "Polda Kepri, Bandoeng Resto, Citra Mas, dan Kampung Mangga juga dilayani K9. Posisi halte bandara di urutan perlu dicek ulang.",
  K8_ke_jodoh: "Daftar sangat ringkas.",
  K9_pergi: "Enam halte pertama sama dengan K8. Ujung di Nongsa tidak tercantum.",
};

const LABEL_ARAH: Record<string, string> = {
  K1_balik: "Batam Centre → Sekupang (sebagian)",
  K5_ke_batam_center: "Jodoh → Batam Centre",
  K5_ke_jodoh_moovit: "Batam Centre → Jodoh (Moovit)",
  K5_ke_batam_center_moovit_ujung: "Ujung arah Batam Centre (Moovit)",
};

// ---------- Strip map ----------

export type BarisStrip =
  | {
      jenis: "halte";
      kunci: string;
      nama: string;
      kelompok: string;
      lokasi: "pasti" | "perkiraan" | "belum";
      /** Koridor lain di halte ini. */
      transit: string[];
      catatan: string | null;
      ujung: boolean;
    }
  | { jenis: "gap"; kunci: string; label: string };

export type ArahStrip = {
  id: string;
  label: string;
  sumber: string;
  catatan: string | null;
  tercantum: string;
  perluCek: boolean;
  baris: BarisStrip[];
};

/** Jumlah halte yang tidak tercantum, hanya bila bisa dihitung: total tunggal dan persis satu gap. */
export function hitungGap(pola: Pola, total?: JumlahHalte | null): number | null {
  const gap = pola.halte.filter((h) => h.jenis === "gap").length;
  const t = totalHalte(pola.jumlah_halte_sumber ?? total);
  if (gap !== 1 || t === null) return null;
  const sisa = t - (pola.halte.length - gap);
  return sisa > 0 ? sisa : null;
}

export const labelGap = (n: number | null) =>
  n === null ? "halte tidak tercantum di sumber" : `±${n} halte tidak tercantum di sumber`;

export function arahStrip(pola: Pola): ArahStrip {
  const n = hitungGap(pola);
  const halteSaja = pola.halte.filter((h) => h.jenis === "halte");
  const total = totalHalte(pola.jumlah_halte_sumber);
  const baris: BarisStrip[] = pola.halte.map((item, i) => {
    if (item.jenis === "gap") return { jenis: "gap", kunci: `gap-${i}`, label: labelGap(n) };
    const h = halteId.get(item.halte_id);
    const kelompok = h?.kelompok ?? item.halte_id;
    return {
      jenis: "halte",
      kunci: `${item.halte_id}-${i}`,
      nama: namaKelompok(kelompok),
      kelompok,
      lokasi:
        h?.status_koordinat === "terverifikasi" && h.lat !== null
          ? "pasti"
          : h?.lat !== null && h?.lat !== undefined
            ? "perkiraan"
            : "belum",
      transit: koridorDiKelompok(kelompok).filter((k) => k !== pola.koridor),
      catatan: h?.catatan_urutan?.[pola.id]?.replace(/perlu_cek_ulang/g, "perlu cek ulang") ?? null,
      ujung: item === halteSaja[0] || item === halteSaja[halteSaja.length - 1],
    };
  });
  return {
    id: pola.id,
    label: LABEL_ARAH[pola.id] ?? pola.arah,
    sumber: pola.sumber.split(";")[0].trim(),
    catatan: CATATAN_POLA[pola.id] ?? null,
    tercantum:
      total !== null && total > halteSaja.length
        ? `${halteSaja.length} dari ${total} halte tercantum di sumber.`
        : `${halteSaja.length} halte tercantum di sumber.`,
    perluCek: pola.status_data === "perlu_cek_ulang",
    baris,
  };
}

export const polaKoridor = (id: string) => POLA.filter((p) => p.koridor === id);

// ---------- Titik transit dan konektivitas ----------

const memuatKoridor = (teks: string, id: string) => new RegExp(`\\b${id}\\b`).test(teks);

export const transitKoridor = (id: string) =>
  TRANSIT.filter((t) => memuatKoridor(t.koridor, id)).map((t) => ({
    ...t,
    fungsi: t.fungsi.replace(/,?\s*butuh line-offset/i, ""),
  }));

/** Dihitung dari halte: koridor lain yang berbagi halte dengan koridor ini, di daftar yang tercantum. */
export function pindahKoridor(id: string): { koridor: string; halte: string[] }[] {
  const milik = new Set(
    polaKoridor(id).flatMap((p) =>
      p.halte.flatMap((h) => (h.jenis === "halte" ? [kelompokDariHalte(h.halte_id)] : [])),
    ),
  );
  const hasil: { koridor: string; halte: string[] }[] = [];
  for (const k of KORIDOR) {
    if (k.id === id || k.status !== "aktif") continue;
    const sama = [...milik].filter((g) => koridorDiKelompok(g).includes(k.id));
    if (sama.length) hasil.push({ koridor: k.id, halte: sama.map(namaKelompok) });
  }
  return hasil;
}

export function kataKonektivitas(status: string): { teks: string; nada?: "caution" } {
  if (status.startsWith("perlu_cek_ulang")) return { teks: "perlu cek ulang", nada: "caution" };
  if (status.startsWith("terverifikasi")) return { teks: "lokasi deskriptif, koordinat belum ada" };
  return { teks: status };
}

export const konektivitasKoridor = (id: string) => INFO.konektivitas.filter((k) => memuatKoridor(k.koridor, id));

// ---------- Titik di peta ----------

export type TitikJalan = {
  id: string;
  nama: string;
  jenis: "hub" | "halte" | "terminal";
  lat: number;
  lng: number;
  perkiraan: boolean;
  catatan: string;
  rincian: string;
  href: string;
};

const CATATAN_HUB: Record<string, string> = {
  "tp-batam-center": "Titik terminal feri, bukan halte. Halte sekitar 240 m dari sini.",
  "tp-sekupang": "Titik pelabuhan, bukan halte.",
  "tp-punggur": "Titik Pelabuhan Telaga Punggur, bukan halte. Sumber lain memberi titik berbeda.",
};

export const adalahHub = (h: Pick<Halte, "id">) => h.id.startsWith("tp-");

/**
 * Tahap 1 (brief 10): hanya hub, bergaya perkiraan, karena koordinatnya titik landmark. Halte lain hanya muncul
 * setelah koordinatnya terverifikasi lewat tools/import_koordinat.py. Tanpa koordinat tidak pernah dirender.
 */
export function titikTransDiPeta(halte: Halte[] = HALTE): TitikJalan[] {
  return halte.flatMap((h) => {
    if (h.lat === null || h.lng === null) return [];
    const pasti = h.status_koordinat === "terverifikasi";
    if (!pasti && !adalahHub(h)) return [];
    return [
      {
        id: h.id,
        nama: namaKelompok(h.kelompok),
        jenis: adalahHub(h) ? ("hub" as const) : ("halte" as const),
        lat: h.lat,
        lng: h.lng,
        perkiraan: !pasti,
        catatan: pasti ? "Koordinat sudah dicek." : (CATATAN_HUB[h.id] ?? "Titik landmark, bukan posisi halte."),
        rincian: `Trans Batam ${h.koridor.join(", ")}`,
        href: adalahHub(h) ? `/info/tempat/${h.id}` : `/jalan/trans-batam/${slugKoridor(h.koridor[0])}`,
      },
    ];
  });
}

export const HUB_TANPA_TITIK = HALTE.filter((h) => adalahHub(h) && h.lat === null).map((h) => ({
  id: h.id,
  nama: h.nama,
  koridor: h.koridor,
}));

export const jumlahHalteBelumDiisi = (halte: Halte[] = HALTE) => halte.filter((h) => h.lat === null).length;
