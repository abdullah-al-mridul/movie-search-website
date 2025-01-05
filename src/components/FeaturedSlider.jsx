import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards } from "swiper/modules";
import { IMAGE_BASE_URL } from "../api/config";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

function FeaturedSlider({ movies, showSlider }) {
  if (!movies || movies.length === 0 || !showSlider) return null;

  const featuredMovies = movies.slice(0, 5);

  return (
    <div className="featured-slider">
      <Swiper
        effect="cards"
        grabCursor={true}
        modules={[EffectCards, Autoplay]}
        className="featured-swiper"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
      >
        {featuredMovies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="featured-slide">
              <div
                className="featured-backdrop"
                style={{
                  backgroundImage: `url(${IMAGE_BASE_URL}/original${movie.backdrop_path})`,
                }}
              >
                <div className="featured-content">
                  <h2 className="featured-title">{movie.title}</h2>
                  <p className="featured-overview">{movie.overview}</p>
                  <div className="featured-meta">
                    <span className="featured-rating">
                      ★ {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="featured-year">
                      {movie.release_date?.split("-")[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default FeaturedSlider;
