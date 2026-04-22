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

  /**
   *
   * @returns {Promise<z.infer<typeof BenefitYAMLSchema>[]>}
   */
  static async getAllBenefits() {
    try {
      const benefitsFile = fs.readFileSync(
        path.join(__dirname, "../data/benefits.yml"),
        "utf8",
      );
      const benefitsData = yaml.load(benefitsFile);
      //console.log("raw data", JSON.stringify(benefitsData.benefits, null, 2));

      console.log("Schema:", BenefitYAMLSchema);

      return benefitsData.benefits
        .sort((a, b) => (a.display_order || 99) - (b.display_order || 99))
        .map((i) => {
          const validated = BenefitYAMLSchema.parse(i);
          return new Benefits(validated);
        });
    } catch (err) {
      console.error("Failed to load Benefits: ", err);
      throw err; // rethrow so errorHandler catches it
    }
  }
}

export default Benefits;
