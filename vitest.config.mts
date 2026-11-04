import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const ROOT = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  resolve: { alias: [{ find: /^@\//, replacement: ROOT }] },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
});
