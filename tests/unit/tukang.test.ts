import { readFileSync } from "node:fs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import taksonomi from "@/data/taksonomi/taksonomi.json";
import {
  sandiContohBenar,
  kukiContohBenar,
  nilaiKukiContoh,
  peranModerator,
  asalSama,
} from "@/features/tukang/admin-auth";
import {
  hariIni,
  jumlahPerekomendasi,
  kePublik,
  kontakSah,
  kunciTukang,
  normalKontak,
  saringPublik,
  samarkanKontak,
  syaratTampil,
  tautanTelepon,
  teksBulan,
  teksTerakhirDicek,
  teksTerakhirDiperiksa,
  type RekomendasiBaris,
  type TukangBaris,
} from "@/features/tukang/aturan";
import { buatBatasLaju, ipDari } from "@/features/tukang/batas-laju";
import { alasanCekUlang, lewatEnamBulan } from "@/features/tukang/cek-ulang";
import { GalatTidakAda } from "@/features/tukang/galat";
import { hashKontak } from "@/features/tukang/hash";
import { KATEGORI_JASA, TAG_REKOMENDASI, teksTag } from "@/features/tukang/kategori";
import {
  bacaTempelan,
  csvHalte,
  csvTempat,
  jsonKoordinat,
  koordinatSah,
  kunciIsian,
  type TitikKoordinat,
} from "@/features/tukang/koordinat";
import { modeKiriman } from "@/features/tukang/mode";
import {
  SkemaFoto,
  SkemaKoreksi,
  SkemaLaporan,
  SkemaRekomendasi,
  type InputRekomendasi,
} from "@/features/tukang/skema";
import { ambilStore } from "@/features/tukang/store";
import { buatStoreContoh, dataAwalContoh, type DataContoh } from "@/features/tukang/store-contoh";
import { buatStoreSupabase } from "@/features/tukang/store-supabase";
import { daftarTitik } from "@/features/tukang/titik-admin";
import { POST as postKoreksi } from "@/app/api/koreksi/route";
import { POST as postFoto } from "@/app/api/kiriman-foto/route";
import { POST as postLaporkan } from "@/app/api/tukang/laporkan/route";
import { POST as postRekomendasi } from "@/app/api/tukang/rekomendasi/route";
import { POST as postSinyal } from "@/app/api/tukang/sinyal/route";

const ID_A = "00000000-0000-4000-8000-000000000001";

function tukang(isi: Partial<TukangBaris> = {}): TukangBaris {
  return {
    id: ID_A,
    kunci: "k",
    nama: "Penjahit Uji",
    jasa: "jahit-permak",
    areaKecamatan: ["Sekupang"],
    areaCatatan: null,
    panggilan: false,
    caraHubungi: "kontak-tukang-rahasia",
    statusModerasi: "disetujui",
    izinTukangAt: "2026-11-01T00:00:00Z",
    kontakBolehTampil: false,
    disembunyikan: false,
    terakhirDicek: "2026-11-01",
    dibuatAt: "2026-11-01T00:00:00Z",
    ...isi,
  };
}

function rek(kontak: string, statusModerasi: RekomendasiBaris["statusModerasi"] = "disetujui"): RekomendasiBaris {
  return {
    id: `r-${kontak}`,
    tukangId: ID_A,
    cerita: "Cerita uji yang cukup panjang.",
    tag: ["rapi"],
    kapanDipakai: "2026-10",
    kontakPerekomendasi: kontak,
    kontakHash: hashKontak(kontak),
    statusModerasi,
    dibuatAt: "2026-11-01T00:00:00Z",
  };
}

const KIRIMAN = {
  nama_tukang: "Penjahit Uji Baru",
  jasa: "jahit-permak",
  area_kecamatan: ["Sekupang"],
  cara_hubungi: "Kios di pasar",
  kapan_dipakai: "2026-10",
  cerita: "Celana saya dipermak rapi dan selesai dua hari.",
  tag: ["rapi"],
  kontak_perekomendasi: "warga-a@contoh.invalid",
  bukan_pemilik: true,
  setuju: true,
};
const input = (isi: Record<string, unknown> = {}) => SkemaRekomendasi.parse({ ...KIRIMAN, ...isi });

describe("syarat tampil", () => {
  it("butuh minimal dua perekomendasi berbeda", () => {
    expect(syaratTampil(tukang(), []).boleh).toBe(false);
    expect(syaratTampil(tukang(), [rek("a@contoh.invalid")]).boleh).toBe(false);
    expect(syaratTampil(tukang(), [rek("a@contoh.invalid"), rek("b@contoh.invalid")]).boleh).toBe(true);
  });

  it("orang yang sama mengirim berkali-kali tetap dihitung satu, termasuk beda penulisan", () => {
    const sama = [rek("0812-3456-7890"), rek("+62 812 3456 7890"), rek("6281234567890")];
    expect(jumlahPerekomendasi(sama)).toBe(1);
    expect(syaratTampil(tukang(), sama).boleh).toBe(false);
    expect(jumlahPerekomendasi([rek("Warga@Contoh.Invalid"), rek("warga@contoh.invalid")])).toBe(1);
  });

  it("rekomendasi yang belum disetujui atau ditolak tidak dihitung", () => {
    expect(syaratTampil(tukang(), [rek("a@x.invalid"), rek("b@x.invalid", "menunggu")]).boleh).toBe(false);
    expect(syaratTampil(tukang(), [rek("a@x.invalid"), rek("b@x.invalid", "ditolak")]).boleh).toBe(false);
  });

  it("dua rekomendasi saja belum cukup tanpa moderator, izin tukang, dan tanpa laporan", () => {
    const dua = [rek("a@x.invalid"), rek("b@x.invalid")];
    expect(syaratTampil(tukang({ statusModerasi: "menunggu" }), dua).boleh).toBe(false);
    expect(syaratTampil(tukang({ statusModerasi: "ditolak" }), dua).boleh).toBe(false);
    expect(syaratTampil(tukang({ izinTukangAt: null }), dua).boleh).toBe(false);
    expect(syaratTampil(tukang({ disembunyikan: true }), dua).boleh).toBe(false);
  });

  it("menyebut apa yang kurang", () => {
    const h = syaratTampil(tukang({ statusModerasi: "menunggu", izinTukangAt: null }), [rek("a@x.invalid")]);
    expect(h.kurang).toEqual([
      "Butuh 1 rekomendasi lagi dari warga berbeda",
      "Izin tukang belum dicatat",
      "Belum disetujui moderator",
    ]);
  });
});

