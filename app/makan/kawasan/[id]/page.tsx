import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KawasanHalaman } from "@/features/makan/components/HalamanMakan";
import { areaCounts, areaMap, kawasanBerisi } from "@/features/makan/lib/data";

export function generateStaticParams() {
  return kawasanBerisi.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!Object.hasOwn(areaMap, id)) return {};
  return { title: areaMap[id].name, description: `${areaCounts[id] ?? 0} tempat makan di ${areaMap[id].name}.` };
}

export default async function Halaman({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!kawasanBerisi.some((a) => a.id === id)) notFound();
  return <KawasanHalaman id={id} />;
}
