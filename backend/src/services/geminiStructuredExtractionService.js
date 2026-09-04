import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const extractStructuredData = async (ocrText, knownIngredients = []) => {
  const knownBlock =
    knownIngredients.length > 0
      ? `
  These ingredients are ALREADY KNOWN from a shared dictionary — reuse their
  risk, description and assessment EXACTLY as given below instead of
  re-analyzing them. Only research/analyze ingredients that are NOT in this list.

  KNOWN INGREDIENTS:
  ${JSON.stringify(knownIngredients, null, 2)}
  `
      : "";

  const prompt = `
  You are an expert Indian food-label parser and nutrition analyst.

  The text comes from OCR and may contain noise, broken lines, spelling mistakes, and incomplete formatting.
  ${knownBlock}
  Your task is to:
  1. Extract structured food-label information.
  2. Analyze the product from a health perspective.
  3. Return ONLY valid JSON.

  Return ONLY this JSON structure:

  {
    "product": {
      "name": null,
      "brand": null,
      "category": null
    },

    "score": 0,
    "rating": "",
    "explanation": "",

    "factors": [
      {
        "label": "",
        "value": "",
        "tone": "good"
      }
    ],

    "good": [],
    "watchOut": [],

    "ingredients": [
      {
        "name": "",
        "risk": "safe",
        "description": "",
        "assessment": ""
      }
    ],

    "nutrition": [
      {
        "label": "",
        "value": "",
        "warning": false
      }
    ],

    "healthImpacts": [
    {
      "key": "bloodSugar",
      "icon": "bloodSugar",
      "title": "Blood Sugar",
      "impact": "low",
      "description": "",
      "reasons": []
    },
    {
      "key": "bloodPressure",
      "icon": "bloodPressure",
      "title": "Blood Pressure",
      "impact": "low",
      "description": "",
      "reasons": []
    },
    {
      "key": "weight",
      "icon": "weight",
      "title": "Weight Management",
      "impact": "low",
      "description": "",
      "reasons": []
    },
    {
      "key": "heart",
      "icon": "heart",
      "title": "Heart Health",
      "impact": "low",
      "description": "",
      "reasons": []
    },
    {
      "key": "dental",
      "icon": "dental",
      "title": "Dental Health",
      "impact": "low",
      "description": "",
      "reasons": []
    }
  ],

  "healthTip": {
    "detail": ""
  },

"recommendation": {
    "recommendation": {
      "title": "",
      "detail": ""
    }
  }

  Rules:
  - Convert percentages into strings with units if present.
  - Keep INS / E-numbers exactly as written.
  - If a value is not found, use null.
  - healthScore must be an integer between 0 and 100.
  - rating should be one of:
    - "Healthy Choice"
    - "Moderate Choice"
    - "Occasional Choice"
    - "Poor Choice"
  - good should contain positive nutritional observations.
  - watchOut should contain ingredients or nutrition concerns (high sugar, high sodium, palm oil, artificial flavour, etc.).
  - recommendation.title should be a short action-oriented heading.
  - recommendation.detail should be 1-2 simple consumer-friendly sentences.
  - Return ONLY raw JSON without markdown, comments, or explanation.
  - healthImpacts must contain exactly these 5 health areas:bloodSugar, bloodPressure, weight, heart, dental.
  - impact must be exactly one of:"low", "moderate", "high".
  - Assess health impacts ONLY from the available ingredients and nutrition information.
  - Blood Sugar:Consider total sugar, added sugar and carbohydrate content.
  - Blood Pressure:Consider sodium/salt content.
  - Weight Management:
    Consider calories, sugar, fat and overall energy density.
  - Heart Health:
    Consider saturated fat, trans fat, sodium and beneficial nutrients such as fiber.
  - Dental Health:
    Consider sugar and other ingredients that may contribute to dental concerns.
  - description should be a simple consumer-friendly explanation of the possible impact.
  - reasons should contain short evidence-based reasons such as
    "High sugar: 18g/100g" or "Low sodium: 120mg/100g".
  - Do NOT diagnose, treat, or claim that a product causes a disease.
    Use cautious language such as "may contribute to", "may be a concern for",
    or "may have a higher impact".
  - If the required nutrition value is unavailable, do not invent a number.
    Use the available ingredients and nutrition information only.
  - healthTip should provide one simple healthy-eating tip based on the product.

  OCR TEXT:
  ${ocrText}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  console.log("RAW GEMINI RESPONSE:");
  console.log(response.text);

  const cleaned = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini returned invalid JSON:");
    console.error(cleaned);

    throw new Error("AI returned invalid JSON response");
  }
};

export default extractStructuredData;
