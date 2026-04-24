import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "npm start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
  reporter: [
    ["monocart-reporter", {
      name: "Benefits Buddy E2E Coverage",
      outputFile: "./coverage/e2e/index.html",
      coverage: {
        entryFilter: (entry) => entry.url.includes("Frontend"),
        sourceFilter: (sourcePath) => sourcePath.includes("Frontend/scripts"),
      }
    }]
  ],
});
