import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const term = query.trim();

    if (!term) {
      setSongs([]);
      setError("");
      setSearched(false);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:3001/api/search?q=${encodeURIComponent(term)}`
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        if (!cancelled) {
          setSongs(data.songs);
          setSearched(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Something went wrong. Please try again.");
          setSongs([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  function handleSelect(song) {
    setSelected(song);
    setQuery("");
  }

  return (
    <div className="app">
      <h1>Music Recommender</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a song..."
      />

      {loading && <p className="status">Searching...</p>}
      {error && <p className="status error">{error}</p>}
      {!loading && !error && searched && songs.length === 0 && (
        <p className="status">No results found.</p>
      )}

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