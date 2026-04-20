/*
GET /api/benefits
- 200 returns array
GET /api/benefits/frontend
- 200 returns array
*/

import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../Backend/app.js";

describe("Benefits routes", () => {
  let res;

  beforeAll(async () => {
    res = await request(app).get("/api/benefits");
  });

  // arrange, act, assert
  it("GET /api/benefits returns 200", async () => {
    //const res = await request(app).get("/api/benefits");
    expect(res.status).toBe(200);
  });

  it("GET /api/benefits returns array", async () => {
    //const res = await request(app).get("/api/benefits");
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/benefits returns at least one benefit", async () => {
    //const res = await request(app).get("/api/benefits");
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("Benefirs frontend routes", () => {
  let res;

  beforeAll(async () => {
    res = await request(app).get("/api/benefits/frontend");
  });

  // arrange, act, assert
  it("GET /api/benefits/frontend returns 200", async () => {
    //const res = await request(app).get("/api/benefits/frontend");
    expect(res.status).toBe(200);
  });

  it("GET /api/benefits/frontend returns array", async () => {
    //const res = await request(app).get("/api/benefits/frontend");
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/benefits/frontend returns at least one benefit", async () => {
    //const res = await request(app).get("/api/benefits/frontend");
    expect(res.body.length).toBeGreaterThan(0);
  });

  it.todo("changes shape for frontend (removes the developer_meta)");
  it.todo(
    "creates imgURL - uses protocl and host from request to make baseURL, uses benefit.slug to get the img endpoint",
  );
  it.todo("moves gov_url into details");
  it.todo("adds self plug to questions (consider having this somewhere else)");
});
