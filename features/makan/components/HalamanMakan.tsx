"use client";

import dynamic from "next/dynamic";
import { KIRIMAN_AKTIF } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { terminalDariMakan } from "@/features/jalan/feri-data";
import FeriTerakhirMuat from "@/features/jalan/FeriTerakhirMuat";
import { areaCounts, areaMap, categories, categoryCounts, categoryMap, dalamKategori, ferries, kawasanBerisi, places } from "../lib/data";
import { FilterProvider, useAlamat, useFilters } from "../lib/filters";
import { CURRENCY_RATES, TANGGAL_KURS } from "../lib/format";
import { DEK_HIDANGAN, grafisHidangan, kategoriDariSlug, RUMPUN, slugHidangan } from "../lib/hidangan";
import { catName, HALAL_LABEL, LABEL_LABEL, miring, useI18n, type KunciTeks } from "../lib/i18n";
import { getPanduan, ID_SAMPUL, panduan, type Panduan } from "../lib/panduan";
import { RADIUS_FERI_KM, tautanPeta } from "../lib/saring";
import type { Lang, PlaceWithGeo, RecLabel } from "../lib/types";
import BarisTempat from "./BarisTempat";
import HalamanDaftar from "./HalamanDaftar";
import PetaCetak from "./PetaCetak";
import SearchBar, { PesanKosong } from "./SearchBar";

const TrailMap = dynamic(() => import("./TrailMap"), { ssr: false });

const Panah = () => (
  <span className="mk-panah" aria-hidden="true">
    →
  </span>
);

function TautanAksi({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="mk-aksi-tautan">
      {children} <Panah />
    </Link>
  );
}

function Remah({ isi }: { isi: { teks: string; href?: string }[] }) {
  const { t } = useI18n();
  return (
    <nav className="bch-remah" aria-label={t("breadcrumb")}>
      {isi.map((x, i) => (
        <span key={x.teks}>
          {i > 0 && " / "}
          {x.href ? <Link href={x.href}>{x.teks}</Link> : <span aria-current="page">{x.teks}</span>}
        </span>
      ))}
    </nav>
  );
}

function KepalaBagian({ judul, dek, tautan }: { judul: string; dek?: string; tautan?: ReactNode }) {
  return (
    <div className="mk-kepala">
      <h2>{judul}</h2>
      {dek && <p>{dek}</p>}
      {tautan && <div className="mk-kepala-tautan">{tautan}</div>}
    </div>
  );
}

