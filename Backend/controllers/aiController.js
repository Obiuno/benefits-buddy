import generateAIResponse from "../services/aiServices.js";
import Benefits from "../models/benefitsModel.js";
import Glossary from "../models/glossaryModel.js";

const aiChat = async (req, res) => {
  try {
    const { messages } = req.body;

    const glossaryData = await Glossary.getAllGlossaryItems();
    const benefitsData = await Benefits.getAllBenefits();
    console.log("message recieved:", messages);
    console.log("messages type:", typeof messages);

    const response = await generateAIResponse(
      messages,
      benefitsData,
      glossaryData,
    );
    console.log("🟥 this is the response shape: ", response);

    const { your_reasoning, feedback, ...frontendResponse } = response;

    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString,
        resoning: your_reasoning,
        feedback,
      }),
    );

    res.status(200).send(frontendResponse);
  } catch (err) {
    console.error("Error talking to Benefits Buddy: ", err);
    res.status(500).send({ error: err.message });
  }
};

export default { aiChat };
