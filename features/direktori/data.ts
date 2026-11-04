// Direktori Info Warga dari data/places.json. Fungsi di sini murni dan hanya dipakai di server, kecuali
// lewat route indeks.json dan pin.json yang mengirim versi ringkasnya ke browser.
import raw from "@/data/places.json";
import { KECAMATAN, type Place } from "@/lib/data/schema";

export type { Place };
export const TEMPAT = raw as unknown as Place[];
export const tempatPerId = new Map(TEMPAT.map((p) => [p.id, p]));

// Panduan dan nomor darurat merujuk id sumber lama; id_alias memetakannya ke entri gabungan.
const perAlias = new Map(TEMPAT.flatMap((p) => p.id_alias.map((a) => [a, p] as const)));
export const cariTempat = (id: string) => tempatPerId.get(id) ?? perAlias.get(id);

export type InfoKategori = { kategori: Place["kategori"]; nama: string; lede: string };

// Urutan menu mengikuti kebutuhan warga (research/00 bagian 5, laporan 06). Slug URL = kategori dengan
// garis bawah menjadi tanda hubung.
export const DAFTAR_KATEGORI: InfoKategori[] = [
  {
    kategori: "pemerintahan",
    nama: "Kantor Pemerintahan",
    lede: "Kecamatan, kelurahan, dinas, dan layanan Pemko serta BP Batam.",
  },
  { kategori: "layanan_publik", nama: "Layanan Publik", lede: "KUA, kantor pos, listrik, air, BPJS." },
  { kategori: "keamanan_darurat", nama: "Keamanan & Darurat", lede: "Polisi, pemadam kebakaran, SAR, kebencanaan." },
  { kategori: "kesehatan", nama: "Kesehatan", lede: "Puskesmas, rumah sakit, donor darah." },
  { kategori: "pendidikan", nama: "Pendidikan", lede: "Sekolah dan perguruan tinggi, negeri dan swasta." },
  { kategori: "perpustakaan", nama: "Perpustakaan", lede: "Perpustakaan umum, keliling, dan komunitas." },
  { kategori: "ibadah", nama: "Tempat Ibadah", lede: "Masjid, gereja, pura, vihara." },
  { kategori: "pemakaman", nama: "Pemakaman", lede: "TPU, makam per agama, krematorium, taman makam pahlawan." },
  { kategori: "transportasi", nama: "Transportasi", lede: "Pelabuhan, pelantar pompong, bandara, halte, SPKLU." },
  { kategori: "belanja", nama: "Belanja", lede: "Pasar, mal, supermarket, bahan bangunan, buku dan ATK." },
  { kategori: "ruang_publik", nama: "Ruang Publik", lede: "Taman, alun-alun, bumi perkemahan." },
  { kategori: "wisata", nama: "Wisata", lede: "Pantai, pulau, museum, taman hiburan." },
  { kategori: "olahraga", nama: "Olahraga", lede: "Padel, badminton, golf, gym, stadion." },
  { kategori: "akomodasi", nama: "Hotel & Penginapan", lede: "Hotel berbintang dan non bintang." },
  { kategori: "jasa", nama: "Jasa", lede: "Money changer, service center, ekspedisi." },
  { kategori: "pertanahan_hukum", nama: "Pertanahan & Hukum", lede: "PPAT, notaris, bantuan hukum, pengadilan, KJPP." },
  { kategori: "kuliner", nama: "Kuliner", lede: "Tempat makan dari Loket Makan." },
  { kategori: "kampung_tua", nama: "Kampung Tua", lede: "Daftar kampung tua. Ceritanya ada di Loket 05." },
  { kategori: "landmark", nama: "Landmark", lede: "Jembatan, monumen, dan penanda kota." },
  { kategori: "budaya", nama: "Budaya", lede: "Museum, cagar budaya, lembaga adat." },
  { kategori: "khas_batam", nama: "Khas Batam", lede: "Hal-hal yang rasanya hanya ada di sini." },
  { kategori: "lainnya", nama: "Lainnya", lede: "Waduk, kawasan, dan tempat lain." },
];

export const slugKategori = (k: string) => k.replace(/_/g, "-");
export const kategoriDariSlug = (s: string) => DAFTAR_KATEGORI.find((k) => slugKategori(k.kategori) === s);
export const namaKategori = (k: string) => DAFTAR_KATEGORI.find((d) => d.kategori === k)?.nama ?? k;

