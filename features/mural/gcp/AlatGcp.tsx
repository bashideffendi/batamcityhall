"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import type { Map as PetaMl, Marker } from "maplibre-gl";
import type OpenSeadragon from "openseadragon";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  berkasGcp,
  buatTransformer,
  galatTinggalkanSatu,
  keGeo,
  kePiksel,
  MIN_GCP_TPS,
  uraiBerkasGcp,
  type Gcp,
} from "../lib/gcp";
import type { Titik } from "../lib/geom";

type Mode = "tambah" | "uji";

const enam = (n: number) => n.toFixed(6);

/**
 * Alat internal: klik titik yang sama di gambar dan di peta bersama, keluarannya berkas JSON GCP. Semua berjalan di
 * peramban. Tidak ada yang ditulis ke server: berkas hanya diunduh.
 */
export default function AlatGcp({
  dasar,
  segmen,
  lebar,
  tinggi,
}: {
  dasar: string;
  segmen: string;
  lebar: number;
  tinggi: number;
}) {
  const wadahGambar = useRef<HTMLDivElement>(null);
  const wadahPeta = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const petaRef = useRef<PetaMl | null>(null);
  const osdRef = useRef<typeof OpenSeadragon | null>(null);
  const tandaPeta = useRef<Marker | null>(null);
  const tandaGambar = useRef<HTMLDivElement | null>(null);
  const penanganan = useRef<{ gambar: (t: Titik) => void; peta: (t: Titik) => void }>({
    gambar: () => {},
    peta: () => {},
  });

  const [gcps, setGcps] = useState<Gcp[]>([]);
  const [tundaPiksel, setTundaPiksel] = useState<Titik | null>(null);
  const [tundaGeo, setTundaGeo] = useState<Titik | null>(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<Mode>("tambah");
  const [hasilUji, setHasilUji] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [siap, setSiap] = useState({ gambar: false, peta: false });

  const transformer = useMemo(() => buatTransformer(gcps), [gcps]);
  const galat = useMemo(() => galatTinggalkanSatu(gcps), [gcps]);
  const berkas = useMemo(
    () => JSON.stringify(berkasGcp(segmen, gcps, "dibuat di /mural/gcp"), null, 2),
    [gcps, segmen],
  );

  useEffect(() => {
    penanganan.current = {
      gambar(t) {
        if (mode === "tambah") {
          setTundaPiksel(t);
          return;
        }
        if (!transformer) {
          setHasilUji(`Butuh minimal ${MIN_GCP_TPS} pasangan untuk menguji.`);
          return;
        }
        const [lng, lat] = keGeo(transformer, t);
        setHasilUji(`Piksel ${Math.round(t[0])}, ${Math.round(t[1])} = lng ${enam(lng)}, lat ${enam(lat)}`);
        tandaPeta.current?.setLngLat([lng, lat]).addTo(petaRef.current!);
        petaRef.current?.panTo([lng, lat]);
      },
      peta(t) {
        if (mode === "tambah") {
          setTundaGeo(t);
          return;
        }
        if (!transformer) {
          setHasilUji(`Butuh minimal ${MIN_GCP_TPS} pasangan untuk menguji.`);
          return;
        }
        const [x, y] = kePiksel(transformer, t);
        setHasilUji(`lng ${enam(t[0])}, lat ${enam(t[1])} = piksel ${Math.round(x)}, ${Math.round(y)}`);
        const v = viewerRef.current;
        const O = osdRef.current;
        if (v && O && tandaGambar.current) {
          const titik = v.viewport.imageToViewportCoordinates(new O.Point(x, y));
          v.removeOverlay(tandaGambar.current);
          v.addOverlay({ element: tandaGambar.current, location: titik });
          v.viewport.panTo(titik);
        }
      },
    };
  }, [mode, transformer]);

  useEffect(() => {
    let batal = false;
    let viewer: OpenSeadragon.Viewer | null = null;
    (async () => {
      const O = (await import("openseadragon")).default;
      if (batal || !wadahGambar.current) return;
      osdRef.current = O;
      viewer = O({
        element: wadahGambar.current,
        tileSources: `${dasar}/segmen.dzi`,
        drawer: "canvas",
        showNavigationControl: false,
        gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true },
        gestureSettingsTouch: { pinchToZoom: true },
      });
      viewerRef.current = viewer;
      viewer.canvas.setAttribute("role", "application");
      viewer.canvas.setAttribute("aria-label", "Gambar segmen. Klik untuk memilih piksel.");
      const tanda = document.createElement("div");
      tanda.className = "gcp-tanda";
      tandaGambar.current = tanda;
      const v = viewer;
      v.addHandler("open", () => setSiap((s) => ({ ...s, gambar: true })));
      v.addHandler("canvas-click", (e) => {
        const ev = e as OpenSeadragon.CanvasClickEvent;
        if (!ev.quick) return;
        const p = v.viewport.viewerElementToImageCoordinates(ev.position!);
        penanganan.current.gambar([Math.round(p.x), Math.round(p.y)]);
      });
    })();
    return () => {
      batal = true;
      viewer?.destroy();
      viewerRef.current = null;
    };
  }, [dasar]);

  useEffect(() => {
    let batal = false;
    let peta: PetaMl | null = null;
    (async () => {
      const [{ Map: Peta, Marker: Tanda }, { pasangGlobalPeta }, { baseStyle }] = await Promise.all([
        import("maplibre-gl"),
        import("@/features/peta/global"),
        import("@/features/peta/style"),
      ]);
      if (batal || !wadahPeta.current) return;
      pasangGlobalPeta();
      peta = new Peta({
        container: wadahPeta.current,
        style: baseStyle("light", window.location.origin, { chart: false }),
        center: [104.006, 1.152],
        zoom: 12.5,
        attributionControl: { compact: true },
      });
      petaRef.current = peta;
      tandaPeta.current = new Tanda();
      peta.on("load", () => setSiap((s) => ({ ...s, peta: true })));
      peta.on("click", (e) => {
        penanganan.current.peta([Number(enam(e.lngLat.lng)), Number(enam(e.lngLat.lat))]);
      });
    })();
    return () => {
      batal = true;
      peta?.remove();
      petaRef.current = null;
    };
  }, []);

  const pasangkan = () => {
    if (!tundaPiksel || !tundaGeo) return;
    setGcps((g) => [...g, { resource: tundaPiksel, geo: tundaGeo, ...(label.trim() ? { label: label.trim() } : {}) }]);
    setTundaPiksel(null);
    setTundaGeo(null);
    setLabel("");
  };

  const unduh = () => {
    const u = URL.createObjectURL(new Blob([berkas], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = u;
    a.download = `${segmen}.gcps.json`;
    a.click();
    URL.revokeObjectURL(u);
  };

  const muat = async (f: File | undefined) => {
    if (!f) return;
    const hasil = uraiBerkasGcp(await f.text());
    if (hasil) {
      setGcps(hasil);
      setPesan(`Dimuat ${hasil.length} pasangan dari ${f.name}.`);
    } else {
      setPesan("Berkas tidak dikenali. Tidak ada yang berubah.");
    }
  };

  return (
    <>
      <div className="gcp-kontrol">
        <div className="bch-field">
          <label htmlFor="gcp-mode">Mode klik</label>
          <select id="gcp-mode" className="bch-select" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="tambah">Tambah pasangan</option>
            <option value="uji">Uji transformasi</option>
          </select>
        </div>
        <div className="bch-field">
          <label htmlFor="gcp-label">Label titik</label>
          <input
            id="gcp-label"
            className="bch-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="ujung dermaga"
          />
        </div>
        <button
          type="button"
          className="bch-btn"
          disabled={!tundaPiksel || !tundaGeo}
          onClick={pasangkan}
          data-pasangkan
        >
          Simpan pasangan
        </button>
        <button type="button" className="bch-btn" disabled={!gcps.length} onClick={unduh} data-unduh>
          Unduh JSON
        </button>
        <div className="bch-field">
          <label htmlFor="gcp-muat">Muat berkas GCP</label>
          <input
            id="gcp-muat"
            type="file"
            accept="application/json,.json"
            onChange={(e) => muat(e.target.files?.[0])}
          />
        </div>
      </div>

      <p className="bch-sel-kecil" aria-live="polite" data-tunda>
        Gambar: {tundaPiksel ? `${tundaPiksel[0]}, ${tundaPiksel[1]}` : "belum diklik"}. Peta:{" "}
        {tundaGeo ? `${tundaGeo[0]}, ${tundaGeo[1]}` : "belum diklik"}.
      </p>
      {hasilUji && (
        <p className="bch-note" data-hasil-uji>
          {hasilUji}
        </p>
      )}
      {pesan && <p className="bch-note">{pesan}</p>}

      <div className="gcp-panggung" data-siap-gambar={siap.gambar} data-siap-peta={siap.peta}>
        <section aria-label="Gambar">
          <h2>
            Gambar <span className="bch-sel-kecil">{`${lebar} x ${tinggi} piksel`}</span>
          </h2>
          <div className="gcp-panel">
            <div ref={wadahGambar} data-gcp-gambar />
          </div>
        </section>
        <section aria-label="Peta">
          <h2>
            Peta <span className="bch-sel-kecil">peta bersama, OpenStreetMap dan Protomaps</span>
          </h2>
          <div className="gcp-panel">
            <div ref={wadahPeta} data-gcp-peta />
          </div>
        </section>
      </div>

      <h2 className="mt-5">Pasangan ({gcps.length})</h2>
      <p className="bch-sel-kecil">
        Target 30 sampai 80 pasangan per segmen, rapat di area yang bengkok. Galat dihitung leave-one-out dengan
        thin-plate spline. Target di bawah 40 piksel pada zoom penuh adalah asumsi kerja.
      </p>
      <div className="bch-table-wrap">
        <table className="bch-table">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Label</th>
              <th scope="col">Piksel</th>
              <th scope="col">Lng, lat</th>
              <th scope="col">Galat</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {gcps.map((g, i) => (
              <tr key={`${g.resource.join()}-${g.geo.join()}-${i}`} data-gcp-baris>
                <td>{i + 1}</td>
                <td>{g.label ?? "tanpa label"}</td>
                <td className="bch-data">{g.resource.join(", ")}</td>
                <td className="bch-data">{g.geo.join(", ")}</td>
                <td className="bch-data">{galat[i] === null ? "belum bisa" : `${galat[i]!.toFixed(1)} px`}</td>
                <td>
                  <button
                    type="button"
                    className="bch-btn"
                    aria-label={`Hapus pasangan ${i + 1}`}
                    onClick={() => setGcps((d) => d.filter((_, k) => k !== i))}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-5">Keluaran JSON</h2>
      <label htmlFor="gcp-keluaran" className="bch-sel-kecil">
        Simpan sebagai data/mural/{segmen}.gcps.json. Tidak ada yang ditulis ke server.
      </label>
      <textarea id="gcp-keluaran" className="gcp-keluaran bch-input" readOnly value={berkas} data-keluaran />
    </>
  );
}
