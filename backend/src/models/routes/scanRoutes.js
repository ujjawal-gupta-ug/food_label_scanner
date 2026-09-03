import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import scanController from "../controllers/scanController.js";

const router = express.Router();

router.post("/scan", upload.single("image"), scanController.scanImage);

export default router;
