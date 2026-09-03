import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config();

console.log("Gemini API configured:", !!process.env.GEMINI_API_KEY);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
});
