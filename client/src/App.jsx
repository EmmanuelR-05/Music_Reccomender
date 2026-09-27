import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [selected, setSelected] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    const res = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setSongs(data.songs);
  }

  function handleSelect(song) {
    setSelected(song);
    setSongs([]);
    setQuery("");
  }

  return (
    <div className="app">
      <h1>Music Recommender</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a song..."
        />
        <button type="submit">Search</button>
      </form>

      <ul className="results">
        {songs.map((song) => (
          <li key={song.id} onClick={() => handleSelect(song)}>
            <img src={song.artworkUrl} alt={song.title} width="60" />
            <span>{song.title} — {song.artist}</span>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="now-playing">
          <img src={selected.artworkUrl} alt={selected.title} />
          <h2>{selected.title}</h2>
          <p>{selected.artist}</p>
        </div>
      )}
    </div>
  );
}

export default App;