// Data terstruktur schema.org (JSON-LD) untuk mesin pencari dan asisten AI. Hanya alamat internal situs. Tidak ada
// data pajak, nomor telepon, rating pihak lain, atau koordinat perkiraan.
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "./site";

export const urlPenuh = (alamat: string) => new URL(alamat, SITE_URL).toString();
export const ID_ORGANISASI = urlPenuh("/#organisasi");
const ID_SITUS = urlPenuh("/#situs");

type Simpul = Record<string, unknown>;

/** Satu blok JSON-LD berisi beberapa simpul yang saling merujuk lewat @id. */
export const grafLd = (...simpul: Simpul[]) => ({ "@context": "https://schema.org", "@graph": simpul });

/** Kebijakan redaksi diumumkan lewat properti Trust Project yang ada di schema.org. */
export function organisasi(): Simpul {
  return {
    "@type": "Organization",
    "@id": ID_ORGANISASI,
    name: SITE_NAME,
    url: urlPenuh("/"),
    logo: urlPenuh("/icon-512.png"),
    description: `${SITE_TAGLINE}: cuaca dan laut, tempat makan, transportasi, cerita kota, dan direktori layanan.`,
    publishingPrinciples: urlPenuh("/standar-redaksi"),
    ethicsPolicy: urlPenuh("/standar-redaksi"),
    correctionsPolicy: urlPenuh("/standar-redaksi#koreksi"),
    actionableFeedbackPolicy: urlPenuh("/standar-redaksi#koreksi"),
    ownershipFundingInfo: urlPenuh("/tentang"),
  };
}

export function situsWeb(): Simpul {
  return {
    "@type": "WebSite",
    "@id": ID_SITUS,
    name: SITE_NAME,
    url: urlPenuh("/"),
    inLanguage: "id-ID",
    publisher: { "@id": ID_ORGANISASI },
  };
}

/** Penulis bernama "Redaksi …" adalah situs ini sendiri, bukan orang. */
const penulisLd = (nama: string): Simpul =>
  /^redaksi\b/i.test(nama.trim()) ? { "@id": ID_ORGANISASI } : { "@type": "Person", name: nama };

export function artikel(a: {
  judul: string;
  ringkasan: string;
  tanggal: string;
  gambar?: string | null;
  alamat: string;
  penulis: string;
}): Simpul {
  return {
    "@type": "Article",
    headline: a.judul,
    description: a.ringkasan,
    datePublished: a.tanggal,
    ...(a.gambar ? { image: urlPenuh(a.gambar) } : {}),
    url: urlPenuh(a.alamat),
    mainEntityOfPage: urlPenuh(a.alamat),
    inLanguage: "id-ID",
    author: penulisLd(a.penulis),
    publisher: { "@id": ID_ORGANISASI },
  };
}

type TempatMakanLd = {
  id: string;
  name: string;
  desc_id: string;
  address: string;
  lat: number;
  lng: number;
  coord_approx: boolean;
  price_tier: string;
};

/** Titik hanya disertakan bila pasti. Nomor telepon dan rating sengaja tidak ikut. */
export function tempatMakan(p: TempatMakanLd, jenisMakanan?: string): Simpul {
  const titikPasti = !p.coord_approx && Number.isFinite(p.lat) && Number.isFinite(p.lng) && p.lat !== 0 && p.lng !== 0;
  return {
    "@type": "FoodEstablishment",
    "@id": urlPenuh(`/makan/tempat/${p.id}`),
    name: p.name,
    url: urlPenuh(`/makan/tempat/${p.id}`),
    ...(p.desc_id ? { description: p.desc_id } : {}),
    address: {
      "@type": "PostalAddress",
      ...(p.address.trim() ? { streetAddress: p.address.trim() } : {}),
      addressLocality: "Batam",
      addressRegion: "Kepulauan Riau",
      addressCountry: "ID",
    },
    ...(titikPasti ? { geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng } } : {}),
    ...(jenisMakanan ? { servesCuisine: jenisMakanan } : {}),
    ...(p.price_tier ? { priceRange: p.price_tier } : {}),
  };
}

/** Isi <script type="application/ld+json">. "<" disandikan supaya teks data tidak bisa menutup tag script. */
export const teksLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
