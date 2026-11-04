"use client";

import type { RefObject } from "react";
import { IconDrop, IconInstall, IconShare } from "./icons";

type Props = {
  sub: string;
  onShare: () => void;
  canInstall: boolean;
  onInstall: () => void;
  topbarRef: RefObject<HTMLElement | null>;
  inert: boolean;
};

// Bilah atas: nama loket (+ subjudul di layar ≥701 px) + Bagikan (+ Pasang kalau browser
// menawarkan). Tombol tema ada di strip navigasi situs. Status data tidak di sini — keadaan terlambat/terputus jadi
// kalimat utama di panel, jadi tidak ada pil status yang bisa salah dibaca.
export default function Topbar({ sub, onShare, canInstall, onInstall, topbarRef, inert }: Props) {
  return (
    <header className="topbar" ref={topbarRef} inert={inert}>
      <div className="brand">
        <span className="mark">
          <IconDrop />
        </span>
        <div className="brand-txt">
          <h1 className="name">Langit &amp; Laut</h1>
          <div className="sub">{sub}</div>
        </div>
      </div>
      <div className="topbar-right">
        {canInstall && (
          <button className="install-btn" onClick={onInstall} aria-label="Pasang Aplikasi ke Layar Utama">
            <IconInstall />
            <span className="txt">Pasang</span>
          </button>
        )}
        <button className="icon-btn" onClick={onShare} aria-label="Bagikan Tampilan Ini">
          <IconShare />
        </button>
      </div>
    </header>
  );
}
