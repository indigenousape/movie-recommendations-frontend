import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        console.log(`Fetching details for movie ID: ${id}`);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/movie/${id}`);
        console.log('Fetched movie details:', response.data);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };
    fetchMovieDetails();
  }, [id]);

  const filterStreamingProviders = (providers) => {
    return providers.filter(provider => provider.type === 'subscription' || provider.type === 'free');
  };

  return (
    <div>
      <button onClick={() => navigate(`/?q=${query}`)}>Back to Search</button>
      {movie ? (
        <div>
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt={movie.title}
              style={{ width: '300px', height: 'auto' }}
            />
          )}
          {movie.streamingProviders && (
            <div>
              {Object.entries(movie.streamingProviders).map(([country, providers]) => (
                <div key={country}>
                  {filterStreamingProviders(providers).length > 0 && <h3>Available on:</h3>}
                  {filterStreamingProviders(providers).map((provider, index) => (
                    <p key={index}>
                      <a href={provider.link} target="_blank" rel="noopener noreferrer">
                        <img
                          src={provider.service.imageSet.lightThemeImage}
                          alt={provider.service.name}
                          style={{ width: '100px', height: 'auto' }}
                        />
                      </a>
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default MovieDetail;
