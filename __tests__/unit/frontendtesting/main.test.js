/**
 * @vitest-environment jsdom
 */
import { renderDOM } from "../helper.js";
import { describe, it, expect, beforeEach } from "vitest";

let document;

// helper
const getLinkByText = (document, text) => {
  return [...document.querySelectorAll("a")].find((a) =>
    a.textContent.includes(text),
  );
};

describe("main.html links working correctly", () => {
  beforeEach(async () => {
    document = await renderDOM("./Frontend/main.html");
  });

  it("Chat with Buddy nav button links correctly", () => {
    const link = getLinkByText(document, "Chat with Buddy");

    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toContain("buddy.html");
  });

  it("Help Center nav button links correctly", () => {
    const link = getLinkByText(document, "Help Center");

    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toContain("info.html");
  });

  it("Browse Benefits nav button links correctly", () => {
    const link = getLinkByText(document, "Browse Benefits");

    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toContain("benefits.html");
  });

  it("About Us nav button links correctly", () => {
    const link = getLinkByText(document, "About Us");

    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toContain("About.html");
  });

  it("displays 4 feature cards", () => {
    const cards = document.querySelectorAll(".feature-card");
    expect(cards.length).toBe(4);
  });

  it("feature cards contain correct text", () => {
    const cards = document.querySelectorAll(".feature-card");
    const text = [...cards].map((c) => c.textContent);

    expect(text.join("")).toContain("Smart Guidance");
    expect(text.join("")).toContain("Quick Answers");
  });

  it("has profile dropdown options", () => {
    const dropdown = document.querySelector(".profile-dropdown");
    expect(dropdown).toBeTruthy();

    const links = dropdown.querySelectorAll("a");
    expect(links.length).toBeGreaterThan(0);
  });
});
