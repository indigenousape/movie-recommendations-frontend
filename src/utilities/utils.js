// utils.js
import axios from 'axios';

const searchCache = {};
const movieDetailsCache = {};

export function getCurrentTimePeriod() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase().replace(' ', '');
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function filterStreamingProviders (providers, selectedServices) {
    return selectedServices ?
        providers.filter(provider => selectedServices.includes(provider.service.id) && (provider.type === 'subscription' || provider.type === 'free') && provider.service.id !== 'plutotv')
        : providers.filter(provider => (provider.type === 'subscription' || provider.type === 'free') && provider.service.id !== 'plutotv');
    }

export async function fetchRecommendations({ 
  setLoading, setError, setRecommendations, position, userProfile, seenMovies, likedMovies, dislikedMovies 
}) {
  setLoading(true);
  setError(null);

  const currentTimePeriod = getCurrentTimePeriod();
  const currentDate = new Date();
  const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' });
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const { latitude, longitude } = position.coords;
  const languageCode = navigator.language || 'en-US';
  const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
  const language = languageNames.of(languageCode.split('-')[0]);

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/recommendations`, {
      currentTime: currentTimePeriod,
      month,
      dayOfWeek,
      latitude,
      longitude,
      ...userProfile,
      language,
      seenMovies,
      likedMovies,
      dislikedMovies,
    });
    setRecommendations(response.data);
  } catch (error) {
    setError('Error fetching recommendations');
  } finally {
    setLoading(false);
  }
}

export async function searchMovies({ searchQuery, setLoading, setError, setSearchResults }) {
  setLoading(true);
  setError(null);

  if (searchCache[searchQuery]) {
    setSearchResults(searchCache[searchQuery]);
    setLoading(false);
    console.log('Fetched search results from cache:', searchQuery);
    return;
  }

  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/search`, {
      params: { q: searchQuery }
    });

    const moviesWithProviders = [];
    for (let movie of response.data) {
      const movieId = movie.id;
      if (movieDetailsCache[movieId]) {
        moviesWithProviders.push(movieDetailsCache[movieId]);
        continue;
      }
      try {
        const movieDetailsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/movie/${movieId}`);
        const movieData = {
          ...movie,
          streamingProviders: movieDetailsResponse.data.streamingProviders,
          posterPath: movieDetailsResponse.data.poster_path,
          tmdbId: movieId,
        };
        movieDetailsCache[movieId] = movieData;
        moviesWithProviders.push(movieData);
      } catch (error) {
        console.error(`Error fetching details for movie ID ${movieId}:`, error);
      }
      await delay(200);  // delay of 200ms to avoid exceeding the rate limit
    }

    searchCache[searchQuery] = moviesWithProviders;
    setSearchResults(moviesWithProviders);
    console.log('Fetched search results from server:', searchQuery)
  } catch (error) {
    setError('Error fetching search results');
  } finally {
    setLoading(false);
  }
}
