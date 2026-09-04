import uploadImage from "../services/imageUploadService.js";
import validateImage from "../services/imageValidationService.js";
import extractText from "../services/ocrService.js";
import extractStructuredData from "../services/geminiStructuredExtractionService.js";
import cleanOCRText from "../utils/textCleaner.js";
import validateOCRText from "../services/ocrValidationService.js";
import normalize from "../utils/normalize.js";
import hashImageFile from "../utils/hashImage.js";
import extractIngredientNames from "../utils/extractIngredientNames.js";
import Scan from "../models/scan.js";
import Ingredient from "../models/ingredient.js";

const formatScanResponse = (scan) => ({
  success: true,
  id: scan._id,
  product: {
    image: scan.imageUrl,
    name: scan.product?.name,
    brand: scan.product?.brand,
    category: scan.product?.category,
  },
  score: scan.score,
  rating: scan.rating,
  explanation: scan.explanation,
  factors: scan.factors,
  good: scan.good,
  watchOut: scan.watchOut,
  ingredients: scan.ingredients,
  nutrition: scan.nutrition,
  healthImpacts: scan.healthImpacts,
  healthTip: scan.healthTip,
  recommendation: scan.recommendation,
});

// Builds the global ingredient dictionary — each unique ingredient is
// upserted once and reused; Gemini's per-scan output keeps growing it.
const upsertIngredients = async (ingredients = []) => {
  await Promise.all(
    ingredients
      .filter((i) => i?.name)
      .map((i) =>
        Ingredient.findOneAndUpdate(
          { nameKey: normalize(i.name) },
          {
            $setOnInsert: { nameKey: normalize(i.name) },
            $set: {
              name: i.name,
              risk: i.risk,
              description: i.description,
              assessment: i.assessment,
            },
          },
          { upsert: true },
        ),
      ),
  );
};