describe("kePublik", () => {
  const dua = [rek("rahasia-a@x.invalid"), rek("rahasia-b@x.invalid")];

  it("null kalau belum lolos", () => {
    expect(kePublik(tukang(), dua.slice(0, 1), { masihBuka: 0, sudahPindah: 0 })).toBeNull();
  });

  it("tidak membawa kontak perekomendasi, hash, atau kunci", () => {
    const hasil = JSON.stringify(kePublik(tukang(), dua, { masihBuka: 1, sudahPindah: 0 }));
    expect(hasil).not.toContain("rahasia-a");
    expect(hasil).not.toContain(hashKontak("rahasia-a@x.invalid"));
    expect(hasil).not.toMatch(/kontakHash|kontakPerekomendasi|kunci/);
  });

  it("kontak tukang hanya keluar kalau diizinkan", () => {
    expect(kePublik(tukang(), dua, { masihBuka: 0, sudahPindah: 0 })?.kontak).toBeNull();
    expect(kePublik(tukang({ kontakBolehTampil: true }), dua, { masihBuka: 0, sudahPindah: 0 })?.kontak).toBe(
      "kontak-tukang-rahasia",
    );
  });

  it("tidak ada kolom rating", () => {
    const hasil = kePublik(tukang(), dua, { masihBuka: 0, sudahPindah: 0 });
    expect(Object.keys(hasil ?? {}).filter((k) => /rating|bintang|skor/i.test(k))).toEqual([]);
  });

  it("menyaring per jasa dan kecamatan", () => {
    const a = kePublik(tukang(), dua, { masihBuka: 0, sudahPindah: 0 });
    const daftar = a ? [a] : [];
    expect(saringPublik(daftar, { jasa: "laundry" })).toEqual([]);
    expect(saringPublik(daftar, { kecamatan: "Bulang" })).toEqual([]);
    expect(saringPublik(daftar, { jasa: "jahit-permak", kecamatan: "Sekupang" })).toHaveLength(1);
  });
});

describe("kontak", () => {
  it("menormalkan dan memvalidasi", () => {
    expect(normalKontak("0812 3456 7890")).toBe("6281234567890");
    expect(kontakSah("0812 3456 7890")).toBe(true);
    expect(kontakSah("warga@contoh.invalid")).toBe(true);
    expect(kontakSah("bukan kontak")).toBe(false);
    expect(kontakSah("123")).toBe(false);
  });

  it("menyamarkan", () => {
    expect(samarkanKontak("warga@contoh.invalid")).toBe("w***@contoh.invalid");
    expect(samarkanKontak("0812 3456 7890")).toBe("62***90");
    expect(samarkanKontak(null)).toBeNull();
  });

  it("kunci tukang mencocokkan nomor, dan condong memisah nama yang sama di kecamatan lain", () => {
    const dasar = { jasa: "laundry", nama: "Pak Uji", areaKecamatan: ["Sekupang"] };
    expect(kunciTukang({ ...dasar, caraHubungi: "WA 0812-3456-7890" })).toBe(
      kunciTukang({ ...dasar, nama: "Laundry Uji", caraHubungi: "+62 812 3456 7890" }),
    );
    expect(kunciTukang({ ...dasar, caraHubungi: "Kios" })).toBe(
      kunciTukang({ ...dasar, nama: "PAK  uji!", caraHubungi: "Datang saja" }),
    );
    expect(kunciTukang({ ...dasar, caraHubungi: "Kios" })).not.toBe(
      kunciTukang({ ...dasar, areaKecamatan: ["Bulang"], caraHubungi: "Kios" }),
    );
  });
});

