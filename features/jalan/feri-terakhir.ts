// "Feri terakhir hari ini" (brief 14). Modul murni: tanpa React, tanpa fetch, jam selalu dari argumen.
//
// Aturan dasar: jam keberangkatan adalah waktu lokal pelabuhan asal. Jam dan zona tidak pernah disatukan.
// `now` dibandingkan di zona entri, jadi pukul 23:30 WIB sudah hari berikutnya untuk jadwal dari Singapura.

export type Zona = "Asia/Jakarta" | "Asia/Singapore" | "Asia/Kuala_Lumpur";

export const AMBANG_DATA_LAMA_HARI = 60;

const MENIT_UTC: Record<Zona, number> = { "Asia/Jakarta": 420, "Asia/Singapore": 480, "Asia/Kuala_Lumpur": 480 };
// Penulisan zona di tampilan mengikuti pedoman 2.6: "21.40 waktu Singapura".
const SINGKATAN: Record<Zona, string> = {
  "Asia/Jakarta": "WIB",
  "Asia/Singapore": "waktu Singapura",
  "Asia/Kuala_Lumpur": "waktu Malaysia",
};

export const singkatanZona = (z: Zona) => SINGKATAN[z];
export const zonaSah = (z: string | null | undefined): Zona | null => (z && z in MENIT_UTC ? (z as Zona) : null);

/** Jam mesin "20:30" menjadi jam tampilan "20.30" (pedoman 2.6). */
export const jamTitik = (t: string) => t.replace(/\b(\d{1,2}):(\d{2})\b/g, "$1.$2");

export const kapital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Tautan jadwal yang boleh tampil. Situs pemerintah tidak ditautkan (pedoman 2.9). */
export const tautanPublik = (url: string | null | undefined) => (!url || /\.go\.id(\/|$)/i.test(url) ? null : url);

/** "tiap ±30 menit" menjadi "sekitar 30 menit sekali". */
export const teksInterval = (t: string) => t.replace(/tiap\s*±?\s*(\d+)\s*menit/i, "sekitar $1 menit sekali");

/** Bentuk baris di data/feri/jadwal.json. */
export type JadwalMentah = {
  rute_id: string;
  arah: string;
  jam_berangkat: string[];
  hari?: string | null;
  tanggal_data?: string | null;
  operator?: string | null;
  zona_waktu?: string | null;
  trips?: { jam: string; keterangan?: string | null }[];
  per_kapal?: { kapal: string; dari: string; jam_berangkat: string[] }[];
  jam_operasi?: string | null;
  interval?: string | null;
  catatan?: string | null;
  status_data?: string | null;
};

/** Bentuk baris di data/feri/rute.json (rute dan rute_tambahan). */
export type RuteMentah = {
  id: string;
  asal_id: string | null;
  asal_ids?: string[];
  tujuan: string;
  operator: string[];
  jenis: string | null;
  link_jadwal_resmi?: string | null;
};

export type JenisJadwal =
  | "jam" // jam berangkat yang bisa dibandingkan dengan sekarang
  | "operasi" // hanya jendela operasi: tpg-tpi dan tpg-tgu
  | "bukan_harian" // satu contoh bertanggal: Pelni
  | "hari_tertentu" // "2x seminggu", "dua hari sekali": tidak bisa dipastikan hari ini berlayar
  | "teks" // layanan tanpa jam tetap: pompong Sekupang-Belakang Padang
  | "zona_belum_jelas" // zona_waktu null: jam ada, tetapi tidak boleh dipakai di widget
  | "belum_tersedia";

export type Trip = { jam: string; hari: number[] | null; catatan: string | null; perluCek: boolean };

export type EntriFeri = {
  ruteId: string;
  jenisRute: string | null;
  arah: "dari_batam" | "ke_batam";
  asal: string;
  tujuan: string;
  /** Id terminal asal di data/feri/terminal.json. */
  asalIds: string[];
  operator: string | null;
  zona: Zona | null;
  jenisJadwal: JenisJadwal;
  trips: Trip[];
  operasi: { buka: string; tutup: string; interval: string | null } | null;
  /** Keterangan hari untuk warga, sudah tanpa istilah penyusun. */
  hariTeks: string | null;
  tanggalData: string | null;
  perluCek: boolean;
  contoh: boolean;
  terganggu: boolean;
  adaJadwalUsang: boolean;
  link: string | null;
};

