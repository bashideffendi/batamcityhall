// Implementasi Supabase. BELUM PERNAH DIJALANKAN melawan Supabase sungguhan: proyeknya belum ada, dan yang
// sudah teruji hanya klien tiruan (tests/unit/tukang.test.ts).
//
// Dua klien, dengan hak berbeda:
// - publik (kunci anon): hanya membaca view tukang_publik dan rekomendasi_publik.
// - layanan (service role): semua tulisan dan layar moderator. Hanya di server, jangan pernah ke browser.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  hariIni,
  kunciTukang,
  ringkasTag,
  samarkanKontak,
  syaratTampil,
  VERSI_PERSETUJUAN,
  type TukangPublik,
} from "./aturan";
import { GalatTidakAda } from "./galat";
import { hashKontak } from "./hash";
import type { Env } from "./mode";
import type { AksiModerasi, InputFoto, InputKoreksi, InputRekomendasi } from "./skema";
import type { Antrean, TukangStore } from "./store";

// Hasil query dibaca lewat bentuk minimal ini, karena tipe skema belum dibangkitkan dari proyek sungguhan.
type Hasil = { data: unknown; error: { message: string; code?: string } | null };

function pastikan<T = unknown>(h: Hasil): T {
  if (h.error) throw new Error(`Supabase: ${h.error.message}`);
  return h.data as T;
}

type Status = "menunggu" | "disetujui" | "ditolak";
type BarisTukang = {
  id: string;
  nama: string;
  jasa: string;
  area_kecamatan: string[];
  area_catatan: string | null;
  panggilan: boolean;
  cara_hubungi: string;
  status_moderasi: Status;
  izin_tukang_at: string | null;
  kontak_boleh_tampil: boolean;
  disembunyikan: boolean;
  terakhir_dicek: string | null;
};
type BarisRek = {
  id: string;
  tukang_id: string;
  cerita: string;
  tag: string[];
  kapan_dipakai: string;
  kontak_perekomendasi: string;
  kontak_hash: string;
  status_moderasi: Status;
};
type BarisPublik = {
  id: string;
  nama: string;
  jasa: string;
  area_kecamatan: string[];
  area_catatan: string | null;
  panggilan: boolean;
  cara_hubungi: string | null;
  terakhir_dicek: string | null;
  jumlah_rekomendasi: number;
  masih_buka: number;
  sudah_pindah: number;
};
type BarisLaporan = {
  id: string;
  tukang_id: string;
  jenis: "sudah_pindah" | "masalah";
  alasan: string | null;
  dibuat_at: string;
};
type BarisKoreksi = {
  id: string;
  jenis: string;
  tempat_id: string | null;
  tukang_id: string | null;
  isi: string;
  kontak: string | null;
  kontak_hash: string | null;
  dibuat_at: string;
};
type BarisFoto = {
  id: string;
  judul: string;
  lokasi: string;
  perkiraan_tahun: string;
  cerita: string | null;
  kredit: string;
  kontak: string;
  dibuat_at: string;
};

const KOLOM_PUBLIK =
  "id,nama,jasa,area_kecamatan,area_catatan,panggilan,cara_hubungi,terakhir_dicek,jumlah_rekomendasi,masih_buka,sudah_pindah";

