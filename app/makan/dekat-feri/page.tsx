import type { Metadata } from "next";
import ferries from "@/data/makan/ferries.json";
import { terminalDariMakan } from "@/features/jalan/feri-data";
import { DekatFeri } from "@/features/makan/components/HalamanMakan";

/** Id terminal di data Makan ke id terminal feri, untuk papan feri terakhir di bawah daftar. */
const TERMINAL_PER_MAKAN = Object.fromEntries(
  ferries.flatMap((f) => {
    const t = terminalDariMakan(f.id);
    return t ? [[f.id, t]] : [];
  }),
);

export const metadata: Metadata = {
  title: "Dekat Feri",
  description: "Tempat makan terdekat dari Batam Centre, Harbour Bay, Sekupang, dan Nongsapura.",
};

export default function Halaman() {
  return <DekatFeri terminalPerMakan={TERMINAL_PER_MAKAN} />;
}