// ---------- Hari ----------

const HARI: Record<string, number> = { min: 0, sen: 1, sel: 2, rab: 3, kam: 4, jum: 5, sab: 6 };
const POLA_RENTANG = /\b(Min|Sen|Sel|Rab|Kam|Jum|Sab)[a-z]*\s*[–—-]\s*(Min|Sen|Sel|Rab|Kam|Jum|Sab)[a-z]*\b/i;
const POLA_TUNGGAL = /^(Minggu|Senin|Selasa|Rabu|Kamis|Jumat|Sabtu)$/i;

/** "Kam–Min" menjadi [4,5,6,0], "Sab–Sen" menjadi [6,0,1], "Minggu" menjadi [0]. Selain itu null. */
export function bacaHari(teks: string | null | undefined): number[] | null {
  if (!teks) return null;
  const t = teks.trim();
  const r = t.match(POLA_RENTANG);
  if (r) {
    const akhir = HARI[r[2].toLowerCase()];
    const hasil = [HARI[r[1].toLowerCase()]];
    while (hasil[hasil.length - 1] !== akhir) hasil.push((hasil[hasil.length - 1] + 1) % 7);
    return hasil;
  }
  const s = t.match(POLA_TUNGGAL);
  return s ? [HARI[s[1].slice(0, 3).toLowerCase()]] : null;
}

// ---------- Normalisasi data mentah ----------

const ASAL_LUAR_BATAM = /^(HarbourFront|Tanah Merah|Stulang|Puteri Harbour|Tanjung Uban)/i;
const PERLU_CEK = /perlu_cek/i;

export function pecahArah(arah: string): { asal: string; tujuan: string; dalamKurung: string | null } {
  if (arah.includes("<->")) {
    const [a, b] = arah.split("<->").map((s) => s.trim());
    return { asal: a, tujuan: b ?? "", dalamKurung: null };
  }
  const [kiri, kanan = ""] = arah.split("->").map((s) => s.trim());
  const kurung = kanan.match(/\(([^()]*)\)\s*$/);
  return {
    asal: kiri,
    tujuan: kanan
      .replace(/\s*\([^()]*\)\s*$/, "")
      .replace(/\s+[–—-]\s+/g, "—")
      .trim(),
    dalamKurung: kurung?.[1] ?? null,
  };
}

const BUKAN_OPERATOR = /^(WIB|SGT|MYT|contoh|jadwal lama|pompong reguler|speedboat)$/i;

const gabungOperator = (r: RuteMentah) =>
  r.operator.length ? r.operator.join(", ").replace(/,\s*lainnya$/, " dan lainnya") : null;

export function operatorEntri(j: JadwalMentah, r: RuteMentah): string | null {
  if (j.per_kapal?.length) return "ASDP";
  if (j.operator && j.operator !== "RoRo") return j.operator;
  const dariArah = pecahArah(j.arah).dalamKurung?.split(",")[0].trim();
  if (dariArah && !BUKAN_OPERATOR.test(dariArah) && dariArah !== "RoRo") return dariArah;
  return gabungOperator(r);
}

function bacaTrip(jam: string, keterangan: string | null | undefined, hariEntri: number[] | null): Trip {
  let hari = hariEntri;
  let perluCek = false;
  const catatan: string[] = [];
  for (const potong of (keterangan ?? "").split(",").map((s) => s.trim())) {
    if (!potong) continue;
    const h = bacaHari(potong);
    if (h) hari = h;
    else if (PERLU_CEK.test(potong)) perluCek = true;
    else catatan.push(`dioperasikan ${potong}`);
  }
  return { jam, hari, catatan: catatan.join(", ") || null, perluCek };
}

