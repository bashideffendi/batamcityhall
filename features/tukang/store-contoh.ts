// Mode contoh: semua isi fiktif dan berlabel, di memori server, hilang saat server mati. Dipasang di globalThis
// karena route handler dan halaman bisa dibundel terpisah, dan mereka harus melihat data yang sama.
import { randomUUID } from "node:crypto";
import {
  hariIni,
  kePublik,
  kunciTukang,
  LABEL_CONTOH,
  samarkanKontak,
  syaratTampil,
  VERSI_PERSETUJUAN,
  type RekomendasiBaris,
  type TukangBaris,
} from "./aturan";
import { GalatTidakAda } from "./galat";
import { hashKontak } from "./hash";
import type { AksiModerasi, InputFoto, InputKoreksi, InputRekomendasi } from "./skema";
import type { Antrean, TukangStore } from "./store";

type Laporan = {
  id: string;
  tukangId: string;
  jenis: "masih_buka" | "sudah_pindah" | "masalah";
  alasan: string | null;
  status: "baru" | "ditinjau";
  dibuatAt: string;
};
type Koreksi = InputKoreksi & { id: string; kontakHash: string | null; status: "baru" | "ditinjau"; dibuatAt: string };
type Foto = InputFoto & { id: string; status: "baru" | "ditinjau"; dibuatAt: string };

export type DataContoh = {
  tukang: TukangBaris[];
  rekomendasi: RekomendasiBaris[];
  laporan: Laporan[];
  koreksi: Koreksi[];
  foto: Foto[];
  /** Log persetujuan, tanpa kontak. */
  consent: { subjek: string; aksi: string; tukangId: string | null; versi: string; dicatatAt: string }[];
  newsletter: { email: string; dibuatAt: string }[];
};

const WAKTU_CONTOH = new Date(Date.UTC(2026, 10, 1)).toISOString();

function tukangContoh(id: string, nama: string, jasa: string, area: string[], tayang: boolean): TukangBaris {
  return {
    id,
    kunci: `contoh|${id}`,
    nama: `${LABEL_CONTOH}: ${nama}`,
    jasa,
    areaKecamatan: area,
    areaCatatan: null,
    panggilan: false,
    caraHubungi: "Contoh, tidak ada kontak sungguhan",
    statusModerasi: tayang ? "disetujui" : "menunggu",
    izinTukangAt: tayang ? WAKTU_CONTOH : null,
    kontakBolehTampil: tayang,
    disembunyikan: false,
    terakhirDicek: tayang ? "2026-11-01" : null,
    dibuatAt: WAKTU_CONTOH,
  };
}

function rekContoh(n: number, tukangId: string, cerita: string, tag: string[], setuju: boolean): RekomendasiBaris {
  // Domain .invalid dicadangkan RFC 2606, jadi tidak mungkin milik siapa pun.
  const kontak = `warga-contoh-${n}@contoh.invalid`;
  return {
    id: `00000000-0000-4000-8000-0000000001${String(n).padStart(2, "0")}`,
    tukangId,
    cerita: `${LABEL_CONTOH}. ${cerita}`,
    tag,
    kapanDipakai: "2026-10",
    kontakPerekomendasi: kontak,
    kontakHash: hashKontak(kontak),
    statusModerasi: setuju ? "disetujui" : "menunggu",
    dibuatAt: WAKTU_CONTOH,
  };
}

