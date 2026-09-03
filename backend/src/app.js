import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import scanRoutes from "./routes/scanRoutes.js";

const app = express();

const allowedOrigins = ["http://localhost:8080", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", scanRoutes);

export default app;
