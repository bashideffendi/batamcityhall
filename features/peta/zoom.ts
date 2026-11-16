// Batas zoom peta kerja (features/peta/PetaKerja.tsx). Angka zoom MapLibre (tile 512 px) = zoom Leaflet situs lama
// (tile 256 px) dikurangi 1, jadi skala di layar sama persis dengan hujandibatam.
export const MIN_ZOOM = 6;
/** Dikunci: lebih dari ini citra radar (1 km per piksel) mulai pecah. Mode kamera menaikkannya sendiri. */
export const MAX_ZOOM = 11;
