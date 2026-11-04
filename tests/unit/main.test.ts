import { describe, expect, it } from "vitest";
import { bungkus } from "@/features/main/gambar-kartu";
import { hitungOngkos, TARIF } from "@/features/main/ongkos";

describe("ongkos", () => {
  it("menghitung dari tarif tercatat", () => {
    const h = hitungOngkos(12_000, 1);
    expect(h?.singapura).toBe((TARIF.feriPpSgd + TARIF.surchargeSgd) * 12_000 + TARIF.surchargeRp);
    expect(h?.nagoya).toBe(2 * TARIF.busRp);
    expect(h?.selisih).toBe((h?.singapura ?? 0) - (h?.nagoya ?? 0));
  });

  it("dikali jumlah orang", () => {
    expect(hitungOngkos(12_000, 3)?.nagoya).toBe(6 * TARIF.busRp);
  });

  it("kurs kosong atau aneh tidak menghasilkan angka", () => {
    expect(hitungOngkos(Number.NaN, 1)).toBeNull();
    expect(hitungOngkos(0, 1)).toBeNull();
    expect(hitungOngkos(-1, 1)).toBeNull();
    expect(hitungOngkos(12_000, 0)).toBeNull();
    expect(hitungOngkos(12_000, 1.5)).toBeNull();
  });
});

describe("bungkus teks", () => {
  const lebar = (s: string) => s.length;

  it("memecah per kata menurut lebar", () => {
    expect(bungkus("hujan lagi sekupang kering", lebar, 10)).toEqual(["hujan lagi", "sekupang", "kering"]);
  });

  it("kata lebih panjang dari batas tetap satu baris", () => {
    expect(bungkus("mahaberkepanjangan", lebar, 5)).toEqual(["mahaberkepanjangan"]);
  });

  it("kosong tidak menghasilkan baris", () => {
    expect(bungkus("   ", lebar, 10)).toEqual([]);
  });
});
