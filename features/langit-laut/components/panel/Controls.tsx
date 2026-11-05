import { useRef } from "react";
import { VIEWS, type ViewKey } from "@/features/langit-laut/lib/radar";
import type { Caption } from "@/features/langit-laut/lib/status";
import { IconPause, IconPlay } from "../icons";

/** Sakelar 38 x 22 dengan label teks (PEDOMAN 4.5). */
export function Sakelar({ label, nyala, onUbah }: { label: string; nyala: boolean; onUbah: (v: boolean) => void }) {
  return (
    <button type="button" className="bch-sakelar" role="switch" aria-checked={nyala} onClick={() => onUbah(!nyala)}>
      <span>{label}</span>
      <span className="rel" aria-hidden />
    </button>
  );
}

/** Pilihan segmen Cakupan. */
export function Cakupan({ keys, view, onChange }: { keys: ViewKey[]; view: ViewKey; onChange: (v: ViewKey) => void }) {
  return (
    <div className="cu-cakupan-isi">
      <span id="cu-cakupan-label" className="cu-label">
        Cakupan
      </span>
      <div className="bch-segmen" role="group" aria-labelledby="cu-cakupan-label">
        {keys.map((k) => (
          <button key={k} type="button" onClick={() => onChange(k)} aria-pressed={view === k}>
            {VIEWS[k].label}
          </button>
        ))}
      </div>
    </div>
  );
}

type TransportProps = {
  playing: boolean;
  ready: boolean;
  onTogglePlay: () => void;
  playLabel: string;
  label: string;
  valueText: string;
  max: number;
  value: number;
  onScrub: (v: number) => void;
  caption: Caption;
  jam: string;
  ketJam: string;
  onToNow: () => void;
};

/** Putar atau jeda, penggeser waktu, dan jam citra yang sedang tampil. */
export function Transport({
  playing,
  ready,
  onTogglePlay,
  playLabel,
  label,
  valueText,
  max,
  value,
  onScrub,
  caption,
  jam,
  ketJam,
  onToNow,
}: TransportProps) {
  const rangeRef = useRef<HTMLInputElement>(null);
  return (
    <div className="cu-transport">
      <button type="button" className="bch-btn cu-putar" onClick={onTogglePlay} disabled={!ready} aria-label={playing ? "Jeda" : playLabel}>
        {playing ? <IconPause /> : <IconPlay />}
        {playing ? "Jeda" : "Putar"}
      </button>
      <div className="cu-geser">
        <input
          ref={rangeRef}
          className="cu-rng"
          type="range"
          aria-label={label}
          aria-valuetext={valueText}
          min={0}
          max={max}
          value={value}
          disabled={!ready}
          onChange={(e) => onScrub(Number(e.target.value))}
        />
        <div className="cu-caps">
          <span data-warn={caption.warn || undefined}>{caption.left}</span>
          {caption.toNow ? (
            <button
              type="button"
              className="bch-tautan-tombol"
              onClick={() => {
                onToNow();
                // tombol ini hilang begitu kembali ke sekarang, jadi fokus jangan jatuh ke body
                rangeRef.current?.focus();
              }}
            >
              Ke terbaru
            </button>
          ) : (
            caption.right && <span>{caption.right}</span>
          )}
        </div>
      </div>
      {jam && (
        <div className="cu-jam">
          <b className="bch-data">{jam}</b>
          <span>{ketJam}</span>
        </div>
      )}
    </div>
  );
}
