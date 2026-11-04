/* Pengganti service worker batam-bites: hapus cache, arahkan tab yang terbuka ke situs baru, lepas diri.
   Tab /saved tidak dipindah di sini: saved.html harus membaca favorit di domain lama dulu. */
const BARU = "https://DOMAIN-BARU";

function tujuan(path) {
  if (path === "/" || path === "") return "/makan";
  if (/^\/(tempat|jalur|peta|daftar|kategori)(\/|$)/.test(path)) return "/makan" + path;
  if (/^\/about\/?$/.test(path)) return "/makan/tentang";
  return "/makan";
}

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const kunci = await caches.keys();
      await Promise.all(kunci.map((k) => caches.delete(k)));
      await self.clients.claim();
      const tab = await self.clients.matchAll({ type: "window" });
      await Promise.all(
        tab.map((c) => {
          const lama = new URL(c.url);
          const arah = /^\/saved/.test(lama.pathname) ? lama.href : BARU + tujuan(lama.pathname) + lama.search;
          return c.navigate(arah).catch(() => {});
        }),
      );
      await self.registration.unregister();
    })(),
  );
});
