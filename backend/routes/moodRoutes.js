import express from "express";
import {
  logMood,
  getMoodHistory,
  analyzeTextMood,
  recommendTracks,
} from "../controllers/moodController.js";

const router = express.Router();

router.post("/", logMood);
router.get("/history", getMoodHistory);
router.post("/analyze-text", analyzeTextMood);
router.post("/recommend", recommendTracks);

export default router;
