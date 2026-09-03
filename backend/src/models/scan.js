import mongoose from "mongoose";

const factorSchema = new mongoose.Schema(
  { label: String, value: String, tone: String },
  { _id: false },
);

const ingredientSchema = new mongoose.Schema(
  { name: String, risk: String, description: String, assessment: String },
  { _id: false },
);

const nutritionSchema = new mongoose.Schema(
  { label: String, value: String, warning: { type: Boolean, default: false } },
  { _id: false },
);

const healthImpactSchema = new mongoose.Schema(
  {
    key: String,
    icon: String,
    title: String,
    impact: String,
    description: String,
    reasons: { type: [String], default: [] },
  },
  { _id: false },
);

const scanSchema = new mongoose.Schema(
  {
    // Source image
    imageName: { type: String, required: true },
    imagePath: { type: String, required: true },
    imageType: { type: String, required: true },
    imageSize: { type: Number, required: true },
    imageUrl: { type: String, required: true },

    // Raw OCR text, kept for debugging / re-analysis
    extractedText: { type: String, default: "" },

    // Product identity
    product: {
      name: { type: String, default: "Scanned Product" },
      brand: { type: String, default: "NutriScan" },
      category: { type: String, default: "Food Product" },
    },

    // Top-level analysis result
    score: { type: Number, default: 0 },
    rating: { type: String, default: "Analysis Unavailable" },
    tone: {
      type: String,
      enum: ["good", "average", "attention"],
      default: "average",
    },
    explanation: { type: String, default: "" },

    factors: { type: [factorSchema], default: [] },
    good: { type: [String], default: [] },
    watchOut: { type: [String], default: [] },
    ingredients: { type: [ingredientSchema], default: [] },
    nutrition: { type: [nutritionSchema], default: [] },
    healthImpacts: { type: [healthImpactSchema], default: [] },

    healthTip: {
      detail: { type: String, default: "" },
    },
    recommendation: {
      title: { type: String, default: "" },
      detail: { type: String, default: "" },
    },

    // Optional: wire up once auth exists
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

// History list is sorted by recency — index it
scanSchema.index({ createdAt: -1 });

// Derive the "tone" bucket from score if it wasn't set explicitly
scanSchema.pre("save", function () {
  if (!this.isModified("score")) return;
  if (this.score >= 60) this.tone = "good";
  else if (this.score >= 40) this.tone = "average";
  else this.tone = "attention";
});

const Scan = mongoose.model("Scan", scanSchema);

export default Scan;
