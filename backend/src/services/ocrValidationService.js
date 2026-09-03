const validateOCRText = (text) => {
  const cleaned = text.replace(/\\s+/g, " ").trim();

  // Very little text
  if (cleaned.length < 30) {
    return {
      valid: false,
      reason:
        "Could not read the label. Please upload a clearer image of the food package.",
    };
  }

  // Food-label keywords
  const keywords = [
    "ingredient",
    "ingredients",
    "nutrition",
    "nutritional",
    "calories",
    "protein",
    "fat",
    "sugar",
    "sodium",
    "carbohydrate",
    "energy",
    "vitamin",
  ];

  const lower = cleaned.toLowerCase();

  const foundKeywords = keywords.filter((k) => lower.includes(k));

  console.log("OCR KEYWORDS FOUND:", foundKeywords);

  if (foundKeywords.length < 2) {
    return {
      valid: false,
      reason:
        "No readable food label detected. Please capture the ingredients or nutrition panel clearly.",
    };
  }

  return {
    valid: true,
    foundKeywords,
  };
};

export default validateOCRText;
