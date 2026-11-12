import { describe, expect, it } from "vitest";
import { batasiKamera, cakupanUbin, keX, keY } from "@/features/peta/cakupan-ubin";

/** Tepi layar (bujur dan lintang) untuk kamera di layar lebar × tinggi px. */
function tepi(k: { lng: number; lat: number; zoom: number }, lebar: number, tinggi: number) {
  const dunia = 512 * 2 ** k.zoom;
  const x = keX(k.lng);
  const y = keY(k.lat);
  return { x0: x - lebar / 2 / dunia, x1: x + lebar / 2 / dunia, y0: y - tinggi / 2 / dunia, y1: y + tinggi / 2 / dunia };
}

function dalamCakupan(k: { lng: number; lat: number; zoom: number }, lebar: number, tinggi: number) {
  const c = cakupanUbin(Math.min(Math.floor(k.zoom), 15))!;
  const t = tepi(k, lebar, tinggi);
  const e = 1e-9;
  return t.x0 >= c.x0 - e && t.x1 <= c.x1 + e && t.y0 >= c.y0 - e && t.y1 <= c.y1 + e;
}

describe("kamera mengikuti cakupan ubin peta dasar", () => {
  it("zoom 4 di layar laptop diperbesar sampai Kalimantan tidak terpotong di 112,5 BT", () => {
    const k = batasiKamera(104, 3, 4, 770, 705);
    expect(k.zoom).toBeGreaterThan(4.5);
    expect(dalamCakupan(k, 770, 705)).toBe(true);
  });

  it("tampilan Natuna di ponsel tetap memuat Natuna", () => {
    // Pusat dan zoom hasil fitBounds tampilan Natuna di layar 375 × 700 px.
    const k = batasiKamera(105.4, 1.7, 5.45, 375, 700);
    expect(dalamCakupan(k, 375, 700)).toBe(true);
    const t = tepi(k, 375, 700);
    expect(t.x1).toBeGreaterThan(keX(108.1));
  });

  it("memperbesar Natuna berhenti di zoom tertinggi yang ubinnya ada", () => {
    const k = batasiKamera(108.2, 3.9, 11, 770, 705);
    expect(k.zoom).toBeLessThan(11);
    expect(k.zoom).toBeGreaterThan(10.9);
    expect(k.lng).toBeCloseTo(108.2, 5);
  });

  it("Batam di zoom 11 tidak diubah", () => {
    const k = batasiKamera(104.03, 1.08, 11, 770, 705);
    expect(k).toEqual({ lng: expect.closeTo(104.03, 9), lat: expect.closeTo(1.08, 9), zoom: 11 });
  });

  it("menggeser jauh ke timur di zoom 8 berhenti di tepi ubin", () => {
    const k = batasiKamera(112, 1, 8, 770, 705);
    expect(dalamCakupan(k, 770, 705)).toBe(true);
    expect(k.zoom).toBe(8);
    expect(k.lng).toBeLessThan(112);
  });
});
