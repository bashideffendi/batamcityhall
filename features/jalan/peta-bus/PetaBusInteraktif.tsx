"use client";

// Bingkai interaktif Peta Bus: geser, perbesar, layar penuh, dan sorot koridor. Isi SVG datang dari server.
// Tampilan diubah lewat atribut viewBox langsung (ref), supaya gerakan tidak memicu render ulang React.
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { InfoKoridor } from "./data";

type Kotak = [number, number, number, number];
type Pandang = { x: number; y: number; w: number; h: number };

const SKALA_MAKS = 3.2;
/** Di bawah skala ini nama halte biasa disembunyikan; nama terminal tetap. */
const SKALA_LABEL = 0.45;
/** Pusat awal: Baloi, di antara Sekupang, Jodoh, dan Batam Centre. Skala awal: nama halte sekitar 10 px. */
const PUSAT_AWAL: [number, number] = [1000, 800];
const SKALA_AWAL = 0.85;
/** Di layar sempit pandangan awal lebih luas supaya arah tetap terbaca. */
const SKALA_AWAL_SEMPIT = 0.6;

export default function PetaBusInteraktif({
  lebar,
  tinggi,
  batas,
  koridor,
  sorotAwal,
  children,
}: {
  lebar: number;
  tinggi: number;
  batas: Record<string, Kotak>;
  koridor: InfoKoridor[];
  sorotAwal?: string;
  children: ReactNode;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const pandang = useRef<Pandang>({ x: 0, y: 0, w: lebar, h: tinggi });
  const [sorot, setSorot] = useState<string | null>(sorotAwal ?? null);
  const [penuh, setPenuh] = useState(false);
  const [petunjuk, setPetunjuk] = useState<string | null>(null);
  const jamPetunjuk = useRef<number | undefined>(undefined);

  const ukuranLayar = () => {
    const el = svg.current;
    return el ? { W: el.clientWidth || 1, H: el.clientHeight || 1 } : { W: 1, H: 1 };
  };

  const terapkan = useCallback(() => {
    const el = svg.current;
    if (!el) return;
    const { W } = ukuranLayar();
    const v = pandang.current;
    el.setAttribute("viewBox", `${v.x.toFixed(1)} ${v.y.toFixed(1)} ${v.w.toFixed(1)} ${v.h.toFixed(1)}`);
    const skala = W / v.w;
    if (skala < SKALA_LABEL) el.setAttribute("data-jauh", "");
    else el.removeAttribute("data-jauh");
  }, []);

  /** Batasi pandangan: tidak lebih kecil dari seluruh peta, tidak lebih besar dari SKALA_MAKS, tetap di kanvas. */
  const rapikan = useCallback(
    (v: Pandang): Pandang => {
      const { W, H } = ukuranLayar();
      const rasio = H / W;
      const wMin = W / SKALA_MAKS;
      const wMaks = Math.max(lebar, tinggi / rasio) * 1.04;
      const w = Math.min(Math.max(v.w, wMin), wMaks);
      const h = w * rasio;
      const cx = v.x + v.w / 2;
      const cy = v.y + v.h / 2;
      let x = cx - w / 2;
      let y = cy - h / 2;
      const tepiX = Math.max(0, (w - lebar) / 2);
      const tepiY = Math.max(0, (h - tinggi) / 2);
      x = Math.min(Math.max(x, -tepiX - w * 0.15), lebar - w + tepiX + w * 0.15);
      y = Math.min(Math.max(y, -tepiY - h * 0.15), tinggi - h + tepiY + h * 0.15);
      if (w >= lebar) x = (lebar - w) / 2;
      if (h >= tinggi) y = (tinggi - h) / 2;
      return { x, y, w, h };
    },
    [lebar, tinggi],
  );

  const pasang = useCallback(
    (v: Pandang) => {
      pandang.current = rapikan(v);
      terapkan();
    },
    [rapikan, terapkan],
  );

  /** Pandangan yang memuat kotak k dengan sedikit tepi. */
  const muatKotak = useCallback(
    ([x0, y0, x1, y1]: Kotak, tepi = 60) => {
      const { W, H } = ukuranLayar();
      const rasio = H / W;
      let w = x1 - x0 + tepi * 2;
      let h = y1 - y0 + tepi * 2;
      if (h / w > rasio) w = h / rasio;
      else h = w * rasio;
      pasang({ x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w, h });
    },
    [pasang],
  );

  const awal = useCallback(() => {
    if (sorotAwal && batas[sorotAwal]) {
      muatKotak(batas[sorotAwal]);
      return;
    }
    const { W, H } = ukuranLayar();
    const seluruh = Math.min(W / lebar, H / tinggi);
    const skala = Math.max(seluruh, W < 640 ? SKALA_AWAL_SEMPIT : SKALA_AWAL);
    const w = W / skala;
    const h = H / skala;
    pasang({ x: PUSAT_AWAL[0] - w / 2, y: PUSAT_AWAL[1] - h / 2, w, h });
  }, [batas, lebar, tinggi, muatKotak, pasang, sorotAwal]);

  const seluruhPeta = useCallback(() => muatKotak([0, 0, lebar, tinggi], 10), [lebar, tinggi, muatKotak]);

  // Ukuran bingkai berubah (layar penuh, putar ponsel): pertahankan pusat dan skala.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    let pertama = true;
    const ro = new ResizeObserver(() => {
      if (pertama) {
        pertama = false;
        awal();
        return;
      }
      const { W, H } = ukuranLayar();
      const v = pandang.current;
      const skala = W / v.w;
      const cx = v.x + v.w / 2;
      const cy = v.y + v.h / 2;
      pasang({ x: cx - W / skala / 2, y: cy - H / skala / 2, w: W / skala, h: H / skala });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [awal, pasang]);

  const perbesar = useCallback(
    (faktor: number, layar?: { x: number; y: number }) => {
      const el = svg.current;
      if (!el) return;
      const { W, H } = ukuranLayar();
      const v = pandang.current;
      const sx = layar ? layar.x : W / 2;
      const sy = layar ? layar.y : H / 2;
      const px = v.x + (sx / W) * v.w;
      const py = v.y + (sy / H) * v.h;
      const w = v.w / faktor;
      const h = v.h / faktor;
      pasang({ x: px - (sx / W) * w, y: py - (sy / H) * h, w, h });
    },
    [pasang],
  );

  const geser = useCallback(
    (dx: number, dy: number) => {
      const { W } = ukuranLayar();
      const v = pandang.current;
      const k = v.w / W;
      pasang({ ...v, x: v.x - dx * k, y: v.y - dy * k });
    },
    [pasang],
  );

  const tampilkanPetunjuk = (teks: string) => {
    setPetunjuk(teks);
    window.clearTimeout(jamPetunjuk.current);
    jamPetunjuk.current = window.setTimeout(() => setPetunjuk(null), 1600);
  };

  // Roda tetikus: Ctrl atau Cmd untuk memperbesar, kecuali di layar penuh. Pasif false agar bisa dicegah.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const roda = (e: WheelEvent) => {
      if (!penuh && !e.ctrlKey && !e.metaKey) {
        tampilkanPetunjuk("Tekan Ctrl sambil menggulir untuk memperbesar peta");
        return;
      }
      e.preventDefault();
      const r = el.getBoundingClientRect();
      perbesar(Math.exp(-e.deltaY * 0.0022), { x: e.clientX - r.left, y: e.clientY - r.top });
    };
    el.addEventListener("wheel", roda, { passive: false });
    return () => el.removeEventListener("wheel", roda);
  }, [penuh, perbesar]);

  // Penunjuk: tetikus menggeser dengan satu jari/tombol, sentuh butuh dua jari kecuali di layar penuh.
  const penunjuk = useRef(new Map<number, { x: number; y: number }>());
  const geserTadi = useRef(false);
  // Garis yang ditekan dan titik awal tekan. Dicatat di pointerdown karena setelah pointer capture, klik
  // mendarat di <svg>, bukan di garis.
  const garisTekan = useRef<string | null>(null);
  const awalTekan = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    penunjuk.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    geserTadi.current = false;
    if (penunjuk.current.size === 1) {
      garisTekan.current = (e.target as Element).closest?.("[data-garis]")?.getAttribute("data-garis") ?? null;
      awalTekan.current = { x: e.clientX, y: e.clientY };
    }
    if (e.pointerType === "mouse" || penuh || penunjuk.current.size >= 2) {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    }
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const lama = penunjuk.current.get(e.pointerId);
    if (!lama) return;
    const semua = [...penunjuk.current.entries()];
    if (semua.length === 1) {
      if (e.pointerType !== "mouse" && !penuh) return;
      if (e.pointerType === "mouse" && e.buttons !== 1) return;
      const dx = e.clientX - lama.x;
      const dy = e.clientY - lama.y;
      // Ambang dari titik awal, bukan per gerakan: geser pelan tetap terhitung geser, bukan klik.
      const awal = awalTekan.current;
      if (awal && Math.hypot(e.clientX - awal.x, e.clientY - awal.y) > 5) geserTadi.current = true;
      geser(dx, dy);
      penunjuk.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      return;
    }
    if (semua.length === 2) {
      const [[idA, a], [idB, b]] = semua;
      const baru = { x: e.clientX, y: e.clientY };
      const a2 = idA === e.pointerId ? baru : a;
      const b2 = idB === e.pointerId ? baru : b;
      const jarakLama = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const jarakBaru = Math.hypot(a2.x - b2.x, a2.y - b2.y) || 1;
      const r = (e.currentTarget as Element).getBoundingClientRect();
      const tengahLama = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const tengahBaru = { x: (a2.x + b2.x) / 2, y: (a2.y + b2.y) / 2 };
      geser(tengahBaru.x - tengahLama.x, tengahBaru.y - tengahLama.y);
      perbesar(jarakBaru / jarakLama, { x: tengahBaru.x - r.left, y: tengahBaru.y - r.top });
      geserTadi.current = true;
      penunjuk.current.set(e.pointerId, baru);
    }
  };
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    penunjuk.current.delete(e.pointerId);
  };

  // Ketuk garis: sorot koridornya. Ketuk lagi atau Esc: kembali semua.
  const onClick = () => {
    const id = garisTekan.current;
    garisTekan.current = null;
    if (geserTadi.current || !id) return;
    setSorot((s) => (s === id ? null : id));
  };

  const onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    const langkah = 60;
    const aksi: Record<string, () => void> = {
      ArrowLeft: () => geser(langkah, 0),
      ArrowRight: () => geser(-langkah, 0),
      ArrowUp: () => geser(0, langkah),
      ArrowDown: () => geser(0, -langkah),
      "+": () => perbesar(1.3),
      "=": () => perbesar(1.3),
      "-": () => perbesar(1 / 1.3),
      "0": () => seluruhPeta(),
      Escape: () => (penuh ? setPenuh(false) : setSorot(null)),
    };
    const f = aksi[e.key];
    if (f) {
      e.preventDefault();
      f();
    }
  };

  // Layar penuh: kunci gulir halaman, Esc menutup.
  useEffect(() => {
    if (!penuh) return;
    const lama = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const tutup = (e: KeyboardEvent) => e.key === "Escape" && setPenuh(false);
    window.addEventListener("keydown", tutup);
    return () => {
      document.documentElement.style.overflow = lama;
      window.removeEventListener("keydown", tutup);
    };
  }, [penuh]);

  const pilihKoridor = (id: string) => {
    const baru = sorot === id ? null : id;
    setSorot(baru);
    if (baru && batas[baru]) muatKotak(batas[baru]);
  };

  const aktif = koridor.find((k) => k.id === sorot);
  const judul = aktif
    ? `Peta Bus Trans Batam, ${aktif.id} ${aktif.nama} disorot.`
    : "Peta Bus Trans Batam: sembilan koridor beroperasi dan satu koridor rencana.";

  return (
    <div className="pb" data-penuh={penuh ? "" : undefined}>
      <div className="pb-bingkai">
        <svg
          ref={svg}
          className="pb-svg"
          viewBox={`0 0 ${lebar} ${tinggi}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={judul}
          tabIndex={0}
          data-sorot={sorot ?? undefined}
          fontFamily="var(--bch-font-sans)"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            perbesar(1.8, { x: e.clientX - r.left, y: e.clientY - r.top });
          }}
          onClick={onClick}
          onKeyDown={onKeyDown}
        >
          {children}
        </svg>
        <div className="pb-kendali">
          <button type="button" className="pb-tombol" onClick={() => perbesar(1.4)} aria-label="Perbesar peta">
            +
          </button>
          <button type="button" className="pb-tombol" onClick={() => perbesar(1 / 1.4)} aria-label="Perkecil peta">
            −
          </button>
          <button type="button" className="pb-tombol" onClick={seluruhPeta} aria-label="Tampilkan seluruh peta">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4.5 10a5.5 5.5 0 1 0 1.6-3.9M4.5 3.5v3h3" />
            </svg>
          </button>
          <button
            type="button"
            className="pb-tombol"
            onClick={() => setPenuh((p) => !p)}
            aria-label={penuh ? "Tutup layar penuh" : "Buka peta layar penuh"}
            aria-pressed={penuh}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              {penuh ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M8 3H3v5M12 3h5v5M17 12v5h-5M3 12v5h5" />}
            </svg>
          </button>
        </div>
        {petunjuk && (
          <p className="pb-petunjuk" role="status">
            {petunjuk}
          </p>
        )}
        {aktif && (
          <button type="button" className="pb-sorot-label jl-k" style={{ "--k": aktif.warna, "--k-malam": aktif.malam } as React.CSSProperties} onClick={() => setSorot(null)}>
            <span className="jl-chip-warna" aria-hidden="true" />
            <span>
              <span className="bch-data">{aktif.id}</span> {aktif.nama}
            </span>
            <span className="pb-sorot-tutup">Tampilkan Semua</span>
          </button>
        )}
      </div>
      <div className="pb-legenda">
        <h3 className="bch-kicker">Sorot Koridor</h3>
        <ul className="pb-legenda-koridor">
          {koridor.map((k) => (
            <li key={k.id}>
              <button
                type="button"
                className="jl-k pb-chip"
                style={{ "--k": k.warna, "--k-malam": k.malam } as React.CSSProperties}
                aria-pressed={sorot === k.id}
                data-rencana={k.rencana ? "" : undefined}
                onClick={() => pilihKoridor(k.id)}
              >
                <span className="jl-chip-warna" aria-hidden="true" />
                <span className="bch-data">{k.id}</span>
                <span className="pb-chip-nama">{k.nama}</span>
                {k.rencana && <span className="jl-chip-rencana">Rencana</span>}
              </button>
            </li>
          ))}
        </ul>
        <ul className="pb-legenda-simbol">
          <li>
            <svg viewBox="0 0 30 16" aria-hidden="true">
              <path d="M2 8H28" className="pb-contoh-garis" />
              <path d="M15 8V1.5" className="pb-contoh-tick" />
            </svg>
            Halte
          </li>
          <li>
            <svg viewBox="0 0 30 16" aria-hidden="true">
              <path d="M2 5H28M2 11H28" className="pb-contoh-garis" />
              <path d="M15 2V14" className="pb-batang-luar" />
              <path d="M15 2V14" className="pb-batang-dalam" />
            </svg>
            Halte Dua Koridor atau Lebih
          </li>
          <li>
            <svg viewBox="0 0 30 16" aria-hidden="true">
              <path d="M15 4V12" className="pb-simpul-luar" />
              <path d="M15 4V12" className="pb-simpul-dalam" />
            </svg>
            Halte Transit atau Ujung
          </li>
          <li>
            <svg viewBox="-8 -8 16 16" aria-hidden="true">
              <g className="pb-ikon">
                <path d="M0 -5.5a1.6 1.6 0 1 0 0.01 0M0 -2.5V6M-3 -1H3M-5.5 2.2C-5 4.8 -2.6 6 0 6S5 4.8 5.5 2.2" />
              </g>
            </svg>
            Pelabuhan
          </li>
          <li>
            <svg viewBox="0 0 30 16" aria-hidden="true">
              <path d="M2 8H28" className="pb-contoh-rencana" />
            </svg>
            Koridor Rencana
          </li>
        </ul>
        <p className="jl-catatan-kecil pb-cara">
          Ketuk garis atau nama koridor untuk menyorot. Geser untuk melihat bagian lain; di ponsel pakai dua jari
          atau buka layar penuh.
        </p>
      </div>
    </div>
  );
}
