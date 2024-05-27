import React from 'react';
import { Link } from 'react-router-dom';
import StreamingProviders from './StreamingProviders';

const MovieCard = ({
  movie,
  isActive,
  likedMovies,
  likeMovie,
  dislikedMovies,
  dislikeMovie,
  seenMovies,
  markAsSeen,
  selectedServices,
}) => (
  <div style={{ margin: '10px', textAlign: 'center' }}>
    {movie.backdrop_path && (
      <img
        src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
        alt={movie.title}
        className={`backdrop-image ${isActive ? 'active' : ''}`}
      />
    )}

    {movie.tmdbId ? (
      <>
        <Link to={`/movie/${movie.tmdbId}`}>
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
            alt={movie.title}
            style={{ width: '175px', height: 'auto' }}
          />
        </Link>
        <div>
          <button onClick={() => likeMovie(movie.title.trim())}>
            {likedMovies.includes(movie.title.trim()) ? 'Liked' : 'Like'}
          </button>
          <button onClick={() => dislikeMovie(movie.title.trim())}>
            {dislikedMovies.includes(movie.title.trim()) ? 'Disliked' : 'Dislike'}
          </button>
          {!seenMovies.includes(movie.title.trim()) ? (
            <button onClick={() => markAsSeen(movie.title.trim())}>Not Now</button>
          ) : (
            'Not Now'
          )}
        </div>
        {movie.streamingProviders && (
          <StreamingProviders
            providers={movie.streamingProviders}
            selectedServices={selectedServices}
          />
        )}
      </>
    ) : (
      <span>{movie.title} (ID not found)</span>
    )}
  </div>
);

export default MovieCard;
