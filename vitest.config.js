import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/**/*.js"],
    coverage: {
      provider: "v8",
      include: ["Backend/**/*.js"],
      exclude: [
        "Backend/index.js",
        "Backend/db/setup-db.js",
        "Backend/de/index.js",
      ],
    },
  },
});
