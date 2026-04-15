import db from "../database/connect.js";

class Faqs {
  constructor(faq) {
    this.question = faq.question;
    this.answer = faq.answer;
    this.benefit_slug = faq.benefit_slug;
    this.category = faq.category;
    this.display_order = faq.display_order;
    this.active = faq.active;
  }
}
