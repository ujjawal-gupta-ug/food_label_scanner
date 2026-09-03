import uploadImage from "../services/imageUploadService.js";
import validateImage from "../services/imageValidationService.js";
import extractText from "../services/ocrService.js";
import extractStructuredData from "../services/geminiStructuredExtractionService.js";
import cleanOCRText from "../utils/textCleaner.js";
import validateOCRText from "../services/ocrValidationService.js";
import Scan from "../models/scan.js";

const scanImage = async (req, res) => {
  try {
    // 1. Upload
    const imageData = await uploadImage(req.file);

    // 2. Validate
    const validation = await validateImage(imageData.imagePath);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        stage: "image-validation",
        message: validation.reason,
      });
    }

    // 3. OCR
    const extractedText = await extractText(validation.correctedImagePath);

    // OCR readability validation
    const ocrCheck = validateOCRText(extractedText);

    if (!ocrCheck.valid) {
      return res.status(400).json({
        success: false,
        stage: "ocr-validation",
        message: ocrCheck.reason,
      });
    }

    // 4. Clean the extracted text
    const cleanedText = cleanOCRText(extractedText);

    // 5. Gemini structured data
    const structuredData = await extractStructuredData(cleanedText);

    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/${imageData.imageName}`;

    // 6. Persist the scan + analysis
    const scan = await Scan.create({
      imageName: imageData.imageName,
      imagePath: imageData.imagePath,
      imageType: imageData.imageType,
      imageSize: imageData.imageSize,
      imageUrl,
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
        detail:
          "Choose products based on their overall nutrition and ingredient profile.",
      },
      recommendation: structuredData.recommendation || {
        title: "Try scanning again",
        detail:
          "A clearer image may provide a more accurate nutritional analysis.",
      },
    });

    // 7. Response — same shape as before, plus the saved id
    res.status(200).json({
      success: true,
      id: scan._id,

      product: {
        image: imageUrl,
        name: scan.product.name,
        brand: scan.product.brand,
        category: scan.product.category,
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

// GET /api/scans — history list (matches client History.tsx ScanRecord shape)
const getScans = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    const [scans, total] = await Promise.all([
      Scan.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          "product score rating tone imageUrl createdAt",
        )
        .lean(),
      Scan.countDocuments({}),
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

// GET /api/scans/:id — full analysis for one scan (matches client Result.tsx Analysis shape)
const getScanById = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id).lean();

    if (!scan) {
      return res.status(404).json({ success: false, message: "Scan not found." });
    }

    res.status(200).json({
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
      createdAt: scan.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not load this scan." });
  }
};

export default { scanImage, getScans, getScanById };
