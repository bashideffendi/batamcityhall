// Quest edukatif. Progres hanya di localStorage, selalu dalam try/catch: bisa hilang, dan itu tidak apa-apa.
// Tidak ada quest atau poin di bekas kamp Galang, makam Nghia Trang, Rempang, atau kampung tua
// (data/mural/topik_sensitif.md, research/00 bagian 9.3).

export type Target = { id: string; petunjuk: string };
export type Quest = { id: string; judul: string; lede: string; lencana: string; target: Target[] };

const SEGMEN_TANPA_QUEST = new Set(["rempang", "galang"]);
const KATEGORI_TANPA_QUEST = new Set([
  "kampung-tua-rujukan",
  "situs-sejarah-memorial",
  "monumen-memorial",
  "memorial",
  "museum",
  "pulau-sensitif",
  "topik-sensitif",
  "batam-yang-hilang",
]);

/** Titik di luar permainan, apa pun isi definisi quest. Dijaga oleh tes unit. */
export const bolehJadiQuest = (l: { segmen: string; kategori: string }) =>
  !SEGMEN_TANPA_QUEST.has(l.segmen) && !KATEGORI_TANPA_QUEST.has(l.kategori);

export const KUNCI_PROGRES = "bch-mural-quest";
export type Progres = Record<string, string[]>;

type PenyimpananMini = Pick<Storage, "getItem" | "setItem">;

export function bacaProgres(simpan: PenyimpananMini | null): Progres {
  try {
    const mentah = simpan?.getItem(KUNCI_PROGRES);
    if (!mentah) return {};
    const data: unknown = JSON.parse(mentah);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const hasil: Progres = {};
    for (const [k, v] of Object.entries(data)) {
      if (Array.isArray(v)) hasil[k] = v.filter((x): x is string => typeof x === "string");
    }
    return hasil;
  } catch {
    return {};
  }
}

export function tulisProgres(simpan: PenyimpananMini | null, progres: Progres): void {
  try {
    simpan?.setItem(KUNCI_PROGRES, JSON.stringify(progres));
  } catch {
    /* mode privat atau penyimpanan penuh: progres hanya bertahan selama halaman terbuka */
  }
}

/** Menambahkan temuan. Id di luar target quest diabaikan, jadi titik sensitif tidak bisa memberi poin. */
export function tandaiTemuan(progres: Progres, quest: Quest, id: string): Progres {
  if (!quest.target.some((t) => t.id === id)) return progres;
  const lama = progres[quest.id] ?? [];
  if (lama.includes(id)) return progres;
  return { ...progres, [quest.id]: [...lama, id] };
}

export function hitungTemuan(progres: Progres, quest: Quest) {
  const ada = new Set(progres[quest.id] ?? []);
  const ditemukan = quest.target.filter((t) => ada.has(t.id)).length;
  return { ditemukan, total: quest.target.length, selesai: ditemukan === quest.target.length, ada };
}

export const teksProgres = (quest: Quest, ditemukan: number, total: number) =>
  ditemukan === total
    ? `${quest.judul}: semua ${total} ditemukan.`
    : `${quest.judul}: ${ditemukan} dari ${total} ditemukan.`;
