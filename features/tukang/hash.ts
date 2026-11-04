import { createHash } from "node:crypto";
import { normalKontak } from "./aturan";

/** Dasar hitungan "perekomendasi berbeda". Hanya di server. */
export const hashKontak = (kontak: string) => createHash("sha256").update(normalKontak(kontak)).digest("hex");
