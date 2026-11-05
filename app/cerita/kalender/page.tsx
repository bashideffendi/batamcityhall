import type { Metadata } from "next";
import { DATA_DIHIMPUN, daftarAcara } from "@/features/budaya/data";
import Kalender from "@/features/budaya/Kalender";
import { LABEL_STATUS } from "@/features/budaya/label";
import NavBudaya, { KickerCerita } from "@/features/budaya/NavBudaya";
import "@/features/budaya/budaya.css";

const LEDE = "Tanggal acara di Batam dapat berubah; tanyakan penyelenggara sebelum datang.";

export const metadata: Metadata = {
  title: "Kalender Acara",
  description: LEDE,
};

const ARTI_STATUS = [
  ["rutin", "Sudah beberapa kali diadakan."],
  ["pernah", "Tercatat pernah diadakan. Belum tentu berulang."],
  ["belum pasti", "Tanggal atau agendanya belum pasti."],
  ["dibatalkan", "Dijadwalkan, lalu dibatalkan."],
] as const;

export default function HalamanKalender() {
  return (
    <div className="bch-page">
      <KickerCerita />
      <h1 className="mt-2">Kalender Acara</h1>
      <p className="bch-lede">{LEDE}</p>
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
      <Kalender acara={daftarAcara()} />
      <p className="bch-card-meta mt-5">{DATA_DIHIMPUN}</p>
      <NavBudaya kini="/cerita/kalender" />
    </div>
  );
}
