const MovieCardSkeleton = () => (
  <div className="movie-card skeleton-card">
    <div className="skeleton-movie-poster">
      <div className="skeleton-rating" />
    </div>
    <div className="skeleton-movie-info">
      <div className="skeleton-movie-title" />
      <div className="skeleton-movie-year" />
    </div>
  </div>
);

export default MovieCardSkeleton;
