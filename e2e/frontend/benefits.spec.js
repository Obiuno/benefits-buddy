import { test, expect } from "@playwright/test";

const MOCK_BENEFITS = [
  {
    name: "Universal Credit",
    slug: "universal-credit",
    description:
      "Help with living costs if you're on low income or out of work",
    category: ["income_support"],
    image: null,
    urls: { apply_url: "https://www.gov.uk/apply-universal-credit" },
    learn_more: {
      eligibility: {
        age_min: 18,
        age_max: 66,
        savings_threshold: 16000,
        residency: "habitual_residence",
      },
      documents_required: ["National Insurance number", "Bank account details"],
      gotchas: ["LISA counts toward savings threshold"],
      preparation_tips: ["Have last 3 payslips ready"],
      related_benefits: ["council_tax_reduction"],
      gov_url: "https://www.gov.uk/universal-credit",
    },
  },
  {
    name: "Child Benefit",
    slug: "child-benefit",
    description: "Monthly payments for bringing up a child",
    category: ["families_and_children"],
    image: null,
    urls: { apply_url: "https://www.gov.uk/child-benefit/how-to-claim" },
    learn_more: {
      eligibility: {},
      documents_required: ["Child's birth certificate"],
      gotchas: [],
      preparation_tips: [],
      related_benefits: [],
      gov_url: "https://www.gov.uk/child-benefit",
    },
  },
];

test.describe("benefits.js", () => {
  test.beforeEach(async ({ page }) => {
    //arrange
    await page.route("/api/benefits/frontend", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_BENEFITS),
      });
    });

    await page.goto("/buddy.html");

    await page.goto("/benefits.html");
  });

  /* =====================================================
   loadbenefits
===================================================== */

  test.describe("loadBenefits()", () => {
    test("fetches from correct URL", async ({ page }) => {
      // arrange
      const requests = [];
      page.on("request", (req) => requests.push(req.url()));

      // act
      await page.reload(); // need to reload to make it think it's a load
      await page.waitForSelector(".benefit-card");

      //assert
      expect(
        requests.some((url) => url.includes("/api/benefits/frontend")),
      ).toBe(true);
    });

    test("renders cards after fetch done", async ({ page }) => {
      // arraneg and act
      await page.waitForSelector(".benefit-card");
      const cards = await page.locator(".benefit-card").count();
      expect(cards).toBe(2);
    });

    test("handles fetch error", async ({ page }) => {
      await page.route("/api/benefits/frontend", async (route) => {
        await route.fulfill({ status: 500 });
      });

      const errors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });

      await page.reload();
      await page.waitForTimeout(500);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  /* =====================================================
   render benefits
===================================================== */

  test.describe("renderBenefits()", () => {
    test("renders benefit cards into #benefitGrid", async ({ page }) => {
      await page.waitForSelector("#benefitGrid .benefit-card");
      const cards = await page.locator("#benefitGrid .benefit-card").count();
      expect(cards).toBe(2);
    });

    test("shows no results message when list is empty", async ({ page }) => {
      await page.route("/api/benefits/frontend", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
      });
      await page.reload();
      await page.waitForTimeout(500);
      const noResult = page.locator("#noResult");
      await expect(noResult).toBeVisible();
    });

    test("hides no results when list has data", async ({ page }) => {
      //act
      await page.waitForSelector(".benefit-card");
      const noResult = page.locator("#noResult");
      // assert
      await expect(noResult).toBeHidden();
    });

    test("shows benefit name and description", async ({ page }) => {
      await page.waitForSelector(".benefit-card");
      await expect(page.locator(".benefit-card").first()).toContainText(
        "Universal Credit",
      );
      await expect(page.locator(".benefit-card").first()).toContainText(
        "Help with living costs",
      );
    });

    test("uses default image if no image provided", async ({ page }) => {
      await page.waitForSelector(".benefit-card");
      const src = await page
        .locator(".benefit-card img")
        .first()
        .getAttribute("src");
      expect(src).toBe("Images/default.jpg");
    });

    test("formats category correctly", async ({ page }) => {
      await page.waitForSelector(".benefit-card");
      const tag = await page.locator(".tag").first().textContent();
      expect(tag?.trim()).toBe("Income support");
    });
  });
});
