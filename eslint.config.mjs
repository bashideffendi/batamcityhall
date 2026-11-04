import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // features/makan dan features/langit-laut/components masih kode lama yang belum di-port (fase 2).
  // Keluarkan dari sini, dan dari exclude tsconfig.json, begitu modulnya selesai dipindah.
  globalIgnores([".next/**", "out/**", "next-env.d.ts", "features/makan/**", "features/langit-laut/components/**", "research/**", "data/**"]),
]);