describe("validasi kiriman", () => {
  it("menerima kiriman lengkap", () => {
    expect(SkemaRekomendasi.safeParse(KIRIMAN).success).toBe(true);
  });

  it.each([
    ["nama_tukang", { nama_tukang: "" }],
    ["jasa", { jasa: "listing-berbayar" }],
    ["area_kecamatan", { area_kecamatan: [] }],
    ["area_kecamatan", { area_kecamatan: ["Kecamatan Karangan"] }],
    ["cara_hubungi", { cara_hubungi: "" }],
    ["kapan_dipakai", { kapan_dipakai: "kemarin" }],
    ["kapan_dipakai", { kapan_dipakai: "2999-01" }],
    ["cerita", { cerita: "pendek" }],
    ["cerita", { cerita: "Hubungi saja nomornya di 0812 3456 7890 ya, orangnya baik." }],
    ["nama_tukang", { nama_tukang: "Pak Uji 081234567890" }],
    ["tag", { tag: ["bintang lima"] }],
    ["kontak_perekomendasi", { kontak_perekomendasi: "rahasia" }],
    ["bukan_pemilik", { bukan_pemilik: false }],
    ["setuju", { setuju: false }],
  ])("menolak %s yang salah", (kolom, isi) => {
    const h = SkemaRekomendasi.safeParse({ ...KIRIMAN, ...isi });
    expect(h.success).toBe(false);
    expect(h.error?.issues.some((g) => g.path[0] === kolom)).toBe(true);
  });

  it("tukang tidak bisa merekomendasikan dirinya sendiri", () => {
    const h = SkemaRekomendasi.safeParse({
      ...KIRIMAN,
      cara_hubungi: "WA 0812-3456-7890",
      kontak_perekomendasi: "+62 812 3456 7890",
    });
    expect(h.success).toBe(false);
    expect(h.error?.issues[0].path[0]).toBe("kontak_perekomendasi");
  });

  it("koreksi boleh tanpa kontak, kecuali soal data pribadi", () => {
    const dasar = { jenis: "data_salah", isi: "Tempat ini sudah pindah sejak lama." };
    expect(SkemaKoreksi.safeParse(dasar).success).toBe(true);
    expect(SkemaKoreksi.safeParse({ ...dasar, jenis: "hapus_data" }).success).toBe(false);
    expect(SkemaKoreksi.safeParse({ ...dasar, jenis: "hapus_data", kontak: "a@b.invalid" }).success).toBe(false);
    expect(SkemaKoreksi.safeParse({ ...dasar, jenis: "hapus_data", kontak: "a@b.invalid", setuju: true }).success).toBe(
      true,
    );
    expect(SkemaKoreksi.safeParse({ ...dasar, kontak: "bukan kontak", setuju: true }).success).toBe(false);
  });

  it("foto wajib punya izin dan hak", () => {
    const dasar = {
      judul: "Pelabuhan lama",
      lokasi: "Sekupang",
      perkiraan_tahun: "sekitar 1990-an",
      kredit: "Warga Uji",
      kontak: "a@b.invalid",
      punya_hak: true,
      izin_tampil: true,
    };
    expect(SkemaFoto.safeParse(dasar).success).toBe(true);
    expect(SkemaFoto.safeParse({ ...dasar, izin_tampil: false }).success).toBe(false);
    expect(SkemaFoto.safeParse({ ...dasar, punya_hak: false }).success).toBe(false);
  });

  it("laporan butuh id entri yang sah", () => {
    expect(SkemaLaporan.safeParse({ tukang_id: "1 or 1=1", alasan: "Orangnya kasar" }).success).toBe(false);
  });
});

describe("mode", () => {
  const penuh = { NEXT_PUBLIC_SUPABASE_URL: "u", NEXT_PUBLIC_SUPABASE_ANON_KEY: "a", SUPABASE_SERVICE_ROLE_KEY: "s" };

  it("produksi tanpa Supabase = mati, data fiktif tidak tampil", () => {
    expect(modeKiriman({ NODE_ENV: "production" })).toBe("mati");
    expect(ambilStore({ NODE_ENV: "production" })).toBeNull();
  });
  it("produksi hanya berisi contoh kalau diminta eksplisit", () => {
    expect(modeKiriman({ NODE_ENV: "production", NEXT_PUBLIC_MODE_CONTOH: "1" })).toBe("contoh");
    expect(modeKiriman({ NODE_ENV: "production", NEXT_PUBLIC_MODE_CONTOH: "0" })).toBe("mati");
  });
  it("dev tanpa Supabase = contoh", () => {
    expect(modeKiriman({ NODE_ENV: "development" })).toBe("contoh");
  });
  it("Supabase menang atas contoh", () => {
    expect(modeKiriman({ ...penuh, NODE_ENV: "production", NEXT_PUBLIC_MODE_CONTOH: "1" })).toBe("supabase");
  });
  it("Supabase terisi sebagian = mati, tidak jatuh ke data fiktif", () => {
    expect(modeKiriman({ NODE_ENV: "development", NEXT_PUBLIC_SUPABASE_URL: "u" })).toBe("mati");
    expect(modeKiriman({ NODE_ENV: "production", NEXT_PUBLIC_SUPABASE_URL: "u", NEXT_PUBLIC_MODE_CONTOH: "1" })).toBe(
      "mati",
    );
  });
});