const scanImage = async (req, res) => {
  try {
    // 1. Upload
    const imageData = await uploadImage(req.file);
    const userId = req.body?.userId || req.user?._id || undefined;

    // 2. Hash the raw upload BEFORE any processing — cheapest possible check
    const imageHash = hashImageFile(imageData.imagePath);

    // Pehle user ki purani searches check hongi — same user, same exact photo
    if (userId) {
      const ownHit = await Scan.findOne({ userId, imageHash });
      if (ownHit) return res.status(200).json(formatScanResponse(ownHit));
    }

    // Koi bhi (anonymous ho ya doosra user) already isi image ko scan kar chuka ho
    const globalHit = await Scan.findOne({ imageHash });
    if (globalHit) {
      // Reuse the analysis — no OCR/Gemini call needed. If this is a new
      // user, record it against them too (still dedup'd by productKey below).
      if (userId && String(globalHit.userId) !== String(userId)) {
        const cloned = await Scan.findOneAndUpdate(
          { userId, productKey: globalHit.productKey },
          {
            $setOnInsert: { userId, productKey: globalHit.productKey },
            $set: {
              imageName: imageData.imageName,
              imagePath: imageData.imagePath,
              imageType: imageData.imageType,
              imageSize: imageData.imageSize,
              imageUrl: globalHit.imageUrl,
              imageHash,
              extractedText: globalHit.extractedText,
              product: globalHit.product,
              score: globalHit.score,
              rating: globalHit.rating,
              explanation: globalHit.explanation,
              factors: globalHit.factors,
              good: globalHit.good,
              watchOut: globalHit.watchOut,
              ingredients: globalHit.ingredients,
              nutrition: globalHit.nutrition,
              healthImpacts: globalHit.healthImpacts,
              healthTip: globalHit.healthTip,
              recommendation: globalHit.recommendation,
            },
          },
          { upsert: true, new: true },
        );
        return res.status(200).json(formatScanResponse(cloned));
      }
      return res.status(200).json(formatScanResponse(globalHit));
    }

    // 3. Validate
    const validation = await validateImage(imageData.imagePath);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        stage: "image-validation",
        message: validation.reason,
      });
    }

    // 4. OCR
    const extractedText = await extractText(validation.correctedImagePath);
    const ocrCheck = validateOCRText(extractedText);
    if (!ocrCheck.valid) {
      return res.status(400).json({
        success: false,
        stage: "ocr-validation",
        message: ocrCheck.reason,
      });
    }

    // 5. Clean text, look up known ingredients, THEN call Gemini
    const cleanedText = cleanOCRText(extractedText);

    const candidateNames = extractIngredientNames(cleanedText);
    const candidateKeys = candidateNames.map(normalize);

    const knownDocs = candidateKeys.length
      ? await Ingredient.find({ nameKey: { $in: candidateKeys } }).lean()
      : [];

    const knownIngredients = knownDocs.map((d) => ({
      name: d.name,
      risk: d.risk,
      description: d.description,
      assessment: d.assessment,
    }));

    const structuredData = await extractStructuredData(cleanedText, knownIngredients);

    // 6. Grow the shared ingredient dictionary
    await upsertIngredients(structuredData.ingredients);

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/${imageData.imageName}`;

    const productKey = normalize(
      `${structuredData.product?.brand || "NutriScan"}|${structuredData.product?.name || "Scanned Product"}`,
    );

    const payload = {
      imageName: imageData.imageName,
      imagePath: imageData.imagePath,
      imageType: imageData.imageType,
      imageSize: imageData.imageSize,
      imageUrl,
      imageHash,
      productKey,
      extractedText: cleanedText,
      product: {
        name: structuredData.product?.name || "Scanned Product",
        brand: structuredData.product?.brand || "NutriScan",
        category: structuredData.product?.category || "Food Product",
      },
      score: structuredData.score || 0,
      rating: structuredData.rating || "Analysis Unavailable",
      explanation:
        structuredData.explanation ||
        "We could not generate a detailed analysis for this product.",
      factors: structuredData.factors || [],
      good: structuredData.good || [],
      watchOut: structuredData.watchOut || [],
      ingredients: structuredData.ingredients || [],
      nutrition: structuredData.nutrition || [],
      healthImpacts: structuredData.healthImpacts || [],
      healthTip: structuredData.healthTip || {
        detail: "Choose products based on their overall nutrition and ingredient profile.",
      },
      recommendation: structuredData.recommendation || {
        title: "Try scanning again",
        detail: "A clearer image may provide a more accurate nutritional analysis.",
      },
    };

    // 7. Persist — upsert per (userId, productKey) so re-scans of the same
    // product (even via a different photo) update one document, not create a new one.
    const scan = userId
      ? await Scan.findOneAndUpdate(
          { userId, productKey },
          { $setOnInsert: { userId, productKey }, $set: payload },
          { upsert: true, new: true },
        )
      : await Scan.create(payload);

    res.status(200).json(formatScanResponse(scan));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message?.includes("503")
        ? "AI service is temporarily busy. Please try again in a few seconds."
        : error.message || "Something went wrong while analyzing the image.",
    });
  }
};

// GET /api/scans — optional ?userId= to see just one user's search history
const getScans = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const filter = req.query.userId ? { userId: req.query.userId } : {};

    const [scans, total] = await Promise.all([
      Scan.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("product score rating tone imageUrl createdAt")
        .lean(),
      Scan.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      page,
      total,
      scans: scans.map((s) => ({
        id: s._id,
        image: s.imageUrl,
        name: s.product?.name,
        brand: s.product?.brand,
        category: s.product?.category,
        date: s.createdAt,
        score: s.score,
        status: s.rating,
        tone: s.tone,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not load scan history." });
  }
};

const getScanById = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id).lean();
    if (!scan) {
      return res.status(404).json({ success: false, message: "Scan not found." });
    }
    res.status(200).json(formatScanResponse(scan));
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not load this scan." });
  }
};

export default { scanImage, getScans, getScanById };
