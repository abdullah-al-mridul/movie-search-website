import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("ratings");
    return saved ? JSON.parse(saved) : {};
  });

  const [watchHistory, setWatchHistory] = useState(() => {
    const saved = localStorage.getItem("watchHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("ratings", JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem("watchHistory", JSON.stringify(watchHistory));
  }, [watchHistory]);

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  };

  const addRating = (movieId, rating) => {
    setRatings((prev) => ({
      ...prev,
      [movieId]: rating,
    }));
  };

  const addToHistory = (movie) => {
    setWatchHistory((prev) => {
      const filtered = prev.filter((m) => m.id !== movie.id);
      return [
        {
          ...movie,
          viewed_at: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 100); // Keep last 100 movies
    });
  };

  const value = {
    watchlist,
    ratings,
    watchHistory,
    addToWatchlist,
    removeFromWatchlist,
    addRating,
    addToHistory,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
