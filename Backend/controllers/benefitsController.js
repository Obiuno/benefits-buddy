import Benefits from "../models/benefitsModel.js";

/**
 * Get all active Benefits
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getAllBenefits = async (req, res) => {
  try {
    const benefits = await Benefits.getAllBenefits();
    res.status(200).send(benefits);
  } catch (err) {
    console.error("Error fetching each benefit: ", err);
    res.status(500).send({ error: err.message });
  }
};

export default { getAllBenefits };
