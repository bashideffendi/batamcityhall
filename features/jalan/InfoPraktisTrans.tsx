import { INFO, TEKS_TANGGAL_DATA } from "./trans-data";

// Info praktis Trans Batam. Tidak ada opsi tunai: nontunai wajib sejak 1 Januari 2023, artikel yang masih
// menyebut tunai menyalin template lama (research/10).
export default function InfoPraktisTrans() {
  const { tarif, pembayaran, kontak, rencana } = INFO;
  const qris = pembayaran.metode_disebut_sumber.find((m) => m.metode === "QRIS");
  const sipTb = INFO.aplikasi.find((a) => a.nama === "SIP TB");
  return (
    <section aria-labelledby="info-praktis" className="jl-info">
      <h2 id="info-praktis">Info praktis</h2>
      <p className="bch-card-meta">Data {TEKS_TANGGAL_DATA}, dari media sekunder.</p>
      <dl className="bch-daftar">
        <dt>Tarif</dt>
        <dd>
          <span className="bch-data">{tarif.umum}</span> umum, <span className="bch-data">{tarif.pelajar}</span> untuk{" "}
          {tarif.berlaku_tarif_pelajar_untuk}. Tidak ada tambahan ke bandara. Menurut BatamToday, 3 Juli 2026.
        </dd>
        <dt>Cara bayar</dt>
        <dd>
          Nontunai sejak 1 Januari 2023. Kartu BRIZZI (BRI), QRIS ({qris?.aplikasi?.join(", ")}), dan m-banking.{" "}
          {pembayaran.metode_seharusnya_diterima.metode.join(", ")} seharusnya diterima menurut kerja sama Juli 2024,
          tetapi berita 2026 hanya konsisten menyebut BRIZZI dan QRIS.{" "}
          <span className="bch-badge" data-tone="caution">
            perlu cek ulang
          </span>
        </dd>
        <dt>Pindah koridor</dt>
        <dd>
          Tidak ditemukan aturan transfer gratis. Anggap tiap naik bayar satu tarif sampai ada konfirmasi UPT.{" "}
          <span className="bch-badge" data-tone="caution">
            perlu cek ulang
          </span>
        </dd>
        <dt>Halte</dt>
        <dd>Ada dua tipe: halte bangunan dengan atap dan tempat duduk, dan bus stop yang hanya tiang rambu.</dd>
        <dt>Aksesibilitas</dt>
        <dd>
          {INFO.aksesibilitas.teks_ui}. Lantai rendah, ramp, tarif lansia, dan layanan disabilitas belum diketahui.
        </dd>
        <dt>Kontak</dt>
        <dd>
          {kontak.map((k) => (
            <span key={k.telepon} className="jl-kontak">
              {k.nama}:{" "}
              <a href={`tel:${k.telepon.replace(/-/g, "")}`} className="bch-data jl-tautan-resmi">
                {k.telepon}
              </a>{" "}
              (Media Center Pemkot Batam, Desember 2022){" "}
              <span className="bch-badge" data-tone="caution">
                perlu cek ulang
              </span>
            </span>
          ))}
        </dd>
        <dt>Posisi bus</dt>
        <dd>
          Situs ini tidak melacak bus dan tidak punya jadwal real-time. Posisi bus ada di aplikasi resmi{" "}
          <a href={sipTb?.url} target="_blank" rel="noopener" className="jl-tautan-resmi">
            SIP TB di Google Play
          </a>{" "}
          (Android). Untuk K7, UPT juga menyebut aplikasi Mitra Darat.
        </dd>
        <dt>Rencana</dt>
        <dd>
          <span className="bch-badge" data-tone="caution">
            rencana, bukan layanan aktif
          </span>
          <ul className="jl-daftar-rapat">
            {rencana.item.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </dd>
      </dl>
    </section>
  );
}
