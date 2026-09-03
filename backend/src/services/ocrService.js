import { createWorker } from "tesseract.js";

const extractText = async (imagePath) => {
  let worker;

  try {
    worker = await createWorker("eng");

    const {
      data: { text },
    } = await worker.recognize(imagePath);

    await worker.terminate();

    return text;
  } catch (error) {
    console.error("OCR Error:", error);

    if (worker) {
      await worker.terminate();
    }

    throw new Error("Failed to extract text from image");
  }
};

export default extractText;
