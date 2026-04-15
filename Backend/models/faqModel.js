import db from "../database/connect.js";

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
    this.id = faq.faqs_id;
    this.question = faq.question;
    this.answer = faq.answer;
    this.benefit_slug = faq.benefit_slug;
    this.category = faq.category;
    this.display_order = faq.display_order ?? 0;
    this.active = faq.active ?? true;
  }
  /**Get all FAQs from the faq.yml
   * @static
   * @async
   * @returns {Promise<Faqs[]>} A promise that resolves to an array of FAQ instances
   */
  static async getAllFaqs() {
    return;
  }
}
