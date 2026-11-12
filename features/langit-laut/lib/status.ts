// ---------------------------------------------------------------------------
// Turunan TAMPILAN dari data mentah — fungsi murni (tanpa React, tanpa I/O), jadi
// gampang diuji dan satu-satunya tempat aturan "jujur soal kesegaran" + SALINAN panel
// didefinisikan. Salinan mengikuti PEDOMAN 3.3 dan 3.11: label berkapital di awal saja,
// kalimat data persis templatnya, tanpa lelucon saat ada peringatan.
// ---------------------------------------------------------------------------
import type {
  EchoSummary,
  ForecastResponse,
  OfsResponse,
  PerairanEntry,
  PerairanResponse,
} from "./api-types";
import {
  KAB_ORDER,
  inScope,
  kabRank,
  kecLevel,
  rainyKec,
  type KecEcho,
  type RainLevel,
  type RainScope,
} from "./kecamatan";
import { currentSlot, warnAt } from "./perairan";
import { ageMinutesOf, ofsValidWib, tsToInstant, type Frame } from "./radar";

/** PEDOMAN 3.3. Langsung: umur citra kurang dari 15 menit. */
export const LIVE_MAX_AGE_MIN = 15;
/** PEDOMAN 3.3. Tertunda sampai 30 menit; lebih dari itu Terputus dan peta hujan tidak ditampilkan. */
export const RADAR_OLD_MIN = 30;
/** Radius deteksi gema di sekitar Batam (lib/echo.ts). */
const RADIUS_GEMA_KM = 20;
/** Run OFS lebih tua dari 2 siklus (12 jam) = BMKG mandek. Umur wajar run terbaru 8–20 jam. */
export const OFS_STALE_H = 24;
/** Respons lama (tanpa per kecamatan): kelas baru disebut kalau luasnya ≥ ini (1 px = 1 km²). */
export const LEVEL_MIN_PX = 10;

export type LoadStatus = "loading" | "ok" | "error";
export type EchoLevel = RainLevel;
export type Tone = "normal" | "muted" | "warn";
export type Answer = {
  headline: string;
  tone: Tone;
  /** titik warna kelas hujan di depan jawaban */
  dot: EchoLevel | null;
  context: string;
  /** tawarkan "Coba Lagi" */
  retry: boolean;
  /** isi bilah mini saat panel dilipat */
  mini: string;
  /** teks Bagikan */
  share: string;
  /** teks pembaca layar — TIDAK bergantung posisi penggeser, jadi tak berbunyi tiap frame */
  live: string;
};
export type Caption = { left: string; right: string | null; warn: boolean; toNow: boolean };

// ---- teks ------------------------------------------------------------------
export const fmtM = (n: number) => String(n).replace(".", ",");
/** "0.5 - 1.25 m" → "0,5—1,25 m" */
export const fmtWave = (s: string) => s.replace(/\./g, ",").replace(/\s*-\s*/, "—");
export const ktToKmh = (kt: number) => Math.round(kt * 1.852);

const SINGKATAN = /\b(bmkg|mss|nea|psi|uv|wib)\b/gi;

/** Label berkapital di awal saja (PEDOMAN 2.3): "HUJAN PETIR" → "Hujan petir". Singkatan tetap kapital. */
export function titleCase(s: string): string {
  const t = s.trim().replace(/\s+/g, " ").toLowerCase();
  if (!t) return "";
  return (t[0].toUpperCase() + t.slice(1)).replace(SINGKATAN, (m) => m.toUpperCase());
}

const ARAH: Record<string, string> = {
  U: "utara",
  TL: "timur laut",
  T: "timur",
  TG: "tenggara",
  S: "selatan",
  BD: "barat daya",
  B: "barat",
  BL: "barat laut",
};
/** Kode mata angin NEA ("TL") atau teks BMKG ("Timur Laut") → "timur laut". */
export const arahLengkap = (kode: string) => ARAH[kode.trim().toUpperCase()] ?? kode.trim().toLowerCase();

