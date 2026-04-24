import { test, expect } from "@playwright/test";

const MOCK_FAQS = [
  {
    question: "Can I claim if I am working?",
    answer:
      "Yes, Universal Credit is designed to support people on low incomes, including those in work.",
    benefit_slug: "universal-credit",
    category: "eligibility",
    display_order: 1,
    active: true,
  },
  {
    question:
      "I have some money saved away. Does that mean I shouldn't bother?",
    answer:
      "Not at all. Many types of help don't look at your bank balance at all.",
    benefit_slug: null,
    category: null,
    display_order: 2,
    active: true,
  },
  {
    question: "This should be hidden",
    answer: "This FAQ is inactive",
    benefit_slug: null,
    category: null,
    display_order: 3,
    active: false,
  },
];

test.describe("info1.js", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/faqs", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_FAQS),
      });
    });

    await page.goto("/faq.html");
  });

  // ============================================================
  // loadFaqs()
  // ============================================================
  test.describe("loadFaqs()", () => {
    test("fetches from correct URL", async ({ page }) => {
      const requests = [];
      page.on("request", (req) => requests.push(req.url()));
      await page.reload();
      await page.waitForSelector(".faq-item");
      expect(requests.some((url) => url.includes("/api/faqs"))).toBe(true);
    });

    test("renders FAQs after fetch", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      const items = await page.locator(".faq-item").count();
      expect(items).toBe(2);
    });

    test("filters out inactive FAQs", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      const items = await page.locator(".faq-item").count();
      expect(items).toBe(2);
    });

    test("handles fetch error", async ({ page }) => {
      await page.route("/api/faqs", async (route) => {
        await route.fulfill({ status: 500 });
      });

      const errors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });

      await page.reload();
      await page.waitForTimeout(500);
      await expect(page.locator(".not-found")).toBeVisible();
    });
  });

  // ============================================================
  // renderFaqs()
  // ============================================================
  test.describe("renderFaqs()", () => {
    test("renders FAQ questions", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      await expect(page.locator(".faq-item").first()).toContainText(
        "Can I claim if I am working?",
      );
    });

    test("shows no results message when list is empty", async ({ page }) => {
      await page.route("/api/faqs", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
      });
      await page.reload();
      await page.waitForTimeout(500);
      await expect(page.locator(".not-found")).toBeVisible();
    });

    test("accordion starts closed", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      const firstItem = page.locator(".faq-item").first();
      await expect(firstItem).not.toHaveClass(/active/);
    });

    test("accordion opens on click", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      await page.locator(".faq-question").first().click();
      const firstItem = page.locator(".faq-item").first();
      await expect(firstItem).toHaveClass(/active/);
    });

    test("accordion sign changes to minus when open", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      await page.locator(".faq-question").first().click();
      const sign = page.locator(".faq-question span").first();
      await expect(sign).toContainText("−");
    });

    test("accordion sign changes back to plus when closed", async ({
      page,
    }) => {
      await page.waitForSelector(".faq-item");
      await page.locator(".faq-question").first().click();
      await page.locator(".faq-question").first().click();
      const sign = page.locator(".faq-question span").first();
      await expect(sign).toContainText("+");
    });
  });

  // ============================================================
  // highlightText()
  // ============================================================
  test.describe("highlightText()", () => {
    test("wraps matching keyword in mark tag", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      await page.fill(".search-box input", "working");
      await page.waitForTimeout(300);
      const html = await page.locator(".faq-list").innerHTML();
      expect(html).toContain("<mark>working</mark>");
    });

    test("returns same text if no keyword", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      const text = await page.locator(".faq-question").first().textContent();
      expect(text?.trim()).toContain("Can I claim if I am working?");
    });
  });

  // ============================================================
  // searchFaqs()
  // ============================================================
  test.describe("searchFaqs()", () => {
    test("filters by question text", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      await page.fill(".search-box input", "working");
      await page.waitForTimeout(300);
      const items = await page.locator(".faq-item").count();
      expect(items).toBe(1);
    });

    test("filters by answer text", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      await page.fill(".search-box input", "bank balance");
      await page.waitForTimeout(300);
      const items = await page.locator(".faq-item").count();
      expect(items).toBe(1);
    });

    test("filters by benefit_slug", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      await page.fill(".search-box input", "universal-credit");
      await page.waitForTimeout(300);
      const items = await page.locator(".faq-item").count();
      expect(items).toBe(1);
    });

    test("is case insensitive", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      await page.fill(".search-box input", "WORKING");
      await page.waitForTimeout(300);
      const items = await page.locator(".faq-item").count();
      expect(items).toBe(1);
    });

    test("shows no results if no match", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      await page.fill(".search-box input", "zzznomatch");
      await page.waitForTimeout(300);
      await expect(page.locator(".not-found")).toBeVisible();
    });

    test("search button triggers search", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      await page.fill(".search-box input", "working");
      await page.click(".search-box button");
      await page.waitForTimeout(300);
      const items = await page.locator(".faq-item").count();
      expect(items).toBe(1);
    });

    test("Enter key triggers search", async ({ page }) => {
      await page.waitForSelector(".faq-item");
      await page.fill(".search-box input", "working");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);
      const items = await page.locator(".faq-item").count();
      expect(items).toBe(1);
    });
  });
});
