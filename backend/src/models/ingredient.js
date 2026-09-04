import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    nameKey: { type: String, required: true, unique: true, index: true },
    name: String,
    risk: String,
    description: String,
    assessment: String,
  },
  { timestamps: true },
);

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;
