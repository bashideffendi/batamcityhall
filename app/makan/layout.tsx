import type { Metadata } from "next";
import Providers from "@/features/makan/components/Providers";
import "@/features/makan/makan.css";

export const metadata: Metadata = {
  title: { default: "Makan", template: "%s · Makan · Batam City Hall" },
  description: "Tempat makan pilihan di Batam: peta, daftar, jalur kuliner. Tanpa listing berbayar.",
};

// Tetap di dalam layout situs: strip navigasi dan footer datang dari app/layout.tsx.
export default function MakanLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
