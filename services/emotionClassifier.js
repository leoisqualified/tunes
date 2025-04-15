import axios from "axios";

export const analyzeEmotion = async (text) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const emotions = response.data[0]; // Array of {label, score}
    const top = emotions.reduce((a, b) => (a.score > b.score ? a : b));

    return top.label.toLowerCase();
  } catch (err) {
    console.error(err);
    return "neutral";
  }
};
