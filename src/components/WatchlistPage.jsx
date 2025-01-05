import { useUser } from "../context/UserContext";
import { IMAGE_BASE_URL, POSTER_SIZE } from "../api/config";

const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist } = useUser();

  return (
    <div className="container">
      <h1 className="page-title">My Watchlist</h1>
      {watchlist.length === 0 ? (
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p>Your watchlist is empty. Start adding movies you want to watch!</p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((movie) => (
            <div key={movie.id} className="watchlist-item">
              <img
                src={`${IMAGE_BASE_URL}/${POSTER_SIZE}${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="watchlist-item-content">
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
                <div className="watchlist-actions">
                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="remove-button"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Remove from Watchlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
