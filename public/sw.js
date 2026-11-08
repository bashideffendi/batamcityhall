/* Service worker minimal untuk installability PWA, aman dari data basi:
   - Data realtime (API sendiri, tile peta, radar, BMKG, video CCTV): NETWORK-ONLY.
     Cross-origin tidak pernah disentuh sama sekali.
   - Aset statis Next (/_next/static/*, content-hashed = immutable): cache-first untuk offline
     shell, DIPANGKAS ke 60 entri (tiap deploy chunk-nya ganti; tanpa pangkas cache tumbuh terus).
   - Navigasi/HTML: network-first (update langsung terpakai), fallback cache saat offline. Disimpan di cache
     terpisah yang DIPANGKAS ke 40 halaman. Respons no-store/private tidak pernah disimpan.
   - /admin tidak pernah disentuh: halamannya memuat data moderasi dan tidak boleh tertinggal setelah keluar.
   Nama cache naik ke v2 supaya simpanan v1, yang mungkin memuat halaman admin, terhapus saat aktivasi. */
const SHELL = "bch-shell-v2";
const HALAMAN = "bch-halaman-v2";
const MAX_STATIC_ENTRIES = 60;
const MAX_HALAMAN = 40;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== HALAMAN).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Buang entri tertua (urutan keys() = urutan masuk) kalau melebihi batas.
async function trim(cache, max = MAX_STATIC_ENTRIES) {
  const keys = await cache.keys();
  const extra = keys.length - max;
  if (extra > 0) await Promise.all(keys.slice(0, extra).map((k) => cache.delete(k)));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  // Cross-origin (tile OFS, BMKG, CCTV) → biarkan browser menangani.
  if (url.origin !== self.location.origin) return;

  // 1) Data realtime, berkas peta, dan admin → selalu dari network, JANGAN di-cache.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/tiles/")) return;
  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) return;

  // 2) Aset statis Next yang content-hashed → cache-first (aman, immutable), dipangkas.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(SHELL).then((cache) =>
        cache.match(req).then(
          (hit) =>
            hit ||
            fetch(req).then((res) => {
              if (res.ok) {
                cache
                  .put(req, res.clone())
                  .then(() => trim(cache))
                  .catch(() => {});
              }
              return res;
            }),
        ),
      ),
    );
    return;
  }

  // 3) Navigasi + manifest/ikon → network-first, fallback cache (offline shell).
  const isShell =
    req.mode === "navigate" ||
    url.pathname === "/manifest.webmanifest" ||
    /\.(png|ico|svg|webmanifest)$/.test(url.pathname);
  if (!isShell) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && !/no-store|private/i.test(res.headers.get("cache-control") || "")) {
          const copy = res.clone();
          caches
            .open(HALAMAN)
            .then((cache) => cache.put(req, copy).then(() => trim(cache, MAX_HALAMAN)))
            .catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("/"))),
  );
});
