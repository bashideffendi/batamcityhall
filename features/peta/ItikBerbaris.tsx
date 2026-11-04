// Penanda memuat (data/design/microcopy.json): tiga itik garis, bukan maskot.
const ITIK =
  "M4 6.5a2.5 2.5 0 1 1 5 0c0 1-.3 1.8-.9 2.5C10 10.5 13 10.5 17 9c0 5-3 8-7.5 8S3 14.5 3.5 11.5c.2-1 .8-1.8 1.2-2.5C4.3 8.3 4 7.4 4 6.5ZM4 6 1.5 6.8 4 7.4";

export default function ItikBerbaris() {
  return (
    <div className="peta-muat" role="status">
      <span className="peta-itik" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            width="24"
            height="24"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
            style={{ animationDelay: `${i * 160}ms` }}
          >
            <path d={ITIK} />
          </svg>
        ))}
      </span>
      <span>Itik sedang berbaris…</span>
    </div>
  );
}
