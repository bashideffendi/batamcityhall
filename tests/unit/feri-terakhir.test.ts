import { describe, expect, it } from "vitest";
import jadwalRaw from "@/data/feri/jadwal.json";
import ruteRaw from "@/data/feri/rute.json";
import {
  BARIS_POMPONG,
  ENTRI_FERI,
  hargaMulaiDari,
  KARTU_FERI,
  SEMUA_RUTE,
  TAUTAN_OPERATOR,
  terminalDariMakan,
} from "@/features/jalan/feri-data";
import {
  bacaHari,
  dariTerminal,
  dataSudahLama,
  hitungFeri,
  hitungSatu,
  keWib,
  normalisasi,
  ringkasHariIni,
  teksStatus,
  teksTanggal,
  umurData,
  waktuDiZona,
  type EntriFeri,
  type JadwalMentah,
  type RuteMentah,
} from "@/features/jalan/feri-terakhir";

/** Jam dinding WIB menjadi Date. 5 Nov 2026 adalah hari Kamis. */
const wib = (tgl: string, jam: string) => new Date(`${tgl}T${jam}:00+07:00`);
const KAMIS = "2026-11-05";
const RABU = "2026-11-04";
const JUMAT = "2026-11-06";
const SABTU = "2026-11-07";
const MINGGU = "2026-11-08";

function cari(ruteId: string, potongan: RegExp, now = wib(KAMIS, "12:00")) {
  const baris = hitungFeri(ENTRI_FERI, now).filter(
    (h) => h.ruteId === ruteId && potongan.test(`${h.asal} ${h.tujuan} ${h.operator}`),
  );
  expect(baris.length, `${ruteId} ${potongan}`).toBeGreaterThan(0);
  return baris[0];
}

