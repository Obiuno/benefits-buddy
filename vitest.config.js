import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    environmentMatchGlobs: [["__tests__/unit/frontendtesting/**", "jsdom"]],
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
        "Backend/db/*.js",
        "Backend/middleware/auth.js",
        "Backend/models/userModel.js",
        "Backend/routes/authRoutes.js",
        "Backend/controllers/authControllers.js",
        "Backend/services/geminiAIServices.js",
      ],
    },
  },
});
