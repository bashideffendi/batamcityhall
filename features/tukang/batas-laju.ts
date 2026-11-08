// Batas laju sederhana per alamat IP, di memori. Di hosting serverless tiap instance menghitung sendiri, jadi
// ini hanya rem kasar untuk spam biasa, bukan perlindungan penuh. IP tidak disimpan ke mana-mana.
type Jendela = { awal: number; jumlah: number };

export type BatasLaju = (kunci: string, sekarang?: number) => boolean;

const MAKS_KUNCI = 5000;

export function buatBatasLaju(maks: number, jendelaMs: number): BatasLaju {
  // Urutan Map = urutan jendela dibuka, karena jendela baru selalu dihapus lalu dipasang ulang di ujung.
  const peta = new Map<string, Jendela>();
  return (kunci, sekarang = Date.now()) => {
    const j = peta.get(kunci);
    if (j && sekarang - j.awal < jendelaMs) {
      j.jumlah += 1;
      return j.jumlah <= maks;
    }
    peta.delete(kunci);
    if (peta.size >= MAKS_KUNCI) {
      for (const [k, lama] of peta) if (sekarang - lama.awal >= jendelaMs) peta.delete(k);
      // Masih penuh: buang yang paling tua saja. Mengosongkan semuanya akan membebaskan alamat yang sedang dibatasi.
      for (const k of peta.keys()) {
        if (peta.size < MAKS_KUNCI) break;
        peta.delete(k);
      }
    }
    peta.set(kunci, { awal: sekarang, jumlah: 1 });
    return true;
  };
}

/** Satu pelanggan IPv6 biasanya memegang satu blok /64, jadi alamat di blok yang sama dihitung satu. */
export function kunciIp(ip: string): string {
  const polos = ip.replace(/^\[|\]$/g, "").split("%")[0];
  if (!polos.includes(":")) return polos;
  const v4 = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(polos);
  if (v4) return v4[1];
  const [kiri, kanan] = polos.toLowerCase().split("::");
  const depan = kiri ? kiri.split(":") : [];
  const belakang = kanan ? kanan.split(":") : [];
  const lengkap = kanan === undefined ? depan : [...depan, ...Array(Math.max(0, 8 - depan.length - belakang.length)).fill("0"), ...belakang];
  return `${lengkap
    .slice(0, 4)
    .map((h) => h.replace(/^0+(?=.)/, ""))
    .join(":")}::/64`;
}

/** x-real-ip dan elemen terakhir x-forwarded-for dipasang proxy hosting; elemen awal bisa dipalsukan pengirim. */
export function ipDari(req: Request): string {
  const nyata = req.headers.get("x-real-ip")?.trim();
  const ip = nyata || req.headers.get("x-forwarded-for")?.split(",").pop()?.trim();
  return ip ? kunciIp(ip) : "tanpa-ip";
}
