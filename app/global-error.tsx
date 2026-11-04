"use client";

// Boundary paling luar (layout ikut gagal): wajib merender <html>/<body> sendiri, dan token CSS situs
// belum tentu ada, jadi warnanya ditulis langsung.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, background: "#F4EFE4", color: "#1C1B19", fontFamily: "Georgia, serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }} role="alert">
          <div style={{ maxWidth: 360, textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 400, margin: "0 0 8px" }}>Batam City Hall belum bisa dibuka</h1>
            <p style={{ fontSize: 16, lineHeight: 1.5, margin: "0 0 16px" }}>
              Ada kendala saat membuka situs. Coba muat ulang halamannya.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                font: "inherit",
                padding: "10px 18px",
                border: 0,
                borderRadius: 2,
                background: "#1C1B19",
                color: "#F4EFE4",
                cursor: "pointer",
                minHeight: 44,
              }}
            >
              Coba lagi
            </button>
            {error.digest && <p style={{ fontSize: 12, marginTop: 12 }}>Kode: {error.digest}</p>}
          </div>
        </main>
      </body>
    </html>
  );
}
