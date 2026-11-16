import { PNG } from "pngjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LEGEND } from "@/features/langit-laut/lib/radar";

const timestamp = (offset = 0) => {
  const d = new Date(Date.UTC(2026, 10, 16, 12, 0) - offset * 300000);
  return d.toISOString().replace(/[-:T]/g, "").slice(0, 12);
};
const req = (ts: string) => new Request("http://localhost/api/radar-citra/" + ts);

// setImmediate tidak dipalsukan: route memakainya untuk memberi napas di antara penghalusan citra.
beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
  vi.setSystemTime(new Date("2026-11-16T04:00:00Z"));
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("proxy citra radar", () => {
  it("mengirim citra yang dihaluskan dengan warna MSS, transparansi, dan cache", async () => {
    // Blok pantulan 6x6 berwarna satu kunci LEGEND di tengah citra 16x16.
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(LEGEND[4].slice(i, i + 2), 16));
    const png = new PNG({ width: 16, height: 16 });
    for (let y = 5; y < 11; y++) for (let x = 5; x < 11; x++) png.data.set([r, g, b, 255], (y * 16 + x) * 4);
    const bytes = PNG.sync.write(png);
    const fetcher = vi.fn().mockResolvedValue(new Response(new Uint8Array(bytes)));
    vi.stubGlobal("fetch", fetcher);
    const { GET } = await import("@/app/api/radar-citra/[ts]/route");
    const { SKALA_HALUS } = await import("@/features/langit-laut/lib/halus-radar");
    const ts = timestamp();
    const res = await GET(req(ts), { params: Promise.resolve({ ts }) });
    // Gradasi halus dikirim sebagai WebP (lebih kecil); warnanya boleh bergeser sedikit karena kompresi.
    expect(res.headers.get("Content-Type")).toBe("image/webp");
    const sharp = (await import("sharp")).default;
    const { data, info } = await sharp(Buffer.from(await res.arrayBuffer())).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    expect(info.width).toBe(16 * SKALA_HALUS);
    const piksel = (x: number, y: number) => [...data.subarray((y * info.width + x) * 4, (y * info.width + x) * 4 + 4)];
    // Tengah blok: warna kunci yang sama, tidak tembus pandang. Pojok citra: tetap tanpa pantulan.
    const tengah = piksel(8 * SKALA_HALUS, 8 * SKALA_HALUS);
    [r, g, b].forEach((v, i) => expect(Math.abs(tengah[i] - v)).toBeLessThanOrEqual(12));
    expect(tengah[3]).toBe(255);
    expect(piksel(0, 0)[3]).toBe(0);
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=2592000, immutable");
    expect((await GET(req(ts), { params: Promise.resolve({ ts }) })).status).toBe(200);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("PNG yang tidak terbaca dikirim apa adanya, bukan gambar kosong", async () => {
    const bytes = new Uint8Array([1, 2, 3, 4]);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(bytes)));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { GET } = await import("@/app/api/radar-citra/[ts]/route");
    const ts = timestamp();
    const res = await GET(req(ts), { params: Promise.resolve({ ts }) });
    expect(res.status).toBe(200);
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(bytes);
  });
  it("galat sementara dari penyedia dijawab 502 dan langsung dicoba lagi", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));
    vi.stubGlobal("fetch", fetcher);
    const { GET } = await import("@/app/api/radar-citra/[ts]/route");
    const ts = timestamp(), ctx = { params: Promise.resolve({ ts }) };
    expect((await GET(req(ts), ctx)).status).toBe(502);
    // Tidak ditahan semenit seperti 404: permintaan berikutnya langsung ke penyedia lagi.
    expect((await GET(req(ts), ctx)).status).toBe(502);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("tiga puluh citra sekaligus semuanya terjawab 200 (dihaluskan bergiliran)", async () => {
    const png = new PNG({ width: 8, height: 8 });
    png.data.set([0, 255, 0, 255], (3 * 8 + 3) * 4);
    const bytes = PNG.sync.write(png);
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => Promise.resolve(new Response(new Uint8Array(bytes)))));
    const { GET } = await import("@/app/api/radar-citra/[ts]/route");
    const jawaban = await Promise.all(
      Array.from({ length: 30 }, (_, i) => {
        const ts = timestamp(i);
        return GET(req(ts), { params: Promise.resolve({ ts }) });
      }),
    );
    expect(jawaban.map((r) => r.status)).toEqual(Array(30).fill(200));
    expect(new Set(jawaban.map((r) => r.headers.get("Content-Type")))).toEqual(new Set(["image/webp"]));
  });
  it("menggabungkan permintaan yang berjalan", async () => {
    let finish!: (r: Response) => void;
    const fetcher = vi.fn(() => new Promise<Response>((resolve) => { finish = resolve; }));
    vi.stubGlobal("fetch", fetcher);
    const { GET } = await import("@/app/api/radar-citra/[ts]/route");
    const ts = timestamp(), ctx = { params: Promise.resolve({ ts }) };
    const a = GET(req(ts), ctx), b = GET(req(ts), ctx);
    await Promise.resolve();
    finish(new Response(new Uint8Array([1,2,3])));
    expect((await a).status).toBe(200);
    expect((await b).status).toBe(200);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("frame hilang tetap 404 tanpa gambar kosong, dicoba lagi setelah semenit", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 404 }));
    vi.stubGlobal("fetch", fetcher);
    const { GET } = await import("@/app/api/radar-citra/[ts]/route");
    const ts = timestamp(), ctx = { params: Promise.resolve({ ts }) };
    const r = await GET(req(ts), ctx);
    expect(r.status).toBe(404);
    expect(await r.text()).toBe("");
    expect(r.headers.get("Cache-Control")).toBe("no-store");
    await GET(req(ts), ctx);
    expect(fetcher).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(60001);
    await GET(req(ts), ctx);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("kegagalan jaringan tetap 502, bukan citra tanpa hujan", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const { GET } = await import("@/app/api/radar-citra/[ts]/route");
    const ts = timestamp();
    expect((await GET(req(ts), { params: Promise.resolve({ ts }) })).status).toBe(502);
  });
  it("batas laju tetap 120 cache miss per sepuluh menit", async () => {
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(new Response(null, { status: 404 })));
    vi.stubGlobal("fetch", fetcher);
    const { GET } = await import("@/app/api/radar-citra/[ts]/route");
    for (let i = 0; i < 120; i++) {
      const ts = timestamp(i);
      expect((await GET(req(ts), { params: Promise.resolve({ ts }) })).status).toBe(404);
    }
    const ts = timestamp(120);
    expect((await GET(req(ts), { params: Promise.resolve({ ts }) })).status).toBe(429);
    expect(fetcher).toHaveBeenCalledTimes(120);
  });
});

