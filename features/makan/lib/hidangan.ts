// Sumbu utama Makan: 17 hidangan dalam enam rumpun. Rumpun hanya alat bantu baca di indeks.
// Kode kategori tetap kode data lama; alamat memakai slug pendek di bawah.
import type { Lang } from "./types";

type Tri = Record<Lang, string>;

const SLUG: Record<string, string> = {
  "seafood-gonggong": "makanan-laut",
  "sup-ikan": "sup-ikan",
  "mie-tarempa": "mi-tarempa",
  "nasi-ayam-hainan": "nasi-ayam",
  kopitiam: "kopitiam",
  "martabak-prata": "martabak-prata",
  "mie-bakmi": "mi-bakmi",
  bubur: "bubur",
  "nasi-padang": "nasi-padang",
  "sunda-jawa": "sunda-jawa",
  "sate-kambing": "sate-kambing",
  bakso: "bakso",
  "dimsum-chinese": "dim-sum",
  "ayam-penyet": "ayam-penyet",
  "pecel-gado": "pecel-gado",
  "oleh-oleh": "oleh-oleh",
  cafe: "kafe",
};

const KE_KATEGORI = Object.fromEntries(Object.entries(SLUG).map(([k, s]) => [s, k]));

export const slugHidangan = (kategori: string) => SLUG[kategori] ?? kategori;
export const kategoriDariSlug = (slug: string): string | undefined =>
  Object.hasOwn(KE_KATEGORI, slug) ? KE_KATEGORI[slug] : undefined;
export const semuaSlugHidangan = Object.values(SLUG);

export const grafisHidangan = (kategori: string) => `/grafis/hidangan/${kategori}.webp`;

export interface Rumpun {
  id: string;
  nama: Tri;
  kategori: string[];
}

// Urutan dan pembagian ini membentuk tiga baris enam ubin di layar lebar.
export const RUMPUN: Rumpun[] = [
  {
    id: "laut",
    nama: { id: "Laut dan Pesisir", en: "Sea and Coast", zh: "海味" },
    kategori: ["seafood-gonggong", "sup-ikan", "mie-tarempa"],
  },
  {
    id: "roti",
    nama: { id: "Roti dan Bakaran", en: "Breads and Grills", zh: "饼与烧烤" },
    kategori: ["martabak-prata", "sate-kambing"],
  },
  {
    id: "kopi",
    nama: { id: "Kopi", en: "Coffee", zh: "咖啡" },
    kategori: ["cafe"],
  },
  {
    id: "tionghoa",
    nama: { id: "Kedai Tionghoa dan Kopitiam", en: "Chinese and Kopitiam", zh: "华人小馆与咖啡店" },
    kategori: ["nasi-ayam-hainan", "kopitiam", "dimsum-chinese", "mie-bakmi", "bubur"],
  },
  {
    id: "bawa",
    nama: { id: "Bawa Pulang", en: "To Take Home", zh: "带回家" },
    kategori: ["oleh-oleh"],
  },
  {
    id: "nusantara",
    nama: { id: "Nusantara", en: "Indonesian Plates", zh: "印尼家常" },
    kategori: ["nasi-padang", "sunda-jawa", "ayam-penyet", "pecel-gado", "bakso"],
  },
];

// Satu kalimat, semua isinya berasal dari menu andalan di data atau pengertian umum hidangannya.
export const DEK_HIDANGAN: Record<string, Tri> = {
  "seafood-gonggong": {
    id: "Gonggong adalah siput laut khas Kepulauan Riau.",
    en: "Gonggong is a sea snail from the Riau Islands.",
    zh: "香螺（gonggong）是廖内群岛特产的海螺。",
  },
  "sup-ikan": {
    id: "Sup ikan tenggiri, dengan nasi atau bihun.",
    en: "Mackerel soup, with rice or vermicelli.",
    zh: "马鲛鱼汤，配米饭或米粉。",
  },
  "mie-tarempa": {
    id: "Mi pipih dari Anambas dan luti gendang isi ikan.",
    en: "Flat noodles from Anambas and fish-filled luti gendang.",
    zh: "来自阿南巴斯的扁面，以及鱼馅 luti gendang。",
  },
  "nasi-ayam-hainan": {
    id: "Ayam rebus atau panggang, nasi gurih, dan sambal.",
    en: "Poached or roast chicken, savoury rice, and chilli.",
    zh: "白切或烧鸡、香饭与辣椒酱。",
  },
  kopitiam: {
    id: "Kopi, teh tarik, dan nasi lemak.",
    en: "Coffee, teh tarik, and nasi lemak.",
    zh: "咖啡、拉茶与椰浆饭。",
  },
  "martabak-prata": {
    id: "Martabak telur dan prata, gurih atau manis.",
    en: "Egg martabak and prata, savoury or sweet.",
    zh: "鸡蛋煎饼与印度甩饼，咸甜皆有。",
  },
  "mie-bakmi": {
    id: "Mi ayam dan pangsit.",
    en: "Chicken noodles and wontons.",
    zh: "鸡肉面与云吞。",
  },
  bubur: {
    id: "Bubur ayam dan bubur ikan tenggiri.",
    en: "Chicken congee and mackerel congee.",
    zh: "鸡肉粥与马鲛鱼粥。",
  },
  "nasi-padang": {
    id: "Rendang, gulai, dan dendeng.",
    en: "Rendang, gulai, and dendeng.",
    zh: "仁当、咖喱与牛肉干。",
  },
  "sunda-jawa": {
    id: "Ikan bakar, pepes, dan lalapan.",
    en: "Grilled fish, pepes, and lalapan.",
    zh: "烤鱼、蕉叶蒸菜与生菜拼盘。",
  },
  "sate-kambing": {
    id: "Sate, gulai, dan tongseng kambing.",
    en: "Goat satay, gulai, and tongseng.",
    zh: "羊肉沙爹、咖喱与炖羊肉。",
  },
  bakso: {
    id: "Bakso tetelan, bakso kawah, dan bakso campur.",
    en: "Meatball soup, plain or loaded.",
    zh: "各式肉丸汤。",
  },
  "dimsum-chinese": {
    id: "Dim sum, suimian, dan masakan Tionghoa.",
    en: "Dim sum, suimian, and Chinese dishes.",
    zh: "点心、水面与中式菜肴。",
  },
  "ayam-penyet": {
    id: "Ayam penyet, pecel lele, dan sambal.",
    en: "Smashed fried chicken, catfish, and sambal.",
    zh: "压扁炸鸡、炸鲶鱼与参巴酱。",
  },
  "pecel-gado": {
    id: "Lontong pecel, gado-gado, dan nasi lemak.",
    en: "Lontong pecel, gado-gado, and nasi lemak.",
    zh: "花生酱蔬菜、加多加多与椰浆饭。",
  },
  "oleh-oleh": {
    id: "Kek pisang, kue lapis, dan bingka.",
    en: "Banana cake, layer cake, and bingka.",
    zh: "香蕉蛋糕、千层糕与 bingka。",
  },
  cafe: {
    id: "Kopi spesialti dan kue.",
    en: "Specialty coffee and cake.",
    zh: "精品咖啡与蛋糕。",
  },
};
