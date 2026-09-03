import extractIngredients from "./extractIngredients.js";
//import extractNutrition from "./extractNutrition.js";

const extractLabelData = (text) => {
  return {
    ingredients: extractIngredients(text),

    //nutrition: extractNutrition(text),
  };
};

export default extractLabelData;
