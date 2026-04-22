import db from "../db/connect.js";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { FaqYAMLSchema, FaqSchema } from "../schemas/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Faqs {
  /**
   * Represents an FAQ record
   * @constructor
   * @param {z.infer<typeof FaqYAMLSchema>}
   */
  constructor(faq) {
    this.id = faq.faqs_id ?? 999;
    this.question = faq.question ?? "test question ?";
    this.answer = faq.answer ?? "test answer";
    this.benefit_slug = faq.benefit_slug ?? "bnefit slug";
    this.category = faq.category ?? ["category"];
    this.display_order = faq.display_order ?? 999;
    this.active = faq.active ?? true;
  }

  /**
   *
   * @returns {Promise<z.infer<typeof FaqYAMLSchema>[]>}
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
      //console.log("raw data", JSON.stringify(faqData.faqs, null, 2));

      console.log("Schema:", FaqYAMLSchema);
      return faqData.faqs
        .filter((f) => f.active !== false)
        .sort((a, b) => (a.display_order || 99) - (b.display_order || 99))
        .map((f) => {
          const validated = FaqYAMLSchema.parse(f);
          return new Faqs(validated);
        }); //would want to filer for active, sort based on display order
    } catch (err) {
      console.error("Failed to read FAQs: ", err.message);
      throw err; // rethrow so errorHandler catches it
    }
  }
  /**
   *
   * @returns {Promise<z.infer<typeof FaqSchema>[]>}
   */
  static async getFaqsFromDB() {
    try {
      const { rows } = await db.query("SELECT * FROM faqs WHERE active = true");

      return rows.map((i) => {
        const validated = FaqSchema.parse(i);
        return new Faqs(validated);
      });
    } catch (err) {
      console.error("❌Failed to load FAQs from DB: ", err.message);
      throw err;
    }
  }
}

export default Faqs;
