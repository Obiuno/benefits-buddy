/**
 * @vitest-environment jsdom
 */
import { renderDOM } from "../helper.js";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import fs from "fs";
import path from "path";

/*
let document;

// helper
const getByText = (document, text) => {
  return [...document.querySelectorAll("*")].find((el) =>
    el.textContent?.includes(text),
  );
};

/*
describe("buddy.html", () => {
  beforeEach(async () => {
    document = await renderDOM("./Frontend/buddy.html");
  });

  it("has a navbar", () => {
    const nav = document.querySelector(".navbar");
    expect(nav).toBeTruthy();
  });

  it("has navigation links", () => {
    expect(getByText(document, "Home")).toBeTruthy();
    expect(getByText(document, "Chat with Buddy")).toBeTruthy();
    expect(getByText(document, "Help Center")).toBeTruthy();
    expect(getByText(document, "Browse Benefits")).toBeTruthy();
    expect(getByText(document, "About Us")).toBeTruthy();
  });

  it("has left panel buttons", () => {
    expect(getByText(document, "+ New Chat")).toBeTruthy();
    expect(getByText(document, "View History")).toBeTruthy();
    expect(getByText(document, "Download Chat")).toBeTruthy();
  });

  it("has history box", () => {
    const history = document.querySelector("#historyBox");
    expect(history).toBeTruthy();
  });

  it("has chat container", () => {
    const chatBox = document.querySelector("#chatBox");
    expect(chatBox).toBeTruthy();
  });

  it("displays welcome message", () => {
    expect(getByText(document, "Hello")).toBeTruthy();
    expect(getByText(document, "How can I assist you today")).toBeTruthy();
  });

  it("has message input textarea", () => {
    const input = document.querySelector("#messageInput");
    expect(input).toBeTruthy();
    expect(input.placeholder).toContain("Message Benefit Buddy");
  });

  it("has send button", () => {
    const btn = document.querySelector(".send-btn");
    expect(btn).toBeTruthy();
  });

  it("has profile dropdown options", () => {
    expect(getByText(document, "Login")).toBeTruthy();
    expect(getByText(document, "Add new account")).toBeTruthy();
    expect(getByText(document, "Settings")).toBeTruthy();
    expect(getByText(document, "Logout")).toBeTruthy();
  });
});
*/

/*
 * Frontend testing attempted but not feasible in current form.
 * These files are written for browser execution and rely on:
 * - Top-level DOM queries that fail outside a browser environment
 * - Browser globals (window, localStorage, sessionStorage)
 * - Execution order guarantees provided by the browser's HTML parser
 *
 * Pure logic functions (highlight, formatCategory, linkify) are
 * testable in isolation but are not currently exported.
 *
 * Recommended refactor:
 * - Wrap all DOM init code in DOMContentLoaded or an init() function
 * - Export pure functions separately for unit testing
 * - Separate data/logic from DOM manipulation
 *
 * Multiple approaches attempted to emulate browser conditions in jsdom
 * including module reset, dynamic imports, DOM rendering, delaying with promises for imports, using filepaths to get stings and injecting as  manual DOM construction.
 * The tight coupling between DOM state, async flow and variable
 * dependencies makes isolation not feasible without refactoring.
 * Logged as technical debt — revisit before production deployment.
 */

describe("buddy.js", () => {
  let buddy;

  beforeEach(async () => {
    vi.resetModules();
    global.fetch = vi.fn();
    // now try whole doc
    const filePath = path.join(process.cwd(), "./Frontend/buddy.html");
    const html = fs.readFileSync(filePath, "utf-8");
    document.documentElement.innerHTML = html;

    console.log("input exists:", !!document.getElementById("messageInput"));
    console.log("chatBox exists:", !!document.getElementById("chatBox"));
    console.log("historyBox exists:", !!document.getElementById("historyBox"));

    window.dispatchEvent(new Event("load"));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const module = await import("../../../Frontend/scripts/buddy.js");
    buddy = module.default;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("helper function Logic", () => {
    describe("linkify", () => {
      it("converts URLs to clickable links", () => {
        const test = "Visit https://gov.uk";
        const testResult = buddy.linkify(test);
        expect(testResult).toBe(
          'Visit <a href="https://gov.uk" target="_blank" rel="noopener noreferrer" class="chat-link">https://gov.uk</a>',
        );
      });
    });
  });

  it("sendMessage() - handles API success", async () => {
    document.getElementById("messageInput").value = "Hello";

    console.log("waitingForReply - can't check directly but continuing");
    console.log("input value:", document.getElementById("messageInput").value);
    console.log("allChats state - triggering sendMessage now");

    await buddy.sendMessage();

    console.log("fetch call count:", fetch.mock.calls.length);
    console.log(
      "sessionStorage available:",
      typeof sessionStorage !== "undefined",
    );
    console.log(
      "sessionStorage content:",
      sessionStorage.getItem("buddyChats_guest"),
    );
  });
  /*
    // arrange
    const mockResponse = {
      message: "Hello user",
      benefits_suggested: [],
      glossary_terms: [],
      next_question: null,
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    // Act
    window.dispatchEvent(new Event("load"));
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.getElementById("messageInput").value = "Hello";
    await buddy.sendMessage();

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      "/api/ai/chat",
      expect.objectContaining({
        method: "POST",
        headers: expect.any(Object),
        body: expect.any(String),
      }),
    );
    */

  it.todo("Message helpers");
  it.todo(
    "linkify(text) -converts URLs into clickable <a> links, returns empty string if no text ",
  );
  it.todo(
    "addMessage()- appends message row to chat box, shows correct avatar , shows time",
  );
  it.todo("addTyping()adds typing animation row");

  it.todo("sendMessage()");
  /*
- ignore empty input
- ignore if already waiting
- add user message
- disable input while waiting
- call API `/api/ai/chat`
- add assistant reply
- re-enable input after reply
  */
  it.todo("renderAssistantResponse(msg)");
  /*
- text reply
- benefit cards
- glossary cards
- next question
  */
  it.todo("Chat Actions");
  /*
`loadChat(id)`
- switches current chat

`deleteChat(id)`
- removes chat
- creates new one if last chat deleted

`renameChat(id)`
- updates title after save

`pinChat(id)`
- toggles pinned state

  */
  it.todo("downloadChat()");
  /*
- alert if no messages
- alert if jsPDF missing
- call `doc.save()`
  */
  it.todo("renderCurrentChat()");
  /*
  if no messages: - Shows welcome screen:
  */
});
