import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import penamaanRaw from "@/data/tokoh/penamaan.json";
import relasiRaw from "@/data/tokoh/relasi.json";
import tokohRaw from "@/data/tokoh/tokoh.json";
import { TEMPAT } from "@/features/direktori/data";
import {
  barisTokoh,
  CATATAN_HIKAYAT,
  penamaanTokoh,
  PENAMAAN,
  RELASI,
  relasiTokoh,
  statusTokoh,
  TOKOH,
  tokohPerId,
  uraiProfil,
} from "@/features/nama-jalan/data";
import { GUGUS, H, LEBAR, W } from "@/features/nama-jalan/DiagramRelasi";

// Kalimat yang ditujukan ke penyusun kartu. Tidak boleh sampai ke warga.
const CATATAN_PENYUSUN =
  /untuk sementara|sebaiknya|tampilkan sebagai|perlu catatan di UI|dipisah dari baris|tabel menggabungkan|\bp1[0-9]\b|bisa merujuk/i;
const CATATAN_KERJA = /perlu dicek|perlu konfirmasi|belum kami tulis/i;

describe("tokoh", () => {
  it("semua 46 tokoh tampil", () => {
    expect(TOKOH).toHaveLength(tokohRaw.length);
    expect(TOKOH).toHaveLength(46);
    expect(TOKOH.filter((t) => t.ringkas)).toHaveLength(17);
  });

  it("tanpa catatan penyusun", () => {
    for (const t of TOKOH) {
      const teks = [t.gelar, t.masaHidup, t.ringkasan, t.kisah, t.kaitan, t.tempatTeks, t.statusTeks, ...t.catatan];
      expect(teks.join(" "), t.id).not.toMatch(CATATAN_PENYUSUN);
      const tampil = [t.gelar, t.masaHidup, t.ringkasan, t.kisah, t.kaitan, t.tempatTeks, ...t.catatan];
      expect(tampil.join(" "), t.id).not.toMatch(CATATAN_KERJA);
    }
  });

  it("satu label per kartu, hikayat tidak disamakan dengan sejarah", () => {
    const sah = ["Tercatat", "Berbeda versi", "Belum terverifikasi", "Cerita rakyat"];
    for (const t of TOKOH) expect(sah, t.id).toContain(t.status.teks);
    expect(statusTokoh("hikayat")).toMatchObject({ grup: "hikayat", teks: "Cerita rakyat", hikayat: true });
    expect(statusTokoh("semi_historis")).toMatchObject({ teks: "Belum terverifikasi", hikayat: true });
    expect(statusTokoh("terverifikasi")).toMatchObject({ teks: "Tercatat", hikayat: false, nada: "ok" });
    expect(statusTokoh("perlu_dicek").teks).toBe("Belum terverifikasi");
    expect(statusTokoh(null).teks).toBe("Belum terverifikasi");
    expect(tokohPerId.get("hang_nadim")?.catatan.join(" ")).toContain("Perlawanannya terhadap Portugis tercatat");
  });

  it("tokoh ringkas tidak diberi biografi karangan", () => {
    const k = tokohPerId.get("katamso");
    expect(k?.ringkas).toBe(true);
    expect(k?.kisah).toBeNull();
    expect(k?.gelar).toBeNull();
    expect(k?.sumber).toEqual([]);
  });

  it("Dang Anom dan Laksamana Bintan tidak diarang", () => {
    expect(tokohPerId.get("dang_anom")?.ringkasan).toMatch(/perempuan istana atau dayang/);
    expect(tokohPerId.get("dang_anom")?.statusTeks).not.toMatch(/kartu/);
    expect(tokohPerId.get("laksamana_bintan")?.ringkasan).toMatch(/jabatan panglima laut/);
    expect(tokohPerId.get("laksamana_bintan")?.catatan.join(" ")).toMatch(/bukan klaim/);
  });

  it("julukan Harimau Padri hanya di Tuanku Tambusai", () => {
    for (const t of TOKOH) {
      const teks = [t.ringkasan, t.kisah, ...t.catatan].join(" ");
      if (t.id === "tuanku_tambusai") expect(teks).toContain("Harimau Padri dari Rokan");
      else expect(teks, t.id).not.toContain("Harimau Padri");
    }
  });

  it("Nong Isa, Sultan Abdul Rachman, dan Brickworks memakai kata beda versi", () => {
    expect(tokohPerId.get("nong_isa")?.status.grup).toBe("beda_versi");
    expect(tokohPerId.get("sultan_abdul_rahman_1")?.catatan.join(" ")).toContain("I atau II, belum dipastikan");
    expect(tokohPerId.get("raja_ali_kelana")?.catatan.join(" ")).toContain("berbeda versi");
  });

  it("baris untuk browser tidak membawa kisah dan sumber", () => {
    expect(Object.keys(barisTokoh(TOKOH[0])).sort()).toEqual(
      ["gelar", "id", "kelompok", "masaHidup", "nama", "ringkasan", "status"].sort(),
    );
  });

  it("catatan hikayat menyebut dua versi", () => {
    expect(CATATAN_HIKAYAT.join(" ")).toMatch(/Hang Kasturi.*Hang Jebat/);
  });
});