function tripsEntri(j: JadwalMentah): Trip[] {
  const hariEntri = bacaHari(j.hari);
  if (j.per_kapal?.length) {
    const semua = j.per_kapal.flatMap((k) =>
      k.jam_berangkat.map((jam) => ({ jam, hari: hariEntri, catatan: k.kapal, perluCek: false })),
    );
    return semua.sort((a, b) => keMenit(a.jam) - keMenit(b.jam));
  }
  if (j.trips?.length) return j.trips.map((t) => bacaTrip(t.jam, t.keterangan, hariEntri));
  return j.jam_berangkat.map((jam) => bacaTrip(jam, null, hariEntri));
}

/** Jendela operasi: kolom jam_operasi, atau teks "operasi 07:30-17:30 tiap ±30 menit" di kolom hari (tpg-tpi). */
function jendelaOperasi(j: JadwalMentah): EntriFeri["operasi"] {
  const sumber = j.jam_operasi ?? j.hari?.match(/operasi\s+(\d{2}:\d{2}\s*[–—-]\s*\d{2}:\d{2})/i)?.[1];
  const m = sumber?.match(/(\d{2}:\d{2})\s*[–—-]\s*(\d{2}:\d{2})/);
  if (!m) return null;
  return { buka: m[1], tutup: m[2], interval: j.interval ?? j.hari?.match(/tiap\s+±?\d+\s*menit/i)?.[0] ?? null };
}

const NAMA_HARI: Record<string, string> = {
  min: "Minggu",
  sen: "Senin",
  sel: "Selasa",
  rab: "Rabu",
  kam: "Kamis",
  jum: "Jumat",
  sab: "Sabtu",
};
const NAMA_BULAN: Record<string, string> = {
  Jan: "Januari",
  Feb: "Februari",
  Mar: "Maret",
  Apr: "April",
  Mei: "Mei",
  Jun: "Juni",
  Jul: "Juli",
  Agu: "Agustus",
  Sep: "September",
  Okt: "Oktober",
  Nov: "November",
  Des: "Desember",
};
const RENTANG_BULAN =
  /\b(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)\s*[–—-]\s*(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)\b/g;
const TANGGAL_PENDEK = /\b(\d{1,2}) (Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des) (\d{4})\b/g;
const RENTANG_HARI = new RegExp(POLA_RENTANG.source, "gi");

/**
 * Teks hari untuk pembaca: tanpa istilah penyusun, hari dan bulan ditulis penuh, jam bertitik. Kolom mentahnya tetap
 * dibaca mesin (bacaHari, jendelaOperasi), jadi perapian hanya di sini.
 */
export function hariPublik(hari: string | null | undefined, zona: Zona | null = null): string | null {
  if (!hari) return null;
  const z = zona ? ` ${SINGKATAN[zona]}` : "";
  const t = hari
    .replace(/\s*\(tanda tidak terbaca[^)]*\)/i, "")
    .replace(/\s*\(?perlu_cek_ulang\)?/gi, "")
    .replace(/\s*\(contoh; sekitar mingguan\)/i, " (sekitar mingguan)")
    .replace(/^data\s/i, "contoh ")
    .replace(
      /operasi\s+(\d{2}:\d{2})\s*[–—-]\s*(\d{2}:\d{2})\s+tiap\s+±?(\d+)\s*menit/i,
      (_, a: string, b: string, n: string) => `operasi ${a}—${b}${z}, sekitar ${n} menit sekali`,
    )
    .replace(RENTANG_BULAN, (_, a: string, b: string) => `${NAMA_BULAN[a]}—${NAMA_BULAN[b]}`)
    .replace(TANGGAL_PENDEK, (_, h: string, b: string, y: string) => `${h} ${NAMA_BULAN[b]} ${y}`)
    .replace(/\b(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu) (\d{1,2} )/g, "$1, $2")
    .replace(RENTANG_HARI, (_, a: string, b: string) => `${NAMA_HARI[a.toLowerCase()]}—${NAMA_HARI[b.toLowerCase()]}`)
    .replace(/\bakhir pekan\/libur\b/, "akhir pekan atau hari libur")
    .replace(/\b2x seminggu\b/, "dua kali seminggu")
    .replace(/\btrip\b/g, "keberangkatan")
    .replace(/±\s*/g, "sekitar ");
  return jamTitik(t).trim() || null;
}