export const slugKecamatan = (k: string) => k.toLowerCase().replace(/\s+/g, "-");
export const kecamatanDariSlug = (s: string) => KECAMATAN.find((k) => slugKecamatan(k) === s);

const LABEL_SUB: Record<string, string> = {
  rs_tipe_b: "RS Tipe B",
  rs_tipe_c: "RS Tipe C",
  rs_tipe_d: "RS Tipe D",
  rs_khusus: "RS Khusus",
  rsia_tipe_b: "RSIA Tipe B",
  rsia_tipe_c: "RSIA Tipe C",
  rumah_sakit: "Rumah Sakit",
  puskesmas_rawat_inap: "Puskesmas Rawat Inap",
  puskesmas_non_rawat_inap: "Puskesmas Non Rawat Inap",
  kua: "KUA",
  bpjs_kes: "BPJS Kesehatan",
  bpjs_tk: "BPJS Ketenagakerjaan",
  tpu: "TPU",
  tpu_kristen: "TPU Kristen",
  tpu_multiagama: "TPU Multiagama",
  spklu: "SPKLU",
  gor: "GOR",
  stadion_gor: "Stadion & GOR",
  sd: "SD",
  smp: "SMP",
  sma: "SMA",
  smk: "SMK",
  ppat: "PPAT",
  notaris_ppat: "Notaris & PPAT",
  kjpp: "KJPP",
  lbh: "LBH",
  posbakum: "Posbakum",
  mpp: "Mal Pelayanan Publik",
  bp_batam: "BP Batam",
  sar: "SAR",
  militer_tni_ad: "TNI AD",
  militer_tni_al: "TNI AL",
  militer_tni_au: "TNI AU",
  buku_atk: "Buku & ATK",
  disdukcapil: "Disdukcapil",
  dukcapil: "Dukcapil",
  disnaker: "Disnaker",
  kemenag: "Kemenag",
};

export const slugSub = (s: string) => s.replace(/_/g, "-");

/** "hotel_non_bintang" menjadi "Hotel non bintang". Subkategori kuliner memakai tanda hubung. */
export function labelSub(sub: string | null): string {
  if (!sub) return "Lainnya";
  if (LABEL_SUB[sub]) return LABEL_SUB[sub];
  const teks = sub.replace(/[_-]+/g, " ");
  return teks.charAt(0).toUpperCase() + teks.slice(1);
}

// Yang diminta warga tetapi belum punya satu pun data (research/00 bagian 5, brief 06, 07, 12). Tiap butir
// tetap punya halaman berisi "Belum ada data", dan tidak pernah diisi dengan tebakan.
export const SUB_KOSONG: Partial<Record<Place["kategori"], { slug: string; nama: string }[]>> = {
  kesehatan: [
    { slug: "klinik", nama: "Klinik" },
    { slug: "apotek", nama: "Apotek" },
    { slug: "laboratorium", nama: "Laboratorium" },
    { slug: "dokter-umum", nama: "Dokter umum" },
    { slug: "dokter-gigi", nama: "Dokter gigi" },
    { slug: "dokter-kandungan", nama: "Dokter kandungan" },
    { slug: "dokter-anak", nama: "Dokter anak" },
    { slug: "dokter-kulit", nama: "Dokter kulit" },
    { slug: "dokter-tht", nama: "Dokter THT" },
    { slug: "dokter-mata", nama: "Dokter mata" },
    { slug: "penyakit-dalam", nama: "Penyakit dalam" },
    { slug: "psikolog-psikiater", nama: "Psikolog & psikiater" },
    { slug: "fisioterapi", nama: "Fisioterapi" },
    { slug: "bidan", nama: "Bidan" },
    { slug: "dokter-hewan", nama: "Dokter hewan" },
  ],
  pendidikan: [
    { slug: "paud", nama: "PAUD" },
    { slug: "playgroup", nama: "Playgroup" },
    { slug: "tk", nama: "TK" },
    { slug: "daycare", nama: "Daycare" },
    { slug: "mi-mts-ma", nama: "MI, MTs, MA" },
  ],
  olahraga: [
    { slug: "futsal", nama: "Futsal" },
    { slug: "mini-soccer", nama: "Mini soccer" },
    { slug: "basket", nama: "Basket" },
    { slug: "tenis", nama: "Tenis" },
    { slug: "voli", nama: "Voli" },
  ],
  belanja: [{ slug: "minimarket", nama: "Minimarket" }],
  ibadah: [{ slug: "klenteng", nama: "Klenteng" }],
  transportasi: [
    { slug: "spbu", nama: "SPBU" },
    { slug: "terminal-bus", nama: "Terminal bus" },
  ],
  jasa: [
    { slug: "bengkel", nama: "Bengkel" },
    { slug: "laundry", nama: "Laundry" },
    { slug: "servis-elektronik", nama: "Servis elektronik" },
    { slug: "pijat-refleksi", nama: "Pijat & refleksi" },
    { slug: "pijat-panggilan", nama: "Pijat panggilan" },
    { slug: "salon-barbershop", nama: "Salon & barbershop" },
    { slug: "percetakan", nama: "Fotokopi & percetakan" },
  ],
  akomodasi: [{ slug: "kos", nama: "Kos" }],
};

