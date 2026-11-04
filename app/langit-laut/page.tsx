import type { Metadata } from "next";
import MapShell from "@/features/langit-laut/components/MapShell";

export const metadata: Metadata = {
  title: "Langit & Laut",
  description: "Radar hujan, prakiraan ombak, dan kamera lalu lintas Batam.",
};

export default function LangitLaut() {
  return (
    <div className="ll-halaman">
      <MapShell />
    </div>
  );
}