function jenisDari(j: JadwalMentah, zona: Zona | null): JenisJadwal {
  const adaJam = j.jam_berangkat.length > 0;
  if (zona && jendelaOperasi(j)) return "operasi";
  if (!adaJam) return !zona && j.hari ? "teks" : "belum_tersedia";
  if (!zona) return "zona_belum_jelas";
  if (/mingguan/i.test(j.hari ?? "")) return "bukan_harian";
  if (/x seminggu|hari sekali/i.test(j.hari ?? "")) return "hari_tertentu";
  return "jam";
}

/**
 * Data mentah menjadi entri siap hitung: satu baris per rute + arah + operator. Jadwal berstatus usang tidak
 * pernah menjadi "terakhir" (jebakan skp-tbk 16:15). Rute yang tidak punya baris jadwal tetap muncul dengan
 * jenis belum_tersedia, supaya widget bisa jujur menulis "jadwal belum tersedia".
 */
export function normalisasi(
  jadwal: JadwalMentah[],
  rute: RuteMentah[],
  namaTerminal: Record<string, string> = {},
): EntriFeri[] {
  const hasil: EntriFeri[] = [];
  for (const r of rute) {
    const asalIds = r.asal_ids ?? (r.asal_id ? [r.asal_id] : []);
    const namaAsal = asalIds.map((id) => namaTerminal[id] ?? id).join(" / ");
    const milik = jadwal.filter((j) => j.rute_id === r.id);
    const aktif = milik.filter((j) => j.status_data !== "usang");

    const kosong = (usang: boolean, j?: JadwalMentah): EntriFeri => ({
      ruteId: r.id,
      jenisRute: r.jenis,
      arah: "dari_batam",
      asal: namaAsal,
      tujuan: r.tujuan,
      asalIds,
      operator: gabungOperator(r),
      zona: null,
      jenisJadwal: "belum_tersedia",
      trips: [],
      operasi: null,
      hariTeks: null,
      tanggalData: j?.tanggal_data ?? null,
      perluCek: j ? j.status_data === "perlu_cek_ulang" : false,
      contoh: false,
      terganggu: false,
      adaJadwalUsang: usang,
      link: tautanPublik(r.link_jadwal_resmi),
    });

    if (!aktif.length) {
      hasil.push(kosong(milik.length > 0));
      continue;
    }

    for (const j of aktif) {
      const zona = zonaSah(j.zona_waktu);
      const jenisJadwal = jenisDari(j, zona);
      if (jenisJadwal === "belum_tersedia") {
        hasil.push(kosong(false, j));
        continue;
      }
      const { asal, tujuan: tujuanArah, dalamKurung } = pecahArah(j.arah);
      // Dua rute ke Tanjung Uban hanya beda kapal.
      const kapal = dalamKurung?.match(/speedboat|RoRo/i)?.[0];
      const tujuan = kapal ? `${tujuanArah} (${kapal === "RoRo" ? kapal : "kapal cepat"})` : tujuanArah;
      const operator = operatorEntri(j, r);
      const trips = tripsEntri(j);
      hasil.push({
        ruteId: r.id,
        jenisRute: r.jenis,
        arah: ASAL_LUAR_BATAM.test(asal) ? "ke_batam" : "dari_batam",
        asal,
        tujuan,
        asalIds,
        operator,
        zona,
        jenisJadwal,
        trips,
        operasi: jendelaOperasi(j),
        hariTeks: hariPublik(j.hari, zona),
        tanggalData: j.tanggal_data ?? null,
        // Majestic: tanda hari di PDF tidak terbaca, jadi semua jamnya ditandai (jebakan g).
        perluCek:
          /majestic/i.test(operator ?? "") ||
          j.status_data === "perlu_cek_ulang" ||
          PERLU_CEK.test(j.hari ?? "") ||
          PERLU_CEK.test(j.catatan ?? ""),
        contoh: /contoh|^data\s/i.test(j.hari ?? ""),
        terganggu: /suspended/i.test(j.catatan ?? ""),
        adaJadwalUsang: milik.length > aktif.length,
        link: tautanPublik(r.link_jadwal_resmi),
      });
    }
  }
  return hasil;
}

// ---------- Waktu ----------

