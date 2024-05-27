import React from 'react';
import MovieCard from './MovieCard';

const RecommendationsList = ({
  recommendations,
  activeBackdropIndex,
  likedMovies,
  likeMovie,
  dislikedMovies,
  dislikeMovie,
  seenMovies,
  markAsSeen,
  selectedServices,
}) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    {recommendations.map((movie, index) => (
      <MovieCard
        key={index}
        movie={movie}
        isActive={activeBackdropIndex === index}
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
);

export default RecommendationsList;
