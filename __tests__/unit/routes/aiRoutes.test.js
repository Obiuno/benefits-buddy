/*
POST /api/ai/chat
- without body-> 400
- without messages -> 400
- with empty array from beenfits or glossary -> 400 
*/

import { describe, it, expect, beforeAll, vi, afterAll } from "vitest";
import request from "supertest";

// need to move aiService.js
vi.mock("../../../Backend/services/aiServices.js", () => ({
  default: vi.fn().mockResolvedValue({
    message: "I am a helpful asssitant giving you information about benefits",
    benefits_suggested: [
      {
        name: "Benefit 1",
        slug: "benefit_1",
        reason: "you are in your situation and this is helpful",
        gov_url: "https://www.gov.uk/benefit-1",
      },
    ],
    glossary_terms: ["item_1"],
    next_question: "do you have any savings?",
    developer_meta: {
      reasoning: "test reasoning",
      feedback: "keep on keeping on",
    },
  }),
}));

import app from "../../../Backend/app";

describe("AI routes", () => {
  let response;
  let parsed;
  let consoleSpy;

  beforeAll(async () => {
    consoleSpy = vi.spyOn(console, "log");
    response = await request(app)
      .post("/api/ai/chat")
      .send({
        messages: [
          {
            role: "user",
            content: "I am unemployed",
          },
        ],
      });
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("POST /api/ai/chat returns 200", () => {
    expect(response.status).toBe(200);
  });

  it("has correct shape", () => {
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("benefits_suggested");
    expect(Array.isArray(response.body.benefits_suggested)).toBe(true);
    expect(response.body.benefits_suggested[0]).toHaveProperty("name");
    expect(response.body.benefits_suggested[0]).toHaveProperty("slug");
    expect(response.body.benefits_suggested[0]).toHaveProperty("reason");
    expect(response.body.benefits_suggested[0]).toHaveProperty("gov_url");
    expect(response.body).toHaveProperty("glossary_terms");
    expect(Array.isArray(response.body.glossary_terms)).toBe(true);
  });

  it("has developer_meta stripped", () => {
    expect(response.body).not.toHaveProperty("developer_meta");
  });

  it("logs developer meta", async () => {
    const devMetaCall = consoleSpy.mock.calls.find((call) => {
      try {
        const parsed = JSON.parse(call[0]);
        return parsed.reasoning !== undefined;
      } catch {
        return false;
      }
    });

    expect(devMetaCall).toBeDefined();

    const parsed = JSON.parse(devMetaCall[0]);
    expect(parsed).toHaveProperty("reasoning");
    expect(parsed).toHaveProperty("feedback");
    expect(parsed).toHaveProperty("timestamp");
  });

  it.todo("strips developer_meta before sending (your_reasoning, feedback)");
});
