import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 30000,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4179",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    launchOptions: { args: ["--enable-unsafe-swiftshader"] },
  },
  webServer: {
    command: "npm run preview -- --port 4179",
    url: "http://127.0.0.1:4179",
    reuseExistingServer: !process.env.CI,
  },
});
