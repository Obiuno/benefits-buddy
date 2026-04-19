/*
getAllGLossaryItems
- returns array or objects
- "Failed to read Glossary: ", err
- each object has: slug, term and defn
*/

import { vi, expect, beforeAll, describe, it } from "vitest";
import Glossary from "../../../Backend/models/glossaryModel";

describe("Glossary model", () => {
  let glossaryItems;

  beforeAll(async () => {
    glossaryItems = await Glossary.getAllGlossaryItems();
  });

  it("loads glossary items from YAML", async () => {
    // arrange, act, assert
    expect(Array.isArray(glossaryItems)).toBe(true);
  });

  it("returns at least one glossary item", async () => {
    // arrange, act, assert
    expect(glossaryItems.length).toBeGreaterThan(0);
  });

  it("each glossary item has required feilds", async () => {
    // assert for each benefit
    glossaryItems.forEach((g) => {
      expect(g).toHaveProperty("slug");
      expect(g).toHaveProperty("term");
      expect(g).toHaveProperty("definition");
    });
  });

  it("each glossary item to contain an array of only objects", async () => {
    // asser for each benefit
    glossaryItems.forEach((g) => {
      expect(typeof g).toBe("object");
      expect(g).not.toBeNull();
    });
  });

  it.todo(
    "handles file read error - fix how test error handling - probs best just to make a separate file",
  );
});