describe("zona waktu", () => {
  it("menit dan hari dihitung di zona yang diminta", () => {
    const n = wib(KAMIS, "23:30");
    expect(waktuDiZona(n, "Asia/Jakarta")).toEqual({ menit: 23 * 60 + 30, hari: 4, tanggal: KAMIS });
    expect(waktuDiZona(n, "Asia/Singapore")).toEqual({ menit: 30, hari: 5, tanggal: JUMAT });
    expect(waktuDiZona(n, "Asia/Kuala_Lumpur")).toEqual({ menit: 30, hari: 5, tanggal: JUMAT });
  });

  it("konversi ke WIB sesuai contoh brief, termasuk lewat tengah malam", () => {
    expect(keWib("21:40", "Asia/Singapore")).toBe("20:40");
    expect(keWib("18:30", "Asia/Kuala_Lumpur")).toBe("17:30");
    expect(keWib("20:30", "Asia/Jakarta")).toBe("20:30");
    expect(keWib("00:30", "Asia/Singapore")).toBe("23:30 kemarin");
  });

  it("jam dari Singapura dibandingkan di SGT, bukan WIB", () => {
    // 20:45 WIB = 21:45 SGT: BatamFast 21:40 SGT sudah lewat, Sindo 21:50 SGT masih ada.
    const n = wib(KAMIS, "20:45");
    const batamFast = cari("btc-hfc", /^HarbourFront.*BatamFast/, n);
    const sindo = cari("btc-hfc", /^HarbourFront.*Sindo/, n);
    expect(batamFast.jam).toBe("21:40");
    expect(batamFast.jamWib).toBe("20:40");
    expect(batamFast.status).toBe("sudah_lewat");
    expect(sindo.jam).toBe("21:50");
    expect(sindo.status).toBe("masih_ada");
    expect(sindo.menitLagi).toBe(5);
  });

  it("batas menit: tepat jam terakhir masih ada, semenit kemudian sudah lewat", () => {
    const tepat = cari("btc-hfc", /^Batam Centre.*BatamFast/, wib(KAMIS, "20:30"));
    expect(tepat.status).toBe("masih_ada");
    expect(tepat.menitLagi).toBe(0);
    expect(teksStatus(tepat)).toBe("Berangkat sekarang");
    expect(cari("btc-hfc", /^Batam Centre.*BatamFast/, wib(KAMIS, "20:31")).status).toBe("sudah_lewat");
    // 20:40 WIB = 21:40 SGT tepat.
    expect(cari("btc-hfc", /^HarbourFront.*BatamFast/, wib(KAMIS, "20:40")).status).toBe("masih_ada");
    expect(cari("btc-hfc", /^HarbourFront.*BatamFast/, wib(KAMIS, "20:41")).status).toBe("sudah_lewat");
  });

  it("tengah malam: pukul 23:30 WIB, jadwal dari Singapura sudah hari baru, dari Batam belum", () => {
    const n = wib(KAMIS, "23:30");
    expect(cari("btc-hfc", /^Batam Centre.*BatamFast/, n).status).toBe("sudah_lewat");
    expect(cari("btc-hfc", /^HarbourFront.*BatamFast/, n).status).toBe("masih_ada");
    // Pukul 22:59 WIB masih hari yang sama di Singapura (23:59 SGT).
    expect(cari("btc-hfc", /^HarbourFront.*BatamFast/, wib(KAMIS, "22:59")).status).toBe("sudah_lewat");
    expect(cari("btc-hfc", /^HarbourFront.*BatamFast/, wib(KAMIS, "23:00")).status).toBe("masih_ada");
  });

  it("pukul 00:30 WIB semua jadwal hari itu masih ada", () => {
    const n = wib(KAMIS, "00:30");
    expect(cari("btc-hfc", /^Batam Centre.*BatamFast/, n).status).toBe("masih_ada");
    expect(cari("btc-stl", /^Stulang/, n).status).toBe("masih_ada");
  });

  it("jadwal Malaysia memakai MYT", () => {
    const stulang = cari("btc-stl", /^Stulang/, wib(KAMIS, "16:00"));
    expect(stulang.zona).toBe("Asia/Kuala_Lumpur");
    expect(stulang.jam).toBe("17:00");
    expect(stulang.jamWib).toBe("16:00");
    expect(stulang.status).toBe("masih_ada");
    expect(cari("btc-stl", /^Stulang/, wib(KAMIS, "16:01")).status).toBe("sudah_lewat");
    expect(cari("hb-ph", /^Puteri/).jam).toBe("18:30");
  });

  it("hari tertentu mengikuti hari di zona asal, bukan hari di Batam", () => {
    // Tanah Merah 20:30 SGT hanya Kam-Min. Rabu 23:30 WIB sudah Kamis di Singapura.
    const rabuMalam = cari("btc-tmft", /^Tanah Merah.*BatamFast/, wib(RABU, "23:30"));
    expect(rabuMalam.jam).toBe("20:30");
    const rabuSiang = cari("btc-tmft", /^Tanah Merah.*BatamFast/, wib(RABU, "12:00"));
    expect(rabuSiang.jam).toBe("17:20");
  });
});

