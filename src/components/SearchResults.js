import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';

const SearchResults = ({
  results,
  likedMovies,
  likeMovie,
  dislikedMovies,
  dislikeMovie,
  seenMovies,
  markAsSeen,
  selectedServices,
}) => {
  const [activeBackdropIndex, setActiveBackdropIndex] = useState(0);

  // Filter results to only include movies with backdrop images
  const resultsWithBackdrops = results.filter(movie => movie.backdrop_path);

  useEffect(() => {
    if (resultsWithBackdrops.length > 0) {
      const interval = setInterval(() => {
        setActiveBackdropIndex(prevIndex => (prevIndex + 1) % resultsWithBackdrops.length);
      }, 6000); // Rotate every 6 seconds

      return () => clearInterval(interval);
    }
  }, [resultsWithBackdrops.length]);

  return (
    <div>
      <div className='search-results-container'>
        {results.map((movie, index) => (
          <MovieCard
            key={index}
            movie={movie}
            isActive={resultsWithBackdrops[activeBackdropIndex]?.tmdbId === movie.tmdbId}
            likedMovies={likedMovies}
            likeMovie={likeMovie}
            dislikedMovies={dislikedMovies}
            dislikeMovie={dislikeMovie}
            seenMovies={seenMovies}
            markAsSeen={markAsSeen}
            selectedServices={selectedServices}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
