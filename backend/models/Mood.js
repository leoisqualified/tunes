import mongoose from "mongoose";

const MoodSchema = new mongoose.Schema({
  mood: { type: String, required: true },
  source: { type: String, enum: ["text", "camera"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Mood = mongoose.model("Mood", MoodSchema);
export default Mood;
