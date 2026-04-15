import Faqs from "../models/faqModel.js";

/**
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
