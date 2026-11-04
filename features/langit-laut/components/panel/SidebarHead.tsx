import { IconDrop, IconInstall, IconShare } from "../icons";

type Props = {
  onShare: () => void;
  canInstall: boolean;
  onInstall: () => void;
};

// Kepala sidebar laptop: nama loket + Bagikan (+ Pasang). Di HP disembunyikan CSS —
// di sana bilah atas (Topbar) yang memegang peran ini.
export default function SidebarHead({ onShare, canInstall, onInstall }: Props) {
  return (
    <div className="sb-head">
      {/* h1 di sini hanya tampil di laptop; di HP h1 ada di Topbar (yang ini display:none) */}
      <h1 className="sb-brand">
        <IconDrop className="sb-drop" />
        Langit &amp; Laut
      </h1>
      <div className="sb-icons">
        {canInstall && (
          <button className="sb-ib" onClick={onInstall} aria-label="Pasang Aplikasi ke Layar Utama">
            <IconInstall />
          </button>
        )}
        <button className="sb-ib" onClick={onShare} aria-label="Bagikan Tampilan Ini">
          <IconShare />
        </button>
      </div>
    </div>
  );
}
