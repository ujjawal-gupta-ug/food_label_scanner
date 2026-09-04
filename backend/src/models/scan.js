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
    imageName: { type: String, required: true },
    imagePath: { type: String, required: true },
    imageType: { type: String, required: true },
    imageSize: { type: Number, required: true },
    imageUrl: { type: String, required: true },

    // dedup keys — this is what kills duplicate entries
    imageHash: { type: String, index: true }, // exact same photo re-uploaded
    productKey: { type: String, index: true }, // normalized "brand|name", same product via a different photo

    extractedText: { type: String, default: "" },

    product: {
      name: { type: String, default: "Scanned Product" },
      brand: { type: String, default: "NutriScan" },
      category: { type: String, default: "Food Product" },
    },

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

    healthTip: { detail: { type: String, default: "" } },
    recommendation: {
      title: { type: String, default: "" },
      detail: { type: String, default: "" },
    },

    // left undefined (not null) when absent, so the sparse index below works correctly
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

scanSchema.index({ createdAt: -1 });

// One entry per user per product — re-scanning the same item updates this
// instead of inserting a new document. Sparse so anonymous scans (no userId)
// don't get forced into this constraint.
scanSchema.index({ userId: 1, productKey: 1 }, { unique: true, sparse: true });

scanSchema.pre("save", function () {
  if (!this.isModified("score")) return;
  if (this.score >= 60) this.tone = "good";
  else if (this.score >= 40) this.tone = "average";
  else this.tone = "attention";
});

const Scan = mongoose.model("Scan", scanSchema);

export default Scan;
