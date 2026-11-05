// Daftar feed yang dipakai dan bentuk respons /api/berita. Bukti tiap feed: docs/SUMBER_BERITA.md.

export type SumberBerita = { id: string; nama: string; situs: string; feed: string };

export const SUMBER_BERITA: SumberBerita[] = [
  { id: "batam-pos", nama: "Batam Pos", situs: "https://batampos.co.id/", feed: "https://batampos.co.id/feed/" },
  {
    id: "antara-kepri",
    nama: "Antara Kepri",
    situs: "https://kepri.antaranews.com/",
    feed: "https://kepri.antaranews.com/rss/terkini.xml",
  },
  { id: "gowest", nama: "GoWest", situs: "https://gowest.id/", feed: "https://gowest.id/feed/" },
  { id: "gokepri", nama: "GoKepri", situs: "https://gokepri.com/", feed: "https://gokepri.com/feed/" },
  { id: "ulasan", nama: "Ulasan.co", situs: "https://ulasan.co/", feed: "https://ulasan.co/feed/" },
  {
    id: "media-center-batam",
    nama: "Media Center Pemko Batam",
    situs: "https://mediacenter.batam.go.id/",
    feed: "https://mediacenter.batam.go.id/feed/",
  },
];

export type StatusFeed = "ok" | "kosong" | "gagal";

export type StatusSumber = {
  id: string;
  nama: string;
  situs: string;
  status: StatusFeed;
  /** Jumlah judul dari sumber ini di respons, termasuk yang masih diingat dari pengambilan lalu. */
  jumlah: number;
  /** Waktu pengambilan terakhir yang berhasil, menurut ingatan server. Null berarti belum tercatat. */
  terakhirBerhasil: string | null;
};

export type BeritaItem = {
  judul: string;
  tautan: string;
  sumberId: string;
  sumber: string;
  waktu: string | null;
};

export type BeritaResponse = {
  diperbarui: string;
  sumber: StatusSumber[];
  item: BeritaItem[];
};