describe("store contoh", () => {
  let data: DataContoh;
  let store: ReturnType<typeof buatStoreContoh>;
  beforeEach(() => {
    data = dataAwalContoh();
    store = buatStoreContoh(data);
  });

  it("semua isi awal berlabel contoh fiktif dan kontaknya domain .invalid", async () => {
    for (const t of data.tukang) expect(t.nama).toMatch(/^Contoh fiktif: /);
    for (const r of data.rekomendasi) {
      expect(r.cerita).toMatch(/^Contoh fiktif\. /);
      expect(r.kontakPerekomendasi).toMatch(/@contoh\.invalid$/);
    }
    for (const t of await store.daftarPublik()) expect(t.nama).toContain("Contoh fiktif");
  });

  it("alur penuh: kirim, moderasi, tampil", async () => {
    const nama = () => store.daftarPublik().then((d) => d.map((t) => t.nama));
    await store.kirimRekomendasi(input());
    expect(await nama()).not.toContain("Contoh fiktif: Penjahit Uji Baru");

    await store.kirimRekomendasi(input({ kontak_perekomendasi: "warga-b@contoh.invalid" }));
    const t = data.tukang.find((x) => x.nama.endsWith("Penjahit Uji Baru"));
    if (!t) throw new Error("tukang tidak terbentuk");
    expect(data.rekomendasi.filter((r) => r.tukangId === t.id)).toHaveLength(2);
    expect(await nama()).not.toContain(t.nama);

    for (const r of data.rekomendasi.filter((x) => x.tukangId === t.id)) {
      await store.moderasi({ aksi: "setujui_rekomendasi", id: r.id });
    }
    expect(await nama()).not.toContain(t.nama);
    await store.moderasi({ aksi: "catat_izin", id: t.id, kontak_boleh_tampil: false, catatan: "" });
    expect(await nama()).not.toContain(t.nama);
    await store.moderasi({ aksi: "setujui_tukang", id: t.id });
    expect(await nama()).toContain(t.nama);
    expect(t.terakhirDicek).toBe(hariIni());

    expect(data.consent.filter((c) => c.tukangId === t.id).map((c) => c.subjek)).toEqual([
      "perekomendasi",
      "perekomendasi",
      "tukang",
    ]);
    expect(JSON.stringify(data.consent)).not.toContain("warga-b");
  });

  it("laporan menyembunyikan sampai ditinjau", async () => {
    await store.laporkanMasalah(ID_A, "Dia mengambil uang muka lalu hilang");
    expect((await store.daftarPublik()).map((t) => t.id)).not.toContain(ID_A);

    const { laporan } = await store.antrean();
    expect(laporan).toHaveLength(1);
    await store.moderasi({ aksi: "tinjau_laporan", id: laporan[0].id, tampilkan_lagi: false });
    expect((await store.daftarPublik()).map((t) => t.id)).not.toContain(ID_A);

    await store.laporkanMasalah("00000000-0000-4000-8000-000000000002", "Laporan lain");
    const kedua = (await store.antrean()).laporan[0];
    await store.moderasi({ aksi: "tinjau_laporan", id: kedua.id, tampilkan_lagi: true });
    expect((await store.daftarPublik()).map((t) => t.id)).toContain("00000000-0000-4000-8000-000000000002");
  });

  it("sinyal dihitung dan tidak mengubah terakhir dicek", async () => {
    const sebelum = data.tukang[0].terakhirDicek;
    await store.kirimSinyal(ID_A, "masih_buka");
    await store.kirimSinyal(ID_A, "sudah_pindah");
    const t = (await store.daftarPublik()).find((x) => x.id === ID_A);
    expect([t?.masihBuka, t?.sudahPindah, t?.terakhirDicek]).toEqual([1, 1, sebelum]);
  });

  it("tombol publik tidak bisa menyentuh entri yang belum tampil", async () => {
    const belum = "00000000-0000-4000-8000-000000000003";
    await expect(store.kirimSinyal(belum, "masih_buka")).rejects.toBeInstanceOf(GalatTidakAda);
    await expect(store.laporkanMasalah(belum, "apa saja")).rejects.toBeInstanceOf(GalatTidakAda);
  });

  it("antrean admin hanya membawa kontak tersamar", async () => {
    const teks = JSON.stringify(await store.antrean());
    expect(teks).not.toContain("warga-contoh-1@");
    expect(teks).toContain("w***@contoh.invalid");
    expect(teks).not.toMatch(/kontakHash|kontakPerekomendasi/);
  });

  it("menggabungkan dua entri tukang membuat rekomendasinya terhitung bersama", async () => {
    const c = "00000000-0000-4000-8000-000000000003";
    await store.kirimRekomendasi(input({ jasa: "tukang-kunci", nama_tukang: "Pak Kunci Beda Tulisan" }));
    const baru = data.tukang.find((t) => t.nama.endsWith("Pak Kunci Beda Tulisan"));
    if (!baru) throw new Error("tukang tidak terbentuk");
    await store.moderasi({ aksi: "gabungkan", id: baru.id, ke: c });
    expect(data.tukang.some((t) => t.id === baru.id)).toBe(false);
    expect(data.rekomendasi.filter((r) => r.tukangId === c)).toHaveLength(2);
  });

  it("menghapus data pengirim atas permintaan: rekomendasi dan kontak hilang, log tetap tanpa kontak", async () => {
    await store.kirimRekomendasi(input());
    await store.kirimKoreksi(
      SkemaKoreksi.parse({
        jenis: "hapus_data",
        isi: "Tolong hapus rekomendasi saya.",
        kontak: "WARGA-A@contoh.invalid",
        setuju: true,
      }),
    );
    const { koreksi } = await store.antrean();
    expect(koreksi[0].cocokRekomendasi).toBe(1);
    await store.moderasi({ aksi: "hapus_data_pengirim", id: koreksi[0].id });
    expect(data.rekomendasi.some((r) => r.kontakPerekomendasi === "warga-a@contoh.invalid")).toBe(false);
    expect(JSON.stringify(data)).not.toMatch(/warga-a@/i);
    expect(data.consent.at(-1)).toMatchObject({ subjek: "perekomendasi", aksi: "hapus" });
    expect((await store.antrean()).koreksi).toEqual([]);
  });

  it("menghapus entri tukang menghapus rekomendasinya", async () => {
    await store.moderasi({ aksi: "hapus_tukang", id: ID_A });
    expect(data.tukang.some((t) => t.id === ID_A)).toBe(false);
    expect(data.rekomendasi.some((r) => r.tukangId === ID_A)).toBe(false);
    await expect(store.moderasi({ aksi: "tandai_dicek", id: ID_A })).rejects.toBeInstanceOf(GalatTidakAda);
  });
});

// Klien tiruan yang meniru rantai query supabase-js. Hanya membuktikan store memanggil tabel, view, dan kolom yang
// benar. Tidak membuktikan migrasi, RLS, atau Supabase sungguhan.
type Panggilan = { tabel: string; op: string; isi?: unknown; kolom?: string; saring: [string, unknown][] };

function klienTiruan(baris: Record<string, unknown[]> = {}, galat: Record<string, string> = {}) {
  const log: Panggilan[] = [];
  const from = (tabel: string) => {
    const p: Panggilan = { tabel, op: "select", saring: [] };
    log.push(p);
    const hasil = (satu: boolean) => {
      const pesan = galat[`${tabel}:${p.op}`];
      if (pesan) return { data: null, error: { message: pesan } };
      const isi = p.op === "insert" ? [{ id: `${tabel}-baru` }] : (baris[tabel] ?? []);
      return { data: satu ? (isi[0] ?? null) : isi, error: null };
    };
    const rantai = {
      select: (kolom?: string) => {
        p.kolom = kolom;
        return rantai;
      },
      insert: (isi: unknown) => {
        p.op = "insert";
        p.isi = isi;
        return rantai;
      },
      update: (isi: unknown) => {
        p.op = "update";
        p.isi = isi;
        return rantai;
      },
      delete: () => {
        p.op = "delete";
        return rantai;
      },
      eq: (k: string, v: unknown) => {
        p.saring.push([k, v]);
        return rantai;
      },
      neq: () => rantai,
      in: () => rantai,
      order: () => rantai,
      maybeSingle: async () => hasil(true),
      single: async () => hasil(true),
      then: (ok: (v: unknown) => unknown, gagal?: (e: unknown) => unknown) =>
        Promise.resolve(hasil(false)).then(ok, gagal),
    };
    return rantai;
  };
  return { klien: { from } as unknown as SupabaseClient, log };
}

