// Ringkasan di puncak panel: satu kalimat data (PEDOMAN 3.11) dan satu baris waktu.
export function Ringkasan({
  kalimat,
  baris,
  nada,
  onRetry,
}: {
  kalimat: string;
  baris: string;
  nada?: "ok" | "caution" | "danger";
  onRetry?: () => void;
}) {
  return (
    <div className="cu-ringkasan">
      <p className="answer" tabIndex={-1}>
        {kalimat}
      </p>
      {(baris || onRetry) && (
        <p className="cu-baris-waktu">
          {nada ? (
            <span className="bch-status bch-data" data-tone={nada}>
              {baris}
            </span>
          ) : (
            <span className="bch-data">{baris}</span>
          )}
          {onRetry && (
            <button type="button" className="bch-tautan-tombol" onClick={onRetry}>
              Muat ulang
            </button>
          )}
        </p>
      )}
    </div>
  );
}
