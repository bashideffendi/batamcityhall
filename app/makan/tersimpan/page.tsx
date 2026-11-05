import type { Metadata } from "next";
import { Suspense } from "react";
import TersimpanMakan from "@/features/makan/components/TersimpanMakan";

export const metadata: Metadata = {
  title: "Tersimpan",
  description: "Daftar tempat makan yang tersimpan di peramban perangkat ini.",
};

// useSearchParams di halaman statis harus berada di dalam Suspense.
export default function Tersimpan() {
  return (
    <Suspense>
      <TersimpanMakan />
    </Suspense>
  );
}