describe("feri terakhir dari Batam sesuai tabel brief 14", () => {
  const kasus: [string, RegExp, string, string][] = [
    ["btc-hfc", /^Batam Centre.*BatamFast/, "20:30", "2026-11-01"],
    ["btc-hfc", /^Batam Centre.*Majestic/, "20:35", "2026-05"],
    ["btc-hfc", /^Batam Centre.*Sindo/, "20:20", "2026-11"],
    ["hb-hfc", /^Harbour Bay.*Horizon/, "20:30", "2026-11-04"],
    ["skp-hfc", /^Sekupang.*BatamFast/, "17:40", "2026-11-01"],
    ["skp-hfc", /^Sekupang.*Majestic/, "18:00", "2026-05"],
    ["skp-hfc", /^Sekupang.*Sindo/, "20:30", "2026-11"],
    ["btc-tmft", /^Batam Centre.*Majestic/, "19:50", "2026-05"],
    ["btc-tmft", /^Batam Centre.*BatamFast/, "13:20", "2026-11-01"],
    ["btc-tmft", /^Batam Centre.*Sindo/, "13:20", "2026-11"],
    ["nsp-tmft", /^Nongsapura.*BatamFast/, "20:00", "2026-11-01"],
    ["btc-stl", /^Batam Centre.*Indomas/, "13:30", "2026-01-01"],
    ["hb-ph", /^Harbour Bay/, "07:15", "2026-11-03"],
    ["tpg-tgu-roro", /^Telaga Punggur/, "18:00", "2026-10-09"],
    ["tpg-tpi", /^Telaga Punggur/, "17:30", "2026-07"],
    ["tpg-tgu", /^Telaga Punggur/, "18:00", "2026-02"],
  ];
  for (const [rute, pola, jam, tanggal] of kasus) {
    it(`${rute} ${pola.source}: ${jam}`, () => {
      const h = cari(rute, pola);
      expect(h.jam).toBe(jam);
      expect(h.tanggalData).toBe(tanggal);
      expect(h.zona).toBe("Asia/Jakarta");
      expect(h.jamWib).toBeNull();
    });
  }
});

describe("dari luar Batam, waktu lokal", () => {
  const kasus: [string, RegExp, string, string][] = [
    ["btc-hfc", /^HarbourFront.*BatamFast/, "21:40", "20:40"],
    ["btc-hfc", /^HarbourFront.*Sindo/, "21:50", "20:50"],
    ["btc-hfc", /^HarbourFront.*Majestic/, "21:20", "20:20"],
    ["hb-hfc", /^HarbourFront.*Horizon/, "21:35", "20:35"],
    ["skp-hfc", /^HarbourFront.*BatamFast/, "19:30", "18:30"],
    ["skp-hfc", /^HarbourFront.*Majestic/, "20:40", "19:40"],
    ["nsp-tmft", /^Tanah Merah/, "20:20", "19:20"],
    ["hb-ph", /^Puteri/, "18:30", "17:30"],
    ["btc-stl", /^Stulang/, "17:00", "16:00"],
  ];
  for (const [rute, pola, jam, jamWib] of kasus) {
    it(`${rute} ${pola.source}: ${jam} = ${jamWib} WIB`, () => {
      const h = cari(rute, pola);
      expect(h.arah).toBe("ke_batam");
      expect(h.jam).toBe(jam);
      expect(h.jamWib).toBe(jamWib);
    });
  }
});

