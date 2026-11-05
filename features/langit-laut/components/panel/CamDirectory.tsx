import { CCTV_MB_PER_MIN, MAPPED_CAMS, UNMAPPED_CAMS, type Cam } from "@/features/langit-laut/lib/cctv";
import { CAM_PATH_A, CAM_PATH_B, IconChevronRight } from "../icons";

type Props = {
  dead: ReadonlyMap<string, number | null>;
  onPick: (cam: Cam) => void;
};

// Kamera dikelompokkan per wilayah, urutan wilayah mengikuti data (lib/cctv.ts).
const BY_AREA: [string, Cam[]][] = (() => {
  const m = new Map<string, Cam[]>();
  for (const c of MAPPED_CAMS) {
    const list = m.get(c.area);
    if (list) list.push(c);
    else m.set(c.area, [c]);
  }
  return [...m.entries()].map(([area, cams]) => [area, [...cams].sort((a, b) => a.name.localeCompare(b.name, "id"))]);
})();

const PinSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d={CAM_PATH_A} />
    <path d={CAM_PATH_B} />
  </svg>
);

// Wilayah sudah jadi subjudul kelompok → sub-baris hanya untuk hal yang perlu diperhatikan.
function Row({ cam, failed, onPick }: { cam: Cam; failed: boolean; onPick: (c: Cam) => void }) {
  const sub = failed ? "Kamera tidak aktif" : cam.approx ? "Lokasi perkiraan" : null;
  return (
    <li>
      <button className="cam-row" data-failed={failed || undefined} onClick={() => onPick(cam)}>
        <span className="cam-row-txt">
          <span className="nm">{cam.name}</span>
          {sub && <span className="sub">{sub}</span>}
        </span>
        <IconChevronRight className="cam-row-chev" />
      </button>
    </li>
  );
}

/** Isi "Daftar" mode CCTV: semua kamera per wilayah, yang belum dipetakan, legenda pin, kredit. */
export default function CamDirectory({ dead, onPick }: Props) {
  return (
    <>
      <section className="d-sec">
        <h2 className="cu-sub">Semua Kamera</h2>
        {BY_AREA.map(([area, cams]) => (
          <div key={area} className="dir-area">
            <h3 className="dir-area-title">{area}</h3>
            <ul className="cam-rows">
              {cams.map((c) => (
                <Row key={c.slug} cam={c} failed={dead.has(c.slug)} onPick={onPick} />
              ))}
            </ul>
          </div>
        ))}
      </section>
      {UNMAPPED_CAMS.length > 0 && (
        <section className="d-sec">
          <h2 className="cu-sub">Belum Ada di Peta</h2>
          <ul className="cam-rows">
            {UNMAPPED_CAMS.map((c) => (
              <Row key={c.slug} cam={c} failed={dead.has(c.slug)} onPick={onPick} />
            ))}
          </ul>
        </section>
      )}
      <section className="d-sec">
        <h2 className="cu-sub">Arti Tanda di Peta</h2>
        <ul className="pin-legend">
          <li>
            <span className="cam-pin is-approx">
              <PinSvg />
            </span>
            Garis putus-putus: lokasi perkiraan
          </li>
          <li>
            <span className="cam-pin is-mati">
              <PinSvg />
            </span>
            Abu-abu: kamera tidak aktif
          </li>
          <li>
            <span className="cam-cluster">3</span>
            Angka: beberapa kamera berdekatan
          </li>
        </ul>
        <p className="d-note">
          Siaran memakai sekitar {CCTV_MB_PER_MIN} MB per menit. Siaran berhenti saat tab ditutup atau disembunyikan.
        </p>
      </section>
    </>
  );
}