describe("profil_tokoh.md", () => {
  const md = readFileSync("data/tokoh/profil_tokoh.md", "utf8");

  it("24 judul, semuanya terpetakan", () => {
    const { judul, peta } = uraiProfil(md);
    expect(judul).toHaveLength(24);
    expect(peta.size).toBe(27);
    for (const id of peta.keys()) expect(tokohPerId.has(id), id).toBe(true);
  });

  it("isi kartu terurai, termasuk Keppres dan sumber", () => {
    const raja = tokohPerId.get("raja_haji_fisabilillah");
    expect(raja?.kisah).toContain("Keppres No. 072/TK/1997");
    expect(raja?.sumber.length).toBeGreaterThanOrEqual(3);
    expect(tokohPerId.get("engku_haji_tua")?.statusTeks).toBe("Terverifikasi sebagai tokoh (sumber ensiklopedis)");
  });

  it("satu profil gabungan dibagi ke empat sahabat Hang Tuah", () => {
    for (const id of ["hang_jebat", "hang_kasturi", "hang_lekir", "hang_lekiu"]) {
      expect(tokohPerId.get(id)?.kisah, id).toContain("sahabat Hang Tuah");
    }
  });
});

describe("penamaan", () => {
  it("semua 61 tampil dan semua tokohnya ada", () => {
    expect(PENAMAAN).toHaveLength(penamaanRaw.length);
    expect(PENAMAAN).toHaveLength(61);
    for (const p of PENAMAAN) expect(tokohPerId.has(p.tokohId), p.id).toBe(true);
  });

  it("lokasi perlu dicek bila kecamatan kosong atau bertanda", () => {
    const perId = new Map(PENAMAAN.map((p) => [p.id, p]));
    expect(perId.get("p29")?.lokasiPerluDicek).toBe(true);
    expect(perId.get("p14")?.lokasiPerluDicek).toBe(true);
    expect(perId.get("p01")?.lokasiPerluDicek).toBe(false);
  });

  it("tempat ditautkan lewat penamaan_id dan tiap tempat bertokoh tertangkap", () => {
    const bertokoh = TEMPAT.filter((p) => p.atribut.tokoh_id);
    expect(bertokoh).toHaveLength(18);
    expect(PENAMAAN.filter((p) => p.tempat)).toHaveLength(18);
    for (const p of bertokoh) {
      const baris = PENAMAAN.find((x) => x.tempat?.id === p.id);
      expect(baris?.tokohId, p.id).toBe(p.atribut.tokoh_id);
    }
  });

  it("catatan yang tampil bebas catatan kerja", () => {
    for (const p of PENAMAAN) {
      if (p.catatan) expect(p.catatan, p.id).not.toMatch(CATATAN_PENYUSUN);
    }
    expect(PENAMAAN.find((p) => p.id === "pt01")?.catatan).toBeNull();
    expect(PENAMAAN.find((p) => p.id === "p24")?.catatan).toContain("I atau II, belum dipastikan");
    expect(PENAMAAN.find((p) => p.id === "p27")?.catatan).toContain("masih asumsi");
    for (const p of PENAMAAN) {
      expect(`${p.letak} ${p.catatan ?? ""}`, p.id).not.toMatch(CATATAN_KERJA);
    }
  });

  it("sumber hanya tautan yang sah", () => {
    for (const p of PENAMAAN) if (p.sumber) expect(p.sumber, p.id).toMatch(/^https?:\/\//);
  });

  it("penamaanTokoh mengumpulkan semua nama", () => {
    expect(penamaanTokoh("engku_putri").map((p) => p.id)).toEqual(["p11", "p12", "p13", "pt02"]);
  });
});

describe("relasi", () => {
  it("semua 23 relasi tampil, kedua ujungnya tokoh yang ada", () => {
    expect(RELASI).toHaveLength(relasiRaw.length);
    expect(RELASI).toHaveLength(23);
    for (const r of RELASI) {
      expect(tokohPerId.has(r.a), r.id).toBe(true);
      expect(tokohPerId.has(r.b), r.id).toBe(true);
    }
  });

  it("setiap relasi ada di tepat satu gugus diagram, dan simpulnya lengkap", () => {
    const hitung = new Map<string, number>();
    for (const g of GUGUS) {
      const simpul = new Set(g.simpul.map((s) => s.id));
      for (const t of g.tepi) {
        hitung.set(t.relasi, (hitung.get(t.relasi) ?? 0) + 1);
        const [a, b] = t.relasi.split(">");
        expect(simpul.has(a), `${g.id}: ${a}`).toBe(true);
        expect(simpul.has(b), `${g.id}: ${b}`).toBe(true);
      }
    }
    for (const r of RELASI) expect(hitung.get(r.id), r.id).toBe(1);
    expect(hitung.size).toBe(RELASI.length);
  });

  it("simpul diagram tetap di dalam kanvas", () => {
    for (const g of GUGUS) {
      for (const s of g.simpul) {
        expect(s.x - W / 2, s.id).toBeGreaterThanOrEqual(0);
        expect(s.x + W / 2, s.id).toBeLessThanOrEqual(LEBAR);
        expect(s.y + H / 2, s.id).toBeLessThanOrEqual(g.tinggi);
      }
    }
  });

  it("dua relasi yang lemah ditandai perlu dicek", () => {
    expect(RELASI.filter((r) => r.perluDicek).map((r) => r.id)).toEqual([
      "embung_fatimah>raja_ali_kelana",
      "batin_limat>embung_fatimah",
    ]);
    expect(RELASI.find((r) => r.id === "batin_limat>embung_fatimah")?.jenis).toContain("putra Embung Fatimah");
  });

  it("relasiTokoh mengambil dua arah", () => {
    expect(relasiTokoh("nong_isa").map((r) => r.a)).toEqual(["sultan_abdul_rahman_1"]);
  });
});
