import Faqs from "../models/faqModel.js";

/**
 * @swagger
 * /api/faqs:
 *  get:
 *    description: Fetches FAQ data frp, the knowledgebase, filtered by active status and sorted by display order
 *    responses:
 *      200:
 * Get all active FAQs
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faqs.getAllFaqs();
    res.status(200).send(faqs);
  } catch (err) {
    console.error("Error fetching FAQs: ", err);
    res.status(500).send({ error: err.message });
  }
};

export default { getAllFaqs };
