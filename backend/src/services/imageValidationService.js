import sharp from "sharp";
import { fileTypeFromFile } from "file-type";
import path from "path";

const validateImage = async (imagePath) => {
  // 1. Check actual file type
  const fileType = await fileTypeFromFile(imagePath);

  if (!fileType) {
    return {
      valid: false,
      reason: "Invalid file. Unable to detect file type.",
    };
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedMimeTypes.includes(fileType.mime)) {
    return {
      valid: false,
      reason: "Only JPG, PNG, and WEBP images are allowed.",
    };
  }

  // 2. Read image metadata
  const metadata = await sharp(imagePath).metadata();

  // 3. Validate dimensions
  if (metadata.width < 400 || metadata.height < 400) {
    return {
      valid: false,
      reason: "Image resolution is too low. Please upload a clearer photo.",
    };
  }

  // 4. Create corrected file path
  const ext = path.extname(imagePath);

  const correctedPath = imagePath.replace(ext, `-corrected${ext}`);

  // 5. Auto-rotate image using EXIF data
  await sharp(imagePath).rotate().toFile(correctedPath);

  // 6 blur check
  const { data } = await sharp(correctedPath)
    .grayscale()
    .resize(200)
    .raw()
    .toBuffer({ resolveWithObject: true });

  let diffSum = 0;

  for (let i = 1; i < data.length; i++) {
    diffSum += Math.abs(data[i] - data[i - 1]);
  }

  const blurScore = diffSum / data.length;

  console.log("BLUR SCORE:", blurScore);

  // Threshold (tune experimentally)
  // if (blurScore < 15) {
  //   return {
  //     valid: false,
  //     reason:
  //       "Image is too blurry. Please upload a clearer photo of the food label.",
  //   };
  // }

  return {
    valid: true,
    correctedImagePath: correctedPath,
    metadata: {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
    },
  };
};

export default validateImage;