export function tempatDiKategori(k: string): Place[] {
  return TEMPAT.filter((p) => p.kategori === k).sort((a, b) => a.nama.localeCompare(b.nama, "id"));
}

export function subDiKategori(k: string): { sub: string; jumlah: number }[] {
  const hitung = new Map<string, number>();
  for (const p of TEMPAT) {
    if (p.kategori === k) hitung.set(p.subkategori ?? "lainnya", (hitung.get(p.subkategori ?? "lainnya") ?? 0) + 1);
  }
  return [...hitung.entries()].map(([sub, jumlah]) => ({ sub, jumlah })).sort((a, b) => b.jumlah - a.jumlah);
}

// Catatan di places.json sebagian besar catatan kerja penyusun ("seed", "laporan", "jangan tampilkan"),
// bukan teks untuk warga. Hanya yang lolos saringan ini yang boleh tampil.
const CATATAN_INTERNAL =
  /laporan|seed|riset|prosa|jangan|DPO|^\[|lintas|koordinat|brief|ringkasan|\bJSON\b|isi manual|disimpulkan|tabel|digabung|perlu (di)?cek|sumber lain|\[V\]|\[A\]|wiki|sengaja|kapolsek|ikon|quest|topik sensitif|di UI|untuk layer|kartu hening|disebut-sebut|webarchive|\bentri\b|\(S\d+\)/i;
const KATEGORI_TANPA_CATATAN = new Set(["kampung_tua", "lainnya", "kuliner", "akomodasi"]);

export function catatanPublik(p: Place): string | null {
  if (!p.catatan || KATEGORI_TANPA_CATATAN.has(p.kategori) || CATATAN_INTERNAL.test(p.catatan)) return null;
  return p.catatan.replace(/\s*⚠️\s*/g, " ").trim();
}

// Daftar putih atribut. Yang tidak tercantum tidak pernah tampil: rating Google, luas lahan, id internal,
// dan catatan penyusun tetap tersimpan di data, tetapi tidak sampai ke warga.
const ATRIBUT: Record<string, string> = {
  kelas_asli: "Kelas",
  tipe: "Tipe",
  tipe_museum: "Tipe museum",
  rawat_inap_label: "Rawat inap",
  igd_24jam: "IGD 24 jam",
  harga: "Harga menurut sumber, cek di lokasi",
  catatan_harga: "Catatan harga",
  booking: "Pemesanan",
  cara_booking: "Pemesanan",
  lapangan: "Lapangan",
  jumlah_lapangan: "Lapangan",
  hole: "Hole",
  par: "Par",
  pengelola: "Pengelola",
  operator: "Operator",
  daftar_nikah: "Daftar nikah",
  layanan: "Layanan",
  layanan_gratis: "Layanan gratis",
  pendampingan_sidang: "Mendampingi di sidang",
  akreditasi_bphn: "Akreditasi BPHN",
  afiliasi_dpn: "Afiliasi DPN",
  wilayah_kerja: "Wilayah kerja",
  aplikasi: "Aplikasi",
  fasilitas: "Fasilitas",
  kapasitas: "Kapasitas",
  rute: "Rute",
  tujuan: "Tujuan",
  waktu_tempuh: "Waktu tempuh",
  npsn: "NPSN",
  koridor: "Koridor",
  online: "Layanan online",
  kanal_online: "Layanan online",
  jemput_bola: "Jemput bola",
  antrean_online: "Antrean online",
  layanan_sabtu: "Layanan Sabtu",
  instansi: "Instansi di dalamnya",
  loket_mpp: "Ada loket di MPP",
  ramah_anak: "Ramah anak",
  parkir: "Parkir",
  waktu_terbaik: "Waktu terbaik",
  pembayaran: "Pembayaran",
  agama_makam: "Agama",
  akses: "Akses",
  call_center: "Call center",
  nomor_darurat: "Nomor darurat",
  diresmikan: "Diresmikan",
  tahun_berdiri: "Berdiri",
  status_cagar_budaya: "Status",
  jadwal: "Jadwal",
  ringkasan: "Ringkasan",
};
const TANPA_ATRIBUT = new Set(["kampung_tua", "lainnya", "kuliner"]);

function teksNilai(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "boolean") return v ? "Ya" : "Tidak";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v;
  if (Array.isArray(v)) {
    const isi = v
      .filter((x) => typeof x === "string" || typeof x === "number")
      .map((x) => String(x).replace(/_/g, " "));
    return isi.length ? isi.join(", ") : null;
  }
  return null;
}