describe("store Supabase dengan klien tiruan", () => {
  const BARIS_PUBLIK = {
    id: ID_A,
    nama: "Penjahit Uji",
    jasa: "jahit-permak",
    area_kecamatan: ["Sekupang"],
    area_catatan: null,
    panggilan: false,
    cara_hubungi: null,
    terakhir_dicek: "2026-11-01",
    jumlah_rekomendasi: 2,
    masih_buka: 1,
    sudah_pindah: 0,
  };

  it("daftar publik hanya lewat kunci anon dan hanya membaca view", async () => {
    const publik = klienTiruan({
      tukang_publik: [BARIS_PUBLIK],
      rekomendasi_publik: [{ tukang_id: ID_A, cerita: "Cerita uji", tag: ["rapi"], kapan_dipakai: "2026-10" }],
    });
    const layanan = klienTiruan();
    const hasil = await buatStoreSupabase(publik.klien, layanan.klien).daftarPublik();
    expect(publik.log.map((p) => p.tabel)).toEqual(["tukang_publik", "rekomendasi_publik"]);
    expect(layanan.log).toEqual([]);
    expect(publik.log.map((p) => p.kolom).join()).not.toMatch(/kontak/);
    expect(hasil[0]).toMatchObject({
      id: ID_A,
      jumlahRekomendasi: 2,
      masihBuka: 1,
      tag: [{ teks: "rapi", jumlah: 1 }],
    });
  });

  it("kiriman masuk lewat service role, kontak hanya di tabel rekomendasi, dan persetujuan dicatat", async () => {
    const publik = klienTiruan();
    const layanan = klienTiruan();
    await buatStoreSupabase(publik.klien, layanan.klien).kirimRekomendasi(input() as InputRekomendasi);
    expect(publik.log).toEqual([]);
    const sisip = layanan.log.filter((p) => p.op === "insert");
    expect(sisip.map((p) => p.tabel)).toEqual(["tukang", "rekomendasi", "consent_log"]);
    expect(JSON.stringify(sisip[0].isi)).not.toContain("warga-a");
    expect(JSON.stringify(sisip[2].isi)).not.toContain("warga-a");
    expect(sisip[1].isi).toMatchObject({
      kontak_perekomendasi: "warga-a@contoh.invalid",
      kontak_hash: hashKontak("warga-a@contoh.invalid"),
    });
    expect(sisip[2].isi).toMatchObject({ subjek: "perekomendasi", aksi: "setuju", rekomendasi_id: "rekomendasi-baru" });
  });

  it("kalau log persetujuan gagal, rekomendasinya dibatalkan", async () => {
    const layanan = klienTiruan({}, { "consent_log:insert": "gagal" });
    const store = buatStoreSupabase(klienTiruan().klien, layanan.klien);
    await expect(store.kirimRekomendasi(input())).rejects.toThrow(/gagal/);
    expect(layanan.log.at(-1)).toMatchObject({ tabel: "rekomendasi", op: "delete" });
  });

  it("tombol publik menolak entri yang tidak ada di view", async () => {
    const store = buatStoreSupabase(klienTiruan().klien, klienTiruan().klien);
    await expect(store.kirimSinyal(ID_A, "masih_buka")).rejects.toBeInstanceOf(GalatTidakAda);
    await expect(store.laporkanMasalah(ID_A, "Alasan uji")).rejects.toBeInstanceOf(GalatTidakAda);
  });

  it("laporan masalah menandai tersembunyi", async () => {
    const layanan = klienTiruan();
    const store = buatStoreSupabase(klienTiruan({ tukang_publik: [{ id: ID_A }] }).klien, layanan.klien);
    await store.laporkanMasalah(ID_A, "Alasan uji");
    expect(layanan.log.map((p) => [p.tabel, p.op])).toEqual([
      ["laporan", "insert"],
      ["tukang", "update"],
    ]);
    expect(layanan.log[1].isi).toEqual({ disembunyikan: true });
  });

  it("antrean admin menyamarkan kontak", async () => {
    const layanan = klienTiruan({
      tukang: [
        {
          id: ID_A,
          nama: "Uji",
          jasa: "laundry",
          area_kecamatan: ["Sekupang"],
          area_catatan: null,
          panggilan: false,
          cara_hubungi: "Kios",
          status_moderasi: "menunggu",
          izin_tukang_at: null,
          kontak_boleh_tampil: false,
          disembunyikan: false,
          terakhir_dicek: null,
        },
      ],
      rekomendasi: [
        {
          id: "r1",
          tukang_id: ID_A,
          cerita: "c",
          tag: [],
          kapan_dipakai: "2026-10",
          kontak_perekomendasi: "rahasia@contoh.invalid",
          kontak_hash: "h",
          status_moderasi: "disetujui",
        },
      ],
    });
    const a = await buatStoreSupabase(klienTiruan().klien, layanan.klien).antrean();
    expect(a.tukang[0].syarat.jumlah).toBe(1);
    expect(a.tukang[0].rekomendasi[0].kontakSamaran).toBe("r***@contoh.invalid");
    expect(JSON.stringify(a)).not.toContain("rahasia@");
  });

  it("galat Supabase dilempar, tidak ditelan", async () => {
    const publik = klienTiruan({}, { "tukang_publik:select": "putus" });
    await expect(buatStoreSupabase(publik.klien, klienTiruan().klien).daftarPublik()).rejects.toThrow(/putus/);
  });
});

