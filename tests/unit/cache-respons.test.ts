import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cacheRespons, kosongkanCacheRespons, lamaSimpan } from "@/lib/cache-respons";

const jawab = (isi: string, cacheControl: string, status = 200) =>
  Response.json({ isi }, { status, headers: { "Cache-Control": cacheControl } });

describe("cache respons route realtime", () => {
  beforeEach(() => {
    kosongkanCacheRespons();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("lama simpan diambil dari s-maxage", () => {
    expect(lamaSimpan("public, s-maxage=60, stale-while-revalidate=120")).toBe(60);
    expect(lamaSimpan("no-store")).toBe(0);
    expect(lamaSimpan("public, max-age=30")).toBe(0);
    expect(lamaSimpan(null)).toBe(0);
  });

  it("sumber tidak dipanggil lagi selama masa simpan, lalu dipanggil setelah lewat", async () => {
    const muat = vi.fn(async () => jawab("a", "public, s-maxage=60"));
    expect(await (await cacheRespons("k", muat)).json()).toEqual({ isi: "a" });
    expect(await (await cacheRespons("k", muat)).json()).toEqual({ isi: "a" });
    expect(muat).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(61_000);
    await cacheRespons("k", muat);
    expect(muat).toHaveBeenCalledTimes(2);
  });

  it("permintaan bersamaan hanya memanggil sumber sekali", async () => {
    const muat = vi.fn(async () => jawab("a", "public, s-maxage=60"));
    const [x, y, z] = await Promise.all([cacheRespons("k", muat), cacheRespons("k", muat), cacheRespons("k", muat)]);
    expect(muat).toHaveBeenCalledTimes(1);
    expect(await x.json()).toEqual(await y.json());
    expect(z.status).toBe(200);
  });

  it("jawaban gagal dan no-store tidak disimpan, supaya permintaan berikutnya mencoba lagi", async () => {
    const gagal = vi.fn(async () => jawab("x", "no-store", 503));
    expect((await cacheRespons("g", gagal)).status).toBe(503);
    await cacheRespons("g", gagal);
    expect(gagal).toHaveBeenCalledTimes(2);

    const tanpaSimpan = vi.fn(async () => jawab("y", "no-store"));
    await cacheRespons("n", tanpaSimpan);
    await cacheRespons("n", tanpaSimpan);
    expect(tanpaSimpan).toHaveBeenCalledTimes(2);
  });

  it("data baik tetap disajikan selama masa simpan walau sumbernya gagal, lalu kegagalan terlihat", async () => {
    let gagal = false;
    const muat = vi.fn(async () => (gagal ? jawab("x", "no-store", 503) : jawab("baik", "public, s-maxage=60")));
    await cacheRespons("k", muat);
    gagal = true;
    expect((await cacheRespons("k", muat)).status).toBe(200);
    vi.advanceTimersByTime(61_000);
    expect((await cacheRespons("k", muat)).status).toBe(503);
  });

  it("kunci berbeda tidak saling menimpa", async () => {
    await cacheRespons("a", async () => jawab("a", "public, s-maxage=60"));
    expect(await (await cacheRespons("b", async () => jawab("b", "public, s-maxage=60"))).json()).toEqual({ isi: "b" });
  });

  it("isi bisa dibaca berkali-kali dari simpanan yang sama", async () => {
    const muat = async () => jawab("a", "public, s-maxage=60");
    await (await cacheRespons("k", muat)).text();
    expect(await (await cacheRespons("k", muat)).text()).toBe(JSON.stringify({ isi: "a" }));
  });
});
