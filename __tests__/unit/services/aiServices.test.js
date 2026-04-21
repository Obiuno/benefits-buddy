/*
generateAIResponse
- called with arguments
- returns parsed JSON object
- handles malformed JSON or doesn't accept it due to zod
- fallback response when API fials
*/

import { describe, it, expect, vi, afterEach } from "vitest";

const { mockOpenAIParse } = vi.hoisted(() => {
  const mockOpenAIParse = vi.fn();
  return { mockOpenAIParse };
});

vi.mock("openai", () => {
  return {
    default: class OpenAI {
      constructor() {
        this.responses = {
          parse: mockOpenAIParse,
        };
      }
    },
  };
});

vi.mock("openai/helpers/zod", () => ({
  zodTextFormat: vi.fn().mockReturnValue({ type: "json_schema" }),
}));

import generateAIResponse from "../../../Backend/services/aiServices.js";

const mockChat = [
  { role: "user", content: "do I qualify for universal credit?" },
];
const mockBenefits = [{ name: "Universal Credit", slug: "universal-credit" }];
const mockGlossary = [{ term: "means-tested", definition: "based on income" }];

const mockParsedResponse = {
  message: "You may qualify",
  benefits_suggested: [
    {
      name: "Universal Credit",
      slug: "universal_credit",
      reason: "unemployed",
      gov_url: "https://gov.uk",
    },
  ],
  glossary_terms: ["means_tested"],
  next_question: "Do you have savings?",
  developer_meta: { reasoning: "test", feedback: "good" },
};

describe("AI services", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns parsed outputs from openAI response", async () => {
    mockOpenAIParse.mockResolvedValueOnce({
      output_parsed: mockParsedResponse,
    });

    const result = await generateAIResponse(
      mockChat,
      mockBenefits,
      mockGlossary,
    );

    expect(result).toEqual(mockParsedResponse);
  });

  it("calls openai with correct model and input", async () => {
    mockOpenAIParse.mockResolvedValueOnce({
      output_parsed: mockParsedResponse,
    });

    await generateAIResponse(mockChat, mockBenefits, mockGlossary);

    expect(mockOpenAIParse).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-4.1-mini",
        input: [
          { role: "user", content: "do I qualify for universal credit?" },
        ],
      }),
    );
  });
  it.todo(
    "fallback response when API fails - currently unreachable due to Zod",
  );
  it.todo(
    "handles malformed JSON - handled by Zod structured outputs on OpenAI side",
  );

  it("developer_meta logging", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    mockOpenAIParse.mockResolvedValueOnce({
      output_parsed: mockParsedResponse,
    });

    const result = await generateAIResponse(
      mockChat,
      mockBenefits,
      mockGlossary,
    );

    expect(consoleSpy).toHaveBeenCalled(
      expect.stringContaining('"reasoning": "test"') &&
        expect.stringContaining('"feedback": "good"'),
    );
  });
});
