// Implementasi Supabase. BELUM PERNAH DIJALANKAN melawan Supabase sungguhan: proyeknya belum ada, dan alur yang
// teruji hanya mode contoh. Memakai service role, jadi hanya boleh dipanggil dari server.
import { createClient } from "@supabase/supabase-js";
import type { Env } from "@/features/tukang/mode";
import { GalatSlugGanda, type BarisAgenda, type BarisFoto, type BarisJurnal, type BarisLoker, type KontenStore } from "./store";
import type { BarisUbahan, BarisUbahanFoodCourt } from "./ubahan";

type Hasil = { data: unknown; error: { message: string; code?: string } | null };

function pastikan<T = unknown>(h: Hasil): T {
  if (h.error) {
    // 23505: pelanggaran unik, satu-satunya yang mungkin di sini adalah slug.
    if (h.error.code === "23505") throw new GalatSlugGanda();
    throw new Error(`Supabase: ${h.error.message}`);
  }
  return h.data as T;
}

export function storeSupabase(env: Env): KontenStore {
  const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL as string, env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: { persistSession: false },
  });
  const sekarang = () => new Date().toISOString();

  return {
    async jurnal(semua) {
      let q = db.from("jurnal").select("*").order("tanggal", { ascending: false });
      if (!semua) q = q.eq("terbit", true);
      return pastikan<BarisJurnal[]>(await q);
    },
    async simpanJurnal({ id, ...d }) {
      const isi = { ...d, diubah: sekarang() };
      pastikan(id ? await db.from("jurnal").update(isi).eq("id", id) : await db.from("jurnal").insert(isi));
    },
    async hapusJurnal(id) {
      pastikan(await db.from("jurnal").delete().eq("id", id));
    },
    async foto() {
      return pastikan<BarisFoto[]>(await db.from("foto_tempat").select("*").order("dibuat"));
    },
    async tambahFoto(d) {
      pastikan(await db.from("foto_tempat").insert(d));
    },
    async hapusFoto(id) {
      pastikan(await db.from("foto_tempat").delete().eq("id", id));
    },
    async agenda(semua) {
      let q = db.from("agenda").select("*").order("mulai");
      if (!semua) q = q.eq("terbit", true);
      return pastikan<BarisAgenda[]>(await q);
    },
    async simpanAgenda({ id, ...d }) {
      const isi = { ...d, diubah: sekarang() };
      pastikan(id ? await db.from("agenda").update(isi).eq("id", id) : await db.from("agenda").insert(isi));
    },
    async hapusAgenda(id) {
      pastikan(await db.from("agenda").delete().eq("id", id));
    },
    async loker(semua) {
      let q = db.from("loker").select("*").order("tanggal", { ascending: false });
      if (!semua) q = q.eq("terbit", true);
      return pastikan<BarisLoker[]>(await q);
    },
    async simpanLoker({ id, ...d }) {
      const isi = { ...d, diubah: sekarang() };
      pastikan(id ? await db.from("loker").update(isi).eq("id", id) : await db.from("loker").insert(isi));
    },
    async hapusLoker(id) {
      pastikan(await db.from("loker").delete().eq("id", id));
    },
    async ubahanMakan() {
      return pastikan<BarisUbahan[]>(await db.from("makan_ubahan").select("tempat_id, baru, data").order("diubah", { ascending: false }));
    },
    async simpanUbahanMakan({ tempat_id, baru, ...data }) {
      pastikan(await db.from("makan_ubahan").upsert({ tempat_id, baru, data, diubah: sekarang() }));
    },
    async hapusUbahanMakan(tempatId) {
      pastikan(await db.from("makan_ubahan").delete().eq("tempat_id", tempatId));
    },
    async ubahanFoodCourt() {
      return pastikan<BarisUbahanFoodCourt[]>(
        await db.from("foodcourt_ubahan").select("foodcourt_id, baru, data").order("diubah", { ascending: false }),
      );
    },
    async simpanUbahanFoodCourt({ foodcourt_id, baru, ...data }) {
      pastikan(await db.from("foodcourt_ubahan").upsert({ foodcourt_id, baru, data, diubah: sekarang() }));
    },
    async hapusUbahanFoodCourt(foodCourtId) {
      pastikan(await db.from("foodcourt_ubahan").delete().eq("foodcourt_id", foodCourtId));
    },
    async unggah(nama, isi, tipe) {
      const { error } = await db.storage.from("konten").upload(nama, isi, { contentType: tipe, upsert: false });
      if (error) throw new Error(`Supabase: ${error.message}`);
      return db.storage.from("konten").getPublicUrl(nama).data.publicUrl;
    },
  };
}
