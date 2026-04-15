import db from "../db/connect.js";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Faqs {
  /**
   * Represents an FAQ record from the database
   * @constructor FAQs
   * @param {Object} faq - the row object from the faqs table
   * @param {number} [faq.faqs_id] - PK (auto incremented)
   * @param {string} faq.question - the FAQ question text
   * @param {string} faq.answer - the FAQ answer text
   * @param {string} faq.benefit_slug - FK referencing benefits(slug)
   * @param {string} [faq.category] - optional grouping category
   * @param {number} [faq.active=0] - Sorting prioirty
   * @param {boolean} [faq.active=true] - active toggle
   */
  constructor(faq) {
    this.id = faq.faqs_id ?? 999;
    this.question = faq.question ?? "test question ?";
    this.answer = faq.answer ?? "test answer";
    this.benefit_slug = faq.benefit_slug ?? "bnefit slug";
    this.category = faq.category ?? "category";
    this.display_order = faq.display_order ?? 0;
    this.active = faq.active ?? true;
  }
  /**Get all FAQs from the faq.yml
   * @static
   * @async
   * @returns {Promise<Faqs[]>} A promise that resolves to an array of FAQ instances
   */
  static async getAllFaqs() {
    try {
      //readfilesyn to read files
      // parse yaml to get each one
      //make into a Faqs class

      const faqFile = fs.readFileSync(
        path.join(__dirname, "../data/faqs.yml"),
        "utf8",
      );
      const faqData = yaml.load(faqFile);
      console.log("raw data", JSON.stringify(faqData.faqs, null, 2));
      return faqData.faqs
        .filter((f) => f.active)
        .sort((a, b) => (a.display_order || 99) - (b.display_order || 99))
        .map((f) => new Faqs(f)); //would want to filer for active, sort based on display order
    } catch (err) {
      console.error("Failed to read FAQs: ", err);
    }
  }
}

export default Faqs;
