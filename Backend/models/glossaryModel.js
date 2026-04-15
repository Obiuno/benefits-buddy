import db from "../db/connect.js";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Glossary {
  /**
   * Represents an glossary item from the database
   * @constructor glossary
   * @param {Object} glossary - the row object from the glossary table
   * @param {number} [glossary.glossary_id] - PK (auto incremented)
   * @param {string} glossary.term - the glossary term to be defined
   * @param {string} glossary.definition
   * @param {JSON} [glossary.related_benefits] - the benefits that reference this glossary item
   * @param {boolean} [glossary.active=true] - active toggle
   */
  constructor(item) {
    this.id = item.glossary_id ?? 99;
    this.term = item.term ?? "placement term";
    this.definition = item.definition ?? "placement def.";
    this.related_benefits = item.related_benefits ?? ["test 1", "test 2"];
    this.active = item.active ?? true;
  }
  /**Get all glossary items from the glossary.yml
   * @static
   * @async
   * @returns {Promise<Faqs[]>} A promise that resolves to an array of glossary item instances
   */
  static async getAllGlossaryItems() {
    try {
      const glossaryFile = fs.readFileSync(
        path.join(__dirname, "../data/glossary.yml"),
        "utf8",
      );
      const glossaryData = yaml.load(glossaryFile);
      console.log("raw data", JSON.stringify(glossaryData.glossary, null, 2));
      return (
        glossaryData.glossary
          // .filter((i) => i.active) // no active in file version
          .sort((a, b) => (a.display_order || 99) - (b.display_order || 99))
          .map((i) => new Glossary(i))
          .filter((i) => i.active)
      );
    } catch (err) {
      console.error("Failed to read Glossary: ", err);
    }
  }
}

export default Glossary;
