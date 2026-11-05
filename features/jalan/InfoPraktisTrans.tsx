import { INFO } from "./trans-data";

// Info praktis Trans Batam. Tidak ada opsi tunai: nontunai wajib sejak 1 Januari 2023, artikel yang masih
// menyebut tunai menyalin template lama (research/10).
export default function InfoPraktisTrans() {
  const { tarif, pembayaran, kontak, rencana } = INFO;
  const qris = pembayaran.metode_disebut_sumber.find((m) => m.metode === "QRIS");
  const kartuLain = pembayaran.metode_seharusnya_diterima.metode;
  return (
    <section aria-labelledby="info-praktis" className="jl-info">
      <h2 id="info-praktis">Info Praktis</h2>
      <dl className="bch-daftar">
        <dt>Tarif</dt>
        <dd>
          <span className="bch-data">{tarif.umum}</span> umum, <span className="bch-data">{tarif.pelajar}</span> untuk{" "}
          {tarif.berlaku_tarif_pelajar_untuk}. Tidak ada tarif tambahan ke bandara.
        </dd>
        <dt>Cara bayar</dt>
        <dd>
          Nontunai sejak 1 Januari 2023: kartu BRIZZI (BRI), QRIS ({qris?.aplikasi?.join(", ")}), dan aplikasi bank.{" "}
          Kartu {kartuLain.slice(0, -1).join(", ")}, dan {kartuLain[kartuLain.length - 1]} mungkin diterima, tetapi
          belum pasti.
        </dd>
        <dt>Pindah koridor</dt>
        <dd>Aturan pindah koridor gratis belum tercatat. Anggap setiap naik bus membayar satu tarif.</dd>
        <dt>Halte</dt>
        <dd>Ada dua tipe: bangunan dengan atap dan tempat duduk, atau perhentian yang hanya berupa tiang rambu.</dd>
        <dt>Aksesibilitas</dt>
        <dd>Belum ada informasi tentang lantai rendah, jalur landai, tarif lansia, dan layanan disabilitas.</dd>
        <dt>Kontak</dt>
        <dd>
          {kontak.map((k) => (
            <span key={k.telepon} className="jl-kontak">
              {k.nama}:{" "}
              <a href={`tel:${k.telepon.replace(/-/g, "")}`} className="bch-data jl-tautan-resmi">
                {k.telepon}
              </a>{" "}
              (nomor per Desember 2022)
            </span>
          ))}
        </dd>
        <dt>Rencana</dt>
        <dd>
          Belum berjalan:
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
