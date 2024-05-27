import React, { useState, useContext, useEffect } from 'react';
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
  const { recommendations, setRecommendations, seenMovies, setSeenMovies, likedMovies, setLikedMovies, dislikedMovies, setDislikedMovies, selectedServices, setSelectedServices } = useContext(RecommendationsContext);
  const { searchResults, setSearchResults, searchQuery, setSearchQuery } = useContext(SearchResultsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState(localStorage.getItem('genres') || '');
  const [mood, setMood] = useState(localStorage.getItem('mood') || '');
  const [gender, setGender] = useState(localStorage.getItem('gender') || '');
  const [age, setAge] = useState(localStorage.getItem('age') || '');
  const [showInputs, setShowInputs] = useState(false); // Toggle state
  const [showRecommendations, setShowRecommendations] = useState(true); // Show recommendations by default
  const [showSearchResults, setShowSearchResults] = useState(false); // Hide search results by default
  const [activeBackdropIndex, setActiveBackdropIndex] = useState(0);

  useEffect(() => {
    const savedRecommendations = localStorage.getItem('recommendations');
    if (savedRecommendations) {
      setRecommendations(JSON.parse(savedRecommendations));
    }
  }, [setRecommendations]);

  useEffect(() => {
    localStorage.setItem('genres', genres);
  }, [genres]);

  useEffect(() => {
    localStorage.setItem('mood', mood);
  }, [mood]);

  useEffect(() => {
    localStorage.setItem('gender', gender);
  }, [gender]);

  useEffect(() => {
    localStorage.setItem('age', age);
  }, [age]);

  useEffect(() => {
    if (recommendations.length > 0) {
      localStorage.setItem('recommendations', JSON.stringify(recommendations));
    }
  }, [recommendations]);

  // Filter recommendations to only include movies with backdrop images
  const recommendationsWithBackdrops = recommendations.filter(movie => movie.backdrop_path);

  useEffect(() => {
    if (recommendationsWithBackdrops.length > 0) {
      const interval = setInterval(() => {
        setActiveBackdropIndex(prevIndex => (prevIndex + 1) % recommendationsWithBackdrops.length);
      }, 6000); // Rotate every 6 seconds

      return () => clearInterval(interval);
    }
  }, [recommendationsWithBackdrops.length]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    setShowSearchResults(false); // Hide search results
    setShowRecommendations(true); // Show recommendations

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
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
            genres,
            mood,
            gender,
            age,
            language,
            seenMovies,
            likedMovies,
            dislikedMovies
          });

          console.log(response.data);
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

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const searchMovies = async () => {
    setLoading(true);
    setError(null);
    setShowRecommendations(false); // Hide recommendations
    setShowSearchResults(true); // Show search results

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/search`, {
        params: { q: searchQuery }
      });

      console.log(response.data);

      const moviesWithProviders = [];
      for (let movie of response.data) {
        const movieId = movie.id;
        try {
          const movieDetailsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/movie/${movieId}`);
          moviesWithProviders.push({
            ...movie,
            streamingProviders: movieDetailsResponse.data.streamingProviders,
            posterPath: movieDetailsResponse.data.poster_path,
            tmdbId: movieId,
          });
        } catch (error) {
          console.error(`Error fetching details for movie ID ${movieId}:`, error);
        }
        await delay(250);  // delay of 250ms to avoid exceeding the rate limit
      }

      console.log(moviesWithProviders);
      setSearchResults(moviesWithProviders);
    } catch (error) {
      setError('Error fetching search results');
    } finally {
      setLoading(false);
    }
  };

  const markAsSeen = (movieTitle) => {
    if (seenMovies.includes(movieTitle)) return;
    setSeenMovies([...seenMovies, movieTitle]);
  };

  const markAllAsSeen = () => {
    const unseenRecommendationTitles = recommendations.map(movie => movie.title.trim()).filter(title => !seenMovies.includes(title));
    setSeenMovies([...seenMovies, ...unseenRecommendationTitles]);
  }

  const likeMovie = (movieTitle) => {
    if (!likedMovies.includes(movieTitle)) {
      setLikedMovies([...likedMovies, movieTitle]);
      setDislikedMovies(dislikedMovies.filter(title => title !== movieTitle));
    }
  };

  const dislikeMovie = (movieTitle) => {
    if (!dislikedMovies.includes(movieTitle)) {
      setDislikedMovies([...dislikedMovies, movieTitle]);
      setLikedMovies(likedMovies.filter(title => title !== movieTitle));
    }
  };

  const filterStreamingProviders = (providers) => {
    return providers.filter(provider =>
      selectedServices.includes(provider.service.id) &&
      (provider.type === 'subscription' || provider.type === 'free') &&
      provider.service.id !== 'plutotv'
    );
  };

  return (
    <div>
      <button className="profile-btn" onClick={() => setShowInputs(!showInputs)}>
        {showInputs ? 'Hide profile' : 'Show profile'}
      </button>
      <div className={`profile-container ${showInputs ? 'active' : ''}`}>
        <h2>Your Profile</h2>
        <div className="flex-cols">
          <label>
            <span>Favorite Genres:</span>
            <input type="text" value={genres} onChange={(e) => setGenres(e.target.value)} placeholder="e.g., action, comedy" />
          </label>
          <label>
            <span>Mood:</span>
            <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} placeholder="e.g., relaxing, adventurous" />
          </label>
          <label>
            <span>Gender:</span>
            <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="e.g., male, female" />
          </label>
          <label>
            <span>Age:</span>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 25" />
          </label>
        </div>
        <StreamingServiceSelector selectedServices={selectedServices} setSelectedServices={setSelectedServices} />
      </div>
      <div className="suggestions-results relative">
        <div className='flex-center'>
          {showSearchResults && <div>
            <input
              className='search-input'
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a movie..."
            />
            <button disabled={loading} className='main-btn' onClick={searchMovies}>Search{loading ? 'ing...' : ''}</button>
            <button className='secondary-btn' onClick={() => { setShowRecommendations(true); setShowSearchResults(false); }}>
              Generate suggestions instead
            </button>
          </div>}
          {!showSearchResults && <button disabled={loading} className='main-btn' onClick={fetchRecommendations}>{!loading ? 'What should we watch, ChatGPT?' : 'Thinking...'}</button>}
          {!showSearchResults && <button className='secondary-btn' onClick={() => { setShowSearchResults(true); setShowRecommendations(false); }}>
            I'd rather search
          </button>}
          {!showSearchResults && recommendations.length > 0 && <button className='main-btn none-of-these-btn' onClick={markAllAsSeen}>None of these</button>}
        </div>
        {error && <p>{error}</p>}
        {showRecommendations && recommendations.length > 0 && (
          <div>
            <div className="flex-2">
              <div className="flex-col"><h2 className="no-vert-m text-center">{loading ? 'Personalizing' : 'Personalized'} movie recommendations for you{loading ? '...' : null}</h2></div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {recommendations.map((movie, index) => (
                <div key={index} style={{ margin: '10px', textAlign: 'center' }}>
                  {movie.tmdbId ? (
                    <>
                      {movie.backdrop_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                          alt={movie.title}
                          className={`backdrop-image ${recommendationsWithBackdrops[activeBackdropIndex].tmdbId === movie.tmdbId ? 'active' : ''}`}
                        />
                      )}
                      <Link to={`/movie/${movie.tmdbId}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                          alt={movie.title}
                          style={{ width: '150px', height: 'auto' }}
                        />
                      </Link>
                      <div>
                        <button onClick={() => likeMovie(movie.title.trim())}>
                          {likedMovies.includes(movie.title.trim()) ? 'Liked' : 'Like'}
                        </button>
                        <button onClick={() => dislikeMovie(movie.title.trim())}>
                          {dislikedMovies.includes(movie.title.trim()) ? 'Disliked' : 'Dislike'}
                        </button>
                        {!seenMovies.includes(movie.title.trim()) ? <button onClick={() => markAsSeen(movie.title.trim())}>Not Now</button> : 'Not Now'}
                      </div>
                      {movie.streamingProviders && (
                        <div>
                          {Object.entries(movie.streamingProviders).map(([country, providers]) => (
                            <div key={country}>
                              {filterStreamingProviders(providers).length > 0 ? <h3 className='no-btm-m'>Watch now</h3> : null}
                              {filterStreamingProviders(providers).map((provider, index) => (
                                <p key={index} className="no-vert-m">
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
        )}
        {showSearchResults && searchResults.length > 0 && (
          <div>
            <h2 className='no-vert-m'>Search Results {searchQuery && `for "${searchQuery}"`}</h2>
            <SearchResults results={searchResults} selectedServices={selectedServices} searchQuery={searchQuery} />
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieRecommendations;
