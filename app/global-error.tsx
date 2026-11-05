"use client";

// Boundary paling luar (layout ikut gagal): wajib merender <html>/<body> sendiri, dan token CSS situs
// belum tentu ada, jadi warnanya ditulis langsung.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, background: "#FFFFFF", color: "#161616", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }} role="alert">
          <div style={{ maxWidth: 420, textAlign: "center" }}>
            <h1 style={{ fontSize: 28, fontWeight: 500, margin: "0 0 8px" }}>Halaman Ini Tidak Dapat Dimuat</h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 16px" }}>
              Terjadi masalah saat memuat halaman. Coba muat ulang dalam beberapa saat.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                font: "inherit",
                fontWeight: 600,
                padding: "0 18px",
                height: 44,
                border: 0,
                borderRadius: 999,
                background: "#161616",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              Muat Ulang
            </button>
            {error.digest && <p style={{ fontSize: 12, marginTop: 12 }}>Kode: {error.digest}</p>}
          </div>
        </main>
      </body>
    </html>
  );
}