const FORMAT = new Map<Zona, Intl.DateTimeFormat>();
function formatZona(zona: Zona) {
  let f = FORMAT.get(zona);
  if (!f) {
    f = new Intl.DateTimeFormat("en-CA", {
      timeZone: zona,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    });
    FORMAT.set(zona, f);
  }
  return f;
}

const HARI_INGGRIS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Jam dinding di suatu zona: menit sejak tengah malam, hari (0 = Minggu), dan tanggal. */
export function waktuDiZona(now: Date, zona: Zona) {
  const p = Object.fromEntries(
    formatZona(zona)
      .formatToParts(now)
      .map((x) => [x.type, x.value]),
  );
  return {
    menit: Number(p.hour) * 60 + Number(p.minute),
    hari: HARI_INGGRIS[p.weekday],
    tanggal: `${p.year}-${p.month}-${p.day}`,
  };
}

export const keMenit = (jam: string) => {
  const [h, m] = jam.split(":").map(Number);
  return h * 60 + m;
};
const dariMenit = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

/** "21:40" SGT menjadi "20:40". Melewati tengah malam ditulis apa adanya: "00:30" SGT menjadi "23:30 kemarin". */
export function keWib(jam: string, zona: Zona): string {
  const n = keMenit(jam) - (MENIT_UTC[zona] - MENIT_UTC["Asia/Jakarta"]);
  return n < 0 ? `${dariMenit(n + 1440)} kemarin` : dariMenit(n);
}

/** Umur data dalam hari menurut tanggal Batam. "2026-05" dihitung dari awal bulan, supaya tidak terlalu yakin. */
export function umurData(tanggal: string | null, now: Date): number | null {
  const m = tanggal?.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (!m) return null;
  const kini = waktuDiZona(now, "Asia/Jakarta").tanggal;
  const [y, b, h] = kini.split("-").map(Number);
  const hariIni = Date.UTC(y, b - 1, h);
  const asal = Date.UTC(Number(m[1]), m[2] ? Number(m[2]) - 1 : 0, m[3] ? Number(m[3]) : 1);
  return Math.floor((hariIni - asal) / 86_400_000);
}

export const dataSudahLama = (tanggal: string | null, now: Date) => {
  const u = umurData(tanggal, now);
  return u === null || u > AMBANG_DATA_LAMA_HARI;
};

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
export function teksTanggal(t: string | null): string {
  const m = t?.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (!m) return "tanggal tidak tercatat";
  if (m[3]) return `${Number(m[3])} ${BULAN[Number(m[2]) - 1]} ${m[1]}`;
  if (m[2]) return `${BULAN[Number(m[2]) - 1]} ${m[1]}`;
  return m[1];
}

/** Satu baris di bawah rute untuk jadwal yang sudah lama atau masih diragukan (pedoman 3.6). */
export const catatanJadwalLama = (tanggal: string | null) =>
  tanggal ? `Jadwal per ${teksTanggal(tanggal)}. Tanyakan kepada operator.` : "Tanyakan jadwal kepada operator.";

// ---------- Perhitungan ----------

export type StatusFeri =
  | "masih_ada"
  | "sudah_lewat"
  | "tidak_hari_ini"
  | "hari_tertentu"
  | "bukan_harian"
  | "teks"
  | "zona_belum_jelas"
  | "belum_tersedia";

export type HasilFeri = EntriFeri & {
  status: StatusFeri;
  /** Jam terakhir yang berlaku hari ini, waktu lokal pelabuhan asal. */
  jam: string | null;
  /** Jam yang sama dalam WIB, hanya bila zona asal bukan WIB. */
  jamWib: string | null;
  /** Dari jendela operasi, bukan jam kapal: ditulis "±". */
  perkiraan: boolean;
  menitLagi: number | null;
  berikutnya: string | null;
  /** Keberangkatan paling awal besok, waktu lokal pelabuhan asal. */
  pertamaBesok: string | null;
  catatanTrip: string | null;
  dataLama: boolean;
};

function hitungPertamaBesok(e: EntriFeri, now: Date): string | null {
  if (e.jenisJadwal !== "jam" || !e.zona) return null;
  const besok = (waktuDiZona(now, e.zona).hari + 1) % 7;
  const jam = e.trips.filter((t) => !t.hari || t.hari.includes(besok)).map((t) => t.jam);
  return jam.sort((a, b) => keMenit(a) - keMenit(b))[0] ?? null;
}