/** Menit → "baru saja" / "25 menit" / "2,5 jam". */
function durasi(min: number): string {
  if (min < 1) return "baru saja";
  if (min < 90) return `${min} menit`;
  return `${fmtM(Math.round(min / 30) / 2)} jam`;
}
const lalu = (min: number) => (min < 1 ? "Baru saja" : `${durasi(min)} lalu`);

/** Tanggal WIB (YYYY-MM-DD) dari instant ms. */
const wibDay = (ms: number) => new Date(ms + 7 * 3600 * 1000).toISOString().slice(0, 10);
/** "10.15 WIB", atau "Sabtu 10.15" kalau citranya bukan dari hari ini. */
function whenLabel(f: Frame, now: number): string {
  const inst = tsToInstant(f.ts);
  const otherDay = inst !== null && wibDay(inst) !== wibDay(now);
  return otherDay ? `${f.date.split(",")[0]} ${f.time}` : `${f.time} WIB`;
}

// ---- HUJAN ----------------------------------------------------------------
export type RadarView = {
  current: Frame | undefined;
  latest: Frame | undefined;
  isLatest: boolean;
  /** cukup frame untuk diputar/digeser */
  ready: boolean;
  latestAge: number | null;
  /** frame yang sedang dipilih ternyata 404 di MSS */
  currentBroken: boolean;
  /** citra terbaru segar (status ok, umur ≤ LIVE_MAX_AGE_MIN) */
  fresh: boolean;
  /** sedang menampilkan citra terbaru DAN citranya segar */
  ok: boolean;
  /** umur frame pertama (menit) — ujung kiri penggeser */
  spanMin: number | null;
  /** waktu citra terbaru untuk keadaan tidak segar: "10.15 WIB", atau "Sabtu 10.15" kalau bukan hari ini */
  latestWhen: string;
  sliderText: string;
};

export function radarView(a: {
  frames: Frame[];
  idx: number;
  status: LoadStatus;
  offline: boolean;
  now: number;
  broken: ReadonlySet<string>;
}): RadarView {
  const { frames, idx, status, offline, now, broken } = a;
  const current = frames[idx];
  const latest = frames[frames.length - 1];
  const isLatest = frames.length > 0 && idx === frames.length - 1;
  const latestAge = latest ? ageMinutesOf(latest.ts, now) : null;
  // Kesegaran dihitung di klien dari umur citra — frame beku tetap ketahuan walau API tak
  // terjangkau. (Flag `stale` server sengaja tidak dipakai: umur citra lebih jujur; "lastGood"
  // dengan umur ≤18 menit memang belum terlambat.) Offline = tak bisa menjamin "sekarang".
  const fresh = status === "ok" && !offline && latestAge !== null && latestAge <= LIVE_MAX_AGE_MIN;
  const currentAge = current ? ageMinutesOf(current.ts, now) : null;
  return {
    current,
    latest,
    isLatest,
    ready: frames.length >= 2,
    latestAge,
    currentBroken: !!current && broken.has(current.url),
    fresh,
    ok: isLatest && fresh && !(!!current && broken.has(current.url)),
    spanMin: frames.length ? ageMinutesOf(frames[0].ts, now) : null,
    latestWhen: latest ? whenLabel(latest, now) : "",
    sliderText: current ? `${current.time} WIB, ${lalu(currentAge ?? 0)}` : "",
  };
}

/** Wilayah peta → cakupan jawaban: "Batam" = Kota Batam; "Kepulauan Riau"/"Luas" = semua kab/kota Kepri. */
export const scopeOf = (view: string): RainScope => (view === "batam" ? "batam" : "kepri");

/** Daftar kecamatan untuk satu cakupan: Kepri dari `region.kec`, Batam dari `kec` akar. */
const kecList = (e: EchoSummary | null | undefined, scope: RainScope): KecEcho[] | undefined =>
  (scope === "kepri" ? (e?.region?.kec ?? e?.kec) : e?.kec)?.filter((k) => inScope(k, scope));

