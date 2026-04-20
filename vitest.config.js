import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      GEMINI_API_KEY: "test-fake-k3y-n0t-r3@l",
      OPENAI_API_KEY: "test-fake-k3y-n0t-r3@l",
      NODE_ENV: "test",
    },
    include: ["__tests__/**/*.js"],
    coverage: {
      provider: "v8",
      include: ["Backend/**/*.js"],
      exclude: [
        "Backend/index.js",
        "Backend/db/setup-db.js",
        "Backend/db/index.js",
        "Backend/middleware/*.js",
        "Backend/models/userModel.js",
        "Backend/routes/authRoutes.js",
        "Backend/controller/authController.js",
        "Backend/services/geminiAIServices.js",
      ],
    },
  },
});