export function atributPublik(p: Place): { label: string; nilai: string }[] {
  if (TANPA_ATRIBUT.has(p.kategori)) return [];
  const out: { label: string; nilai: string }[] = [];
  for (const [k, label] of Object.entries(ATRIBUT)) {
    const nilai = teksNilai(p.atribut[k]);
    if (k === "ringkasan" && nilai && CATATAN_INTERNAL.test(nilai)) continue;
    if (nilai && !out.some((o) => o.label === label)) out.push({ label, nilai });
  }
  return out;
}

/** Kartu hanya nama dan letak umum: kampung tua, dan Rempang Eco-City sampai teks netralnya disetujui (PLAN butir 13). */
export const kartuMinimal = (p: Pick<Place, "id" | "kategori">) =>
  p.kategori === "kampung_tua" || p.id === "kawasan-rempang-eco-city";

export type Nada = "ok" | "caution" | "danger" | "info" | undefined;
export type Lencana = { teks: string; nada: Nada };

export const LABEL_BETA = "Beta, data komunitas, verifikasi sendiri";
const SUB_PROFESI = new Set(["ppat", "notaris_ppat", "pejabat_lelang_kelas_ii"]);
export const adalahProfesi = (p: Pick<Place, "subkategori">) => SUB_PROFESI.has(p.subkategori ?? "");

const LENCANA_DATA: Record<string, Lencana> = {
  terverifikasi: { teks: "Data terverifikasi", nada: "ok" },
  perlu_cek_ulang: { teks: "Perlu cek ulang", nada: "caution" },
  usang: { teks: "Mungkin usang", nada: "caution" },
  sumber_tunggal: { teks: "Sumber tunggal", nada: "caution" },
  rencana: { teks: "Rencana, belum beroperasi", nada: "info" },
  cerita_rakyat: { teks: "Cerita rakyat", nada: "info" },
};

/** Lencana ketidakpastian: selalu berupa kata, tidak hanya warna. */
export function lencana(
  p: Pick<Place, "id" | "kategori" | "status_koordinat" | "status_data" | "subkategori" | "atribut">,
): Lencana[] {
  const out: Lencana[] = [];
  if (adalahProfesi(p)) out.push({ teks: LABEL_BETA, nada: "caution" });
  if (!kartuMinimal(p) && p.status_data && LENCANA_DATA[p.status_data]) out.push(LENCANA_DATA[p.status_data]);
  if (p.atribut.lokasi_luar_batam === true) out.push({ teks: "Di luar Batam", nada: "info" });
  else if (p.status_koordinat === "perlu_diisi_user") out.push({ teks: "Lokasi belum diisi", nada: "info" });
  else if (p.status_koordinat === "perlu_cek_ulang") out.push({ teks: "Lokasi perkiraan", nada: "info" });
  return out;
}

/** Tanggal terakhir dicek. places.json belum punya kolomnya, dan tanggal riset bukan tanggal pengecekan. */
export function teksDicek(p: Pick<Place, "atribut">): string {
  const t = p.atribut.last_verified;
  return typeof t === "string" && t ? `Dicek ${t}` : "Belum dicek ulang sejak riset Nov 2026";
}

