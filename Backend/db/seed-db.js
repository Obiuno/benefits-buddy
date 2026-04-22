import db from "./connect.js";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//benefits data
async function seedBenefitsData() {
  const benefitsFile = fs.readFileSync(
    path.join(__dirname, "../data/benefits.yml"),
    "utf8",
  );

  const benefitsData = yaml.load(benefitsFile);

  for (const benefit of benefitsData.benefits) {
    await db.query(
      `INSERT INTO benefits (slug, name, description, category, urls, details, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO NOTHING`,
      [
        benefit.slug,
        benefit.name,
        benefit.description,
        JSON.stringify(benefit.category),
        JSON.stringify(benefit.urls),
        JSON.stringify(benefit.details),
        benefit.active ?? true,
      ],
    );
  }

  console.log("Benefits seeded");
}

async function seedFaqsData() {
  const faqsFile = fs.readFileSync(
    path.join(__dirname, "../data/faqs.yml"),
    "utf8",
  );

  const faqsData = yaml.load(faqsFile);

  for (const faq of faqsData.faqs) {
    await db.query(
      `INSERT INTO faqs (question, answer, benefit_slug, category, display_order, active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      [
        faq.question,
        faq.answer,
        faq.benefit_slug,
        JSON.stringify(faq.category ?? []),
        faq.display_order,
        faq.active ?? true,
      ],
    );
  }

  console.log("FAQs seeded");
}

async function seedGlossaryData() {
  const glossaryFile = fs.readFileSync(
    path.join(__dirname, "../data/glossary.yml"),
    "utf8",
  );

  const glossaryData = yaml.load(glossaryFile);

  for (const item of glossaryData.glossary) {
    await db.query(
      `INSERT INTO glossary (slug, term, definition, related_benefits, active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      [
        item.glossary_slug,
        item.term,
        item.definition,
        JSON.stringify(item.related_benefits ?? []),
        item.active ?? true,
      ],
    );
  }

  console.log("Glossary seeded");
}