export function hitungSatu(e: EntriFeri, now: Date): HasilFeri {
  const dasar = {
    ...e,
    jam: null,
    jamWib: null,
    perkiraan: false,
    menitLagi: null,
    berikutnya: null,
    pertamaBesok: hitungPertamaBesok(e, now),
    catatanTrip: null,
    dataLama: dataSudahLama(e.tanggalData, now),
  };
  if (e.jenisJadwal !== "jam" && e.jenisJadwal !== "operasi") {
    return { ...dasar, status: e.jenisJadwal };
  }
  const zona = e.zona as Zona;
  const kini = waktuDiZona(now, zona);
  const wib = (jam: string) => (zona === "Asia/Jakarta" ? null : keWib(jam, zona));

  if (e.jenisJadwal === "operasi" && e.operasi) {
    const tutup = e.operasi.tutup;
    const sisa = keMenit(tutup) - kini.menit;
    return {
      ...dasar,
      status: sisa >= 0 ? "masih_ada" : "sudah_lewat",
      jam: tutup,
      jamWib: wib(tutup),
      perkiraan: true,
      menitLagi: sisa >= 0 ? sisa : null,
    };
  }

  const hariIni = e.trips.filter((t) => !t.hari || t.hari.includes(kini.hari));
  if (!hariIni.length) return { ...dasar, status: "tidak_hari_ini" };
  const terakhir = hariIni.reduce((a, b) => (keMenit(b.jam) > keMenit(a.jam) ? b : a));
  const sisa = keMenit(terakhir.jam) - kini.menit;
  const berikut = hariIni
    .filter((t) => keMenit(t.jam) >= kini.menit)
    .sort((a, b) => keMenit(a.jam) - keMenit(b.jam))[0];
  return {
    ...dasar,
    status: sisa >= 0 ? "masih_ada" : "sudah_lewat",
    jam: terakhir.jam,
    jamWib: wib(terakhir.jam),
    menitLagi: sisa >= 0 ? sisa : null,
    berikutnya: berikut && berikut.jam !== terakhir.jam ? berikut.jam : null,
    catatanTrip: terakhir.catatan,
    perluCek: e.perluCek || terakhir.perluCek,
  };
}

export const hitungFeri = (entri: EntriFeri[], now: Date) => entri.map((e) => hitungSatu(e, now));

/** Baris dengan jam nyata dari terminal ini. Untuk detail tempat makan. */
export const dariTerminal = (hasil: HasilFeri[], terminalId: string) =>
  hasil.filter((h) => h.arah === "dari_batam" && h.asalIds.includes(terminalId));

export type KelompokRute = { ruteId: string; asal: string; tujuan: string; link: string | null; baris: HasilFeri[] };

/** Baris dikelompokkan per rute + asal, urutan rute dipertahankan. */
export function kelompokRute(hasil: HasilFeri[]): KelompokRute[] {
  const peta = new Map<string, KelompokRute>();
  for (const h of hasil) {
    const kunci = `${h.ruteId}|${h.asal}|${h.tujuan}`;
    const k = peta.get(kunci);
    if (k) k.baris.push(h);
    else peta.set(kunci, { ruteId: h.ruteId, asal: h.asal, tujuan: h.tujuan, link: h.link, baris: [h] });
  }
  return [...peta.values()];
}

/** Rute utama ke Singapura: dipakai widget ringkas dan kotak Hari Ini. */
export const keSingapura = (h: HasilFeri) => h.arah === "dari_batam" && /HarbourFront|Tanah Merah/i.test(h.tujuan);

export type BarisBerikutnya = {
  /** Rute pertama kelompok ini, untuk tautan ke tabel lengkap. */
  ruteId: string;
  asal: string;
  tujuan: string;
  operator: string[];
  /** Keberangkatan berikutnya hari ini, WIB, paling banyak n. Kosong bila sudah habis. */
  jam: string[];
  /** Keberangkatan pertama besok, WIB, hanya bila hari ini sudah habis. */
  besok: string | null;
  tanggalData: string | null;
};

