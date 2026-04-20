/*
GET /api/faqs
- 200 -> returns array
*/
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../Backend/app.js";

describe("FAQs routes", () => {
  let res;

  beforeAll(async () => {
    res = await request(app).get("/api/faqs");
  });

  // arrange, act, assert
  it("GET /api/faqs returns 200", async () => {
    //const res = await request(app).get("api/faqs");
    expect(res.status).toBe(200);
  });

  it("GET /api/faqs returns array", async () => {
    //const res = await request(app).get("api/faqs");
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/faqs returns at least one faq", async () => {
    //const res = await request(app).get("api/faqs");
    expect(res.body.length).toBeGreaterThan(0);
  });
});
