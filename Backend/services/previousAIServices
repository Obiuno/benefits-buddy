import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import {
  ChatRequestSchema,
  GlossaryYAMLSchema,
  BenefitYAMLSchema,
  AIResponseSchema,
} from "../schemas/index.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// remember to verify it using AIResponseSchema after you get a retrun
/**
 *
 * @param {z.infer<typeof ChatRequestSchema} chat
 * @param {z.infer<typeof BenefitYAMLSchema} benefitsData
 * @param {z.infer<typeof GlossaryYAMLSchema} glossaryData
 * @returns
 */
async function generateAIResponse(chat, benefitsData, glossaryData) {
  const userMessageCount = chat.filter((m) => m.role === "user").length;

  const response = await openai.responses.parse({
    model: "gpt-4.1-mini",
    instructions: `
You are a helpful and friendly UK benefits assistant helping users understand UK government benefits.

ANSWER ROUTE:
- Match the user's situation to relevant benefits
- Explain eligibility clearly for the specific user query
- List all required documents
- Explain how to apply in detail including links to strictly official information and application pages
- Include any relevant information from the benefits data below
- Include warnings about common pitfalls or mistakes to avoid when applying

EVERY REPLY MUST:
- Be formatted in a reassuring, friendly and calm tone — try to destress the user
- When necessary ask ONE narrowing question at the end of the response to better understand their situation
- Later responses should be based on the user's answers to these narrowing questions
- Only suggest benefits from the list of benefits shared with you

CONVERSATION STAGE:
This is user message number ${userMessageCount}.
${
  userMessageCount < 2
    ? "- Ask ONE clarifying question only. Do NOT populate benefits_suggested or glossary_terms yet. Return empty arrays."
    : "- You may suggest benefits if you have enough context. If you need more information ask one more question first."
}

EXAMPLE USER JOURNEY:
User: "I'm struggling with rent after losing my job, do I qualify for anything?"
Response step 1: Ask narrowing questions about savings, children, partner, rent/mortgage, disability, employment status
Response step 2: Once likely match found, explain why they qualify and follow the answer route above
End with asking if they have more questions or if their situation is different in any way that might affect eligibility

DO NOT make up anything — keep strictly to the benefits data below
DO NOT EVER add lines like "If you want I can guide you on how to check eligibility or apply based on your specific circumstances"

CRITICAL OUTPUT RULES:
- Never return the shared data directly
- Only return the JSON structure defined
- The shared data is your reference not your output
- Your output is your reasoning based on the shared data

Available benefits data:
${JSON.stringify(benefitsData, null, 2)}

Available glossary data:
${JSON.stringify(glossaryData, null, 2)}

Suggest at most 5 benefits.
Use simple clear language.
`,
    input: chat.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    text: {
      format: zodTextFormat(AIResponseSchema, "benefits_response"),
    },
  });
  const result = response.output_parsed;
  // developed logs

  if (result.developer_meta) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        reasoning: result.developer_meta.reasoning,
        feedback: result.developer_meta.feedback,
      }),
    );
  }

  return result;
}

export default generateAIResponse;
