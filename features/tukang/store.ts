// Antarmuka penyimpanan kiriman warga, dengan dua implementasi:
// - store-supabase.ts: Postgres lewat service role. Hanya di server.
// - store-contoh.ts: data fiktif di memori. Hanya saat variabel Supabase kosong.
// Mode "mati" tidak punya store sama sekali: lihat modeKiriman().
import type { HasilSyarat, StatusModerasi, TukangPublik } from "./aturan";
import { modeKiriman, type Env } from "./mode";
import type { AksiModerasi, InputFoto, InputKoreksi, InputRekomendasi } from "./skema";
import { storeContoh } from "./store-contoh";
import { buatStoreSupabaseDariEnv } from "./store-supabase";

export { GalatTidakAda } from "./galat";

export type TukangAdmin = {
  id: string;
  nama: string;
  jasa: string;
  areaKecamatan: string[];
  areaCatatan: string | null;
  panggilan: boolean;
  caraHubungi: string;
  statusModerasi: StatusModerasi;
  izinTukangAt: string | null;
  kontakBolehTampil: boolean;
  disembunyikan: boolean;
  terakhirDicek: string | null;
  syarat: HasilSyarat;
  rekomendasi: {
    id: string;
    cerita: string;
    tag: string[];
    kapanDipakai: string;
    /** Versi tersamar. Kontak lengkap tidak pernah dikirim ke browser, termasuk browser moderator. */
    kontakSamaran: string | null;
    statusModerasi: StatusModerasi;
  }[];
};

export type LaporanAdmin = {
  id: string;
  tukangId: string;
  tukangNama: string;
  jenis: "sudah_pindah" | "masalah";
  alasan: string | null;
  dibuatAt: string;
};

export type KoreksiAdmin = {
  id: string;
  jenis: string;
  tempatId: string | null;
  tukangId: string | null;
  isi: string;
  kontakSamaran: string | null;
  /** Jumlah rekomendasi yang kontaknya sama dengan pengirim koreksi. */
  cocokRekomendasi: number;
  dibuatAt: string;
};

export type FotoAdmin = {
  id: string;
  judul: string;
  lokasi: string;
  perkiraanTahun: string;
  cerita: string | null;
  kredit: string;
  kontakSamaran: string | null;
  dibuatAt: string;
};

export type Antrean = {
  tukang: TukangAdmin[];
  laporan: LaporanAdmin[];
  koreksi: KoreksiAdmin[];
  foto: FotoAdmin[];
};

export interface TukangStore {
  readonly jenis: "supabase" | "contoh";
  daftarPublik(): Promise<TukangPublik[]>;
  kirimRekomendasi(input: InputRekomendasi): Promise<void>;
  kirimSinyal(tukangId: string, jenis: "masih_buka" | "sudah_pindah"): Promise<void>;
  /** Menyembunyikan entri sampai ditinjau moderator. */
  laporkanMasalah(tukangId: string, alasan: string): Promise<void>;
  kirimKoreksi(input: InputKoreksi): Promise<void>;
  kirimFoto(input: InputFoto): Promise<void>;
  antrean(): Promise<Antrean>;
  moderasi(aksi: AksiModerasi): Promise<void>;
  /** Alamat yang sudah tercatat diterima diam-diam: tidak membocorkan siapa yang berlangganan. */
  langganan(email: string): Promise<void>;
  pelanggan(): Promise<Pelanggan[]>;
  hapusPelanggan(email: string): Promise<void>;
}

export type Pelanggan = { email: string; dibuatAt: string };

/** null = mode mati, yang berarti belum menerima kiriman. */
export function ambilStore(env: Env = process.env): TukangStore | null {
  const mode = modeKiriman(env);
  if (mode === "supabase") return buatStoreSupabaseDariEnv(env);
  if (mode === "contoh") return storeContoh();
  return null;
}
