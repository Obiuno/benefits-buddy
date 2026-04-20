/*
getAllGlossaryItems
- returns array of objects
- console.error("Error fetching Glossary items: ", err);
    res.status(500).send({ error: err.message });
*/
/**
 * happy path tests are all done by the routes anywa, I will use this to focus on error handling
 */
import { describe, it, expect, beforeAll, vi, afterEach } from "vitest";

vi.mock("../../../Backend/models/glossaryModel.js", () => ({
  default: {
    getAllGlossaryItems: vi.fn(),
  },
}));

import request from "supertest";
import app from "../../../Backend/app.js";
import Glossary from "../../../Backend/models/glossaryModel.js";

// need to nock teh model to throw an error

describe("Glossary controller", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 500 error", async () => {
    Glossary.getAllGlossaryItems.mockRejectedValueOnce(
      new Error("Failed to load"),
    );

    const res = await request(app).get("/api/glossary");

    expect(res.status).toBe(500);
  });

  it("logs error when model throws error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    Glossary.getAllGlossaryItems.mockRejectedValueOnce(
      new Error("Failed to load"),
    );

    await request(app).get("/api/glossary");

    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching Glossary items: ",
      expect.any(Error),
    );
    vi.restoreAllMocks();
  });

  it("logs error when model throws");
});
