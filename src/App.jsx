import { useState, useEffect, useRef } from "react";
import "./App.css";
import { searchMovies, getPopularMovies } from "./api/tmdb";
import { IMAGE_BASE_URL, POSTER_SIZE } from "./api/config";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import FeaturedSlider from "./components/FeaturedSlider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import MovieDetails from "./components/MovieDetails";
import MovieCardSkeleton from "./components/MovieCardSkeleton";
import DeveloperInfo from "./components/DeveloperInfo";
import { UserProvider, useUser } from "./context/UserContext";
import UserProfile from "./components/UserProfile";
import WatchlistPage from "./components/WatchlistPage";
import Navigation from "./components/Navigation";
import LogoutButton from "./components/LogoutButton";

const MovieCard = ({ movie, index, isNewlyLoaded, getAnimationDelay }) => {
  const navigate = useNavigate();

  return (
    <div
      key={`${movie.id}-${index}`}
      className={`movie-card ${isNewlyLoaded ? "new-item" : ""}`}
      style={getAnimationDelay(index, isNewlyLoaded)}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="movie-poster">
        <img
          src={
            movie.poster_path
              ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Poster"
          }
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-rating text-sm">
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title text-md">{movie.title}</h3>
        <p className="movie-year text-sm">
          {movie.release_date?.split("-")[0] || "N/A"}
        </p>
      </div>
    </div>
  );
};

function MainContent() {
  const { isAuthenticated, logout } = useAuth();
  const { watchlist } = useUser();
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showSlider, setShowSlider] = useState(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const location = useLocation();

  const observerTarget = useRef(null);

  useEffect(() => {
    const initializeMovies = async () => {
      try {
        const data = await getPopularMovies(1);
        if (data && data.results) {
          setMovies(data.results);
          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);
          setHasMore(data.currentPage < data.totalPages);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading initial movies:", error);
        setIsLoading(false);
      }
    };

    initializeMovies();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!observerTarget.current || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading]);

  const loadPopularMovies = async (page = 1) => {
    try {
      setIsLoading(true);
      const data = await getPopularMovies(page);
      if (data && data.results) {
        setMovies(page === 1 ? data.results : [...movies, ...data.results]);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setHasMore(data.currentPage < data.totalPages);
      }
    } catch (error) {
      console.error("Error loading popular movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      if (searchQuery.trim()) {
        const data = await searchMovies(searchQuery, currentPage + 1);
        if (data && data.results) {
          setMovies((prev) => [...prev, ...data.results]);
          setCurrentPage(data.currentPage);
          setHasMore(data.currentPage < data.totalPages);
        }
      } else {
        await loadPopularMovies(currentPage + 1);
      }
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    setShowSlider(!query.trim());

    try {
      if (query.trim()) {
        setIsSearching(true);
        setIsLoading(true);
        const data = await searchMovies(query);
        if (data && data.results) {
          setMovies(data.results);
          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);
          setHasMore(data.currentPage < data.totalPages);
        }
      } else {
        await loadPopularMovies(1);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const getAnimationDelay = (index, isNewlyLoaded) => {
    if (!isNewlyLoaded) return {};
    const delayIndex = index % 20;
    return { "--animation-delay": `${delayIndex * 0.05}s` };
  };

  const NoMoviesFound = () => (
    <div className="no-results">
      <svg
        className="no-results-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="no-results-title">No Movies Found</h3>
      <p className="no-results-text">
        We couldn't find any movies matching your search.
        {searchQuery && (
          <span className="no-results-query">
            {" "}
            Try different keywords than "{searchQuery}"
          </span>
        )}
      </p>
    </div>
  );

  const LoadingSkeleton = () => (
    <>
      <div className="skeleton-featured">
        <div className="skeleton-slide">
          <div className="skeleton-slide-content">
            <div className="skeleton-slide-title" />
            <div className="skeleton-slide-text" />
            <div className="skeleton-slide-meta" />
          </div>
        </div>
      </div>
      <div className="movies-grid">
        {[...Array(20)].map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </>
  );

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirmation(false);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <header className={`header-fixed ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">CineZoom</h1>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <div className="search-input-wrapper">
                <svg
                  className="search-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Discover movies and TV shows..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
                {isSearching && (
                  <div className="search-spinner">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
            </div>
            <LogoutButton onLogoutClick={handleLogoutClick} />
          </div>
        </div>
      </header>
      <div className="container">
        <main>
          {isLoading && currentPage === 1 ? (
            <LoadingSkeleton />
          ) : movies.length > 0 ? (
            <>
              <FeaturedSlider movies={movies} showSlider={showSlider} />
              <div className="movies-grid">
                {movies.map((movie, index) => (
                  <MovieCard
                    key={`${movie.id}-${index}`}
                    movie={movie}
                    index={index}
                    isNewlyLoaded={index >= movies.length - 20}
                    getAnimationDelay={getAnimationDelay}
                  />
                ))}
              </div>
              {hasMore && (
                <div ref={observerTarget} className="load-more">
                  {isLoadingMore && (
                    <div className="loading-more">
                      <div className="spinner"></div>
                      <span>Loading more movies...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <NoMoviesFound />
          )}
        </main>
      </div>
      <DeveloperInfo />
      {showLogoutConfirmation && (
        <>
          <div
            className="logout-dialog-overlay"
            onClick={() => setShowLogoutConfirmation(false)}
          />
          <div className="logout-dialog">
            <h2>Confirm Logout</h2>
            <p>
              Are you sure you want to log out? You'll need to log in again to
              access your watchlist and ratings.
            </p>
            <div className="logout-dialog-buttons">
              <button
                className="logout-dialog-button logout-dialog-cancel"
                onClick={() => setShowLogoutConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="logout-dialog-button logout-dialog-confirm"
                onClick={handleConfirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <MainContent />
                  {isAuthenticated && <Navigation />}
                </>
              }
            />
            <Route
              path="/movie/:id"
              element={
                <>
                  <MovieDetails />
                  {isAuthenticated && <Navigation />}
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <UserProfile />
                  {isAuthenticated && <Navigation />}
                </>
              }
            />
            <Route
              path="/watchlist"
              element={
                <>
                  <WatchlistPage />
                  {isAuthenticated && <Navigation />}
                </>
              }
            />
          </Routes>
          <DeveloperInfo />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