const tanggalTertua = (daftar: (string | null)[]) =>
  daftar.reduce<string | null>((a, b) => (!b ? a : !a || b < a ? b : a), null);

/**
 * Keberangkatan berikutnya ke Singapura per pelabuhan asal dan tujuan, untuk beranda. Sama seperti kotak Hari Ini, hanya
 * jam yang tidak diragukan: jadwal perlu_cek, contoh, dan terganggu tidak dipakai. Jam dari Batam selalu WIB; baris
 * berzona lain tidak dipakai supaya jam tidak pernah salah zona. Kelompok yang tidak berlayar hari ini tidak tampil.
 */
export function keberangkatanBerikutnya(entri: EntriFeri[], now: Date, n = 3): BarisBerikutnya[] {
  const kini = waktuDiZona(now, "Asia/Jakarta");
  const besok = (kini.hari + 1) % 7;
  const kelompok = new Map<string, { baris: BarisBerikutnya; hariIni: string[]; jamBesok: string[] }>();
  for (const e of entri) {
    if (e.arah !== "dari_batam" || !/HarbourFront|Tanah Merah/i.test(e.tujuan)) continue;
    if (e.jenisJadwal !== "jam" || e.zona !== "Asia/Jakarta" || e.perluCek || e.contoh || e.terganggu) continue;
    const kunci = `${e.asal}|${e.tujuan}`;
    let k = kelompok.get(kunci);
    if (!k) {
      k = {
        baris: { ruteId: e.ruteId, asal: e.asal, tujuan: e.tujuan, operator: [], jam: [], besok: null, tanggalData: null },
        hariIni: [],
        jamBesok: [],
      };
      kelompok.set(kunci, k);
    }
    if (e.operator && !k.baris.operator.includes(e.operator)) k.baris.operator.push(e.operator);
    k.baris.tanggalData = tanggalTertua([k.baris.tanggalData, e.tanggalData]);
    for (const t of e.trips) {
      if (t.perluCek) continue;
      if (!t.hari || t.hari.includes(kini.hari)) k.hariIni.push(t.jam);
      if (!t.hari || t.hari.includes(besok)) k.jamBesok.push(t.jam);
    }
  }
  const urut = (jam: string[]) => [...new Set(jam)].sort((a, b) => keMenit(a) - keMenit(b));
  const hasil: BarisBerikutnya[] = [];
  for (const { baris, hariIni, jamBesok } of kelompok.values()) {
    if (!hariIni.length) continue;
    const sisa = urut(hariIni).filter((j) => keMenit(j) >= kini.menit);
    hasil.push({ ...baris, jam: sisa.slice(0, n), besok: sisa.length ? null : (urut(jamBesok)[0] ?? null) });
  }
  return hasil;
}

/** Tanggal data tertua di antara baris, untuk satu catatan di bawah modul. */
export const tanggalDataTertua = (baris: { tanggalData: string | null }[]) =>
  tanggalTertua(baris.map((b) => b.tanggalData));

export type RingkasFeri = { judul: string; rincian: string; adaDataLama: boolean };

const gabungDan = (daftar: string[]) =>
  daftar.length < 3 ? daftar.join(" dan ") : `${daftar.slice(0, -1).join(", ")}, dan ${daftar[daftar.length - 1]}`;

/**
 * Kalimat kotak Hari Ini, mengikuti templat Feri di pedoman 3.11. Hanya jam yang tidak diragukan, per terminal, supaya
 * kalimat satu baris tidak bersandar pada angka yang belum pasti. Rincian lengkap ada di widget.
 */
