// Mawar angin 8 titik versi minimal (research/05): garis 0,75 px, hanya ujung utara yang terisi
// terakota. Dipakai sebagai <g> supaya bisa masuk ke peta dan emblem.
const KARDINAL = [90, 180, 270];
const ORDINAL = [45, 135, 225, 315];

export function MawarAnginGaris({ r = 24 }: { r?: number }) {
  const lebar = r * 0.14;
  const leher = r * 0.14;
  const runcing = `M0 ${-r}L${lebar} ${-leher}L0 0L${-lebar} ${-leher}Z`;
  return (
    <g fill="none" stroke="currentColor" strokeWidth={0.75} strokeLinejoin="round">
      {ORDINAL.map((a) => (
        <line key={a} x1={0} y1={0} x2={0} y2={-r * 0.56} transform={`rotate(${a})`} />
      ))}
      {KARDINAL.map((a) => (
        <path key={a} d={runcing} transform={`rotate(${a})`} />
      ))}
      <path d={runcing} fill="var(--bch-accent)" stroke="var(--bch-accent)" />
    </g>
  );
}
