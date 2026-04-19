/*
getAllBenefits
- returns array or objects
- "Failed to load Benefits: ", err
- each object has: slug, name and description
- each benefit should have to URLs
- each benefit should have non-empty detials
*/

import { vi, describe, it, expect, beforeAll } from "vitest";
import Benefits from "../../../Backend/models/benefitsModel.js";

describe("Benefits Model", () => {
  let benefits;

  beforeAll(async () => {
    benefits = await Benefits.getAllBenefits();
  });

  it("loads benneftis from YAML", async () => {
    // arrange, act, assert
    expect(Array.isArray(benefits)).toBe(true);
  });

  it("returns at least one benefit", async () => {
    // arrange, act, assert
    expect(benefits.length).toBeGreaterThan(0);
  });

  it("each benefit has required feilds", async () => {
    // assert for each benefit
    benefits.forEach((b) => {
      expect(b).toHaveProperty("name");
      expect(b).toHaveProperty("slug");
      expect(b).toHaveProperty("description");
    });
  });

  it("each benefit to contain an array of only objects", async () => {
    // asser for each benefit
    benefits.forEach((b) => {
      expect(typeof b).toBe("object");
      expect(b).not.toBeNull();
    });
  });

  it("each benefit has URL property with gov_url and apply_url", async () => {
    benefits.forEach((b) => {
      expect(b).toHaveProperty("urls");
      expect(b.urls).toHaveProperty("gov_url");
      expect(b.urls).toHaveProperty("apply_url");
      expect(b.urls.gov_url).toBeTruthy();
      expect(b.urls.apply_url).toBeTruthy();
    });
  });

  it("each beenfit has non-empty details", async () => {
    benefits.forEach((b) => {
      expect(b).toHaveProperty("details");
      expect(Object.keys(b.details).length).toBeGreaterThan(0);
    });
  });

  it.todo(
    "handles file read error - fix how test error handling - probs best just to make a separate file",
  );
  /*
    await vi.isolateModules(async () => {
      vi.mock("fs", () => ({
        readFileSync: vi.fn(() => {
          throw new Error("File not found");
        }),
      }));

      const { default: Benefits } =
        await import("../../../Backend/models/benefitsModel.js");
    });

    await expect(Benefits.getAllBenefits()).rejects.toThrow();
    */
});
