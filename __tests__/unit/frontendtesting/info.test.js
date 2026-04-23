/**
 * @vitest-environment jsdom
 */
import { renderDOM } from "../helper.js";
import { describe, it, expect, beforeEach, vi } from "vitest";

let document;

const getByText = (document, text) => {
  return [...document.querySelectorAll("*")].find((el) =>
    el.textContent?.includes(text),
  );
};

describe("faq.html", () => {
  beforeEach(async () => {
    document = await renderDOM("./Frontend/faq.html");
  });

  it("has a navbar with navigation links", () => {
    expect(getByText(document, "Home")).toBeTruthy();
    expect(getByText(document, "Chat with Buddy")).toBeTruthy();
    expect(getByText(document, "Help Center")).toBeTruthy();
    expect(getByText(document, "Browse Benefits")).toBeTruthy();
    expect(getByText(document, "About Us")).toBeTruthy();
  });

  it("displays hero title", () => {
    expect(getByText(document, "How can we help")).toBeTruthy();
  });

  it("has a search input", () => {
    const input = document.querySelector(".search-box input");
    expect(input).toBeTruthy();
    expect(input.placeholder).toContain("Search");
  });

  it("displays FAQ section title", () => {
    expect(getByText(document, "Frequently Asked Questions")).toBeTruthy();
  });

  it("has multiple FAQ items", () => {
    const items = document.querySelectorAll(".faq-item");
    expect(items.length).toBeGreaterThan(0);
  });

  it("each FAQ item has a question and answer", () => {
    const items = document.querySelectorAll(".faq-item");

    items.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      expect(question).toBeTruthy();
      expect(answer).toBeTruthy();
    });
  });

  it("contains expected FAQ content", () => {
    expect(getByText(document, "What are benefits")).toBeTruthy();
    expect(getByText(document, "Universal Credit")).toBeTruthy();
  });

  it("has feedback buttons", () => {
    const buttons = document.querySelectorAll(".feedback-buttons button");
    expect(buttons.length).toBe(2);

    const text = [...buttons].map((b) => b.textContent);
    expect(text).toContain("Yes");
    expect(text).toContain("No");
  });

  it("has feedback message area", () => {
    const msg = document.querySelector("#feedbackMessage");
    expect(msg).toBeTruthy();
  });
  //onclick
  it("Sends a thank you message when clicked yes", () => {
    const button = document.querySelector("");
  });
});