describe("migrasi SQL", () => {
  const sql = readFileSync("supabase/migrations/20261105000000_tukang_langganan.sql", "utf8")
    .split("\n")
    .filter((b) => !b.trim().startsWith("--"))
    .join("\n");
  const TABEL = ["tukang", "rekomendasi", "consent_log", "laporan", "koreksi_data", "kiriman_foto"];
  const view = (nama: string) => new RegExp(`create view public\\.${nama}[\\s\\S]*?;`).exec(sql)?.[0] ?? "";

  it("semua tabel memakai RLS dan tanpa policy", () => {
    for (const t of TABEL) expect(sql).toContain(`alter table public.${t} enable row level security`);
    expect(sql).not.toMatch(/create policy/i);
  });

  it("anon hanya mendapat select pada view publik", () => {
    expect(sql.match(/grant [^;]+;/gi)).toEqual([
      "grant select on public.tukang_publik, public.rekomendasi_publik to anon, authenticated;",
    ]);
  });

  it("view publik tidak menyebut kontak perekomendasi", () => {
    for (const v of [view("tukang_publik"), view("rekomendasi_publik")]) {
      expect(v.length).toBeGreaterThan(50);
      expect(v).not.toMatch(/kontak_perekomendasi|select\s+\*|r\.\*|t\.\*/);
    }
    expect(view("rekomendasi_publik")).not.toContain("kontak_hash");
  });

  it("syarat di view sama dengan syaratTampil", () => {
    const v = view("tukang_publik");
    expect(v).toContain("r.jumlah >= 2");
    expect(v).toContain("count(distinct x.kontak_hash)");
    expect(v).toContain("t.status_moderasi = 'disetujui'");
    expect(v).toContain("t.izin_tukang_at is not null");
    expect(v).toContain("not t.disembunyikan");
    expect(v).toContain("when t.kontak_boleh_tampil then t.cara_hubungi");
  });

  it("tidak ada kolom rating atau listing berbayar", () => {
    expect(sql).not.toMatch(/rating|bintang|sponsor|berbayar|featured/i);
  });
});

describe("route handler", () => {
  const permintaan = (badan: unknown, ip = "192.0.2.1") =>
    new Request("http://localhost/api/uji", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": ip },
      body: typeof badan === "string" ? badan : JSON.stringify(badan),
    });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete (globalThis as Record<symbol, unknown>)[Symbol.for("bch.tukang.storeContoh")];
  });

  describe("produksi tanpa Supabase", () => {
    beforeEach(() => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("NEXT_PUBLIC_MODE_CONTOH", "");
    });

    it.each([
      ["rekomendasi", postRekomendasi],
      ["sinyal", postSinyal],
      ["laporkan", postLaporkan],
      ["koreksi", postKoreksi],
      ["foto", postFoto],
    ])("%s menjawab 503 yang jujur", async (_, post) => {
      const r = await post(permintaan(KIRIMAN));
      expect(r.status).toBe(503);
      expect((await r.json()).pesan).toMatch(/belum aktif/);
    });
  });

  describe("mode contoh", () => {
    beforeEach(() => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("NEXT_PUBLIC_MODE_CONTOH", "1");
    });

    it("kiriman sah diterima dan jawabannya tidak membawa kontak", async () => {
      const r = await postRekomendasi(permintaan(KIRIMAN));
      expect(r.status).toBe(200);
      const teks = await r.text();
      expect(teks).toBe('{"ok":true}');
    });

    it("isian salah dijawab per kolom", async () => {
      const r = await postRekomendasi(permintaan({ ...KIRIMAN, cerita: "pendek" }));
      expect(r.status).toBe(400);
      expect((await r.json()).galat.cerita).toBe("Ceritakan pengalamanmu secara singkat.");
    });

    it("cerita paling banyak 300 karakter", async () => {
      const r = await postRekomendasi(permintaan({ ...KIRIMAN, cerita: "a".repeat(301) }));
      expect(r.status).toBe(400);
      expect((await r.json()).galat.cerita).toContain("300 karakter");
    });

    it("honeypot dijawab sukses tetapi tidak disimpan", async () => {
      const r = await postRekomendasi(permintaan({ ...KIRIMAN, nama_tukang: "Robot Madu", situs_web: "http://spam" }));
      expect(r.status).toBe(200);
      const a = await ambilStore()?.antrean();
      expect(a?.tukang.some((t) => t.nama.includes("Robot Madu"))).toBe(false);
    });

    it("JSON rusak dan badan terlalu besar ditolak", async () => {
      expect((await postRekomendasi(permintaan("{rusak"))).status).toBe(400);
      expect((await postRekomendasi(permintaan({ cerita: "x".repeat(20000) }))).status).toBe(413);
    });

    it("sinyal untuk entri yang tidak tampil dijawab 404", async () => {
      const r = await postSinyal(
        permintaan({ tukang_id: "00000000-0000-4000-8000-000000000003", jenis: "masih_buka" }),
      );
      expect(r.status).toBe(404);
    });

    it("koreksi dengan tempat tersimpan", async () => {
      const r = await postKoreksi(
        permintaan({ jenis: "tutup_pindah", tempat_id: "pub-bpbd", isi: "Kantornya sudah pindah tahun lalu." }),
      );
      expect(r.status).toBe(200);
      expect((await ambilStore()?.antrean())?.koreksi[0].tempatId).toBe("pub-bpbd");
    });

    it("kiriman foto menyimpan metadata", async () => {
      const r = await postFoto(
        permintaan({
          judul: "Pelabuhan lama",
          lokasi: "Sekupang",
          perkiraan_tahun: "1990-an",
          kredit: "Warga Uji",
          kontak: "foto@contoh.invalid",
          punya_hak: true,
          izin_tampil: true,
        }),
      );
      expect(r.status).toBe(200);
      const a = await ambilStore()?.antrean();
      expect(a?.foto[0]).toMatchObject({ judul: "Pelabuhan lama", kontakSamaran: "f***@contoh.invalid" });
    });
  });

  it("batas laju menjawab 429 di luar mode contoh", async () => {
    // Klien tiruan tidak dipakai: 429 harus keluar sebelum menyentuh penyimpanan, jadi kunci palsu tidak ditelepon
    // selama batasnya belum terlampaui oleh kiriman tidak sah (400 tidak butuh jaringan).
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://supabase.invalid");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-palsu");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "layanan-palsu");
    const kode: number[] = [];
    for (let i = 0; i < 6; i++) kode.push((await postKoreksi(permintaan({ jenis: "x" }, "192.0.2.77"))).status);
    expect(kode).toEqual([400, 400, 400, 400, 400, 429]);
  });
});

