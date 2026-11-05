import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tempatPerId } from "@/features/direktori/data";
import HujanKecamatan from "@/features/direktori/HujanKecamatan";
import { terminalDariMakan } from "@/features/jalan/feri-data";
import FeriTerakhirMuat from "@/features/jalan/FeriTerakhirMuat";
import DetailView from "@/features/makan/components/DetailView";
import { ferryMap, getPlace, places } from "@/features/makan/lib/data";

// Hanya tempat yang ada di data: slug lain langsung 404.
export function generateStaticParams() {
  return places.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlace(slug);
  if (!p) return {};
  return { title: p.name, description: p.desc_id, openGraph: { title: p.name, description: p.desc_id } };
}

export default async function Halaman({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tempat = getPlace(slug);
  if (!tempat) notFound();
  const kecamatan = tempatPerId.get(slug)?.kecamatan;
  const terminal = terminalDariMakan(tempat.nearestFerryId);
  return (
    <DetailView
      slug={slug}
      cuaca={kecamatan ? <HujanKecamatan kecamatan={kecamatan} /> : null}
      feri={
        terminal ? <FeriTerakhirMuat terminal={terminal} namaTerminal={ferryMap[tempat.nearestFerryId]?.label} /> : null
      }
    />
  );
}
