const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

function simplify(song) {
  return {
    id: song.trackId,
    title: song.trackName,
    artist: song.artistName,
    artworkUrl: song.artworkUrl100.replace("100x100", "600x600"),
    genre: song.primaryGenreName,
  };
}

app.get("/api/search", async (req, res) => {
  const term = req.query.q;

  if (!term) {
    return res.status(400).json({ error: "Missing search term" });
  }

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=10`;
    const response = await fetch(url);
    const data = await response.json();

    const songs = data.results.map(simplify);
    res.json({ songs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});