import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ROBOTS_TERSEMBUNYI } from "@/lib/site";
import "@/features/mural/mural.css";

export const metadata: Metadata = { robots: ROBOTS_TERSEMBUNYI };

export default function MuralLayout({ children }: { children: ReactNode }) {
  return children;
}
