// Cache memori untuk route data realtime (PEDOMAN 8.5). Railway tidak punya CDN bawaan, jadi header s-maxage tidak
// berpengaruh apa pun di sana. Lewat pembantu ini, s-maxage milik tiap route menjadi lama penyimpanan di server, dan
// permintaan yang datang bersamaan menunggu satu panggilan ke sumber saja.
//
// Hanya jawaban 200 dengan s-maxage yang disimpan. Jawaban gagal (503, no-store) selalu dicoba ulang.

type Salinan = { isi: ArrayBuffer; status: number; headers: [string, string][] };
type Entri = Salinan & { sampai: number };

const simpanan = new Map<string, Entri>();
const berjalan = new Map<string, Promise<Salinan>>();

/** Detik s-maxage dari header Cache-Control, atau 0 bila tidak ada atau no-store. */
export function lamaSimpan(cacheControl: string | null): number {
  if (!cacheControl || /no-store/i.test(cacheControl)) return 0;
  const m = /s-maxage=(\d+)/i.exec(cacheControl);
  return m ? Number(m[1]) : 0;
}

const keRespons = (s: Salinan) => new Response(s.isi.slice(0), { status: s.status, headers: s.headers });

async function salin(r: Response): Promise<Salinan> {
  return { isi: await r.arrayBuffer(), status: r.status, headers: [...r.headers.entries()] };
}

export async function cacheRespons(kunci: string, muat: () => Promise<Response>): Promise<Response> {
  const ada = simpanan.get(kunci);
  if (ada && ada.sampai > Date.now()) return keRespons(ada);

  let janji = berjalan.get(kunci);
  if (!janji) {
    janji = muat()
      .then(salin)
      .then((s) => {
        const detik = s.status === 200 ? lamaSimpan(new Headers(s.headers).get("cache-control")) : 0;
        if (detik > 0) simpanan.set(kunci, { ...s, sampai: Date.now() + detik * 1000 });
        else simpanan.delete(kunci);
        return s;
      })
      .finally(() => berjalan.delete(kunci));
    berjalan.set(kunci, janji);
  }
  return keRespons(await janji);
}

/** Buang satu simpanan, misalnya setelah admin mengubah datanya. Permintaan berikutnya memuat ulang. */
export function lupakanCacheRespons(kunci: string) {
  simpanan.delete(kunci);
}

/** Hanya untuk tes. */
export function kosongkanCacheRespons() {
  simpanan.clear();
  berjalan.clear();
}
