import { useState } from "react";

const MovieFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    year: "",
    rating: "",
    genre: "",
    sortBy: "popularity.desc",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="movie-filters">
      <select
        name="sortBy"
        value={filters.sortBy}
        onChange={handleChange}
        className="filter-select"
      >
        <option value="popularity.desc">Most Popular</option>
        <option value="vote_average.desc">Highest Rated</option>
        <option value="release_date.desc">Newest First</option>
        <option value="release_date.asc">Oldest First</option>
      </select>

      <select
        name="year"
        value={filters.year}
        onChange={handleChange}
        className="filter-select"
      >
        <option value="">All Years</option>
        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(
          (year) => (
            <option key={year} value={year}>
              {year}
            </option>
          )
        )}
      </select>

      <select
        name="rating"
        value={filters.rating}
        onChange={handleChange}
        className="filter-select"
      >
        <option value="">All Ratings</option>
        <option value="7">7+ Rating</option>
        <option value="8">8+ Rating</option>
        <option value="9">9+ Rating</option>
      </select>

      {/* Add more filters as needed */}
    </div>
  );
};

export default MovieFilters;