export function dataAwalContoh(): DataContoh {
  const a = "00000000-0000-4000-8000-000000000001";
  const b = "00000000-0000-4000-8000-000000000002";
  const c = "00000000-0000-4000-8000-000000000003";
  return {
    tukang: [
      tukangContoh(a, "Penjahit Contoh A", "jahit-permak", ["Lubuk Baja", "Batu Ampar"], true),
      tukangContoh(b, "Servis AC Contoh B", "servis-ac", ["Batam Kota"], true),
      tukangContoh(c, "Tukang Kunci Contoh C", "tukang-kunci", ["Sekupang"], false),
    ],
    rekomendasi: [
      rekContoh(
        1,
        a,
        "Cerita rekaan untuk menguji tampilan kartu. Orang ini tidak ada.",
        ["rapi", "harga jujur"],
        true,
      ),
      rekContoh(2, a, "Cerita rekaan kedua dari warga rekaan. Penjahitnya juga rekaan.", ["rapi", "tepat waktu"], true),
      rekContoh(3, b, "Cerita rekaan tentang AC yang kembali dingin setelah diservis.", ["cepat"], true),
      rekContoh(4, b, "Cerita rekaan lain. Tukang ini tidak ada.", ["tepat waktu"], true),
      rekContoh(5, c, "Baru satu cerita rekaan, jadi entri ini belum boleh tampil.", ["ramah"], false),
    ],
    laporan: [],
    koreksi: [],
    foto: [],
    consent: [],
    newsletter: [],
  };
}

