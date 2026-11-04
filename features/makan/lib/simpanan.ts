// Nilai localStorage yang dibaca lewat useSyncExternalStore. Sisi server dan render pertama memakai
// nilai awal; React lalu menggantinya setelah hydration tanpa setState di dalam effect.
export function buatSimpanan<T>(kunci: string, awal: T, baca: (mentah: string | null) => T, tulis: (v: T) => string) {
  const pendengar = new Set<() => void>();
  let nilai: T | undefined;

  const muat = (): T => {
    try {
      return baca(localStorage.getItem(kunci));
    } catch {
      return awal;
    }
  };
  const kabari = () => pendengar.forEach((f) => f());
  // Tab lain mengubah nilai yang sama.
  const onStorage = (e: StorageEvent) => {
    if (e.key === kunci || e.key === null) {
      nilai = muat();
      kabari();
    }
  };

  return {
    langgan(f: () => void) {
      if (pendengar.size === 0) window.addEventListener("storage", onStorage);
      pendengar.add(f);
      return () => {
        pendengar.delete(f);
        if (pendengar.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
    ambil(): T {
      if (nilai === undefined) nilai = muat();
      return nilai;
    },
    ambilServer: (): T => awal,
    simpan(v: T) {
      nilai = v;
      try {
        localStorage.setItem(kunci, tulis(v));
      } catch {
        // Penyimpanan penuh atau diblokir: nilai tetap berlaku sampai halaman ditutup.
      }
      kabari();
    },
  };
}
