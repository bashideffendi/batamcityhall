// Penanda memuat peta (PEDOMAN 3.1): teks lurus dengan indikator visual, tanpa elipsis.
export default function ItikBerbaris() {
  return (
    <div className="peta-muat" role="status">
      <span className="peta-itik" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <i key={i} style={{ animationDelay: `${i * 160}ms` }} />
        ))}
      </span>
      <span>Memuat peta</span>
    </div>
  );
}
