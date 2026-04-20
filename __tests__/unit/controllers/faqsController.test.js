/*
- returns array of objects
- console.error("Error fetching FAQs: ", err);
    res.status(500).send({ error: err.message });
*/
/**
 * happy path tests are all done by the routes anywa, I will use this to focus on error handling
 */
import { describe, it, expect, beforeAll, vi, afterEach } from "vitest";

vi.mock("../../../Backend/models/faqModel.js", () => ({
  default: {
    getAllFaqs: vi.fn(),
  },
}));

import request from "supertest";
import app from "../../../Backend/app.js";
import Faqs from "../../../Backend/models/faqModel.js";

// need to nock teh model to throw an error

describe("FAQs controller", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 500 error", async () => {
    Faqs.getAllFaqs.mockRejectedValueOnce(new Error("Failed to load"));

    const res = await request(app).get("/api/faqs");

    expect(res.status).toBe(500);
  });

  it("logs error when model throws error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    Faqs.getAllFaqs.mockRejectedValueOnce(new Error("Failed to load"));

    await request(app).get("/api/faqs");

    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching FAQs: ",
      expect.any(Error),
    );
    vi.restoreAllMocks();
  });

  it("logs error when model throws");
});
