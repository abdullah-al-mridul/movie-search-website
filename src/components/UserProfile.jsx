import { useUser } from "../context/UserContext";
import { IMAGE_BASE_URL } from "../api/config";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { watchlist, ratings, watchHistory } = useUser();

  // Format the date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Sort watch history by date
  const sortedHistory = [...watchHistory].sort(
    (a, b) => new Date(b.viewed_at) - new Date(a.viewed_at)
  );

  return (
    <div className="container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p className="profile-subtitle">Track your movie watching journey</p>
      </div>

      <div className="profile-stats-grid">
        <div className="stat-card">
          <div className="stat-icon watchlist-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
              />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Watchlist</h3>
            <p className="stat-number">{watchlist.length}</p>
            <Link to="/watchlist" className="stat-link">
              View Watchlist →
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon ratings-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Rated Movies</h3>
            <p className="stat-number">{Object.keys(ratings).length}</p>
            <span className="stat-description">Movies you've rated</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon history-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Watch History</h3>
            <p className="stat-number">{watchHistory.length}</p>
            <span className="stat-description">Movies in history</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="recent-activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-grid">
            {sortedHistory.slice(0, 6).map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="activity-card"
              >
                <div className="activity-poster">
                  <img
                    src={
                      movie.poster_path
                        ? `${IMAGE_BASE_URL}/w342${movie.poster_path}`
                        : "https://via.placeholder.com/342x513?text=No+Poster"
                    }
                    alt={movie.title}
                  />
                  {ratings[movie.id] && (
                    <div className="activity-rating">
                      <span>★</span> {ratings[movie.id]}
                    </div>
                  )}
                </div>
                <div className="activity-info">
                  <h4>{movie.title}</h4>
                  <p>Watched {formatDate(movie.viewed_at)}</p>
                </div>
              </Link>
            ))}
          </div>
          {watchHistory.length === 0 && (
            <div className="empty-state">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>
                No watch history yet. Start watching movies to track your
                activity!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