/** Data echo yang dipersempit ke satu cakupan. Respons lama tanpa `region` → pakai data Batam. */
function scoped(e: EchoSummary, scope: RainScope): { kec: KecEcho[] | null; near: boolean; lastTs: string | null } {
  const kec = kecList(e, scope) ?? null;
  if (scope === "kepri" && e.region) return { kec, near: e.region.near, lastTs: e.region.lastTs };
  return { kec, near: e.near, lastTs: e.lastTs };
}

/**
 * Kelas hujan yang JUJUR. Per kecamatan (lib/kecamatan.ts): kelas terderas di antara kecamatan
 * yang hujan dalam cakupan. Respons lama tanpa per kecamatan: kelas tertinggi yang luasnya ≥10 km².
 */
export function rainLevel(e: EchoSummary, scope: RainScope = "batam"): EchoLevel | null {
  const sc = scoped(e, scope);
  if (!sc.near) return null;
  if (sc.kec) return rainyKec(sc.kec)[0]?.level ?? null;
  const b = e.byClass;
  if (!b) return e.level; // respons lama tanpa hitungan per kelas
  if (b.lebat >= LEVEL_MIN_PX) return "lebat";
  if (b.lebat + b.sedang >= LEVEL_MIN_PX) return "sedang";
  return "ringan";
}

const LEVEL_TEXT: Record<EchoLevel, string> = {
  ringan: "Hujan ringan",
  sedang: "Hujan sedang",
  lebat: "Hujan lebat",
};
const LEVEL_KATA: Record<EchoLevel, string> = { ringan: "ringan", sedang: "sedang", lebat: "lebat" };

