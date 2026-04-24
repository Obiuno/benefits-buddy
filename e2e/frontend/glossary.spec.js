// e2e/frontend/glossary.spec.js
import { test, expect } from "@playwright/test";

const MOCK_GLOSSARY = [
  {
    glossary_slug: "universal_credit",
    term: "Universal Credit",
    definition: "A benefit for people on a low income or out of work.",
    related_benefits: [],
    active: true,
  },
  {
    glossary_slug: "assessment_period",
    term: "Assessment Period",
    definition:
      "A monthly period starting on the day you first make your Universal Credit claim.",
    related_benefits: [],
    active: true,
  },
  {
    glossary_slug: "benefit_cap",
    term: "Benefit Cap",
    definition: "A limit on the total amount of benefits you can get.",
    related_benefits: [],
    active: true,
  },
  {
    glossary_slug: "housing_benefit",
    term: "Housing Benefit",
    definition:
      "A benefit to help with rent payments for people on a low income.",
    related_benefits: [],
    active: true,
  },
];

test.describe("glossary.js", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/glossary", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_GLOSSARY),
      });
    });

    await page.goto("/glossary.html");
    await page.waitForSelector(".term-card");
  });

  // ============================================================
  // Initial DOM Setup
  // ============================================================
  test.describe("Initial DOM Setup", () => {
    test("creates 26 alphabet buttons", async ({ page }) => {
      const buttons = await page.locator(".letters button").count();
      expect(buttons).toBe(26);
    });

    test("appends no results message to terms box", async ({ page }) => {
      const notFound = page
        .locator("#terms p")
        .filter({ hasText: "No results found." });
      await expect(notFound).toBeAttached();
    });
  });

  // ============================================================
  // loadGlossary()
  // ============================================================
  test.describe("loadGlossary()", () => {
    test("fetches from correct URL", async ({ page }) => {
      const requests = [];
      page.on("request", (req) => requests.push(req.url()));
      await page.reload();
      await page.waitForSelector(".term-card");
      expect(requests.some((url) => url.includes("/api/glossary"))).toBe(true);
    });

    test("renders terms after fetch", async ({ page }) => {
      const cards = await page.locator(".term-card").count();
      expect(cards).toBe(4);
    });

    test("handles fetch failure gracefully", async ({ page }) => {
      await page.route("/api/glossary", async (route) => {
        await route.fulfill({ status: 500 });
      });

      await page.reload();
      await page.waitForTimeout(500);
      await expect(page.locator(".not-found")).toBeVisible();
    });
  });

  // ============================================================
  // filterTerms()
  // ============================================================
  test.describe("filterTerms()", () => {
    test("filters by selected letter", async ({ page }) => {
      await page.locator(".letters button").filter({ hasText: "U" }).click();
      await page.waitForTimeout(300);
      const cards = await page.locator(".term-card").count();
      expect(cards).toBe(1);
      await expect(page.locator(".term-card").first()).toContainText(
        "Universal Credit",
      );
    });

    test("filters by search text", async ({ page }) => {
      await page.fill("#searchInput", "credit");
      await page.waitForTimeout(300);
      const cards = await page.locator(".term-card").count();
      expect(cards).toBe(2); // Universal Credit + Assessment Period (mentions UC)
    });

    test("combines letter and search filter", async ({ page }) => {
      await page.fill("#searchInput", "credit");
      await page.locator(".letters button").filter({ hasText: "U" }).click();

      await page.waitForTimeout(300);
      const cards = await page.locator(".term-card").count();
      expect(cards).toBe(1);
      await expect(page.locator(".term-card").first()).toContainText(
        "Universal Credit",
      );
    });

    test("is case insensitive", async ({ page }) => {
      await page.fill("#searchInput", "CREDIT");
      await page.waitForTimeout(300);
      const cards = await page.locator(".term-card").count();
      expect(cards).toBeGreaterThan(0);
    });

    test("trims spaces", async ({ page }) => {
      await page.fill("#searchInput", " credit ");
      await page.waitForTimeout(300);
      const cards = await page.locator(".term-card").count();
      expect(cards).toBeGreaterThan(0);
    });

    test("shows no results when nothing matches", async ({ page }) => {
      await page.fill("#searchInput", "zzznomatch");
      await page.waitForTimeout(300);
      await expect(
        page.locator("#terms p").filter({ hasText: "No results found." }),
      ).toBeVisible();
    });
  });

  // ============================================================
  // Search Input Events
  // ============================================================
  test.describe("Search Input Events", () => {
    test("typing in search clears active letter", async ({ page }) => {
      await page.locator(".letters button").filter({ hasText: "U" }).click();
      await expect(
        page.locator(".letters button").filter({ hasText: "U" }),
      ).toHaveClass(/active/);

      await page.fill("#searchInput", "credit");
      await page.waitForTimeout(300);

      await expect(
        page.locator(".letters button").filter({ hasText: "U" }),
      ).not.toHaveClass(/active/);
    });

    test("typing triggers filterTerms", async ({ page }) => {
      await page.fill("#searchInput", "housing");
      await page.waitForTimeout(300);
      const cards = await page.locator(".term-card").count();
      expect(cards).toBe(1);
    });

    test("pressing Enter triggers filterTerms", async ({ page }) => {
      await page.fill("#searchInput", "housing");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);
      const cards = await page.locator(".term-card").count();
      expect(cards).toBe(1);
    });
  });

  // ============================================================
  // submitFeedback()
  // ============================================================
  test.describe("submitFeedback()", () => {
    test("Yes shows thank you message", async ({ page }) => {
      await page.evaluate(() => submitFeedback("Yes"));
      const message = page.locator("#feedbackMessage");
      await expect(message).toContainText("Thank you for your feedback!");
    });

    test("No shows improvement message", async ({ page }) => {
      await page.evaluate(() => submitFeedback("No"));
      const message = page.locator("#feedbackMessage");
      await expect(message).toContainText(
        "Please let us know what can be improved",
      );
    });

    test("No redirects after 2 seconds", async ({ page }) => {
      await page.evaluate(() => submitFeedback("No"));
      await page.waitForTimeout(2200);
      expect(page.url()).toContain("About.html");
    });
  });
});
