import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/movie/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };
    fetchMovieDetails();
  }, [id]);

  const genresString = movie && movie.genres ? movie.genres.map((genre) => genre.name).join(', ') : '';

  return (
    <div>
      {movie ? (
        <div>
          <h1>{movie.title}</h1>
          <p><small>{movie.release_date.substr(0,4)}. {genresString}. {movie.runtime} mins</small>.</p>
          <p>Popularity: {movie.popularity}</p>
          <p>Box Office: ${movie.revenue}</p>
          <p>Budget: ${movie.budget}</p>
          <p>Language: </p>
          <p>{movie.overview}</p>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt={movie.title}
              style={{ width: '300px', height: 'auto' }}
            />
          )}
          {movie.streamingInfo && (
            <div>
              <h3>Available on:</h3>
              <ul>
              {movie.streamingInfo.map((info, index) => (
                <li key={`${info.source_id}-${index}`}>{info.name}: {info.format}</li>
              ))}
              </ul>
            </div>
          )}
          {movie.backdrop_path && (
            <img
            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
            alt={movie.title}
            style={{ width: '300px', height: 'auto' }}
          />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default MovieDetail;
