/* Pengganti service worker hujandibatam: hapus semua cache, arahkan tab yang terbuka ke situs baru,
   lalu lepas diri supaya browser tidak lagi memakai service worker di domain ini. */
const TUJUAN = "https://DOMAIN-BARU/langit-laut";

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
          return c.navigate(TUJUAN + lama.search).catch(() => {});
        }),
      );
      await self.registration.unregister();
    })(),
  );
});
