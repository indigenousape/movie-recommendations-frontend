import React, { useState, useContext } from 'react';
import axios from 'axios';
import { RecommendationsContext } from '../contexts/RecommendationsContext';
import { Link } from 'react-router-dom';

function getCurrentTimePeriod() {
  return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).toLowerCase().replace(' ', '');
}

function MovieRecommendations() {
  const { recommendations, setRecommendations } = useContext(RecommendationsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const currentTimePeriod = getCurrentTimePeriod();
        const currentDate = + new Date().getMonth() + '/' + new Date().getDate();
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/recommendations`, {
            currentTime: currentTimePeriod,
            currentDate,
            latitude,
            longitude
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

  return (
    <div>
      <button onClick={fetchRecommendations}>Get Movie Recommendations</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {recommendations.map((movie, index) => (
          <li key={index}>{movie.tmdbId ? (
            <Link to={`/movie/${movie.tmdbId}`}>{movie.title}</Link>
          ) : (
            <span>{movie.title} (ID not found)</span>
          )}</li>
        ))}
      </ul>
    </div>
  );
}

export default MovieRecommendations;
