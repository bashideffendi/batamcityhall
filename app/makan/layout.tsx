import type { Metadata } from "next";
import Providers from "@/features/makan/components/Providers";
import "@/features/makan/makan.css";

export const metadata: Metadata = {
  title: { default: "Makan", template: "%s · Makan · Batam City Hall" },
  description: "117 tempat makan di Batam, per hidangan dan kawasan. Tidak ada yang membayar untuk masuk daftar ini.",
};

// Tetap di dalam layout situs: menu dan kaki halaman datang dari app/layout.tsx.
export default function MakanLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