// ---- Indeks hidangan: tiga baris enam ubin, dikelompokkan per rumpun ----
export function IndeksHidangan({ tanpaSemua = false }: { tanpaSemua?: boolean }) {
  const { lang, t } = useI18n();
  return (
    <div className="mk-indeks">
      {RUMPUN.map((r) => (
        <div key={r.id} className="mk-rumpun" data-n={r.kategori.length} data-rumpun={r.id}>
          <p className="mk-rumpun-nama">{r.nama[lang]}</p>
          <ul>
            {r.kategori.map((id) => (
              <li key={id}>
                {categoryCounts[id] ? (
                  <Link href={`/makan/hidangan/${slugHidangan(id)}`} className="mk-ubin">
                    <Image src={grafisHidangan(id)} alt="" width={480} height={480} loading="lazy" unoptimized />
                    <span className="mk-ubin-nama">{catName(lang, categoryMap[id])}</span>
                    <span className="mk-ubin-n">{categoryCounts[id]}</span>
                  </Link>
                ) : (
                  <span className="mk-ubin" data-kosong>
                    <Image src={grafisHidangan(id)} alt="" width={480} height={480} loading="lazy" unoptimized />
                    <span className="mk-ubin-nama">{catName(lang, categoryMap[id])}</span>
                    <span className="mk-ubin-n">Belum Ada</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {!tanpaSemua && (
        <div className="mk-rumpun mk-rumpun-semua" data-n={1}>
          <p className="mk-rumpun-nama" aria-hidden="true">
            {" "}
          </p>
          <Link href="/makan/peta" className="mk-ubin-semua">
            <span className="mk-ubin-nama">{t("idx_all")}</span>
            <span className="mk-ubin-n">{places.length}</span>
            <Panah />
          </Link>
        </div>
      )}
    </div>
  );
}

// ---- Sebelum Feri Pulang ----
function ModulFeri() {
  const { t, lang } = useI18n();
  const [aktif, setAktif] = useState(ferries[0].id);
  const dekat = (id: string) =>
    places
      .filter((p) => p.nearestFerryId === id && p.nearestFerryKm <= RADIUS_FERI_KM)
      .sort((a, b) => a.nearestFerryKm - b.nearestFerryKm);
  const daftar = dekat(aktif);
  const nama = ferries.find((f) => f.id === aktif)?.label ?? "";

  return (
    <section className="bch-seksi mk-feri">
      <div className="mk-feri-kiri">
        <h2>{t("near_title")}</h2>
        <p>{t("near_dek", { km: RADIUS_FERI_KM })}</p>
        <div className="mk-terminal" role="group" aria-label={t("near_terminal")}>
          {ferries.map((f) => (
            <button key={f.id} type="button" aria-pressed={aktif === f.id} onClick={() => setAktif(f.id)}>
              <span>{f.label}</span>
              <span className="mk-terminal-n">{dekat(f.id).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mk-feri-kanan">
        <ul className="mk-daftar" key={lang}>
          {daftar.slice(0, 5).map((p) => (
            <li key={p.id}>
              <BarisTempat place={p} ringkas />
            </li>
          ))}
        </ul>
        <p className="mk-feri-semua">
          <TautanAksi href={`/makan/dekat-feri?terminal=${aktif}`}>{t("near_all", { nama })}</TautanAksi>
        </p>
      </div>
    </section>
  );
}

// ---- Entri panduan ----
function EntriPanduan({ g, utama = false }: { g: Panduan; utama?: boolean }) {
  const { lang, t } = useI18n();
  const durasi = g.durasi(lang);
  return (
    <Link href={`/makan/panduan/${g.id}`} className="mk-entri" data-utama={utama || undefined}>
      <span className="mk-entri-gambar" data-persegi={g.berurut ? undefined : ""}>
        <Image
          src={g.grafis}
          alt=""
          width={g.berurut ? 1440 : 960}
          height={960}
          loading={utama ? undefined : "lazy"}
          priority={utama}
          unoptimized
        />
      </span>
      <span className="mk-entri-teks">
        {utama && <span className="bch-kicker">{t("cover_kicker")}</span>}
        <span className="mk-entri-judul">{g.judul(lang)}</span>
        <span className="mk-entri-dek">{miring(g.dek(lang))}</span>
        <span className="mk-entri-data">
          {g.tempat.length} {t("results")}
          {durasi && ` · ${durasi}`}
        </span>
      </span>
    </Link>
  );
}

function DaftarLabel({ label, judul }: { label: RecLabel; judul: KunciTeks }) {
  const { t } = useI18n();
  const isi = places.filter((p) => p.labels.includes(label));
  return (
    <section>
      <KepalaBagian judul={t(judul)} tautan={<TautanAksi href={tautanPeta({ labels: [label] })}>{`${t("see_all")} (${isi.length})`}</TautanAksi>} />
      <ul className="mk-daftar">
        {isi.slice(0, 5).map((p) => (
          <li key={p.id}>
            <BarisTempat place={p} ringkas />
          </li>
        ))}
      </ul>
    </section>
  );
}

// Tombol acak dipilih saat ditekan, jadi tidak ada beda antara server dan browser.
function TombolAcak() {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <button
      type="button"
      className="bch-btn"
      data-variant="ghost"
      onClick={() => router.push(`/makan/tempat/${places[Math.floor(Math.random() * places.length)].id}`)}
    >
      {t("random")}
    </button>
  );
}

function BerandaIsi() {
  const { t, lang } = useI18n();
  const { state, results } = useFilters();
  const mencari = state.query.trim().length > 0;
  const sampul = getPanduan(ID_SAMPUL) ?? panduan[0];
  const lain = panduan.filter((g) => g.id !== sampul.id);
  const chips: { teks: string; href: string }[] = [
    { teks: t("open_now"), href: tautanPeta({ openNow: true }) },
    { teks: HALAL_LABEL.halal[lang], href: tautanPeta({ halal: ["halal"] }) },
    { teks: t("nav_ferry"), href: "/makan/dekat-feri" },
    { teks: t("breakfast"), href: tautanPeta({ waktu: ["sarapan"] }) },
    { teks: t("late"), href: tautanPeta({ waktu: ["larut"] }) },
    { teks: t("cheap"), href: tautanPeta({ murah: true }) },
  ];

  return (
    <div className="bch-page mk-beranda">
      <div className="mk-sampul">
        <div className="mk-sampul-kiri">
          <p className="mk-data-baris">
            {t("home_data", { n: places.length, h: categories.length, k: kawasanBerisi.length })}
          </p>
          <h1>{t("home_title")}</h1>
          <SearchBar besar />
          <div className="mk-chips">
            {chips.map((c) => (
              <Link key={c.href} href={c.href} className="mk-chip">
                {c.teks}
              </Link>
            ))}
          </div>
        </div>
        <EntriPanduan g={sampul} utama />
      </div>

      {mencari ? (
        <section className="bch-seksi">
          <div className="mk-hasil-baris">
            <span className="mk-hasil-n" role="status">
              {results.length} {t("results")}
            </span>
            <TautanAksi href={tautanPeta({ query: state.query })}>{t("see_all")}</TautanAksi>
          </div>
          {results.length === 0 ? (
            <PesanKosong />
          ) : (
            <ul className="mk-daftar">
              {results.slice(0, 10).map((p) => (
                <li key={p.id}>
                  <BarisTempat place={p} Judul="h2" />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <>
          <section className="bch-seksi">
            <KepalaBagian judul={t("idx_title")} />
            <IndeksHidangan />
          </section>

          <ModulFeri />

          <section className="bch-seksi">
            <KepalaBagian judul={t("guides_title")} tautan={<TautanAksi href="/makan/panduan">{t("guides_all")}</TautanAksi>} />
            <div className="mk-entri-kisi">
              {lain.slice(0, 3).map((g) => (
                <EntriPanduan key={g.id} g={g} />
              ))}
            </div>
          </section>

          <section className="bch-seksi mk-kawasan">
            <div className="mk-kawasan-peta">
              <PetaCetak />
              <p className="mk-catatan">{t("map_legend")}</p>
              <TautanAksi href="/makan/peta">{t("map_open")}</TautanAksi>
            </div>
            <div>
              <KepalaBagian judul={t("areas_title")} />
              <DaftarKawasan />
              <TautanAksi href="/makan/food-court">Food Court dan Pujasera</TautanAksi>
            </div>
          </section>

          <div className="bch-seksi mk-dua-kolom">
            <DaftarLabel label="legendaris" judul="legend_title" />
            <DaftarLabel label="hidden-gem" judul="rare_title" />
          </div>

          <aside className="bch-seksi mk-pita">
            <p>{t("trust")}</p>
            <div className="mk-pita-tautan">
              <TautanAksi href="/makan/cara-memilih">{t("how")}</TautanAksi>
              {KIRIMAN_AKTIF && <TautanAksi href="/koreksi">{t("fix")}</TautanAksi>}
              <TombolAcak />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

export function BerandaMakan() {
  return (
    <FilterProvider>
      <BerandaIsi />
    </FilterProvider>
  );
}

function DaftarKawasan() {
  return (
    <ul className="mk-tautan-daftar">
      {kawasanBerisi.map((a) => (
        <li key={a.id}>
          <Link href={`/makan/kawasan/${a.id}`}>
            <span>{a.name}</span>
            <span className="mk-tautan-n">{areaCounts[a.id]}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ---- Halaman Peta ----
export function PetaSemua() {
  const { t } = useI18n();
  return (
    <FilterProvider>
      <HalamanDaftar penuh kepala={<h1>{t("nav_map")}</h1>} />
    </FilterProvider>
  );
}

// ---- Hidangan ----
export function HidanganIndeks() {
  const { t } = useI18n();
  return (
    <div className="bch-page">
      <Remah isi={[{ teks: t("nav_home"), href: "/makan" }, { teks: t("nav_dish") }]} />
      <h1 className="mk-judul">{t("nav_dish")}</h1>
      <IndeksHidangan />
    </div>
  );
}

function KepalaHidangan({ kategori }: { kategori: string }) {
  const { t, lang } = useI18n();
  const nama = catName(lang, categoryMap[kategori]);
  return (
    <div className="mk-kepala-gambar">
      <div>
        <Remah isi={[{ teks: t("nav_home"), href: "/makan" }, { teks: t("nav_dish"), href: "/makan/hidangan" }, { teks: nama }]} />
        <h1 className="mk-judul">{nama}</h1>
        <p className="bch-lede">{miring(DEK_HIDANGAN[kategori]?.[lang] ?? "")}</p>
      </div>
      <Image className="bch-grafis" src={grafisHidangan(kategori)} alt="" width={960} height={960} priority unoptimized />
    </div>
  );
}

export function HidanganHalaman({ slug }: { slug: string }) {
  const kategori = kategoriDariSlug(slug) ?? "";
  const dasar = useCallback((p: PlaceWithGeo) => dalamKategori(p, kategori), [kategori]);
  return (
    <FilterProvider dasar={dasar}>
      <HalamanDaftar kepala={<KepalaHidangan kategori={kategori} />} tanpa={["hidangan"]} />
    </FilterProvider>
  );
}

// ---- Kawasan ----
export function KawasanIndeks() {
  const { t } = useI18n();
  return (
    <div className="bch-page">
      <Remah isi={[{ teks: t("nav_home"), href: "/makan" }, { teks: t("nav_area") }]} />
      <h1 className="mk-judul">{t("nav_area")}</h1>
      <div className="mk-kawasan mk-kawasan-halaman">
        <div className="mk-kawasan-peta">
          <PetaCetak />
          <p className="mk-catatan">{t("map_legend")}</p>
        </div>
        <DaftarKawasan />
      </div>
    </div>
  );
}

const PERINGKAT_HIDANGAN = (dasar: PlaceWithGeo[], lang: Lang) => {
  const hitung: Record<string, number> = {};
  for (const p of dasar) hitung[p.category] = (hitung[p.category] ?? 0) + 1;
  return Object.entries(hitung)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => catName(lang, categoryMap[id]));
};

function KepalaKawasan({ id }: { id: string }) {
  const { t, lang } = useI18n();
  const nama = areaMap[id]?.name ?? "";
  const dek = useMemo(() => PERINGKAT_HIDANGAN(places.filter((p) => p.area === id), lang).join(" · "), [id, lang]);
  return (
    <div>
      <Remah isi={[{ teks: t("nav_home"), href: "/makan" }, { teks: t("nav_area"), href: "/makan/kawasan" }, { teks: nama }]} />
      <h1 className="mk-judul">{nama}</h1>
      <p className="bch-lede">{miring(dek)}</p>
    </div>
  );
}

export function KawasanHalaman({ id }: { id: string }) {
  const dasar = useCallback((p: PlaceWithGeo) => p.area === id, [id]);
  return (
    <FilterProvider dasar={dasar}>
      <HalamanDaftar kepala={<KepalaKawasan id={id} />} tanpa={["kawasan"]} />
    </FilterProvider>
  );
}

// ---- Dekat feri ----
function KepalaFeri({ aktif }: { aktif: string }) {
  const { t } = useI18n();
  const { set } = useFilters();
  return (
    <div className="mk-kepala-gambar" data-lebar>
      <div>
        <Remah isi={[{ teks: t("nav_home"), href: "/makan" }, { teks: t("nav_ferry") }]} />
        <h1 className="mk-judul">{t("nav_ferry")}</h1>
        <p className="bch-lede">{t("near_dek", { km: RADIUS_FERI_KM })}</p>
        <div className="mk-terminal mk-terminal-datar" role="group" aria-label={t("near_terminal")}>
          {ferries.map((f) => (
            <button key={f.id} type="button" aria-pressed={aktif === f.id} onClick={() => set({ ferry: f.id })}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <Image className="bch-grafis" src="/grafis/panduan/dekat-feri.webp" alt="" width={1440} height={960} priority unoptimized />
    </div>
  );
}

export function DekatFeri() {
  const search = useAlamat();
  const minta = new URLSearchParams(search).get("terminal");
  const aktif = ferries.some((f) => f.id === minta) ? (minta as string) : ferries[0].id;
  const dasar = useCallback(
    (p: PlaceWithGeo) => p.nearestFerryId === aktif && p.nearestFerryKm <= RADIUS_FERI_KM,
    [aktif],
  );
  const terminal = terminalDariMakan(aktif);
  const nama = ferries.find((f) => f.id === aktif)?.label;
  return (
    <FilterProvider dasar={dasar} urutAwal="ferry">
      <HalamanDaftar
        kepala={<KepalaFeri aktif={aktif} />}
        tanpa={["terminal"]}
        urut={["ferry", "larut", "harga", "az"]}
        bawah={terminal ? <FeriTerakhirMuat terminal={terminal} namaTerminal={nama} /> : null}
      />
    </FilterProvider>
  );
}

// ---- Panduan ----
export function PanduanIndeks() {
  const { t } = useI18n();
  return (
    <div className="bch-page">
      <Remah isi={[{ teks: t("nav_home"), href: "/makan" }, { teks: t("nav_guides") }]} />
      <h1 className="mk-judul">{t("nav_guides")}</h1>
      <div className="mk-entri-kisi mk-bagian">
        {panduan.map((g) => (
          <EntriPanduan key={g.id} g={g} />
        ))}
      </div>
    </div>
  );
}

function KepalaPanduan({ g }: { g: Panduan }) {
  const { t, lang } = useI18n();
  const durasi = g.durasi(lang);
  return (
    <div className="mk-kepala-gambar" data-lebar={g.berurut ? "" : undefined}>
      <div>
        <Remah isi={[{ teks: t("nav_home"), href: "/makan" }, { teks: t("nav_guides"), href: "/makan/panduan" }, { teks: g.judul(lang) }]} />
        <h1 className="mk-judul">{g.judul(lang)}</h1>
        <p className="bch-lede">{miring(g.dek(lang))}</p>
        <p className="mk-data-baris">
          {g.tempat.length} {t("results")}
          {durasi && ` · ${durasi}`}
        </p>
      </div>
      <Image className="bch-grafis" src={g.grafis} alt="" width={g.berurut ? 1440 : 960} height={960} priority unoptimized />
    </div>
  );
}

// Jalur punya urutan, jadi tidak disaring. Daftar hitungan memakai halaman daftar biasa.
export function PanduanHalaman({ id }: { id: string }) {
  const { t } = useI18n();
  const g = getPanduan(id);
  const ids = useMemo(() => new Set(g?.tempat.map((p) => p.id)), [g]);
  const dasar = useCallback((p: PlaceWithGeo) => ids.has(p.id), [ids]);
  if (!g) return null;
  if (!g.berurut) {
    return (
      <FilterProvider dasar={dasar}>
        <HalamanDaftar kepala={<KepalaPanduan g={g} />} />
      </FilterProvider>
    );
  }
  return (
    <div className="bch-page mk-tata" data-tampil="daftar">
      <div className="mk-tata-kepala">
        <KepalaPanduan g={g} />
      </div>
      <div className="mk-tata-daftar">
        <ol className="mk-daftar">
          {g.tempat.map((p, i) => (
            <li key={p.id}>
              <BarisTempat place={p} Judul="h2" nomor={i + 1} />
            </li>
          ))}
        </ol>
      </div>
      <div className="mk-tata-peta" data-selalu>
        <div className="mk-tata-peta-dalam">
          <TrailMap stops={g.tempat} />
          <p className="mk-peta-catatan">{t("guide_line_note")}</p>
        </div>
      </div>
    </div>
  );
}

// ---- Cara memilih ----
const LABEL_ARTI: [RecLabel, KunciTeks][] = [
  ["legendaris", "about_l_legend"],
  ["wajib-coba", "about_l_kurator"],
  ["hits", "about_l_populer"],
  ["hidden-gem", "about_l_jarang"],
];

function Blok({ id, judul, children }: { id?: string; judul: string; children: ReactNode }) {
  return (
    <section id={id}>
      <h2>{judul}</h2>
      {children}
    </section>
  );
}

export function CaraMemilih() {
  const { t, lang } = useI18n();
  const tanggal = new Intl.DateTimeFormat(lang === "id" ? "id-ID" : lang === "zh" ? "zh-CN" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${TANGGAL_KURS}T00:00:00Z`));
  const sgd = `Rp${CURRENCY_RATES.SGD.toLocaleString("id-ID")}`;

  return (
    <div className="bch-page mk-cara">
      <Remah isi={[{ teks: t("nav_home"), href: "/makan" }, { teks: t("how") }]} />
      <h1 className="mk-judul">{t("about_title")}</h1>
      <div className="mk-cara-isi">
        <Blok judul={t("about_pay_t")}>
          <p>{t("about_pay")}</p>
        </Blok>
        <Blok judul={t("about_labels_t")}>
          <dl className="mk-arti">
            {LABEL_ARTI.map(([l, teks]) => (
              <div key={l}>
                <dt>
                  <em className="mk-label">{LABEL_LABEL[l][lang]}</em>
                </dt>
                <dd>{t(teks)}</dd>
              </div>
            ))}
          </dl>
        </Blok>
        <Blok id="status-halal" judul={t("about_halal_t")}>
          <p>{t("about_halal")}</p>
        </Blok>
        <Blok judul={t("about_coord_t")}>
          <p>{t("about_coord")}</p>
        </Blok>
        <Blok judul={t("about_rating_t")}>
          <p>{t("about_rating")}</p>
        </Blok>
        <Blok judul={t("about_rate_t")}>
          <p>{t("about_rate", { tanggal, sgd })}</p>
        </Blok>
        <Blok judul={t("about_qris_t")}>
          <p>{t("about_qris")}</p>
        </Blok>
        <Blok judul={t("about_tips_t")}>
          <ul>
            <li>{t("about_tip1")}</li>
            <li>{t("about_tip2")}</li>
            <li>{t("about_tip3")}</li>
          </ul>
        </Blok>
      </div>
    </div>
  );
}
