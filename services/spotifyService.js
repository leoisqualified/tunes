import axios from "axios";

let token = null;

const getSpotifyToken = async () => {
  if (token) return token; // Cache it if you like

  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
    }
  );

  token = res.data.access_token;
  return token;
};

const moodToGenres = {
  joy: ["pop", "dance", "happy"],
  sadness: ["acoustic", "piano", "sad"],
  anger: ["metal", "hard-rock"],
  fear: ["ambient", "chill"],
  surprise: ["electronic", "experimental"],
  disgust: ["blues", "jazz"],
  calm: ["lo-fi", "chill"],
  anxious: ["ambient", "sleep"],
  excited: ["edm", "party"],
  neutral: ["indie", "pop"],
};

export const getTracksByMood = async (mood) => {
  const genres = moodToGenres[mood] || ["pop"];

  const accessToken = await getSpotifyToken();

  const res = await axios.get("https://api.spotify.com/v1/recommendations", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      seed_genres: genres.slice(0, 2).join(","),
      limit: 10,
    },
  });

  return res.data.tracks.map((track) => ({
    name: track.name,
    artist: track.artists[0].name,
    url: track.external_urls.spotify,
    preview_url: track.preview_url,
    album_cover: track.album.images[0].url,
  }));
};
