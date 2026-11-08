import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const ROOT = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  // Next menyediakan "server-only" sendiri saat build. Di tes cukup modul kosong.
  resolve: {
    alias: [
      { find: /^@\//, replacement: ROOT },
      { find: /^server-only$/, replacement: `${ROOT}node_modules/next/dist/compiled/server-only/empty.js` },
    ],
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
});
