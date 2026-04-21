import generateAIResponse from "../services/aiServices.js";
import Benefits from "../models/benefitsModel.js";
import Glossary from "../models/glossaryModel.js";

const aiChat = async (req, res) => {
  try {
    const { messages } = req.body;

    const glossaryData = await Glossary.getAllGlossaryItems();
    const benefitsData = await Benefits.getAllBenefits();
    //console.log("message recieved:", messages);
    //console.log("messages type:", typeof messages);

    const response = await generateAIResponse(
      messages,
      benefitsData,
      glossaryData,
    );
    //console.log("🟥 this is the response shape: ", response);

    const { developer_meta, ...frontendResponse } = response;

    if (response.developer_meta) {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          reasoning: developer_meta.reasoning,
          feedback: developer_meta.feedback,
          confidence: developer_meta.confidence,
          severity_category: developer_meta.severity_category,
          distress_category: developer_meta.distress_category,
          complexity_category: developer_meta.complexity_category,
          key_points: developer_meta.key_points,
        }),
      );
    }

    res.status(200).json(frontendResponse);
  } catch (err) {
    console.error("Error talking to Benefits Buddy: ", err);
    res.status(500).send({ error: err.message });
  }
};

export default { aiChat };
