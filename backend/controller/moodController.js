import Mood from "../models/Mood.js";
import { analyzeEmotion } from "../services/emotionClassifier.js";

export const logMood = async (req, res) => {
  const { mood, source } = req.body;

  try {
    const newMood = new Mood({ mood, source });
    await newMood.save();
    res.status(201).json(newMood);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getMoodHistory = async (req, res) => {
  try {
    const moods = await Mood.find().sort({ createdAt: -1 }).limit(20);
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const analyzeTextMood = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const mood = await analyzeEmotion(text);

  const newMood = new Mood({ mood, source: "text" });
  await newMood.save();

  res.json({ mood });
};
