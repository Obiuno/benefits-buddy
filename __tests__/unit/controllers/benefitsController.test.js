/*
getAllBenefits
- returns beneftis array of objects
- console.error("Error fetching each benefit: ", err);
    res.status(500).send({ error: err.message })

getBenefitsForFrontend
- changes shape for frontend (removes the developer_meta)
- creates imgURL - uses protocl and host from request to make baseURL, uses benefit.slug to get the img endpoint
- moves gov_url into details
- adds self plug to questions (consider having this somewhere else)
- console.error("Error shapping benefit: ", err);
    res.status(500).send({ error: err.message })
*/
/**
 * happy path tests are all done by the routes anywa, I will use this to focus on error handling
 */
import { describe, it, expect, beforeAll, vi, afterEach } from "vitest";

vi.mock("../../../Backend/models/benefitsModel.js", () => ({
  default: {
    getAllBenefits: vi.fn(),
  },
}));

import request from "supertest";
import app from "../../../Backend/app.js";
import Benefits from "../../../Backend/models/benefitsModel.js";

// need to nock teh model to throw an error

describe("Benefits controller", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 500 error", async () => {
    Benefits.getAllBenefits.mockRejectedValueOnce(new Error("Failed to load"));

    const res = await request(app).get("/api/benefits");

    expect(res.status).toBe(500);
  });

  it("logs error when model throws error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    Benefits.getAllBenefits.mockRejectedValueOnce(new Error("Failed to load"));

    await request(app).get("/api/benefits");

    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching each benefit: ",
      expect.any(Error),
    );
    vi.restoreAllMocks();
  });
});

describe("Frontend Beneftis controller", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 500 error", async () => {
    Benefits.getAllBenefits.mockRejectedValueOnce(new Error("Failed to load"));

    const res = await request(app).get("/api/benefits/frontend");
    expect(res.status).toBe(500);
  });

  it("logs error when model throws error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    Benefits.getAllBenefits.mockRejectedValueOnce(new Error("Failed to load"));

    await request(app).get("/api/benefits/frontend");

    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error shapping benefit: ",
      expect.any(Error),
    );
    vi.restoreAllMocks();
  });
  it.todo("need to check for image url and shamelesss plug additions done in controller")
});
