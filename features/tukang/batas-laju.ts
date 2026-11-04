// Batas laju sederhana per alamat IP, di memori. Di hosting serverless tiap instance menghitung sendiri, jadi
// ini hanya rem kasar untuk spam biasa, bukan perlindungan penuh. IP tidak disimpan ke mana-mana.
type Jendela = { awal: number; jumlah: number };

export type BatasLaju = (kunci: string, sekarang?: number) => boolean;

export function buatBatasLaju(maks: number, jendelaMs: number): BatasLaju {
  const peta = new Map<string, Jendela>();
  return (kunci, sekarang = Date.now()) => {
    if (peta.size > 5000) {
      for (const [k, j] of peta) if (sekarang - j.awal >= jendelaMs) peta.delete(k);
      if (peta.size > 5000) peta.clear();
    }
    const j = peta.get(kunci);
    if (!j || sekarang - j.awal >= jendelaMs) {
      peta.set(kunci, { awal: sekarang, jumlah: 1 });
      return true;
    }
    j.jumlah += 1;
    return j.jumlah <= maks;
  };
}

/** x-real-ip dan elemen terakhir x-forwarded-for dipasang proxy hosting; elemen awal bisa dipalsukan pengirim. */
export function ipDari(req: Request): string {
  const nyata = req.headers.get("x-real-ip");
  if (nyata) return nyata.trim();
  const terusan = req.headers.get("x-forwarded-for");
  return terusan?.split(",").pop()?.trim() || "tanpa-ip";
}
