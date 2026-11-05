import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { LayerSpecification, StyleSpecification } from "maplibre-gl";
import { describe, expect, it } from "vitest";
import { baseStyle } from "@/features/peta/style";
import {
  gabungGaya,
  geserKeDalam,
  keLngLatBounds,
  kePaddingMapLibre,
  peringkat,
  pikselDunia,
  sisipSebelum,
  sudutCitra,
} from "@/features/langit-laut/lib/peta-lapisan";
import { parseBulletin, warnAt } from "@/features/langit-laut/lib/perairan";
import { MAX_ZOOM, RADAR_BOUNDS, radarCitra, radarUrl } from "@/features/langit-laut/lib/radar";
import { BMKG_HEADERS } from "@/features/langit-laut/lib/sources";

const baca = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

describe("permintaan ke BMKG", () => {
  it("memakai identitas jujur, tanpa Referer", () => {
    expect(BMKG_HEADERS["User-Agent"]).toMatch(/^BatamCityHall\//);
    expect(BMKG_HEADERS).not.toHaveProperty("Referer");
  });

  it.each([
    "app/api/ofs-frame/route.ts",
    "app/api/perairan/route.ts",
    "app/api/gempa/route.ts",
    "app/api/peringatan-cuaca/route.ts",
  ])("%s tidak menyamar sebagai browser", (p) => {
    const kode = baca(p);
    expect(kode).not.toMatch(/Mozilla|Chrome\/\d|Referer/);
    expect(kode).toContain("BMKG_HEADERS");
  });
});

describe("peringatan dini", () => {
  const tanpaProvinsi = {
    Bali: { data: { valid_from: "2026-11-05T08:00", valid_until: "2026-11-08T08:00", warning: {} } },
  };

  it("provinsi tidak ada di warnings.json: bukan aman, statusnya tidak diketahui", () => {
    expect(parseBulletin(tanpaProvinsi)).toBeNull();
    expect(warnAt([], Date.now()).current.status).toBe("unknown");
  });

  it("menyebut tingkat kalau Perairan Kep. Batam tercantum", () => {
    const b = parseBulletin({
      "Kep. Riau": {
        data: {
          valid_from: "2026-11-05T07:00",
          valid_until: "2026-11-08T07:00",
          warning: { sedang: [], tinggi: ["Perairan Kep. Batam"], sangat_tinggi: [], ekstrem: [] },
        },
      },
    });
    expect(b?.status).toBe("ok");
    expect(b?.text).toBe("Peringatan gelombang tinggi");
  });
});

describe("citra radar", () => {
  it("bounds hasil georeferensi tidak berubah", () => {
    expect(RADAR_BOUNDS).toEqual([
      [-0.811, 101.782],
      [3.524, 106.146],
    ]);
  });

  it("sudut citra berurutan kiri atas, kanan atas, kanan bawah, kiri bawah", () => {
    expect(sudutCitra(RADAR_BOUNDS)).toEqual([
      [101.782, 3.524],
      [106.146, 3.524],
      [106.146, -0.811],
      [101.782, -0.811],
    ]);
  });

  it("browser memakai route sendiri, server memakai URL asli MSS", () => {
    expect(radarCitra("202611050015")).toBe("/api/radar-citra/202611050015");
    expect(radarUrl("202611050015")).toMatch(/^https:\/\/www\.weather\.gov\.sg\/.*202611050015.*\.png$/);
  });

  it("zoom maksimum setara z12 Leaflet situs lama", () => {
    expect(MAX_ZOOM).toBe(11);
  });
});

describe("geometri", () => {
  it("bounds lama [[s,w],[n,e]] menjadi [[w,s],[e,n]]", () => {
    expect(
      keLngLatBounds([
        [0.96, 103.84],
        [1.21, 104.2],
      ]),
    ).toEqual([
      [103.84, 0.96],
      [104.2, 1.21],
    ]);
  });

  it("padding lama menjadi padding MapLibre", () => {
    expect(kePaddingMapLibre({ paddingTopLeft: [1, 2], paddingBottomRight: [3, 4] })).toEqual({
      left: 1,
      top: 2,
      right: 3,
      bottom: 4,
    });
  });

  it("piksel dunia cocok dengan proyeksi Web Mercator", () => {
    expect(pikselDunia(0, 0, 0)).toEqual({ x: 256, y: 256 });
    expect(pikselDunia(0, 180, 1).x).toBeCloseTo(1024, 6);
    const utara = pikselDunia(1, 104, 10);
    const selatan = pikselDunia(0, 104, 10);
    expect(utara.y).toBeLessThan(selatan.y);
    expect(selatan.y - utara.y).toBeCloseTo((512 * 2 ** 10) / 360, 0);
  });

  it("geser ke dalam hanya bila keluar dari kotak", () => {
    const u = { w: 100, h: 100 };
    const pad = { left: 10, top: 10, right: 10, bottom: 10 };
    expect(geserKeDalam({ x: 50, y: 50 }, u, pad)).toEqual([0, 0]);
    expect(geserKeDalam({ x: 5, y: 95 }, u, pad)).toEqual([-5, 5]);
  });
});

describe("urutan lapisan", () => {
  const dasar = [
    { id: "earth", type: "fill" },
    { id: "water", type: "fill" },
    { id: "places_locality", type: "symbol" },
  ];

  it("arsiran di bawah radar, garis di atas radar, mask di atas ombak", () => {
    expect(peringkat("ll-kec-fill")).toBeLessThan(peringkat("ll-radar"));
    expect(peringkat("ll-radar")).toBeLessThan(peringkat("ll-kec-line"));
    expect(peringkat("ll-ofs-12")).toBeLessThan(peringkat("ll-land"));
    expect(peringkat("ll-cap-fill")).toBeLessThan(peringkat("ll-radar"));
    expect(peringkat("ll-radar")).toBeLessThan(peringkat("ll-cap-line"));
  });

  it("lapisan baru selalu di bawah label peta", () => {
    expect(sisipSebelum(dasar, "ll-radar")).toBe("places_locality");
  });

  it("lapisan disisipkan di bawah yang peringkatnya lebih tinggi", () => {
    const ada = [dasar[0], dasar[1], { id: "ll-kec-line", type: "line" }, dasar[2]];
    expect(sisipSebelum(ada, "ll-radar")).toBe("ll-kec-line");
    expect(sisipSebelum(ada, "ll-ofs-1")).toBe("places_locality");
  });

  it("ganti tema mempertahankan lapisan fitur", () => {
    const radar: LayerSpecification = { id: "ll-radar", type: "raster", source: "ll-radar" };
    const lama: StyleSpecification = {
      ...baseStyle("light", "http://x", { chart: false }),
      sources: {
        ...baseStyle("light", "http://x", { chart: false }).sources,
        "ll-radar": { type: "image", url: "/a.png", coordinates: sudutCitra(RADAR_BOUNDS) },
      },
    };
    lama.layers = [...lama.layers, radar];
    const baru = baseStyle("dark", "http://x", { chart: false });
    const hasil = gabungGaya(lama, baru);
    expect(hasil.sources["ll-radar"]).toBeDefined();
    const ids = hasil.layers.map((l) => l.id);
    expect(ids).toContain("ll-radar");
    expect(ids.indexOf("ll-radar")).toBeLessThan(hasil.layers.findIndex((l) => l.type === "symbol"));
    expect(gabungGaya(undefined, baru)).toBe(baru);
  });
});

describe("gaya peta tanpa ornamen chart", () => {
  const gaya = baseStyle("light", "http://x", { chart: false });

  it("tanpa selubung siluet dan graticule", () => {
    const ids = gaya.layers.map((l) => l.id);
    for (const id of ["selubung-luar-fokus", "graticule-5", "garis-1n", "garis-1n-label"])
      expect(ids).not.toContain(id);
    expect(Object.keys(gaya.sources)).toEqual(["protomaps"]);
  });

  it("label di luar fokus tidak dipucatkan", () => {
    expect(JSON.stringify(gaya.layers)).not.toContain("within");
  });
});