export function buatStoreSupabase(publik: SupabaseClient, layanan: SupabaseClient): TukangStore {
  const catat = async (baris: {
    subjek: "perekomendasi" | "tukang" | "pengirim_koreksi" | "pengirim_foto";
    aksi: "setuju" | "cabut" | "hapus";
    tukang_id?: string | null;
    rekomendasi_id?: string | null;
    catatan?: string | null;
  }) => {
    pastikan(await layanan.from("consent_log").insert({ ...baris, versi_teks: VERSI_PERSETUJUAN }));
  };

  const adakanTukang = async (i: InputRekomendasi): Promise<string> => {
    const kunci = kunciTukang({
      jasa: i.jasa,
      nama: i.nama_tukang,
      caraHubungi: i.cara_hubungi,
      areaKecamatan: i.area_kecamatan,
    });
    const cari = async () =>
      pastikan<{ id: string } | null>(await layanan.from("tukang").select("id").eq("kunci", kunci).maybeSingle());
    const ada = await cari();
    if (ada) return ada.id;
    const baru = await layanan
      .from("tukang")
      .insert({
        kunci,
        nama: i.nama_tukang,
        jasa: i.jasa,
        area_kecamatan: i.area_kecamatan,
        area_catatan: i.area_catatan,
        panggilan: i.panggilan,
        cara_hubungi: i.cara_hubungi,
      })
      .select("id")
      .single();
    // 23505 = kiriman lain untuk tukang yang sama baru saja masuk lebih dulu.
    if (baru.error?.code === "23505") {
      const lagi = await cari();
      if (lagi) return lagi.id;
    }
    return pastikan<{ id: string }>(baru).id;
  };

  /** Entri harus sedang tampil supaya route publik tidak bisa dipakai menyentuh yang belum lolos moderasi. */
  const pastikanTampil = async (id: string) => {
    const t = pastikan<{ id: string } | null>(
      await publik.from("tukang_publik").select("id").eq("id", id).maybeSingle(),
    );
    if (!t) throw new GalatTidakAda(id);
  };

  const ubahTukang = async (id: string, isi: Record<string, unknown>) => {
    pastikan(await layanan.from("tukang").update(isi).eq("id", id));
  };

  return {
    jenis: "supabase",

    async daftarPublik(): Promise<TukangPublik[]> {
      const baris = pastikan<BarisPublik[]>(
        await publik.from("tukang_publik").select(KOLOM_PUBLIK).order("terakhir_dicek", { ascending: false }),
      );
      if (!baris.length) return [];
      const cerita = pastikan<{ tukang_id: string; cerita: string; tag: string[]; kapan_dipakai: string }[]>(
        await publik
          .from("rekomendasi_publik")
          .select("tukang_id,cerita,tag,kapan_dipakai")
          .in(
            "tukang_id",
            baris.map((b) => b.id),
          )
          .order("dibuat_at", { ascending: true }),
      );
      return baris.map((b) => {
        const milik = cerita.filter((c) => c.tukang_id === b.id);
        return {
          id: b.id,
          nama: b.nama,
          jasa: b.jasa,
          areaKecamatan: b.area_kecamatan,
          areaCatatan: b.area_catatan,
          panggilan: b.panggilan,
          kontak: b.cara_hubungi,
          jumlahRekomendasi: b.jumlah_rekomendasi,
          cerita: milik.map((c) => ({ teks: c.cerita, tag: c.tag, kapanDipakai: c.kapan_dipakai })),
          tag: ringkasTag(milik.map((c) => c.tag)),
          terakhirDicek: b.terakhir_dicek,
          masihBuka: b.masih_buka,
          sudahPindah: b.sudah_pindah,
        };
      });
    },

    async kirimRekomendasi(i: InputRekomendasi) {
      const tukangId = await adakanTukang(i);
      const rek = pastikan<{ id: string }>(
        await layanan
          .from("rekomendasi")
          .insert({
            tukang_id: tukangId,
            cerita: i.cerita,
            tag: i.tag,
            kapan_dipakai: i.kapan_dipakai,
            kontak_perekomendasi: i.kontak_perekomendasi,
            kontak_hash: hashKontak(i.kontak_perekomendasi),
          })
          .select("id")
          .single(),
      );
      try {
        await catat({ subjek: "perekomendasi", aksi: "setuju", tukang_id: tukangId, rekomendasi_id: rek.id });
      } catch (e) {
        // Data pribadi tanpa catatan persetujuan tidak boleh tertinggal.
        await layanan.from("rekomendasi").delete().eq("id", rek.id);
        throw e;
      }
    },

    async kirimSinyal(tukangId, jenis) {
      await pastikanTampil(tukangId);
      pastikan(await layanan.from("laporan").insert({ tukang_id: tukangId, jenis }));
    },

    async laporkanMasalah(tukangId, alasan) {
      await pastikanTampil(tukangId);
      pastikan(await layanan.from("laporan").insert({ tukang_id: tukangId, jenis: "masalah", alasan }));
      await ubahTukang(tukangId, { disembunyikan: true });
    },

    async kirimKoreksi(i: InputKoreksi) {
      pastikan(
        await layanan.from("koreksi_data").insert({
          jenis: i.jenis,
          tempat_id: i.tempat_id,
          tukang_id: i.tukang_id,
          isi: i.isi,
          kontak: i.kontak,
          kontak_hash: i.kontak ? hashKontak(i.kontak) : null,
        }),
      );
      if (i.kontak) await catat({ subjek: "pengirim_koreksi", aksi: "setuju", tukang_id: i.tukang_id });
    },

    async kirimFoto(i: InputFoto) {
      pastikan(
        await layanan.from("kiriman_foto").insert({
          judul: i.judul,
          lokasi: i.lokasi,
          perkiraan_tahun: i.perkiraan_tahun,
          cerita: i.cerita,
          kredit: i.kredit,
          kontak: i.kontak,
          punya_hak: i.punya_hak,
          izin_tampil: i.izin_tampil,
        }),
      );
      await catat({ subjek: "pengirim_foto", aksi: "setuju" });
    },

    async antrean(): Promise<Antrean> {
      const tukang = pastikan<BarisTukang[]>(
        await layanan
          .from("tukang")
          .select(
            "id,nama,jasa,area_kecamatan,area_catatan,panggilan,cara_hubungi,status_moderasi,izin_tukang_at,kontak_boleh_tampil,disembunyikan,terakhir_dicek",
          )
          .neq("status_moderasi", "ditolak")
          .order("dibuat_at", { ascending: false }),
      );
      const rek = pastikan<BarisRek[]>(
        await layanan
          .from("rekomendasi")
          .select("id,tukang_id,cerita,tag,kapan_dipakai,kontak_perekomendasi,kontak_hash,status_moderasi"),
      );
      const laporan = pastikan<BarisLaporan[]>(
        await layanan
          .from("laporan")
          .select("id,tukang_id,jenis,alasan,dibuat_at")
          .eq("status", "baru")
          .neq("jenis", "masih_buka")
          .order("dibuat_at", { ascending: true }),
      );
      const koreksi = pastikan<BarisKoreksi[]>(
        await layanan
          .from("koreksi_data")
          .select("id,jenis,tempat_id,tukang_id,isi,kontak,kontak_hash,dibuat_at")
          .eq("status", "baru")
          .order("dibuat_at", { ascending: true }),
      );
      const foto = pastikan<BarisFoto[]>(
        await layanan
          .from("kiriman_foto")
          .select("id,judul,lokasi,perkiraan_tahun,cerita,kredit,kontak,dibuat_at")
          .eq("status", "baru")
          .order("dibuat_at", { ascending: true }),
      );

      return {
        tukang: tukang.map((t) => {
          const milik = rek.filter((r) => r.tukang_id === t.id);
          return {
            id: t.id,
            nama: t.nama,
            jasa: t.jasa,
            areaKecamatan: t.area_kecamatan,
            areaCatatan: t.area_catatan,
            panggilan: t.panggilan,
            caraHubungi: t.cara_hubungi,
            statusModerasi: t.status_moderasi,
            izinTukangAt: t.izin_tukang_at,
            kontakBolehTampil: t.kontak_boleh_tampil,
            disembunyikan: t.disembunyikan,
            terakhirDicek: t.terakhir_dicek,
            syarat: syaratTampil(
              { statusModerasi: t.status_moderasi, izinTukangAt: t.izin_tukang_at, disembunyikan: t.disembunyikan },
              milik.map((r) => ({ kontakHash: r.kontak_hash, statusModerasi: r.status_moderasi })),
            ),
            rekomendasi: milik.map((r) => ({
              id: r.id,
              cerita: r.cerita,
              tag: r.tag,
              kapanDipakai: r.kapan_dipakai,
              kontakSamaran: samarkanKontak(r.kontak_perekomendasi),
              statusModerasi: r.status_moderasi,
            })),
          };
        }),
        laporan: laporan.map((l) => ({
          id: l.id,
          tukangId: l.tukang_id,
          tukangNama: tukang.find((t) => t.id === l.tukang_id)?.nama ?? "",
          jenis: l.jenis,
          alasan: l.alasan,
          dibuatAt: l.dibuat_at,
        })),
        koreksi: koreksi.map((k) => ({
          id: k.id,
          jenis: k.jenis,
          tempatId: k.tempat_id,
          tukangId: k.tukang_id,
          isi: k.isi,
          kontakSamaran: samarkanKontak(k.kontak),
          cocokRekomendasi: k.kontak_hash ? rek.filter((r) => r.kontak_hash === k.kontak_hash).length : 0,
          dibuatAt: k.dibuat_at,
        })),
        foto: foto.map((f) => ({
          id: f.id,
          judul: f.judul,
          lokasi: f.lokasi,
          perkiraanTahun: f.perkiraan_tahun,
          cerita: f.cerita,
          kredit: f.kredit,
          kontakSamaran: samarkanKontak(f.kontak),
          dibuatAt: f.dibuat_at,
        })),
      };
    },

    async moderasi(a: AksiModerasi) {
      const statusRek = async (id: string, status: Status) => {
        pastikan(await layanan.from("rekomendasi").update({ status_moderasi: status }).eq("id", id));
      };
      switch (a.aksi) {
        case "setujui_rekomendasi":
          return statusRek(a.id, "disetujui");
        case "tolak_rekomendasi":
          return statusRek(a.id, "ditolak");
        case "hapus_rekomendasi":
          pastikan(await layanan.from("rekomendasi").delete().eq("id", a.id));
          return catat({ subjek: "perekomendasi", aksi: "hapus" });
        case "setujui_tukang":
          return ubahTukang(a.id, { status_moderasi: "disetujui", terakhir_dicek: hariIni() });
        case "tolak_tukang":
          return ubahTukang(a.id, { status_moderasi: "ditolak" });
        case "hapus_tukang":
          pastikan(await layanan.from("tukang").delete().eq("id", a.id));
          return catat({ subjek: "tukang", aksi: "hapus" });
        case "catat_izin":
          await ubahTukang(a.id, {
            izin_tukang_at: new Date().toISOString(),
            kontak_boleh_tampil: a.kontak_boleh_tampil,
          });
          return catat({ subjek: "tukang", aksi: "setuju", tukang_id: a.id, catatan: a.catatan || null });
        case "cabut_izin":
          await ubahTukang(a.id, { izin_tukang_at: null, kontak_boleh_tampil: false });
          return catat({ subjek: "tukang", aksi: "cabut", tukang_id: a.id });
        case "tandai_dicek":
          return ubahTukang(a.id, { terakhir_dicek: hariIni() });
        case "gabungkan":
          pastikan(await layanan.from("rekomendasi").update({ tukang_id: a.ke }).eq("tukang_id", a.id));
          pastikan(await layanan.from("laporan").update({ tukang_id: a.ke }).eq("tukang_id", a.id));
          pastikan(await layanan.from("tukang").delete().eq("id", a.id));
          return;
        case "tinjau_laporan": {
          const l = pastikan<{ tukang_id: string } | null>(
            await layanan.from("laporan").select("tukang_id").eq("id", a.id).maybeSingle(),
          );
          if (!l) throw new GalatTidakAda(a.id);
          pastikan(await layanan.from("laporan").update({ status: "ditinjau" }).eq("id", a.id));
          if (a.tampilkan_lagi) {
            await ubahTukang(l.tukang_id, { disembunyikan: false });
            pastikan(
              await layanan
                .from("laporan")
                .update({ status: "ditinjau" })
                .eq("tukang_id", l.tukang_id)
                .eq("jenis", "masalah"),
            );
          }
          return;
        }
        case "selesai_koreksi":
          pastikan(await layanan.from("koreksi_data").update({ status: "ditinjau" }).eq("id", a.id));
          return;
        case "hapus_data_pengirim": {
          const k = pastikan<{ kontak_hash: string | null } | null>(
            await layanan.from("koreksi_data").select("kontak_hash").eq("id", a.id).maybeSingle(),
          );
          if (!k) throw new GalatTidakAda(a.id);
          if (k.kontak_hash) {
            pastikan(await layanan.from("rekomendasi").delete().eq("kontak_hash", k.kontak_hash));
            await catat({ subjek: "perekomendasi", aksi: "hapus" });
          }
          pastikan(
            await layanan
              .from("koreksi_data")
              .update({ status: "ditinjau", kontak: null, kontak_hash: null })
              .eq("id", a.id),
          );
          return;
        }
        case "selesai_foto":
          pastikan(await layanan.from("kiriman_foto").update({ status: "ditinjau" }).eq("id", a.id));
          return;
      }
    },
  };
}

export function buatStoreSupabaseDariEnv(env: Env): TukangStore {
  const url = env.NEXT_PUBLIC_SUPABASE_URL as string;
  const auth = { persistSession: false, autoRefreshToken: false };
  return buatStoreSupabase(
    createClient(url, env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string, { auth }),
    createClient(url, env.SUPABASE_SERVICE_ROLE_KEY as string, { auth }),
  );
}
