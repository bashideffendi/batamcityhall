import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

// Tes jalan terhadap hasil build (`npm run build` dulu), bukan server dev.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  outputDir: "test-results",
  use: {
    baseURL: process.env.E2E_URL ?? `http://localhost:${PORT}`,
    // Mesin tanpa GPU tetap bisa menggambar WebGL lewat renderer perangkat lunak.
    launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] },
  },
  // E2E_URL: menguji server yang sudah jalan (mis. dev), tanpa next start.
  webServer: process.env.E2E_URL
    ? undefined
    : {
        command: `npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: true,
        timeout: 60_000,
      },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "hp", use: { ...devices["Pixel 7"] } },
  ],
});
