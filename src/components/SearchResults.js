import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results, selectedServices, searchQuery }) => {
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
          <div key={index} style={{ margin: '10px', textAlign: 'center' }}>
            {movie.backdrop_path && (
              <img
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                alt={movie.title}
                className={`backdrop-image ${resultsWithBackdrops[activeBackdropIndex]?.tmdbId === movie.tmdbId ? 'active' : ''}`}
              />
            )}

            {movie.tmdbId ? (
              <>
                <Link to={`/movie/${movie.tmdbId}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                    alt={movie.title}
                    style={{ width: '150px', height: 'auto' }}
                  />
                </Link>
                {movie.streamingProviders && (
                  <div>
                    {Object.entries(movie.streamingProviders).map(([country, providers]) => (
                      <div key={country}>
                        {providers.filter(provider => selectedServices.includes(provider.service.id) && provider.type === 'subscription').length > 0 ? <h3>Watch now</h3> : null}
                        {providers.filter(provider => selectedServices.includes(provider.service.id) && provider.type === 'subscription').map((provider, index) => (
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
              </>
            ) : (
              <span>{movie.title} (ID not found)</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