/** "Sekupang" · "Sekupang dan Batu Aji" · "Sekupang, Batu Aji, dan Sagulung". */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} dan ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, dan ${names[names.length - 1]}`;
}

/** Kalimat hujan PEDOMAN 3.11. null kalau gema belum diketahui. */
export function kalimatHujan(echo: EchoSummary | null, scope: RainScope = "batam"): string | null {
  if (!echo) return null;
  const sc = scoped(echo, scope);
  const tempat = scope === "batam" ? "Batam" : "Kepulauan Riau";
  if (!sc.kec) {
    return sc.near ? `Ada hujan sekitar ${RADIUS_GEMA_KM} km dari Batam, belum masuk wilayah kota.` : `Belum ada hujan yang terpantau di ${tempat}.`;
  }
  const rainy = rainyKec(sc.kec);
  if (!rainy.length) {
    return sc.near && scope === "batam"
      ? `Ada hujan sekitar ${RADIUS_GEMA_KM} km dari Batam, belum masuk wilayah kota.`
      : `Belum ada hujan yang terpantau di ${tempat}.`;
  }
  const level = rainy[0].level;
  if (rainy.length <= 3) {
    return `Hujan ${LEVEL_KATA[level]} di Kecamatan ${joinNames(rainy.map((k) => k.name))}.`;
  }
  const jumlah = scope === "batam" ? `${rainy.length} dari ${sc.kec.length} kecamatan` : `${rainy.length} kecamatan Kepulauan Riau`;
  return `Hujan di ${jumlah}, paling deras di ${rainy[0].name} (${LEVEL_KATA[level]}).`;
}

/** Status citra PEDOMAN 3.3. */
export function statusRadar(umurMenit: number | null): "Langsung" | "Tertunda" | "Terputus" {
  if (umurMenit === null || umurMenit > RADAR_OLD_MIN) return "Terputus";
  return umurMenit < LIVE_MAX_AGE_MIN ? "Langsung" : "Tertunda";
}

export function rainAnswer(a: {
  echo: EchoSummary | null;
  frames: Frame[];
  rv: RadarView;
  status: LoadStatus;
  offline: boolean;
  now: number;
  /** Kota Batam (bawaan) atau semua kab/kota Kepri dalam jangkauan radar */
  scope?: RainScope;
}): Answer {
  const { echo, rv, status, offline } = a;
  const scope = a.scope ?? "batam";
  const latest = rv.latest;
  const base = (headline: string, context: string, extra: Partial<Answer> = {}): Answer => ({
    headline,
    context,
    tone: "warn",
    dot: null,
    retry: false,
    mini: headline,
    share: "Radar hujan Batam",
    live: [headline, context].filter(Boolean).join(" "),
    ...extra,
  });
  const TIDAK_TERSAMBUNG = "Perangkat tidak tersambung ke internet. Ini data terakhir yang tersimpan.";

  if (!latest) {
    if (offline) return base(TIDAK_TERSAMBUNG, "", { mini: "Tidak tersambung" });
    if (status === "error") return base("Data radar belum dapat dimuat.", "", { retry: true, mini: "Radar terputus" });
    return base("Memuat data", "", { tone: "muted", live: "" });
  }

  const t = latest.time;
  const age = rv.latestAge ?? 0;
  const kalimat = kalimatHujan(echo, scope);
  const barisWaktu = (s: string) => `Citra pukul ${t} WIB · ${s}`;
  const share = kalimat ? `Radar pukul ${t} WIB: ${kalimat}` : `Radar hujan Batam pukul ${t} WIB`;
  const mini = (h: string) => `${h} · ${t}`;

  if (offline) return base(TIDAK_TERSAMBUNG, kalimat ? `Pukul ${t} WIB: ${kalimat}` : "", { mini: mini("Tidak tersambung"), share });
  if (status === "error" || age > RADAR_OLD_MIN) {
    const h = `Data radar belum diperbarui sejak pukul ${t} WIB sehingga peta hujan tidak ditampilkan.`;
    return base(h, barisWaktu("Terputus"), { retry: status === "error", mini: mini("Radar terputus"), share, live: h });
  }

  const singkat = echo ? (rainyKec(kecList(echo, scope))[0] ? LEVEL_TEXT[rainyKec(kecList(echo, scope))[0].level] : "Tidak hujan") : "Radar Hujan";
  const stat = statusRadar(age);
  const answer: Answer = {
    headline: kalimat ?? "Deteksi hujan otomatis sedang gangguan. Lihat warna di peta.",
    context: barisWaktu(stat),
    tone: stat === "Tertunda" ? "warn" : "normal",
    dot: echo ? (rainyKec(kecList(echo, scope))[0]?.level ?? null) : null,
    retry: false,
    mini: mini(singkat),
    share,
    // tanpa angka menit: kalau tidak, pembaca layar berbunyi tiap menit
    live: `${kalimat ?? "Deteksi hujan gangguan."} Citra pukul ${t} WIB.`,
  };
  // Penggeser di riwayat: jawaban tetap milik citra TERBARU, ditandai "Terkini:".
  if (!rv.isLatest) return { ...answer, headline: `Terkini: ${answer.headline}`, tone: "muted" };
  return answer;
}

export function rainCaption(rv: RadarView, now: number): Caption {
  const { current, latest } = rv;
  if (!current || !latest) return { left: "", right: null, warn: false, toNow: false };
  // Caption kiri berbagi baris dengan tombol "Ke Sekarang" → versi pendek supaya kata
  // penentunya ("Lalu", "Tidak Tersedia") tidak terpotong di 360 px.
  if (rv.currentBroken) {
    return rv.isLatest
      ? { left: `Peta ${current.time} tidak tersedia`, right: null, warn: true, toNow: false }
      : { left: `${current.time} tidak tersedia`, right: null, warn: true, toNow: true };
  }
  if (!rv.isLatest) {
    const age = ageMinutesOf(current.ts, now) ?? 0;
    return { left: `${current.time} WIB, ${lalu(age)}`, right: null, warn: false, toNow: true };
  }
  return {
    left: rv.spanMin !== null ? lalu(rv.spanMin) : "",
    right: rv.fresh ? "Terbaru" : rv.latestWhen,
    warn: false,
    toNow: false,
  };
}

export type KecRow = { code: string; name: string; level: EchoLevel | null; text: string };
export type KecGroup = { kab: string; rows: KecRow[]; rainy: number };

/**
 * "Hujan per Kecamatan" dalam cakupan, dikelompokkan per kab/kota (Batam dulu). Di tiap
 * kelompok yang hujan di atas (terderas, terluas), sisanya urut nama.
 */
export function kecTable(e: EchoSummary | null, scope: RainScope = "batam"): KecGroup[] {
  const list = kecList(e, scope);
  if (!list) return [];
  const rank = { lebat: 3, sedang: 2, ringan: 1 } as const;
  const groups = new Map<string, (KecRow & { rain: number })[]>();
  for (const k of list) {
    if (!inScope(k, scope)) continue;
    const level = kecLevel(k);
    const row = {
      code: k.code,
      name: k.name,
      level,
      rain: k.rain,
      text: level ? LEVEL_TEXT[level] : "Tidak hujan",
    };
    const g = groups.get(k.kab);
    if (g) g.push(row);
    else groups.set(k.kab, [row]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => kabRank(a) - kabRank(b))
    .map(([kab, rows]) => {
      rows.sort((a, b) =>
        a.level && b.level
          ? rank[b.level] - rank[a.level] || b.rain - a.rain
          : a.level
            ? -1
            : b.level
              ? 1
              : a.name.localeCompare(b.name, "id"),
      );
      return { kab, rows: rows.map(({ code, name, level, text }) => ({ code, name, level, text })), rainy: rows.filter((r) => r.level).length };
    });
}

/** Kode kecamatan yang sedang hujan (semua Kepri) beserta kelasnya — untuk arsiran & label peta. */
export function rainyMap(e: EchoSummary | null): Map<string, EchoLevel> {
  return new Map(rainyKec(kecList(e, "kepri")).map((k) => [k.code, k.level]));
}

/** Kab/kota dalam jangkauan (untuk teks penjelasan). */
export const KAB_LIST = joinNames([...KAB_ORDER]);

// ---- prakiraan BMKG (kelurahan) -------------------------------------------
export type ForecastStripView = {
  slots: { time: string; t: number | null; desc: string }[];
  /** versi satu baris untuk layar pendek */
  inline: string | null;
  /** catatan untuk Detail kalau strip tidak bisa tampil */
  note: string | null;
  /** ada slot "Udara Kabur" → Detail menjelaskan istilahnya */
  hasHaze: boolean;
};

export function forecastStrip(fc: ForecastResponse | null, error: boolean, now: number, n = 3): ForecastStripView {
  if (!fc) {
    return { slots: [], inline: null, note: error ? "Prakiraan cuaca belum dapat dimuat." : null, hasHaze: false };
  }
  const slots = fc.slots
    .filter((s) => Date.parse(s.utc) > now)
    .slice(0, n)
    .map((s) => ({ time: s.time, t: s.t, desc: titleCase(s.desc) }));
  if (!slots.length) return { slots, inline: null, note: "Prakiraan cuaca belum diperbarui.", hasHaze: false };
  return {
    slots,
    inline: `Nanti: ${slots
      .slice(0, 2)
      .map((s) => `${s.time} ${s.desc}`)
      .join(", ")}`,
    note: null,
    hasHaze: slots.some((s) => /udara kabur/i.test(s.desc)),
  };
}

// ---- OMBAK ----------------------------------------------------------------
export type OfsView = {
  count: number;
  ready: boolean;
  failed: boolean;
  valid: string | undefined;
  wib: { time: string; day: string; date: string } | null;
  nowIndex: number;
  phase: "now" | "future" | "past";
  /** frame terakhir sudah lewat → "sekarang" sebenarnya frame lama */
  expired: boolean;
  /** baris masalah (hanya saat tidak normal) */
  problem: string | null;
  /** opacity field: diturunkan kalau mask darat gagal (darat jangan ketutup warna) */
  opacity: number;
  sliderText: string;
  /** ujung timeline, untuk label tombol Putar */
  lastWib: { time: string; day: string } | null;
  /** fetch gagal & belum ada data → tawarkan "Coba Lagi" */
  canRetry: boolean;
};

export function ofsView(a: {
  ofs: OfsResponse | null;
  idx: number;
  failed: boolean;
  tilesDown: boolean;
  maskOk: boolean | null;
  offline: boolean;
  /** Pembaca memilih BMKG, tetapi ubin BMKG gagal dimuat sehingga peta beralih ke Copernicus. */
  cadangan?: boolean;
}): OfsView {
  const { ofs, idx, failed, tilesDown, maskOk, offline, cadangan = false } = a;
  const count = ofs?.frames.length ?? 0;
  const ready = count > 0;
  const valid = ofs?.frames[idx];
  const wib = valid ? ofsValidWib(valid) : null;
  const last = ofs?.frames[count - 1];
  const nowIndex = ofs?.nowIndex ?? 0;
  const phase = idx === nowIndex ? "now" : idx > nowIndex ? "future" : "past";

  // Kesegaran dari UMUR run (bukan flag fallback): probe yang nemu run 4 jam lalu itu segar;
  // run dari modelrun yang mandek 30 jam itu basi. Slot buta = tebakan → selalu ditandai.
  const copernicus = ofs?.source === "copernicus";
  const problem = !ready
    ? null
    : tilesDown
      ? copernicus
        ? "Peta gelombang Copernicus gagal dimuat."
        : "Peta gelombang gagal dimuat di perangkat ini."
      : cadangan
        ? "Peta gelombang BMKG sedang tidak tersedia, jadi peta memakai prakiraan Copernicus."
      : ofs?.expired
        ? "Peta gelombang belum diperbarui."
        : ofs?.source === "blind"
          ? "Waktu peta gelombang belum pasti."
          : (ofs?.ageH ?? 0) > OFS_STALE_H
            ? `Peta gelombang dibuat ${ofs?.ageH} jam lalu.`
            : maskOk === false
              ? "Warna di atas daratan bukan data."
              : null;

  return {
    count,
    ready,
    failed,
    valid,
    wib,
    nowIndex,
    phase,
    expired: !!ofs?.expired,
    problem,
    opacity: maskOk === false ? 0.45 : 1,
    sliderText: wib ? `${wib.date}, ${wib.time} WIB` : "",
    lastWib: last ? ofsValidWib(last) : null,
    canRetry: failed && !ready && !offline,
  };
}

export function ofsCaption(ov: OfsView): Caption {
  if (!ov.ready || !ov.wib) return { left: "", right: null, warn: false, toNow: false };
  const { time, day } = ov.wib;
  if (ov.phase === "now") {
    // data kedaluwarsa: frame "sekarang" hanyalah frame terakhir yang tersedia
    return ov.expired
      ? { left: `Peta ${day} ${time}, terakhir tersedia`, right: null, warn: true, toNow: false } // muat di 360 px
      : { left: `Pukul ${time} WIB, sekarang`, right: null, warn: false, toNow: false };
  }
  // berbagi baris dengan "Ke Sekarang" → versi pendek
  if (ov.phase === "future") return { left: `${day} ${time}, prakiraan`, right: null, warn: false, toNow: true };
  return { left: `${time}, sudah lewat`, right: null, warn: false, toNow: true };
}

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
/** ISO atau "2026-09-26 23:39 UTC" (format BMKG) → waktu WIB siap tampil. */
function wibParts(s: string): { day: string; date: string; time: string; key: string } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?\s*(?:Z|UTC)?$/.exec(s.trim());
  const ms = m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : Date.parse(s);
  if (Number.isNaN(ms)) return null;
  const d = new Date(ms + 7 * 3600 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    day: HARI[d.getUTCDay()],
    date: `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]}`,
    time: `${p(d.getUTCHours())}.${p(d.getUTCMinutes())}`,
    key: d.toISOString().slice(0, 10),
  };
}
const hhmm = (iso: string) => wibParts(iso)?.time ?? "";
/** Jendela berlaku prakiraan: "Sen 07.00—19.00 WIB" / "Sen 19.00—Sel 07.00 WIB". */
function windowText(fromIso: string, toIso: string): string {
  const a = wibParts(fromIso);
  const b = wibParts(toIso);
  if (!a || !b) return "";
  return a.key === b.key ? `${a.day} ${a.time}—${b.time} WIB` : `${a.day} ${a.time}—${b.day} ${b.time} WIB`;
}

/** "4 km/jam dari barat laut". Respons lama (rentang): "17—78 km/jam dari utara". null kalau tak lengkap. */
export function anginKmh(e: PerairanEntry): string | null {
  const from = e.windFrom ? ` dari ${arahLengkap(e.windFrom)}` : "";
  if (e.windKt != null) return `${ktToKmh(e.windKt)} km/jam${from}`;
  if (e.windMinKt === null || e.windMaxKt === null) return null;
  return `${ktToKmh(e.windMinKt)}—${ktToKmh(e.windMaxKt)} km/jam${from}`;
}
/** Tinggi gelombang jam ini: "0,5 m" (bentuk lama: rentang teks "0,5—1,25 m"). */
const waveText = (e: PerairanEntry) => (e.waveM != null ? `${fmtM(e.waveM)} m` : fmtWave(e.waveDesc));
/** Rentang meter "0,4—0,6 m" (satu angka kalau sama). */
const rangeM = (a: number, b: number) => (a === b ? `${fmtM(a)} m` : `${fmtM(a)}—${fmtM(b)} m`);

/** Kalimat gelombang PEDOMAN 3.11. */
export function kalimatGelombang(e: PerairanEntry): string {
  const kat = (e.waveCat || "").trim().toLowerCase();
  const tinggi = waveText(e);
  const angin = anginKmh(e);
  const satu = `Gelombang${kat ? ` ${kat}` : ""}${tinggi ? `, sekitar ${tinggi},` : ""} di perairan Batam.`;
  return angin ? `${satu} Angin ${angin}.` : satu;
}

export function ofsAnswer(
  p: PerairanResponse | null,
  perairanError: boolean,
  ov: OfsView,
  offline: boolean,
  now: number = Date.now(),
): Answer & { warning: string | null } {
  const plain = (headline: string, context: string, extra: Partial<Answer> = {}) => ({
    headline,
    context,
    tone: "normal" as Tone,
    dot: null,
    retry: false,
    // bilah mini = judul, supaya gangguan/offline tetap terlihat saat panel diciutkan
    mini: headline,
    share: "Prakiraan gelombang perairan Batam",
    live: [headline, context].filter(Boolean).join(" "),
    warning: null,
    ...extra,
  });

  if (ov.failed && !ov.ready) {
    return offline
      ? plain("Perangkat tidak tersambung ke internet. Ini data terakhir yang tersimpan.", "", {
          tone: "warn",
          mini: "Tidak tersambung",
        })
      : plain("Data gelombang belum dapat dimuat.", "", { tone: "warn", retry: true, mini: "Data gelombang terputus" });
  }
  const { entry: e, upcoming } = currentSlot(p, now);
  if (!e) {
    if (!ov.ready || (!p && !perairanError)) return plain("Memuat data", "", { tone: "muted", live: "" });
    return plain("Prakiraan teks perairan Batam belum tersedia. Warna di peta tetap dari model gelombang.", "", {
      mini: "Gelombang: lihat warna di peta",
    });
  }

  const cat = titleCase(e.waveCat) || "Gelombang";
  const range = waveText(e);
  const headline = kalimatGelombang(e);
  const context = upcoming
    ? `Prakiraan berlaku mulai pukul ${hhmm(e.validFrom)} WIB`
    : `Prakiraan berlaku sampai pukul ${hhmm(e.validTo)} WIB`;
  const warning = warnText(p, e, now);
  return {
    headline,
    context,
    tone: "normal",
    dot: null,
    retry: false,
    mini: `${cat}${range ? ` · ${range}` : ""}`,
    share: `Gelombang perairan Batam: ${cat.toLowerCase()}${range ? `, ${range}` : ""}.${warning ? ` ${warning}` : ""}`,
    live: [warning, headline, context].filter(Boolean).join(" "),
    warning,
  };
}

/**
 * Kalimat peringatan gelombang PEDOMAN 3.11, ditulis lurus. Respons lama tanpa `warns` → teks di entri.
 */
function warnText(p: PerairanResponse | null, e: PerairanEntry, now: number): string | null {
  if (!p?.warns) return e.warning || null;
  const { current, next } = warnAt(p.warns, now);
  const kalimat = (t: string, until: string) =>
    `${t} untuk perairan Batam${until ? ` sampai pukul ${hhmm(until)} WIB` : ""}.`;
  if (current.status === "ok" && current.text) return kalimat(current.text, current.until);
  // sekarang tidak ada, tetapi buletin berikut menyebut Batam → beri tahu kapan mulainya
  if (current.status === "ok" && next?.text) return `${next.text} untuk perairan Batam mulai pukul ${hhmm(next.from)} WIB.`;
  // status sekarang tak diketahui tetapi buletin terbaru menyebut Batam → anggap berlaku (lebih aman daripada diam)
  if (current.status !== "ok" && next?.text) return kalimat(next.text, next.until);
  return null;
}
/** Baris "Peringatan" di Detail. */
function warnRows(p: PerairanResponse, e: PerairanEntry, now: number): { k: string; v: string }[] {
  if (!p.warns) {
    const until = e.warningUntil ? wibParts(e.warningUntil) : null;
    return [{ k: "Peringatan", v: e.warning ? `${e.warning}${until ? `, sampai ${until.day} ${until.time} WIB` : ""}` : "Tidak ada" }];
  }
  const { current, next } = warnAt(p.warns, now);
  const until = current.until ? wibParts(current.until) : null;
  const rows = [
    {
      k: "Peringatan",
      v:
        current.status !== "ok"
          ? "Status belum dapat dimuat"
          : current.text
            ? `${current.text}${until ? `, sampai ${until.day} ${until.time} WIB` : ""}`
            : "Tidak ada",
    },
  ];
  if (next) {
    const from = wibParts(next.from);
    if (from) rows.push({ k: "Peringatan berikutnya", v: `Mulai ${from.day} ${from.time} WIB: ${next.text || "tidak ada"}` });
  }
  return rows;
}

/** Isi "Prakiraan Perairan Batam": label → nilai (PEDOMAN 3.3). */
export function perairanDetail(p: PerairanResponse | null, now: number = Date.now()): { k: string; v: string }[] {
  const e = currentSlot(p, now).entry;
  if (!p || !e) return [];
  const rows: { k: string; v: string }[] = [];
  const wave = waveText(e);
  rows.push({ k: "Tinggi Gelombang", v: `${titleCase(e.waveCat)}${wave ? `, ${wave}` : ""}` });
  if (e.next12) rows.push({ k: "12 Jam ke Depan", v: rangeM(e.next12.minM, e.next12.maxM) });
  const from = e.windFrom ? ` dari ${arahLengkap(e.windFrom)}` : "";
  if (e.windKt != null) {
    rows.push({ k: "Angin", v: `${fmtM(e.windKt)} knot (${ktToKmh(e.windKt)} km/jam)${from}` });
    if (e.gustKt != null) rows.push({ k: "Embusan", v: `${fmtM(e.gustKt)} knot (${ktToKmh(e.gustKt)} km/jam)` });
  } else if (e.windMinKt !== null && e.windMaxKt !== null) {
    rows.push({
      k: "Angin",
      v: `${e.windMinKt}—${e.windMaxKt} knot (${ktToKmh(e.windMinKt)}—${ktToKmh(e.windMaxKt)} km/jam)${from}`,
    });
  }
  if (e.currentKt != null) {
    rows.push({ k: "Arus", v: `${fmtM(Math.round(e.currentKt * 10) / 10)} knot${e.currentTo ? ` ke ${arahLengkap(e.currentTo)}` : ""}` });
  }
  if (e.weather) rows.push({ k: "Cuaca", v: titleCase(e.weather) });
  rows.push(...warnRows(p, e, now));
  const win = windowText(e.validFrom, e.validTo);
  if (win) rows.push({ k: "Berlaku", v: win });
  const issued = p.issued ? wibParts(p.issued) : null;
  if (issued) rows.push({ k: "Diterbitkan", v: `${issued.day} ${issued.date}, ${issued.time} WIB` });
  return rows;
}

// ---- CCTV -----------------------------------------------------------------
export function cctvAnswer(total: number, failed: number): { headline: string; context: string } {
  return {
    headline: `${total} titik kamera`,
    context: failed > 0 ? `Ada ${failed} kamera tidak aktif.` : "",
  };
}