export function ringkasHariIni(hasil: HasilFeri[]): RingkasFeri {
  const sahih = hasil.filter((h) => keSingapura(h) && h.jenisJadwal === "jam" && !h.perluCek);
  const pasti = sahih.filter((h) => h.jam);
  if (!pasti.length) {
    return {
      judul: "Jadwal feri ke Singapura belum tersedia.",
      rincian: "Tanyakan jadwal kepada operator.",
      adaDataLama: false,
    };
  }
  const perAsal = new Map<string, HasilFeri>();
  for (const h of pasti) {
    const lama = perAsal.get(h.asal);
    if (!lama || keMenit(h.jam as string) > keMenit(lama.jam as string)) perAsal.set(h.asal, h);
  }
  const daftar = [...perAsal.values()].sort((a, b) => keMenit(b.jam as string) - keMenit(a.jam as string));
  const masih = daftar.filter((h) => h.status === "masih_ada");
  const barisLama = daftar.find((h) => h.dataLama);
  const catatanLama = barisLama ? catatanJadwalLama(barisLama.tanggalData) : "";

  if (!masih.length) {
    const besok = sahih
      .flatMap((h) => (h.pertamaBesok ? [h.pertamaBesok] : []))
      .sort((a, b) => keMenit(a) - keMenit(b))[0];
    return {
      judul: "Tidak ada lagi keberangkatan ke Singapura hari ini.",
      rincian: [besok ? `Besok mulai pukul ${jamTitik(besok)} WIB.` : "", catatanLama]
        .filter(Boolean)
        .join(" "),
      adaDataLama: !!barisLama,
    };
  }

  const acuan = masih[0].jam as string;
  const sejam = masih.filter((h) => h.jam === acuan).map((h) => h.asal);
  const lain = daftar.filter((h) => !sejam.includes(h.asal)).map((h) => `${h.asal} ${jamTitik(h.jam as string)} WIB`);
  return {
    judul: `Feri terakhir ke Singapura hari ini: pukul ${jamTitik(acuan)} WIB dari ${gabungDan(sejam)}.`,
    rincian: [lain.length ? `Terminal lain: ${lain.join(", ")}.` : "", catatanLama].filter(Boolean).join(" "),
    adaDataLama: !!barisLama,
  };
}

/** Isi baris angka Hari Ini: jam feri terakhir ke Singapura yang masih ada, atau jam pertama besok bila sudah habis. */
export function barisFeriSingapura(hasil: HasilFeri[]): { jam: string | null; terminal: string; besok: string | null } | null {
  const sahih = hasil.filter((h) => keSingapura(h) && h.jenisJadwal === "jam" && !h.perluCek);
  const masih = sahih.filter((h) => h.jam && h.status === "masih_ada").sort((a, b) => keMenit(b.jam as string) - keMenit(a.jam as string));
  if (!sahih.some((h) => h.jam)) return null;
  if (masih.length) {
    const acuan = masih[0].jam as string;
    const terminal = [...new Set(masih.filter((h) => h.jam === acuan).map((h) => h.asal))];
    return { jam: jamTitik(acuan), terminal: gabungDan(terminal), besok: null };
  }
  const besok = sahih.flatMap((h) => (h.pertamaBesok ? [h.pertamaBesok] : [])).sort((a, b) => keMenit(a) - keMenit(b))[0];
  return { jam: null, terminal: "", besok: besok ? jamTitik(besok) : null };
}

const daftarJam = (h: HasilFeri) => {
  const jam = h.trips.map((t) => jamTitik(t.jam)).join(", ");
  return h.zona ? `${jam} ${singkatanZona(h.zona)}` : jam;
};

/** Kalimat status satu baris, selalu kata, tidak hanya warna. */
export function teksStatus(h: HasilFeri): string {
  switch (h.status) {
    case "masih_ada":
      return h.menitLagi === 0 ? "Berangkat sekarang" : "Masih ada";
    case "sudah_lewat":
      return "Sudah lewat";
    case "tidak_hari_ini":
      return `Tidak berlayar hari ini${h.hariTeks ? ` (${h.hariTeks})` : ""}`;
    case "hari_tertentu":
      return `Pukul ${daftarJam(h)}, ${h.hariTeks ?? "hari tertentu"}. Belum tentu hari ini.`;
    case "bukan_harian":
      return `Bukan jadwal harian. Contoh: ${h.hariTeks ?? ""}, pukul ${daftarJam(h)}.`;
    case "teks":
      return h.hariTeks ? kapital(h.hariTeks) : "Tanpa jam tetap";
    case "zona_belum_jelas":
      return "Lihat jadwal lengkap";
    case "belum_tersedia":
      return "Jadwal belum tersedia";
  }
}
