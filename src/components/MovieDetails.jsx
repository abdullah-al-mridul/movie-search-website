import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getMovieReviews,
} from "../api/tmdb";
import { IMAGE_BASE_URL } from "../api/config";
import { useUser } from "../context/UserContext";

const MovieDetailsSkeleton = () => (
  <div className="movie-details">
    <div className="movie-backdrop skeleton-backdrop">
      <div className="backdrop-overlay" />
    </div>
    <div className="movie-details-content">
      <div className="back-button skeleton">
        <div className="skeleton-text" style={{ width: "60px" }} />
      </div>
      <div className="movie-details-grid">
        <div className="movie-poster-wrapper">
          <div className="skeleton-poster" />
        </div>
        <div className="movie-info-detailed">
          <div className="skeleton-title" />
          <div className="skeleton-meta">
            <div className="skeleton-text" style={{ width: "80px" }} />
            <div className="skeleton-text" style={{ width: "60px" }} />
            <div className="skeleton-text" style={{ width: "70px" }} />
          </div>
          <div className="skeleton-genres">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-tag" />
            ))}
          </div>
          <div className="skeleton-tagline" />
          <div className="skeleton-overview">
            <div className="skeleton-text" style={{ width: "120px" }} />
            <div className="skeleton-paragraph">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-line" />
              ))}
            </div>
          </div>
          <div className="skeleton-info-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-info-item">
                <div className="skeleton-text" style={{ width: "60px" }} />
                <div className="skeleton-text" style={{ width: "100px" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const tabsRef = useRef(null);
  const {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    ratings,
    addRating,
    addToHistory,
  } = useUser();

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieData, creditsData, videosData, reviewsData] =
          await Promise.all([
            getMovieDetails(id),
            getMovieCredits(id),
            getMovieVideos(id),
            getMovieReviews(id),
          ]);

        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData);
        setReviews(reviewsData);
        if (movieData) {
          addToHistory({
            id: movieData.id,
            title: movieData.title,
            poster_path: movieData.poster_path,
            viewed_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [id, addToHistory]);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsPosition = tabsRef.current.getBoundingClientRect().top;
        setIsTabsSticky(tabsPosition <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return <MovieDetailsSkeleton />;
  }

  if (!movie) return null;

  const formatCurrency = (amount) => {
    if (!amount) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isInWatchlist = watchlist.some((m) => m.id === movie.id);
  const userRating = ratings[movie.id];

  return (
    <div className="movie-details">
      <div
        className="movie-backdrop"
        style={{
          backgroundImage: `url(${IMAGE_BASE_URL}/original${movie.backdrop_path})`,
        }}
      >
        <div className="backdrop-overlay" />
      </div>
      <div className="movie-details-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        <div className="movie-details-grid">
          <div className="movie-poster-wrapper">
            <img
              src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster-large"
            />
          </div>

          <div className="movie-info-detailed">
            <h1 className="movie-title-large">{movie.title}</h1>

            <div className="movie-meta-details">
              {movie.release_date && (
                <span className="release-date">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="runtime">{movie.runtime} min</span>
              )}
              <span className="rating">★ {movie.vote_average.toFixed(1)}</span>
            </div>

            {movie.genres?.length > 0 && (
              <div className="genres">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movie.tagline && <p className="tagline">{movie.tagline}</p>}

            <div
              className={`details-tabs ${isTabsSticky ? "sticky" : ""}`}
              ref={tabsRef}
            >
              <button
                className={`tab-button ${
                  activeTab === "overview" ? "active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              {credits?.cast?.length > 0 && (
                <button
                  className={`tab-button ${
                    activeTab === "cast" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("cast")}
                >
                  Cast
                </button>
              )}
              {videos.length > 0 && (
                <button
                  className={`tab-button ${
                    activeTab === "videos" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("videos")}
                >
                  Videos
                </button>
              )}
              {reviews.length > 0 && (
                <button
                  className={`tab-button ${
                    activeTab === "reviews" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </button>
              )}
            </div>

            <div className="tab-content">
              {activeTab === "overview" && (
                <div className="overview-tab">
                  {movie.overview && (
                    <div className="overview">
                      <h3>Overview</h3>
                      <p>{movie.overview}</p>
                    </div>
                  )}

                  <div className="additional-info">
                    {movie.status && (
                      <div className="info-item">
                        <span className="label">Status</span>
                        <span className="value">{movie.status}</span>
                      </div>
                    )}
                    {movie.budget > 0 && (
                      <div className="info-item">
                        <span className="label">Budget</span>
                        <span className="value">
                          {formatCurrency(movie.budget)}
                        </span>
                      </div>
                    )}
                    {movie.revenue > 0 && (
                      <div className="info-item">
                        <span className="label">Revenue</span>
                        <span className="value">
                          {formatCurrency(movie.revenue)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "cast" && (
                <div className="cast-tab">
                  <div className="cast-grid">
                    {credits.cast.slice(0, 12).map((person) => (
                      <div key={person.id} className="cast-card">
                        <div className="cast-image">
                          <img
                            src={
                              person.profile_path
                                ? `${IMAGE_BASE_URL}/w185${person.profile_path}`
                                : "https://via.placeholder.com/185x278?text=No+Image"
                            }
                            alt={person.name}
                          />
                        </div>
                        <div className="cast-info">
                          <h4>{person.name}</h4>
                          <p>{person.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "videos" && (
                <div className="videos-tab">
                  <div className="videos-grid">
                    {videos.map((video) => (
                      <div key={video.id} className="video-card">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.key}`}
                          title={video.name}
                          frameBorder="0"
                          allowFullScreen
                        />
                        <h4>{video.name}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="reviews-tab">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <h4>{review.author}</h4>
                        <span>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="review-content">{review.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="movie-actions">
              <button
                className={`watchlist-button ${isInWatchlist ? "in-list" : ""}`}
                onClick={() => {
                  if (isInWatchlist) {
                    removeFromWatchlist(movie.id);
                  } else {
                    addToWatchlist(movie);
                  }
                }}
              >
                {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>

              <div className="rating-control">
                <span>Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-button ${
                      star <= userRating ? "active" : ""
                    }`}
                    onClick={() => addRating(movie.id, star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
