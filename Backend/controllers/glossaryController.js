import Glossary from "../models/glossaryModel.js";

/**
 * Get all active FAQs
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getAllGlossaryItems = async (req, res) => {
  try {
    const glossaryItems = await Glossary.getGlossaryFromDB();
    res.status(200).send(glossaryItems);
  } catch (err) {
    console.error("Error fetching Glossary items: ", err);
    res.status(500).send({ error: err.message });
  }
};

export default { getAllGlossaryItems };