describe("jebakan data", () => {
  it("(a) tpg-tpi tidak mengambil maksimum array pagi, tetapi jam tutup operasi", () => {
    const h = cari("tpg-tpi", /Telaga Punggur/);
    expect(h.jenisJadwal).toBe("operasi");
    expect(h.jam).toBe("17:30");
    expect(h.perkiraan).toBe(true);
    expect(h.operator).toContain("Oceanna");
    expect(cari("tpg-tpi", /Telaga/, wib(KAMIS, "17:31")).status).toBe("sudah_lewat");
  });

  it("(b) tpg-tgu speedboat tanpa jam memakai jam operasi", () => {
    const h = cari("tpg-tgu", /Telaga Punggur/);
    expect(h.jam).toBe("18:00");
    expect(h.perkiraan).toBe(true);
    expect(h.operasi).toEqual({ buka: "07:00", tutup: "18:00", interval: "tiap ±30 menit" });
  });

  it("(c) skp-tbk hanya 07:20, jadwal lama 16:15 tidak jadi terakhir", () => {
    const baris = hitungFeri(ENTRI_FERI, wib(KAMIS, "06:00")).filter((h) => h.ruteId === "skp-tbk");
    expect(baris).toHaveLength(1);
    expect(baris[0].jam).toBe("07:20");
    expect(baris[0].adaJadwalUsang).toBe(true);
    expect(cari("skp-tbk", /Sekupang/, wib(KAMIS, "12:00")).status).toBe("sudah_lewat");
  });

  it("(d) RoRo menggabung dua kapal dan menyebut kapal terakhir", () => {
    const pergi = cari("tpg-tgu-roro", /^Telaga Punggur/);
    expect(pergi.jam).toBe("18:00");
    expect(pergi.catatanTrip).toBe("KMP Trisakti Adinda");
    expect(pergi.operator).toBe("ASDP");
    expect(pergi.contoh).toBe(true);
    const balik = cari("tpg-tgu-roro", /^Tanjung Uban/);
    expect(balik.arah).toBe("ke_batam");
    expect(balik.catatanTrip).toBe("KMP Tanjung Burang");
  });

  it("(e) Pelni bukan jadwal harian dan tidak pernah punya jam terakhir", () => {
    const baris = hitungFeri(ENTRI_FERI, wib("2026-08-05", "10:00")).filter((h) => h.ruteId === "b99-pelni");
    expect(baris).toHaveLength(2);
    for (const h of baris) {
      expect(h.status).toBe("bukan_harian");
      expect(h.jam).toBeNull();
    }
    expect(teksStatus(baris[0])).toContain("Bukan jadwal harian");
    expect(teksStatus(baris[0])).toContain("Rabu, 5 Agustus 2026");
    expect(teksStatus(baris[0])).toContain("pukul 16.00 WIB");
  });

  it("(f) tanda hari per trip: Sekupang dari HarbourFront dan Sekupang ke HarbourFront", () => {
    expect(bacaHari("Kam–Min")).toEqual([4, 5, 6, 0]);
    expect(bacaHari("Sab–Min")).toEqual([6, 0]);
    expect(bacaHari("Jum–Min")).toEqual([5, 6, 0]);
    expect(bacaHari("Sab–Sen")).toEqual([6, 0, 1]);
    expect(bacaHari("Minggu")).toEqual([0]);
    expect(bacaHari("setiap hari")).toBeNull();
    expect(bacaHari(null)).toBeNull();
    // BatamFast Tanah Merah ke Batam Centre: 20:30 hanya Kam-Min, 17:40 hanya Minggu.
    expect(cari("btc-tmft", /^Tanah Merah.*BatamFast/, wib(KAMIS, "12:00")).jam).toBe("20:30");
    expect(cari("btc-tmft", /^Tanah Merah.*BatamFast/, wib("2026-11-03", "12:00")).jam).toBe("17:20");
    expect(cari("btc-tmft", /^Tanah Merah.*BatamFast/, wib(MINGGU, "12:00")).jam).toBe("20:30");
    // Tanda "Sindo" pada trip berarti dioperasikan Sindo.
    const entri = ENTRI_FERI.find((e) => e.ruteId === "skp-hfc" && e.asal === "Sekupang" && e.operator === "BatamFast");
    expect(entri?.trips.find((t) => t.jam === "07:00")?.catatan).toBe("dioperasikan Sindo");
    expect(entri?.trips.find((t) => t.jam === "15:30")?.hari).toEqual([5, 6, 0]);
  });

  it("(f) hari di tingkat entri: Waterfront City hanya akhir pekan", () => {
    const kamis = cari("wfc-hfc", /^Waterfront/, wib(KAMIS, "10:00"));
    expect(kamis.status).toBe("tidak_hari_ini");
    expect(kamis.jam).toBeNull();
    expect(teksStatus(kamis)).toContain("Sabtu—Minggu");
    const sabtu = cari("wfc-hfc", /^Waterfront/, wib(SABTU, "10:00"));
    expect(sabtu.status).toBe("masih_ada");
    expect(sabtu.jam).toBe("14:50");
    expect(cari("wfc-hfc", /^Waterfront/, wib(MINGGU, "15:00")).status).toBe("sudah_lewat");
    // Dari Singapura: Jumat 23:30 WIB sudah Sabtu di SGT.
    expect(cari("wfc-hfc", /^HarbourFront/, wib(JUMAT, "23:30")).status).toBe("masih_ada");
  });

  it("(g) semua jam Majestic bertanda perlu cek", () => {
    const majestic = ENTRI_FERI.filter((e) => /majestic/i.test(e.operator ?? "") && e.jenisJadwal === "jam");
    expect(majestic.length).toBeGreaterThanOrEqual(6);
    for (const e of majestic) expect(e.perluCek, `${e.ruteId} ${e.asal}`).toBe(true);
  });

  it("(h) dua versi Sindo Batam Centre dan Sekupang 20:30 perlu cek, BatamFast tidak", () => {
    expect(cari("btc-hfc", /^Batam Centre.*Sindo/).perluCek).toBe(true);
    expect(cari("skp-hfc", /^Sekupang.*Sindo/).perluCek).toBe(true);
    expect(cari("btc-hfc", /^Batam Centre.*BatamFast/).perluCek).toBe(false);
    expect(cari("hb-hfc", /^Harbour Bay.*Horizon/).perluCek).toBe(false);
  });

  it("zona_waktu null tidak dipakai menghitung", () => {
    const hasil = hitungFeri(ENTRI_FERI, wib(KAMIS, "12:00"));
    const gcb = hasil.filter((h) => h.ruteId === "gcb-hfc");
    expect(gcb).toHaveLength(2);
    for (const h of gcb) {
      expect(h.status).toBe("zona_belum_jelas");
      expect(h.jam).toBeNull();
      expect(h.terganggu).toBe(true);
    }
    const blp = hasil.find((h) => h.ruteId === "skp-blp");
    expect(blp?.status).toBe("teks");
    expect(blp?.jam).toBeNull();
    expect(teksStatus(blp!)).toContain("24 jam");
    expect(hasil.find((h) => h.ruteId === "batam-pasirgudang")?.status).toBe("belum_tersedia");
  });

  it("hari tertentu tidak dianggap berlayar hari ini", () => {
    for (const id of ["tpg-trp", "tpg-senayang"]) {
      const h = cari(id, /Telaga Punggur/);
      expect(h.status).toBe("hari_tertentu");
      expect(h.jam).toBeNull();
      expect(teksStatus(h)).toContain("Belum tentu hari ini");
    }
  });
});

