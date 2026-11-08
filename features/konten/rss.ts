// Umpan RSS 2.0 untuk Jurnal dan Infografik (/rss.xml). Hanya tulisan yang sudah terbit di situs.
export type ItemRss = { judul: string; ringkasan: string; tanggal: string; alamat: string; rubrik?: string };

const xml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Tanggal YYYY-MM-DD dibaca sebagai tengah malam UTC (pukul 07.00 WIB), supaya hari terbitnya sama di zona mana pun. */
const tanggalRss = (iso: string) => {
  const [th, bl, tg] = iso.split("-").map(Number);
  return new Date(Date.UTC(th, bl - 1, tg)).toUTCString();
};

export function umpanRss(o: {
  judul: string;
  deskripsi: string;
  situs: string;
  alamatUmpan: string;
  item: ItemRss[];
}): string {
  const urut = [...o.item].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const penuh = (alamat: string) => new URL(alamat, o.situs).toString();
  const item = urut
    .map(
      (i) => `    <item>
      <title>${xml(i.judul)}</title>
      <link>${xml(penuh(i.alamat))}</link>
      <guid isPermaLink="true">${xml(penuh(i.alamat))}</guid>
      <pubDate>${tanggalRss(i.tanggal)}</pubDate>
      <description>${xml(i.ringkasan)}</description>${i.rubrik ? `\n      <category>${xml(i.rubrik)}</category>` : ""}
    </item>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(o.judul)}</title>
    <link>${xml(penuh("/"))}</link>
    <description>${xml(o.deskripsi)}</description>
    <language>id</language>
    <atom:link href="${xml(penuh(o.alamatUmpan))}" rel="self" type="application/rss+xml"/>${
      urut[0] ? `\n    <lastBuildDate>${tanggalRss(urut[0].tanggal)}</lastBuildDate>` : ""
    }
${item}
  </channel>
</rss>
`;
}
