import React, { useState, useContext } from 'react';
import axios from 'axios';
import { RecommendationsContext } from '../contexts/RecommendationsContext';
import { SearchResultsContext } from '../contexts/SearchResultsContext';
import { Link } from 'react-router-dom';
import StreamingServiceSelector from './StreamingServiceSelector';
import SearchResults from './SearchResults';

function getCurrentTimePeriod() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase().replace(' ', '');
}

function MovieRecommendations() {
  const { recommendations, setRecommendations } = useContext(RecommendationsContext);
  const { searchResults, setSearchResults, searchQuery, setSearchQuery, selectedServices, setSelectedServices } = useContext(SearchResultsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState('');
  const [mood, setMood] = useState('');

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const currentTimePeriod = getCurrentTimePeriod();
        const currentDate = `${new Date().getMonth() + 1}/${new Date().getDate()}`;
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/recommendations`, {
            currentTime: currentTimePeriod,
            currentDate,
            latitude,
            longitude,
            genres,
            mood,
          });
          setRecommendations(response.data);
        } catch (error) {
          setError('Error fetching recommendations');
        } finally {
          setLoading(false);
        }
      }, (err) => {
        setError('Error getting geolocation data');
        setLoading(false);
      });
    } else {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
    }
  };

  const searchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/search`, {
        params: { q: searchQuery }
      });
      setSearchResults(response.data);
    } catch (error) {
      setError('Error fetching search results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <label>
          Favorite Genres:
          <input type="text" value={genres} onChange={(e) => setGenres(e.target.value)} placeholder="e.g., action, comedy" />
        </label>
        <label>
          Mood:
          <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} placeholder="e.g., relaxing, adventurous" />
        </label>
      </div>
      <StreamingServiceSelector selectedServices={selectedServices} setSelectedServices={setSelectedServices} />
      <button onClick={fetchRecommendations}>Get Movie Recommendations</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button onClick={searchMovies}>Search</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {recommendations.map((movie, index) => (
          <div key={index} style={{ margin: '10px', textAlign: 'center' }}>
            {movie.tmdbId ? (
              <>
                <Link to={`/movie/${movie.tmdbId}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                    alt={movie.title}
                    style={{ width: '200px', height: 'auto' }}
                  />
                </Link>
                {movie.streamingProviders && (
                  <div>
                    {Object.entries(movie.streamingProviders).map(([country, providers]) => (
                      <div key={country}>
                        {providers.filter(provider => selectedServices.includes(provider.service.id) && provider.type === 'subscription').length > 0 ? <h3>Watch now on</h3> : null}
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
      <SearchResults results={searchResults} selectedServices={selectedServices} searchQuery={searchQuery} />
    </div>
  );
}

export default MovieRecommendations;