export function buatStoreContoh(data: DataContoh = dataAwalContoh()): TukangStore {
  const rekDari = (id: string) => data.rekomendasi.filter((r) => r.tukangId === id);
  const tukangAda = (id: string) => {
    const t = data.tukang.find((x) => x.id === id);
    if (!t) throw new GalatTidakAda(id);
    return t;
  };
  const sinyalDari = (id: string) => {
    const milik = data.laporan.filter((l) => l.tukangId === id);
    return {
      masihBuka: milik.filter((l) => l.jenis === "masih_buka").length,
      sudahPindah: milik.filter((l) => l.jenis === "sudah_pindah").length,
    };
  };
  const catat = (subjek: string, aksi: string, tukangId: string | null) =>
    data.consent.push({ subjek, aksi, tukangId, versi: VERSI_PERSETUJUAN, dicatatAt: new Date().toISOString() });
  const sedangTampil = (id: string) => {
    const t = tukangAda(id);
    if (!syaratTampil(t, rekDari(id)).boleh) throw new GalatTidakAda(id);
    return t;
  };
  const tambahLaporan = (tukangId: string, jenis: Laporan["jenis"], alasan: string | null) =>
    data.laporan.push({
      id: randomUUID(),
      tukangId,
      jenis,
      alasan,
      status: "baru",
      dibuatAt: new Date().toISOString(),
    });

  return {
    jenis: "contoh",

    async daftarPublik() {
      return data.tukang.flatMap((t) => kePublik(t, rekDari(t.id), sinyalDari(t.id)) ?? []);
    },

    async kirimRekomendasi(i: InputRekomendasi) {
      // Kiriman di mode contoh juga fiktif dan harus terlihat begitu.
      const nama = i.nama_tukang.startsWith(LABEL_CONTOH) ? i.nama_tukang : `${LABEL_CONTOH}: ${i.nama_tukang}`;
      const kunci = kunciTukang({
        jasa: i.jasa,
        nama: i.nama_tukang,
        caraHubungi: i.cara_hubungi,
        areaKecamatan: i.area_kecamatan,
      });
      let t = data.tukang.find((x) => x.kunci === kunci);
      if (!t) {
        t = {
          id: randomUUID(),
          kunci,
          nama,
          jasa: i.jasa,
          areaKecamatan: i.area_kecamatan,
          areaCatatan: i.area_catatan,
          panggilan: i.panggilan,
          caraHubungi: i.cara_hubungi,
          statusModerasi: "menunggu",
          izinTukangAt: null,
          kontakBolehTampil: false,
          disembunyikan: false,
          terakhirDicek: null,
          dibuatAt: new Date().toISOString(),
        };
        data.tukang.push(t);
      }
      data.rekomendasi.push({
        id: randomUUID(),
        tukangId: t.id,
        cerita: i.cerita,
        tag: i.tag,
        kapanDipakai: i.kapan_dipakai,
        kontakPerekomendasi: i.kontak_perekomendasi,
        kontakHash: hashKontak(i.kontak_perekomendasi),
        statusModerasi: "menunggu",
        dibuatAt: new Date().toISOString(),
      });
      catat("perekomendasi", "setuju", t.id);
    },

    async kirimSinyal(tukangId, jenis) {
      sedangTampil(tukangId);
      tambahLaporan(tukangId, jenis, null);
    },

    async laporkanMasalah(tukangId, alasan) {
      sedangTampil(tukangId).disembunyikan = true;
      tambahLaporan(tukangId, "masalah", alasan);
    },

    async kirimKoreksi(i: InputKoreksi) {
      data.koreksi.push({
        ...i,
        id: randomUUID(),
        kontakHash: i.kontak ? hashKontak(i.kontak) : null,
        status: "baru",
        dibuatAt: new Date().toISOString(),
      });
      if (i.kontak) catat("pengirim_koreksi", "setuju", i.tukang_id);
    },

    async langganan(email: string) {
      data.newsletter ??= [];
      if (!data.newsletter.some((p) => p.email === email)) data.newsletter.push({ email, dibuatAt: new Date().toISOString() });
    },

    async pelanggan() {
      return [...(data.newsletter ?? [])].sort((a, b) => b.dibuatAt.localeCompare(a.dibuatAt));
    },

    async hapusPelanggan(email: string) {
      data.newsletter = (data.newsletter ?? []).filter((p) => p.email !== email);
    },

    async kirimFoto(i: InputFoto) {
      data.foto.push({ ...i, id: randomUUID(), status: "baru", dibuatAt: new Date().toISOString() });
      catat("pengirim_foto", "setuju", null);
    },

    async antrean(): Promise<Antrean> {
      return {
        tukang: data.tukang
          .filter((t) => t.statusModerasi !== "ditolak")
          .map((t) => ({
            id: t.id,
            nama: t.nama,
            jasa: t.jasa,
            areaKecamatan: t.areaKecamatan,
            areaCatatan: t.areaCatatan,
            panggilan: t.panggilan,
            caraHubungi: t.caraHubungi,
            statusModerasi: t.statusModerasi,
            izinTukangAt: t.izinTukangAt,
            kontakBolehTampil: t.kontakBolehTampil,
            disembunyikan: t.disembunyikan,
            terakhirDicek: t.terakhirDicek,
            syarat: syaratTampil(t, rekDari(t.id)),
            rekomendasi: rekDari(t.id).map((r) => ({
              id: r.id,
              cerita: r.cerita,
              tag: r.tag,
              kapanDipakai: r.kapanDipakai,
              kontakSamaran: samarkanKontak(r.kontakPerekomendasi),
              statusModerasi: r.statusModerasi,
            })),
          })),
        laporan: data.laporan.flatMap((l) =>
          l.status === "baru" && l.jenis !== "masih_buka"
            ? [
                {
                  id: l.id,
                  tukangId: l.tukangId,
                  tukangNama: data.tukang.find((t) => t.id === l.tukangId)?.nama ?? "",
                  jenis: l.jenis,
                  alasan: l.alasan,
                  dibuatAt: l.dibuatAt,
                },
              ]
            : [],
        ),
        koreksi: data.koreksi
          .filter((k) => k.status === "baru")
          .map((k) => ({
            id: k.id,
            jenis: k.jenis,
            tempatId: k.tempat_id,
            tukangId: k.tukang_id,
            isi: k.isi,
            kontakSamaran: samarkanKontak(k.kontak),
            cocokRekomendasi: k.kontakHash ? data.rekomendasi.filter((r) => r.kontakHash === k.kontakHash).length : 0,
            dibuatAt: k.dibuatAt,
          })),
        foto: data.foto
          .filter((f) => f.status === "baru")
          .map((f) => ({
            id: f.id,
            judul: f.judul,
            lokasi: f.lokasi,
            perkiraanTahun: f.perkiraan_tahun,
            cerita: f.cerita,
            kredit: f.kredit,
            kontakSamaran: samarkanKontak(f.kontak),
            dibuatAt: f.dibuatAt,
          })),
      };
    },

    async moderasi(a: AksiModerasi) {
      const rek = (id: string) => {
        const r = data.rekomendasi.find((x) => x.id === id);
        if (!r) throw new GalatTidakAda(id);
        return r;
      };
      switch (a.aksi) {
        case "setujui_rekomendasi":
          rek(a.id).statusModerasi = "disetujui";
          return;
        case "tolak_rekomendasi":
          rek(a.id).statusModerasi = "ditolak";
          return;
        case "hapus_rekomendasi":
          rek(a.id);
          data.rekomendasi = data.rekomendasi.filter((r) => r.id !== a.id);
          catat("perekomendasi", "hapus", null);
          return;
        case "setujui_tukang": {
          const t = tukangAda(a.id);
          t.statusModerasi = "disetujui";
          t.terakhirDicek = hariIni();
          return;
        }
        case "tolak_tukang":
          tukangAda(a.id).statusModerasi = "ditolak";
          return;
        case "hapus_tukang":
          tukangAda(a.id);
          data.tukang = data.tukang.filter((t) => t.id !== a.id);
          data.rekomendasi = data.rekomendasi.filter((r) => r.tukangId !== a.id);
          data.laporan = data.laporan.filter((l) => l.tukangId !== a.id);
          catat("tukang", "hapus", null);
          return;
        case "catat_izin": {
          const t = tukangAda(a.id);
          t.izinTukangAt = new Date().toISOString();
          t.kontakBolehTampil = a.kontak_boleh_tampil;
          catat("tukang", "setuju", t.id);
          return;
        }
        case "cabut_izin": {
          const t = tukangAda(a.id);
          t.izinTukangAt = null;
          t.kontakBolehTampil = false;
          catat("tukang", "cabut", t.id);
          return;
        }
        case "tandai_dicek":
          tukangAda(a.id).terakhirDicek = hariIni();
          return;
        case "gabungkan":
          tukangAda(a.id);
          tukangAda(a.ke);
          for (const r of data.rekomendasi) if (r.tukangId === a.id) r.tukangId = a.ke;
          for (const l of data.laporan) if (l.tukangId === a.id) l.tukangId = a.ke;
          data.tukang = data.tukang.filter((t) => t.id !== a.id);
          return;
        case "tinjau_laporan": {
          const l = data.laporan.find((x) => x.id === a.id);
          if (!l) throw new GalatTidakAda(a.id);
          l.status = "ditinjau";
          if (a.tampilkan_lagi) {
            tukangAda(l.tukangId).disembunyikan = false;
            for (const x of data.laporan) {
              if (x.tukangId === l.tukangId && x.jenis === "masalah") x.status = "ditinjau";
            }
          }
          return;
        }
        case "selesai_koreksi": {
          const k = data.koreksi.find((x) => x.id === a.id);
          if (!k) throw new GalatTidakAda(a.id);
          k.status = "ditinjau";
          return;
        }
        case "hapus_data_pengirim": {
          const k = data.koreksi.find((x) => x.id === a.id);
          if (!k) throw new GalatTidakAda(a.id);
          if (k.kontakHash) {
            data.rekomendasi = data.rekomendasi.filter((r) => r.kontakHash !== k.kontakHash);
            catat("perekomendasi", "hapus", null);
          }
          k.status = "ditinjau";
          k.kontak = null;
          k.kontakHash = null;
          return;
        }
        case "selesai_foto": {
          const f = data.foto.find((x) => x.id === a.id);
          if (!f) throw new GalatTidakAda(a.id);
          f.status = "ditinjau";
          return;
        }
      }
    },
  };
}

const KUNCI = Symbol.for("bch.tukang.storeContoh");
type GlobalContoh = typeof globalThis & { [KUNCI]?: TukangStore };

export function storeContoh(): TukangStore {
  const g = globalThis as GlobalContoh;
  return (g[KUNCI] ??= buatStoreContoh());
}
