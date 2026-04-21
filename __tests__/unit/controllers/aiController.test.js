/*
aiChat:
- console.error("Error talking to Benefits Buddy: ", err);
    res.status(500).send({ error: err.message });
*/

import { describe, it, expect, beforeAll, vi, afterEach } from "vitest";
vi.mock("../../../Backend/services/aiServices.js", () => ({
  default: vi.fn(),
}));

import request from "supertest";
import app from "../../../Backend/app";
import generateAIResponse from "../../../Backend/services/aiServices.js";

describe("AI controller", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 500 error", async () => {
    generateAIResponse.mockRejectedValueOnce(new Error("Failed to load"));

    const res = await request(app)
      .post("/api/ai/chat")
      .send([
        {
          role: "user",
          content: "can you help me test?",
          timestamp: new Date().toISOString(),
        },
      ]);
    expect(res.status).toBe(500);
  });

  it("logs error when model throws error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    generateAIResponse.mockRejectedValueOnce(new Error("Failed to load"));

    await request(app)
      .post("/api/ai/chat")
      .send([
        {
          role: "user",
          content: "can you help me test?",
          timestamp: new Date().toISOString(),
        },
      ]);

    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error talking to Benefits Buddy: ",
      expect.any(Error),
    );
    vi.resetAllMocks();
  });
});
