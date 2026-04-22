import db from "../db/connect.js";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { GlossaryYAMLSchema, GlossarySchema } from "../schemas/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Glossary {
  /**
   * Represents a glossary item
   * @constructor
   * @param {z.infer<typeof GlossaryYAMLSchema>} item
   */
  constructor(item) {
    this.id = item.glossary_id ?? 999;
    this.term = item.term;
    this.definition = item.definition;
    this.related_benefits = item.related_benefits ?? [];
    this.active = item.active ?? true;
    this.slug = item.glossary_slug;
  }

  /**
   *
   * @returns {Promise<z.infer<typeof GlossaryYAMLSchema>[]>}
   */
  static async getAllGlossaryItems() {
    try {
      const file = fs.readFileSync(
        path.join(__dirname, "../data/glossary.yml"),
        "utf8",
      );
      const data = yaml.load(file);

      return data.glossary
        .map((i) => GlossaryYAMLSchema.parse(i)) // Zod validates each item
        .filter((i) => i.active)
        .sort((a, b) => (a.display_order || 99) - (b.display_order || 99))
        .map((i) => {
          const validated = GlossaryYAMLSchema.parse(i);
          return new Glossary(validated);
        });
    } catch (err) {
      console.error("Failed to load Glossary:", err);
      throw err; // rethrow so errorHandler catches it
    }
  }

  static async getGlossaryFromDB() {
    try {
      const { rows } = await db.query(
        "SELECT glossary_id, slug AS glossary_slug, term, definition, related_benefits, active FROM glossary WHERE active = true",
      );

      return rows.map((i) => {
        const validated = GlossarySchema.parse(i);
        return new Glossary(validated);
      });
    } catch (err) {
      console.error("❌Failed to load Glossary from DB: ", err.message);
      throw err;
    }
  }
}

export default Glossary;