describe("rute tanpa jadwal", () => {
  it("semua rute muncul, yang tanpa jadwal tertulis belum tersedia", () => {
    const hasil = hitungFeri(ENTRI_FERI, wib(KAMIS, "12:00"));
    const ada = new Set(hasil.map((h) => h.ruteId));
    for (const r of SEMUA_RUTE) expect(ada.has(r.id), r.id).toBe(true);
    const kosong = [
      "sgl-buluh",
      "ktp-ngenang",
      "smb-mubut",
      "sbd-abang",
      "blp-kasu",
      "hb-nirup",
      "batam-pasirgudang",
      "tpg-roro-mengkapan-kualatungkal",
      "hb-domestik-tbk-moro",
      "pr-tgr-riau",
      "pr-jb1-wisata",
      "pr-jb2-panjang",
    ];
    for (const id of kosong) {
      const h = hasil.find((x) => x.ruteId === id);
      expect(h?.status, id).toBe("belum_tersedia");
      expect(teksStatus(h!)).toBe("Jadwal belum tersedia");
    }
  });

  it("rute yang hanya punya jadwal usang: belum tersedia, bukan jam lama", () => {
    for (const id of ["skp-dumai", "skp-kundur-penyalai", "pr-blp-kasu-geranting"]) {
      const h = hitungFeri(ENTRI_FERI, wib(KAMIS, "01:00")).find((x) => x.ruteId === id);
      expect(h?.status, id).toBe("belum_tersedia");
      expect(h?.adaJadwalUsang, id).toBe(true);
      expect(h?.jam).toBeNull();
    }
  });

  it("tiap entri jadwal.json dikenal rute.json", () => {
    const id = new Set([...ruteRaw.rute, ...ruteRaw.rute_tambahan].map((r) => r.id));
    for (const j of jadwalRaw.jadwal) expect(id.has(j.rute_id), j.rute_id).toBe(true);
  });
});