describe("batas laju", () => {
  it("menolak setelah batas dan pulih setelah jendela lewat", () => {
    const b = buatBatasLaju(2, 1000);
    expect([b("a", 0), b("a", 10), b("a", 20)]).toEqual([true, true, false]);
    expect(b("b", 20)).toBe(true);
    expect(b("a", 1001)).toBe(true);
  });

  it("memakai alamat dari proxy, bukan elemen awal x-forwarded-for yang bisa dipalsukan", () => {
    const req = (h: Record<string, string>) => new Request("http://x/", { headers: h });
    expect(ipDari(req({ "x-real-ip": "198.51.100.1" }))).toBe("198.51.100.1");
    expect(ipDari(req({ "x-forwarded-for": "6.6.6.6, 198.51.100.2" }))).toBe("198.51.100.2");
    expect(ipDari(req({}))).toBe("tanpa-ip");
  });
});

describe("gerbang admin", () => {
  const env = { ADMIN_MODE_CONTOH: "sandi-uji" };

  it("kata sandi contoh", () => {
    expect(sandiContohBenar("sandi-uji", env)).toBe(true);
    expect(sandiContohBenar("salah", env)).toBe(false);
    expect(sandiContohBenar("", {})).toBe(false);
  });

  it("kuki contoh tidak memuat kata sandi dan tidak bisa ditebak dari nilai lain", () => {
    const nilai = nilaiKukiContoh(env);
    expect(nilai).not.toContain("sandi-uji");
    expect(kukiContohBenar(nilai, env)).toBe(true);
    expect(kukiContohBenar("1", env)).toBe(false);
    expect(kukiContohBenar(undefined, env)).toBe(false);
    expect(kukiContohBenar(nilai, {})).toBe(false);
  });

  it("pengguna Supabase biasa bukan moderator", () => {
    expect(peranModerator({ app_metadata: { peran: "moderator" } })).toBe(true);
    expect(peranModerator({ app_metadata: {} })).toBe(false);
    expect(peranModerator(null)).toBe(false);
  });

  it("menolak permintaan tulis dari situs lain", () => {
    const req = (h: Record<string, string>) => new Request("http://x/", { headers: h });
    expect(asalSama(req({ origin: "http://a.test", host: "a.test" }))).toBe(true);
    expect(asalSama(req({ origin: "http://jahat.test", host: "a.test" }))).toBe(false);
    expect(asalSama(req({ host: "a.test" }))).toBe(false);
  });
});

describe("cek ulang", () => {
  const nov2026 = new Date("2026-11-05T00:00:00Z");
  const jul2027 = new Date("2027-07-01T00:00:00Z");

  it("status dan umur", () => {
    expect(alasanCekUlang({ status_data: "perlu_cek_ulang", atribut: {} }, nov2026)).toEqual(["perlu_cek_ulang"]);
    expect(alasanCekUlang({ status_data: "usang", atribut: {} }, nov2026)).toEqual(["usang"]);
    expect(alasanCekUlang({ status_data: "terverifikasi", atribut: {} }, nov2026)).toEqual([]);
    expect(alasanCekUlang({ status_data: null, atribut: { last_verified: "2026-01" } }, nov2026)).toEqual([
      "lewat_6_bulan",
    ]);
    expect(alasanCekUlang({ status_data: null, atribut: { last_verified: "2026-06" } }, nov2026)).toEqual([]);
  });

  it("tanpa tanggal dihitung sejak riset, bukan dianggap baru selamanya", () => {
    expect(lewatEnamBulan(undefined, nov2026)).toBe(false);
    expect(lewatEnamBulan(null, jul2027)).toBe(true);
    expect(lewatEnamBulan("bukan tanggal", jul2027)).toBe(true);
  });
});

