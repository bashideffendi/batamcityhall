"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent as PE } from "react";
import { useFotoTempat } from "@/features/konten/useFotoTempat";
import { BINGKAI_KOSONG, polaMosaik, type Foto } from "../lib/foto";
import { grafisHidangan } from "../lib/hidangan";
import { useI18n } from "../lib/i18n";
import Ikon from "./Ikon";

// Bingkai kosong gaya lembar tata letak majalah: garis silang menandai tempat foto.
function BingkaiKosong({ nomor }: { nomor: number }) {
  return (
    <span className="mk-bingkai" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
        <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="mk-bingkai-no">{String(nomor).padStart(2, "0")}</span>
    </span>
  );
}

function GaleriKosong({ kategori }: { kategori: string }) {
  const { t } = useI18n();
  return (
    <figure className="mk-galeri" data-pola="kosong">
      <div className="mk-galeri-kisi" tabIndex={0} role="group" aria-label={t("gallery")}>
        <span className="mk-galeri-ilustrasi">
          <Image src={grafisHidangan(kategori)} alt="" width={960} height={960} priority unoptimized />
        </span>
        {Array.from({ length: BINGKAI_KOSONG }, (_, i) => (
          <BingkaiKosong key={i} nomor={i + 1} />
        ))}
      </div>
      <figcaption>{t("gallery_soon")}</figcaption>
    </figure>
  );
}

function Lightbox({ foto, nama, awal, tutup }: { foto: Foto[]; nama: string; awal: number; tutup: () => void }) {
  const { t } = useI18n();
  const dialog = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(awal);
  const geserAwal = useRef<number | null>(null);
  const f = foto[i];
  const satu = foto.length === 1;
  const pindah = useCallback((arah: number) => setI((n) => (n + arah + foto.length) % foto.length), [foto.length]);

  useEffect(() => {
    const d = dialog.current;
    d?.showModal();
    return () => d?.close();
  }, []);

  const mulaiGeser = (e: PE) => {
    geserAwal.current = e.clientX;
  };
  const akhiriGeser = (e: PE) => {
    if (geserAwal.current === null) return;
    const jarak = e.clientX - geserAwal.current;
    geserAwal.current = null;
    if (Math.abs(jarak) > 48) pindah(jarak < 0 ? 1 : -1);
  };

  return (
    <dialog
      ref={dialog}
      className="mk-lightbox"
      aria-label={t("gallery")}
      onClose={tutup}
      onKeyDown={(e) => {
        if (satu) return;
        if (e.key === "ArrowRight") pindah(1);
        if (e.key === "ArrowLeft") pindah(-1);
      }}
    >
      <div className="mk-lightbox-atas">
        <span className="mk-lightbox-n" aria-live="polite">
          {i + 1}/{foto.length}
        </span>
        <button type="button" className="mk-fav" aria-label={t("close")} onClick={() => dialog.current?.close()}>
          <Ikon nama="tutup" />
        </button>
      </div>
      <div className="mk-lightbox-gambar" onPointerDown={mulaiGeser} onPointerUp={akhiriGeser}>
        <Image
          key={f.src}
          src={f.src}
          alt={f.alt ?? t("gallery_photo", { n: i + 1, total: foto.length, nama })}
          width={f.w}
          height={f.h}
          sizes="100vw"
          draggable={false}
        />
      </div>
      {(f.alt || f.kredit) && (
        <p className="mk-lightbox-ket">
          {f.alt}
          {f.alt && f.kredit && " · "}
          {f.kredit && t("gallery_credit", { nama: f.kredit })}
        </p>
      )}
      {!satu && (
        <div className="mk-lightbox-arah">
          <button type="button" className="mk-fav" aria-label={t("gallery_prev")} onClick={() => pindah(-1)}>
            <Ikon nama="kiri" />
          </button>
          <button type="button" className="mk-fav" aria-label={t("gallery_next")} onClick={() => pindah(1)}>
            <Ikon nama="kanan" />
          </button>
        </div>
      )}
    </dialog>
  );
}

function GaleriIsi({ foto, nama }: { foto: Foto[]; nama: string }) {
  const { t } = useI18n();
  const [buka, setBuka] = useState<number | null>(null);
  const tampil = foto.slice(0, polaMosaik(foto.length));
  const sisa = foto.length - tampil.length;

  return (
    <div className="mk-galeri" data-pola={tampil.length}>
      <div className="mk-galeri-kisi">
        {tampil.map((f, i) => (
          <button
            key={f.src}
            type="button"
            className="mk-galeri-foto"
            aria-label={t("gallery_open", { n: i + 1 })}
            onClick={() => setBuka(i)}
          >
            <Image
              src={f.src}
              alt={f.alt ?? t("gallery_photo", { n: i + 1, total: foto.length, nama })}
              fill
              sizes={i === 0 ? "(min-width: 800px) 50vw, 90vw" : "(min-width: 800px) 25vw, 90vw"}
              priority={i === 0}
            />
            {sisa > 0 && i === tampil.length - 1 && (
              <span className="mk-galeri-sisa">
                {t("gallery_all")} ({foto.length})
              </span>
            )}
          </button>
        ))}
      </div>
      {buka !== null && <Lightbox foto={foto} nama={nama} awal={buka} tutup={() => setBuka(null)} />}
    </div>
  );
}

/**
 * Galeri foto di detail tempat. Foto diambil dari public/foto/makan/<id>/ lewat scripts/foto-makan.mjs.
 * Selama belum ada foto, tampil ilustrasi hidangan dan bingkai kosong.
 */
export default function GaleriTempat({ id, nama, kategori }: { id: string; nama: string; kategori: string }) {
  const foto = useFotoTempat(id);
  return foto.length ? <GaleriIsi foto={foto} nama={nama} /> : <GaleriKosong kategori={kategori} />;
}