describe("penghalusan citra radar", () => {
  const warna = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
  const buat = (isi: (x: number, y: number) => string | null, n = 24) => {
    const p = new PNG({ width: n, height: n });
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        const c = isi(x, y);
        if (c) p.data.set([...warna(c), 255], (y * n + x) * 4);
      }
    return PNG.sync.write(p);
  };
  const baca = async (b: Buffer) => {
    const { haluskanRadar, SKALA_HALUS } = await import("@/features/langit-laut/lib/halus-radar");
    const h = PNG.sync.read(haluskanRadar(b));
    const alfa = (x: number, y: number) => h.data[(y * h.width + x) * 4 + 3];
    return { h, alfa, S: SKALA_HALUS };
  };

  it("posisi warna dan warna di posisi saling berbalik untuk tiap warna skala", async () => {
    const { posisiWarna, warnaDiPosisi } = await import("@/features/langit-laut/lib/halus-radar");
    LEGEND.forEach((hex, i) => {
      const t = posisiWarna(...warna(hex));
      expect(t).toBeCloseTo(i / (LEGEND.length - 1), 5);
      expect(warnaDiPosisi(t)).toEqual(warna(hex));
    });
  });

  it("citra tanpa pantulan tetap kosong seluruhnya", async () => {
    const { h } = await baca(buat(() => null));
    for (let i = 3; i < h.data.length; i += 4) expect(h.data[i]).toBe(0);
  });

  it("satu piksel pantulan yang berdiri sendiri tetap terlihat", async () => {
    const { alfa, S } = await baca(buat((x, y) => (x === 12 && y === 12 ? LEGEND[0] : null)));
    expect(alfa(12 * S + Math.floor(S / 2), 12 * S + Math.floor(S / 2))).toBeGreaterThan(127);
  });

  it("tidak menambah hujan: lebih dari satu piksel asli dari pantulan tetap kosong", async () => {
    const { h, alfa, S } = await baca(buat((x, y) => (x >= 8 && x < 16 && y >= 8 && y < 16 ? LEGEND[6] : null)));
    for (let Y = 0; Y < h.height; Y++)
      for (let X = 0; X < h.width; X++) {
        const [x, y] = [X / S, Y / S];
        const jauh = x < 7 || x >= 17 || y < 7 || y >= 17;
        if (jauh) expect(alfa(X, Y)).toBe(0);
      }
  });

  it("warna di dalam daerah hujan tidak memudar ke kelas lebih ringan di tepinya", async () => {
    // Blok merah (lebat) berbatasan langsung dengan daerah tanpa pantulan: semua piksel yang tampil tetap merah.
    const { h, S } = await baca(buat((x, y) => (x >= 8 && x < 16 && y >= 8 && y < 16 ? LEGEND[7] : null)));
    const [r, g, b] = warna(LEGEND[7]);
    for (let i = 0; i < h.data.length; i += 4) {
      if (h.data[i + 3] === 0) continue;
      expect([h.data[i], h.data[i + 1], h.data[i + 2]]).toEqual([r, g, b]);
    }
    expect(S).toBeGreaterThanOrEqual(2);
  });
});