describe("keluaran koordinat", () => {
  const tempat: TitikKoordinat = {
    id: "pub-uji",
    jenis: "tempat",
    nama: 'Kantor "Uji", Batam',
    kelompok: "pemerintahan",
    subkategori: "dinas",
    koridor: null,
    kecamatan: "Sekupang",
    kelurahan: null,
    alamat: "Jl. Uji\nNo. 1",
    lat: null,
    lng: null,
    statusKoordinat: "perlu_diisi_user",
    catatanKoordinat: null,
    sumberUrl: "https://contoh.invalid/a",
  };
  const halte: TitikKoordinat = {
    ...tempat,
    id: "bandara-hang-nadim",
    jenis: "halte",
    nama: "Halte Uji",
    kelompok: "bandara",
    koridor: "K1 K2",
    alamat: null,
  };
  const belum: TitikKoordinat = { ...tempat, id: "belum-diisi", nama: "Belum Diisi" };
  const semua = [tempat, halte, belum];
  const isian = {
    [kunciIsian(tempat)]: { lat: 1.12345, lng: 104.05 },
    [kunciIsian(halte)]: { lat: 1.1, lng: 104.1 },
  };

  it("JSON memakai format koordinat_user.json dan tidak mencampur halte ke tempat", () => {
    expect(JSON.parse(jsonKoordinat(semua, "tempat", isian, "2026-11-05"))).toEqual({
      "pub-uji": { lat: 1.12345, lng: 104.05, tanggal: "2026-11-05" },
    });
    expect(Object.keys(JSON.parse(jsonKoordinat(semua, "halte", isian, "2026-11-05")))).toEqual(["bandara-hang-nadim"]);
  });

  it("CSV tempat cocok dengan header berkas sumber dan tanpa kolom kelompok", () => {
    const sumber = readFileSync("data/koordinat_perlu_diisi.csv", "utf8").replace(/^﻿/, "").split(/\r?\n/)[0];
    const csv = csvTempat(semua, isian);
    expect(csv.split("\r\n")[0]).toBe(sumber);
    expect(sumber).not.toContain("kelompok");
    expect(csv).toContain("1.12345,104.05,terverifikasi");
    expect(csv).toContain('"Kantor ""Uji"", Batam"');
    expect(csv).toContain('"Jl. Uji\nNo. 1"');
    expect(csv).not.toContain("belum-diisi");
    expect(csv).not.toContain("bandara-hang-nadim");
  });

  it("CSV halte cocok dengan header berkas sumber, dan punya kolom kelompok untuk importer", () => {
    const sumber = readFileSync("data/trans_batam/halte_koordinat_perlu_diisi.csv", "utf8")
      .replace(/^﻿/, "")
      .split(/\r?\n/)[0];
    const csv = csvHalte(semua, isian);
    expect(csv.split("\r\n")[0]).toBe(sumber);
    expect(sumber).toContain("kelompok");
    expect(csv).toContain("bandara-hang-nadim");
    expect(csv).not.toContain("pub-uji");
  });

  it("menolak koordinat di luar Batam atau lat dan lng tertukar", () => {
    expect(koordinatSah(1.1, 104.05)).toBe(true);
    expect(koordinatSah(104.05, 1.1)).toBe(false);
    expect(bacaTempelan("104.05, 1.1")).toBeNull();
    expect(bacaTempelan("bukan angka")).toBeNull();
    expect(bacaTempelan("1.1234567, 104.0567")).toEqual({ lat: 1.123457, lng: 104.0567 });
  });

  it("daftar titik mencakup tempat dan halte, tanpa yang sudah terverifikasi, tanpa catatan kerja", () => {
    const titik = daftarTitik();
    expect(titik.some((t) => t.jenis === "tempat")).toBe(true);
    expect(titik.some((t) => t.jenis === "halte")).toBe(true);
    expect(titik.every((t) => t.statusKoordinat !== "terverifikasi")).toBe(true);
    expect(new Set(titik.map(kunciIsian)).size).toBe(titik.length);
    expect(Object.keys(titik[0])).not.toContain("catatan");
    expect(Object.keys(titik[0])).not.toContain("atribut");
  });
});

describe("kategori dan teks", () => {
  it("memuat jenis jasa persis seperti PEDOMAN 3.5", () => {
    expect(KATEGORI_JASA.map((k) => k.nama)).toEqual([
      "Jahit dan permak",
      "Mebel",
      "Servis dan cuci AC",
      "Bengkel motor dan mobil",
      "Tukang kunci",
      "Binatu",
      "Sol sepatu",
      "Servis ponsel, laptop, dan elektronik",
      "Tukang bangunan, listrik, dan ledeng",
      "Pijat dan refleksi",
      "Pijat panggilan",
      "Salon dan pangkas rambut",
      "Fotokopi dan percetakan",
      "Indekos",
      "Jasa titip Singapura",
      "Lainnya",
    ]);
  });

  it("kata pilihan warga tampil berkapital di awal", () => {
    expect(TAG_REKOMENDASI.map(teksTag)).toEqual(["Rapi", "Tepat waktu", "Harga jujur", "Ramah", "Cepat"]);
  });

  it("menunjuk baris Jasa yang benar di taksonomi, dan tidak memakai money changer", () => {
    const baris = new Set(
      taksonomi.taksonomi.filter((t) => t.kategori === "Jasa").map((t) => t.subkategori.replaceAll("&", "dan")),
    );
    for (const k of KATEGORI_JASA) if (k.taksonomi) expect(baris.has(k.taksonomi)).toBe(true);
    expect(KATEGORI_JASA.some((k) => /money changer|bank/i.test(k.nama))).toBe(false);
    expect(new Set(KATEGORI_JASA.map((k) => k.slug)).size).toBe(KATEGORI_JASA.length);
  });

  it("hanya nomor telepon yang menjadi tautan Hubungi", () => {
    expect(tautanTelepon("0812-3456 7890")).toBe("tel:+6281234567890");
    expect(tautanTelepon("+62 812 3456 7890")).toBe("tel:+6281234567890");
    expect(tautanTelepon("Kios di Pasar Sekupang")).toBeNull();
    expect(tautanTelepon("warga@contoh.invalid")).toBeNull();
  });

  it("menulis tanggal dan bulan", () => {
    expect(teksBulan("2026-10")).toBe("Oktober 2026");
    expect(teksTerakhirDicek("2026-11-05")).toBe("Terakhir dicek 5 November 2026");
    expect(teksTerakhirDicek(null)).toBe("Belum pernah dicek");
    expect(teksTerakhirDiperiksa("2026-10-15")).toBe("Terakhir diperiksa Oktober 2026");
    expect(teksTerakhirDiperiksa(null)).toBeNull();
    expect(hariIni(new Date("2026-11-05T20:00:00Z"))).toBe("2026-11-06");
  });
});
