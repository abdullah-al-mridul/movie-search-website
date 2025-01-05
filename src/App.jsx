import { useState, useEffect } from "react";
import "./App.css";
import { searchMovies, getPopularMovies } from "./api/tmdb";
import { IMAGE_BASE_URL, POSTER_SIZE } from "./api/config";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load popular movies when the component mounts
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    setIsLoading(true);
    const popularMovies = await getPopularMovies();
    setMovies(popularMovies);
    setIsLoading(false);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      setIsLoading(true);
      const searchResults = await searchMovies(query);
      setMovies(searchResults);
      setIsLoading(false);
    } else {
      loadPopularMovies();
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="search-section">
          <h1 className="search-title">Movie Search</h1>
          <p className="search-subtitle">
            Discover thousands of movies and TV shows. Start exploring now.
          </p>
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search for movies or TV shows..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </header>
      <main>
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="movie-poster">
                  <img
                    src={
                      movie.poster_path
                        ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Poster"
                    }
                    alt={movie.title}
                  />
                  <div className="movie-rating">
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-year">
                    {movie.release_date?.split("-")[0] || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
