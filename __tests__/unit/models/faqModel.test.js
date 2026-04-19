/*
getAllFaqs
- returns array or objects
- "Failed to read FAQs: ", err
- each object has: question and answer
*/

import { vi, expect, beforeAll, describe, it } from "vitest";
import Faqs from "../../../Backend/models/faqModel";

describe("FAQ model", () => {
  let faqs;

  beforeAll(async () => {
    faqs = await Faqs.getAllFaqs();
  });

  it("loads faqs from YAML", async () => {
    // arrange, act, assert
    expect(Array.isArray(faqs)).toBe(true);
  });

  it("returns at least one faqs", async () => {
    // arrange, act, assert
    expect(faqs.length).toBeGreaterThan(0);
  });

  it("each faq has required feilds", async () => {
    // assert for each benefit
    faqs.forEach((f) => {
      expect(f).toHaveProperty("question");
      expect(f).toHaveProperty("answer");
    });
  });

  it("each faq to contain an array of only objects", async () => {
    // asser for each benefit
    faqs.forEach((f) => {
      expect(typeof f).toBe("object");
      expect(f).not.toBeNull();
    });
  });

  it.todo(
    "handles file read error - fix how test error handling - probs best just to make a separate file",
  );
});
