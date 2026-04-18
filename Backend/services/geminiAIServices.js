import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
/*
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { stringify } from "node:querystring";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const benefitsFile = fs.readFileSync(
  path.join(__dirname, "../data/benefits.yml"),
  "utf8",
);
const benefitsTest = yaml.load(benefitsFile);

const glossaryFile = fs.readFileSync(
  path.join(__dirname, "../data/glossary.yml"),
  "utf8",s
);
const glossaryTest = yaml.load(glossaryFile);

const user_input = "I am 65 and earn and I am struggling to afford my bills";
*/
// AI testing

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function generateAIResponse(chat, benefitsData, glossaryData) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      config: {
        responseMimeType: "application/json",
        systemInstruction: `
        You are a helpful and friendly assistant helping users understand UK government benefits.
        - Match the user's situation to relevant benefits 
        - Explain eligibility clearly
        - List required documents 
        - Explain how to apply 
        - Include warnings about common pitfalls or mistakes to avoid when applying.
        - when suggesting benefits only use ones from the list of benefits shared with you

        CRITICAL OUTPUT RULES:
        - never return the shared data directly 
        - only return teh JSON structure above
        - the shared data  is your reference, not your output
        - your output is your reasoning based on the shared data

        { 
        "message": "str",
        "benefits_suggested": [array], "glossary_terms": [array],
        "next_question": "str",
        "your_reasoning": "give me your reason for keys, formatsm fields and why you arranged the JSON like this, this part is for developer understanding",
        "feedback": "give the developer any feedback they could use to make this more effective for the chatbot and suggest changes they could do"
        }
        Available benefits data: ${JSON.stringify(benefitsData, null, 2)}
        Available glossary data: ${JSON.stringify(glossaryData, null, 2)}
        Suggest at most 5 benefits
        Use simple clear language
         
        `,
      },
      contents: chat.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });
    console.log("Response: ", result.text);
    return JSON.parse(result.text);
  } catch (err) {
    console.error("SDK error: ", err);
  }
}

export default generateAIResponse;