describe("usia data", () => {
  const sekarang = wib(KAMIS, "12:00");
  it("tanggal lengkap, bulan, tahun, dan kosong", () => {
    expect(umurData("2026-11-05", sekarang)).toBe(0);
    expect(umurData("2026-11", sekarang)).toBe(4);
    expect(umurData("2025", sekarang)).toBe(673);
    expect(umurData(null, sekarang)).toBeNull();
    expect(umurData("kira-kira", sekarang)).toBeNull();
  });

  it("banner tepat setelah 60 hari, dan tanggal tak diketahui dianggap lama", () => {
    expect(dataSudahLama("2026-09-06", sekarang)).toBe(false);
    expect(dataSudahLama("2026-09-05", sekarang)).toBe(true);
    expect(dataSudahLama(null, sekarang)).toBe(true);
    expect(cari("btc-hfc", /^Batam Centre.*Majestic/).dataLama).toBe(true);
    expect(cari("btc-hfc", /^Batam Centre.*BatamFast/).dataLama).toBe(false);
  });

  it("usia memakai tanggal Batam, bukan UTC", () => {
    // 00:30 WIB 6 Nov masih 5 Nov di UTC.
    expect(umurData("2026-11-05", wib(JUMAT, "00:30"))).toBe(1);
  });

  it("tanggal ditulis untuk warga", () => {
    expect(teksTanggal("2026-11-01")).toBe("1 November 2026");
    expect(teksTanggal("2026-05")).toBe("Mei 2026");
    expect(teksTanggal("2025")).toBe("2025");
    expect(teksTanggal(null)).toBe("tanggal tidak tercatat");
  });
});

describe("kalimat kotak Hari Ini", () => {
  it("siang hari: terakhir 20.30 dari Batam Centre dan Harbour Bay, tanpa jam yang diragukan", () => {
    const r = ringkasHariIni(hitungFeri(ENTRI_FERI, wib(KAMIS, "12:00")));
    expect(r.judul).toBe("Feri terakhir ke Singapura hari ini: pukul 20.30 WIB dari Batam Centre dan Harbour Bay.");
    expect(r.rincian).toContain("Nongsapura 20.00 WIB");
    expect(r.rincian).toContain("Sekupang 17.40 WIB");
    expect(r.judul).not.toContain("20.35");
    expect(`${r.judul} ${r.rincian}`).not.toMatch(/\d:\d{2}/);
  });

  it("setelah 20.30 memakai bentuk sudah lewat dengan keberangkatan pertama besok dari data", () => {
    const r = ringkasHariIni(hitungFeri(ENTRI_FERI, wib(KAMIS, "21:00")));
    expect(r.judul).toBe("Tidak ada lagi keberangkatan ke Singapura hari ini.");
    expect(r.rincian).toBe("Besok mulai pukul 06.00 WIB.");
  });

  it("keberangkatan pertama besok mengikuti hari besok, bukan hari ini", () => {
    // Waterfront City hanya Sabtu dan Minggu: Jumat sudah punya keberangkatan besok, Minggu tidak.
    const wfc = ENTRI_FERI.filter((e) => e.ruteId === "wfc-hfc" && e.asal.startsWith("Waterfront"));
    expect(hitungFeri(wfc, wib(JUMAT, "12:00"))[0].pertamaBesok).toBe("13:20");
    expect(hitungFeri(wfc, wib(MINGGU, "12:00"))[0].pertamaBesok).toBeNull();
  });

  it("sebagian terminal sudah tutup: acuan turun ke yang masih ada", () => {
    const entri: EntriFeri[] = ENTRI_FERI.filter((e) => e.ruteId === "skp-hfc" || e.ruteId === "nsp-tmft");
    const r = ringkasHariIni(hitungFeri(entri, wib(KAMIS, "18:00")));
    expect(r.judul).toBe("Feri terakhir ke Singapura hari ini: pukul 20.00 WIB dari Nongsapura.");
    expect(r.rincian).toContain("Sekupang 17.40 WIB");
  });

  it("tanpa data: jujur, dan tanpa ajakan cek langsung", () => {
    const r = ringkasHariIni([]);
    expect(r.judul).toBe("Jadwal feri ke Singapura belum tersedia.");
    expect(r.rincian).toBe("Tanyakan jadwal kepada operator.");
  });

  it("jadwal lama ditulis satu kalimat dengan tanggalnya", () => {
    const r = ringkasHariIni(hitungFeri(ENTRI_FERI, wib("2027-03-01", "12:00")));
    expect(r.adaDataLama).toBe(true);
    expect(r.rincian).toMatch(/Jadwal per \d+ November 2026\. Tanyakan kepada operator\./);
  });
});

