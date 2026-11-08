import { describe, expect, it } from "vitest";
import {
  CAMS,
  kameraTidakAktif,
  mbPerMenit,
  potonganTerakhir,
  teksMbPerMenit,
  urutanJalur,
  vonisPlaylist,
} from "@/features/langit-laut/lib/cctv";

// Bentuk playlist Pemko yang dicek 8 Nov 2026: dua potongan, nama berputar stream0..9.
const PLAYLIST = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:31711
#EXTINF:10.000000,
stream1.ts
#EXTINF:9.600000,
stream2.ts
`;

describe("vonis playlist CCTV", () => {
  const kini = Date.UTC(2026, 10, 8, 15, 15);
  const segar = new Date(kini - 20_000).toUTCString();

  it("hidup, mati, beku, hilang, gangguan server, dan tak terjawab", () => {
    expect(vonisPlaylist(200, PLAYLIST, segar, kini).verdict).toBe("ok");
    expect(vonisPlaylist(200, `${PLAYLIST}#EXT-X-ENDLIST\n`, segar, kini).verdict).toBe("mati");
    const lama = new Date(kini - 11 * 60_000).toUTCString();
    expect(vonisPlaylist(200, PLAYLIST, lama, kini)).toEqual({ verdict: "beku", lastSeen: Date.parse(lama) });
    expect(vonisPlaylist(404, "", null, kini).verdict).toBe("hilang");
    expect(vonisPlaylist(502, "", null, kini).verdict).toBe("server");
    expect(vonisPlaylist(403, "", null, kini).verdict).toBe("diam");
  });

  it("hanya mati, beku, dan hilang yang menandai kamera tidak aktif", () => {
    expect(["ok", "mati", "beku", "hilang", "server", "diam"].filter((v) => kameraTidakAktif(v as never))).toEqual([
      "mati",
      "beku",
      "hilang",
    ]);
  });
});

describe("pemakaian data CCTV", () => {
  it("potongan terakhir dan durasinya dibaca dari playlist", () => {
    expect(potonganTerakhir(PLAYLIST)).toEqual({ nama: "stream2.ts", detik: 9.6 });
    expect(potonganTerakhir("#EXTM3U\n")).toBeNull();
    expect(potonganTerakhir(PLAYLIST.replace(/\n/g, "\r\n"))).toEqual({ nama: "stream2.ts", detik: 9.6 });
  });

  it("MB per menit dari ukuran potongan, paling kecil ditulis 1 MB", () => {
    // Kamera Madani Sei Panas: 3,67 MB per 10 detik.
    expect(mbPerMenit(3_667_316, 10)).toBeCloseTo(22, 0);
    expect(mbPerMenit(0, 10)).toBeNull();
    expect(teksMbPerMenit(22.004)).toBe("Sekitar 22 MB per menit");
    expect(teksMbPerMenit(0.3)).toBe("Sekitar 1 MB per menit");
  });
});

describe("jalur pemutar CCTV", () => {
  it("hls.js lebih dulu, termasuk iPhone; pemutar bawaan sebagai cadangan", () => {
    // iPhone iOS 17.1+: hls.js lewat ManagedMediaSource dan pemutar bawaan Safari.
    expect(urutanJalur(true, true)).toEqual(["hls.js", "bawaan"]);
    // iPhone lama: hanya pemutar bawaan.
    expect(urutanJalur(false, true)).toEqual(["bawaan"]);
    // Firefox: hanya hls.js.
    expect(urutanJalur(true, false)).toEqual(["hls.js"]);
    expect(urutanJalur(false, false)).toEqual([]);
  });

  it("28 kamera dengan slug unik", () => {
    expect(CAMS).toHaveLength(28);
    expect(new Set(CAMS.map((c) => c.slug)).size).toBe(28);
  });
});
