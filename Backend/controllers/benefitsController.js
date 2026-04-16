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

const getBenefitsForFrontend = async (req, res) => {
  try {
    const rawBenefits = await Benefits.getAllBenefits();

    const shapedBenefits = rawBenefits.map((benefit) => {
      // 1. Destructure the top-level fields from the benefit record
      // 2. Destructure the nested fields from the 'details' JSONB column
      const { name, category, description, slug, urls, details } = benefit;

      // Destructure only what the frontend needs from details
      const {
        is_legacy_replacement,
        eligibility,
        documents_required,
        gotchas,
        preparation_tips,
        related_benefits,
        questions_to_ask,
      } = details;

      return {
        name,
        category,
        description,
        // Dynamically generate the image path
        //image: `Images/${slug}.jpg`,
        urls: {
          apply_url: urls.apply_url,
        },
        // Mapping 'details' to 'learn_more'
        learn_more: {
          is_legacy_replacement,
          eligibility,
          documents_required,
          gotchas,
          preparation_tips,
          related_benefits,
          questions_to_ask,
          gov_url: urls.gov_url,
        },
      };
    });
    res.status(200).send(shapedBenefits);
  } catch (error) {
    console.error("Error shapping benefit: ", err);
    res.status(500).send({ error: err.message });
  }
};

export default { getAllBenefits, getBenefitsForFrontend };
