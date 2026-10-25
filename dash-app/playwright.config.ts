import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseURL ?? "http://127.0.0.1:3100";
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    navigationTimeout: 60_000,
    actionTimeout: 15_000,
  },
  // Server-rendered pages stream in; allow a little more headroom than the
  // 5s default so a cold production render is not reported as a failure.
  expect: { timeout: 10_000 },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Local machines use the installed Google Chrome; CI installs
        // Playwright's pinned Chromium.
        channel: isCI ? undefined : "chrome",
      },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: isCI
          ? "npm run build && npm run start -- --port 3100"
          : "npm run dev -- --port 3100",
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 180_000,
      },
});
