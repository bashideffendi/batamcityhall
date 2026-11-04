import type { Metadata } from "next";
import { daftarAcara, TERAKHIR_DICEK } from "@/features/budaya/data";
import Kalender from "@/features/budaya/Kalender";
import { LABEL_STATUS } from "@/features/budaya/label";
import NavBudaya, { KickerCerita } from "@/features/budaya/NavBudaya";
import "@/features/budaya/budaya.css";

export const metadata: Metadata = {
  title: "Kalender acara",
  description:
    "Acara budaya, keagamaan, olahraga, dan kota di Batam, per bulan. Tanggal edisi terakhir yang tercatat, bukan janji tahun depan.",
};

const ARTI_STATUS = [
  ["rutin", "Sudah beberapa kali digelar dan ada sumbernya."],
  ["pernah", "Tercatat pernah digelar. Belum tentu berulang."],
  ["perlu dicek", "Sumbernya sekunder atau datanya belum lengkap."],
  ["tidak pasti", "Tanggal atau agendanya tidak terpusat."],
  ["dibatalkan", "Dijadwalkan, lalu batal."],
] as const;

export default function HalamanKalender() {
  return (
    <div className="bch-page">
      <KickerCerita />
      <h1 className="mt-2">Kalender acara</h1>
      <p className="bch-lede">Tanggal di sini edisi terakhir yang tercatat, bukan janji tahun depan.</p>
      <div className="bch-prose">
        <p>
          Semua waktu dalam WIB. Pemko Batam memperbarui kalender event tiap tiga bulan, jadi cek ulang ke{" "}
          <a href="https://disbudpar.batam.go.id/" target="_blank" rel="noopener noreferrer">
            disbudpar.batam.go.id
          </a>{" "}
          (menu Event, lalu Calendar of Event) sebelum berangkat.
        </p>
      </div>
      <dl className="bud-legenda">
        {ARTI_STATUS.map(([s, arti]) => (
          <div key={s}>
            <dt>
              <span className="bch-badge" data-tone={LABEL_STATUS[s].nada}>
                {LABEL_STATUS[s].teks}
              </span>
            </dt>
            <dd>{arti}</dd>
          </div>
        ))}
      </dl>
      <Kalender acara={daftarAcara()} dicek={TERAKHIR_DICEK} />
      <NavBudaya kini="/cerita/kalender" />
    </div>
  );
}