const SITUS_PALSU = /damkarbatam\.com|disdikkotabatam\.org|disdikbatampemkot\.com/i;
export const tautanAman = (u: unknown): u is string =>
  typeof u === "string" && /^https?:\/\//.test(u) && !SITUS_PALSU.test(u);

export const lokasiTeks = (p: Pick<Place, "kelurahan" | "kecamatan">) =>
  [p.kelurahan, p.kecamatan].filter(Boolean).join(", ") || "Kecamatan belum diketahui";

/** Baris ringkas untuk pencarian di browser. Tidak memuat atribut, jadi rating tidak ikut terkirim. */
export function barisIndeks(p: Place) {
  return {
    id: p.id,
    nama: p.nama,
    alt: p.nama_alternatif,
    k: p.kategori,
    s: p.subkategori,
    sl: labelSub(p.subkategori),
    c: p.kecamatan,
    l: p.kelurahan,
    d: p.status_data,
    t: p.status_koordinat,
    j: p.jam_layanan,
    b: adalahProfesi(p),
  };
}
export type BarisIndeks = ReturnType<typeof barisIndeks>;

export type Pin = {
  id: string;
  nama: string;
  k: string;
  sl: string;
  lat: number;
  lng: number;
  perkiraan: boolean;
  lokasi: string;
  alamat: string | null;
  jam: string | null;
  lencana: Lencana[];
  /** tempat lain di koordinat yang persis sama */
  lain: { id: string; nama: string }[];
};

/**
 * Pin peta: hanya tempat berkoordinat, tanpa tempat di luar Batam (research/05, prompt bagian 1). Beberapa
 * tempat di satu titik, mis. kompleks kamp Galang, jadi satu pin, bukan lima pin bertumpuk.
 */
export function daftarPin(sumber: Place[] = TEMPAT): Pin[] {
  const perTitik = new Map<string, Pin>();
  for (const p of sumber) {
    if (p.lat == null || p.lng == null || p.status_koordinat === "perlu_diisi_user") continue;
    if (p.atribut.lokasi_luar_batam === true) continue;
    const kunci = `${p.lat},${p.lng}`;
    const ada = perTitik.get(kunci);
    if (ada) {
      ada.lain.push({ id: p.id, nama: p.nama });
      continue;
    }
    perTitik.set(kunci, {
      id: p.id,
      nama: p.nama,
      k: p.kategori,
      sl: labelSub(p.subkategori),
      lat: p.lat,
      lng: p.lng,
      perkiraan: p.status_koordinat !== "terverifikasi",
      lokasi: lokasiTeks(p),
      alamat: p.alamat,
      jam: p.jam_layanan,
      lencana: lencana(p),
      lain: [],
    });
  }
  return [...perTitik.values()];
}

const hanyaAngka = (s: string) => s.replace(/\D/g, "");

/** Kontak tampil apa adanya; tautan hanya kalau isinya memang satu nomor atau alamat. */
export function kontakPublik(p: Pick<Place, "kontak">): { label: string; teks: string; href: string | null }[] {
  const out: { label: string; teks: string; href: string | null }[] = [];
  const { telepon, whatsapp, email, website } = p.kontak;
  if (typeof telepon === "string" && telepon) {
    const satu = /^[+\d\s()-]+$/.test(telepon);
    out.push({ label: "Telepon", teks: telepon, href: satu ? `tel:${telepon.replace(/[^+\d]/g, "")}` : null });
  }
  if (typeof whatsapp === "string" && whatsapp) {
    const satu = /^[+\d\s()-]+$/.test(whatsapp);
    const nomor = hanyaAngka(whatsapp).replace(/^0/, "62");
    out.push({ label: "WhatsApp", teks: whatsapp, href: satu ? `https://wa.me/${nomor}` : null });
  }
  if (typeof email === "string" && email) out.push({ label: "Email", teks: email, href: `mailto:${email}` });
  if (typeof website === "string" && website) {
    const url = /^https?:\/\//.test(website) ? website : `https://${website}`;
    if (tautanAman(url)) out.push({ label: "Situs", teks: website.replace(/^https?:\/\//, ""), href: url });
  }
  return out;
}
