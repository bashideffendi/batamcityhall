import type { Metadata } from "next";
import { Suspense } from "react";
import TersimpanMakan from "@/features/makan/components/TersimpanMakan";

export const metadata: Metadata = {
  title: "Simpanan",
  description: "Tempat makan yang kamu simpan, tanpa akun.",
};

// useSearchParams di halaman statis harus berada di dalam Suspense.
export default function Halaman() {
  return (
    <Suspense>
      <TersimpanMakan />
    </Suspense>
  );
}
