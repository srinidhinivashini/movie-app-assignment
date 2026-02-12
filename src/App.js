import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const IMG_PATH = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    fetch('/api/movies')
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setFilteredMovies(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const results = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(results);
  }, [searchTerm, movies]);

  const fetchDetails = (id) => {
    setLoading(true);
    fetch(`/api/movies/${id}`)
      .then(res => res.json())
      .then(data => {
        setSelectedMovie(data);
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎬 Pi-xcels Premium</h1>
        {!selectedMovie && (
          <input 
            className="search-input"
            type="text" 
            placeholder="Search movies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </header>

      <div className="container">
        {loading ? <div className="loader">Loading...</div> : 
        selectedMovie ? (
          <div className="movie-details">
            <button className="back-btn" onClick={() => setSelectedMovie(null)}>BACK</button>
            <div className="detail-card">
              <img src={IMG_PATH + selectedMovie.poster_path} alt={selectedMovie.title} />
              <div className="detail-info">
                <h2>{selectedMovie.title}</h2>
                <p className="tagline">{selectedMovie.tagline}</p>
                <div className="meta">⭐ {selectedMovie.vote_average} | {selectedMovie.runtime} MIN</div>
                <p className="overview">{selectedMovie.overview}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map(movie => (
              <div key={movie.id} className="movie-card" onClick={() => fetchDetails(movie.id)}>
                {/* Mela left corner-la text varama iruka, image mattum dhaan first irukanum */}
                <img src={IMG_PATH + movie.poster_path} alt={movie.title} />
                <div className="card-content">
                  <h3>{movie.title}</h3>
                  <span className="rating">⭐ {movie.vote_average}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;