describe("normalisasi", () => {
  const rute: RuteMentah = { id: "x", asal_id: "a", tujuan: "B", operator: ["Op"], jenis: "domestik" };
  const jadwal = (j: Partial<JadwalMentah>): JadwalMentah => ({
    rute_id: "x",
    arah: "A -> B (WIB)",
    jam_berangkat: ["08:00", "09:00"],
    tanggal_data: "2026-11-01",
    zona_waktu: "Asia/Jakarta",
    ...j,
  });

  it("zona tak dikenal diperlakukan seperti null", () => {
    const [e] = normalisasi([jadwal({ zona_waktu: "Mars/Olympus" })], [rute]);
    expect(e.jenisJadwal).toBe("zona_belum_jelas");
  });

  it("jam tidak diambil dari array bila ada jam operasi, juga dengan tanda hubung biasa", () => {
    const [e] = normalisasi([jadwal({ hari: "operasi 06:00-21:15 tiap ±10 menit" })], [rute]);
    const h = hitungSatu(e, wib(KAMIS, "20:00"));
    expect(h.jam).toBe("21:15");
    expect(h.perkiraan).toBe(true);
  });

  it("nama terminal dipakai untuk rute tanpa jadwal", () => {
    const [e] = normalisasi([], [rute], { a: "Terminal A" });
    expect(e.asal).toBe("Terminal A");
    expect(e.jenisJadwal).toBe("belum_tersedia");
  });

  it("teks kolom hari bersih dari istilah penyusun", () => {
    for (const e of ENTRI_FERI) {
      expect(e.hariTeks ?? "", e.ruteId).not.toMatch(/perlu_|PDF|\(\s*$/);
    }
  });
});

describe("terminal untuk detail Makan", () => {
  it("id Makan dipetakan lewat id kanonik", () => {
    expect(terminalDariMakan("batam-centre")).toBe("btc");
    expect(terminalDariMakan("harbour-bay")).toBe("hb");
    expect(terminalDariMakan("sekupang")).toBe("skp");
    expect(terminalDariMakan("nongsapura")).toBe("nsp");
    expect(terminalDariMakan("tidak-ada")).toBeNull();
  });

  it("baris Sekupang memuat rute Singapura dan domestiknya, Pasir Gudang muncul di tiga terminal", () => {
    const hasil = hitungFeri(ENTRI_FERI, wib(KAMIS, "12:00"));
    const skp = dariTerminal(hasil, "skp");
    expect(skp.some((h) => h.ruteId === "skp-hfc")).toBe(true);
    expect(skp.some((h) => h.ruteId === "skp-tbk")).toBe(true);
    expect(skp.every((h) => h.arah === "dari_batam")).toBe(true);
    expect(dariTerminal(hasil, "nsp").some((h) => h.ruteId === "batam-pasirgudang")).toBe(true);
  });
});

describe("kartu rute dan pompong", () => {
  it("harga tanpa kata mulai ganda", () => {
    const pelni = SEMUA_RUTE.find((r) => r.id === "b99-pelni")!;
    expect(hargaMulaiDari(pelni)).toContain("ekonomi sekitar Rp267.000");
    expect(hargaMulaiDari(pelni)).not.toMatch(/mulai/i);
    expect(hargaMulaiDari(SEMUA_RUTE.find((r) => r.id === "tpg-senayang")!)).toBe("Rp212.000—Rp252.000");
    expect(hargaMulaiDari(SEMUA_RUTE.find((r) => r.id === "hb-nirup")!)).toBeNull();
  });

  it("tidak ada catatan penyusun di kartu", () => {
    const teks = JSON.stringify([KARTU_FERI, BARIS_POMPONG]);
    expect(teks).not.toMatch(/Catatan migrasi|Claude|perlu_cek|perlu_diisi|laporan|R7W6|easybook/);
    expect(teks).not.toMatch(
      /perlu cek ulang|data lama|mungkin usang|data lemah|jam dari berita|sumber sekunder|Moovit/i,
    );
    expect(teks).not.toMatch(/\d{2}:\d{2}/);
  });

  it("tautan ke situs pemerintah tidak tampil", () => {
    const tautan = [
      ...KARTU_FERI.map((k) => k.link),
      ...ENTRI_FERI.map((e) => e.link),
      ...TAUTAN_OPERATOR.map((o) => o.url),
    ];
    expect(tautan.join(" ")).not.toMatch(/\.go\.id/);
    // Kolom datanya tetap ada.
    expect(SEMUA_RUTE.find((r) => r.id === "tpg-tpi")?.link_jadwal_resmi).toMatch(/\.go\.id/);
  });

  it("kolom kartu: rute dan operator terpisah, jadwal usang tanpa tanggal tidak tampil", () => {
    const btc = KARTU_FERI.find((k) => k.id === "btc-hfc")!;
    expect(btc.jadwal[0].rute).toBe("Batam Centre → HarbourFront");
    expect(btc.jadwal[0].operator).toBe("BatamFast");
    expect(btc.jadwal[0].jam[0].jam).toMatch(/^\d{2}\.\d{2}$/);
    expect(KARTU_FERI.find((k) => k.id === "skp-tbk")?.jadwal).toHaveLength(1);
    expect(KARTU_FERI.find((k) => k.id === "skp-dumai")?.jadwal).toHaveLength(0);
  });

  it("zona waktu ditulis menurut pedoman", () => {
    const zona = KARTU_FERI.flatMap((k) => k.jadwal.map((j) => j.zona));
    expect(zona).toContain("WIB");
    expect(zona).toContain("waktu Singapura");
    expect(zona).toContain("waktu Malaysia");
  });

  it("pompong: hanya Sekupang-Belakang Padang bernada tegas", () => {
    expect(BARIS_POMPONG.filter((b) => b.tegas).map((b) => b.id)).toEqual(["skp-blp"]);
    const skp = BARIS_POMPONG.find((b) => b.id === "skp-blp")!;
    expect(skp.tarif).toContain("Rp20.000 per orang");
    // Tahun tarif lama tetap terbaca di kolom tarif, tanpa kolom status data.
    expect(BARIS_POMPONG.find((b) => b.id === "pr-jb2-panjang")?.tarif).toBe("Rp60.000 pulang pergi (2014)");
    expect(BARIS_POMPONG.find((b) => b.id === "sbd-abang")?.jam).toBe("tidak ada kapal rutin");
  });

  it("kartu Gold Coast membawa banner terganggu, RoRo menyebut hanya online", () => {
    expect(KARTU_FERI.find((k) => k.id === "gcb-hfc")?.terganggu).toContain("Terganggu");
    expect(KARTU_FERI.find((k) => k.id === "tpg-tgu-roro")?.catatan).toContain("hanya dijual daring");
  });
});
