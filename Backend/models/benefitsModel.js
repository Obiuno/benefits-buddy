import db from "../db/connect.js";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { stringify } from "node:querystring";
import { BenefitYAMLSchema } from "../schemas/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Benefits {
  /**
   * Represents a benefit and its details
   * @constructor
   * @param {z.infer<typeof BenefitYAMLSchema>}
   */
  constructor(benefit) {
    this.id = benefit.benefits_id ?? 999;
    this.slug = benefit.slug ?? "no_slug_name";
    this.name = benefit.name ?? "unknown name";
    this.description = benefit.description ?? "no description available";
    this.category = benefit.category;
    this.urls = benefit.urls;
    this.details = benefit.details;
    this.active = benefit.active ?? true;
  }

  /**Get all benefit from benefits.yml
   * @static
   * @async
   * @returns {Promise<Faqs[]>} A promise that resolves to an array of glossary item instances
   */
  static async getAllBenefits() {
    try {
      const benefitsFile = fs.readFileSync(
        path.join(__dirname, "../data/benefits.yml"),
        "utf8",
      );
      const benefitsData = yaml.load(benefitsFile);
      //console.log("raw data", JSON.stringify(benefitsData.benefits, null, 2));

      return benefitsData.benefits
        .sort((a, b) => (a.display_order || 99) - (b.display_order || 99))
        .map((i) => new Benefits(i));
    } catch (err) {
      console.error("Failed to load Benefits: ", err);
    }
  }
}

export default Benefits;
