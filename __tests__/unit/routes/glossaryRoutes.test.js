/*
GET /api/glossary
- 200 -> returns array
*/
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../Backend/app.js";

describe("Glossary routes", () => {
  let res;

  beforeAll(async () => {
    res = await request(app).get("/api/glossary");
  });

  // arrange, act, assert
  it("GET /api/glossary returns 200", async () => {
    //const res = await request(app).get("api/faqs");
    expect(res.status).toBe(200);
  });

  it("GET /api/glossary returns array", async () => {
    //const res = await request(app).get("api/faqs");
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/glossary returns at least one gossary item", async () => {
    //const res = await request(app).get("api/faqs");
    expect(res.body.length).toBeGreaterThan(0);
  });
});
