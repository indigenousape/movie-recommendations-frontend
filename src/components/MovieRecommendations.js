import React, { useState, useContext, useEffect, useCallback } from 'react';
import { RecommendationsContext } from '../contexts/RecommendationsContext';
import { SearchResultsContext } from '../contexts/SearchResultsContext';
import RecommendationsList from './RecommendationsList';
import SearchResults from './SearchResults';
import ProfileForm from './ProfileForm';
import { fetchRecommendations, searchMovies } from '../utilities/utils';
import { useNavigate, useLocation } from 'react-router-dom';

function MovieRecommendations() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleSearchMovies = useCallback((query) => {
    if (query) {
      setLastContext('search');
      localStorage.setItem('searchQuery', query);
      setSearchQuery(query);
      navigate(`/?q=${query}`);
      searchMovies({
        searchQuery: query,
        setLoading,
        setError,
        setSearchResults
      });
    }
  }, [navigate, setSearchQuery, setLoading, setError, setSearchResults]);

  // Get search query from URL if exists
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    const lastContext = localStorage.getItem('lastContext');

    if (query) {
      setSearchQuery(query);
      setShowRecommendations(false);
      setShowSearchResults(true);
      handleSearchMovies(query);
    } else if (lastContext === 'search') {
      const savedQuery = localStorage.getItem('searchQuery');
      if (savedQuery) {
        setSearchQuery(savedQuery);
        setShowRecommendations(false);
        setShowSearchResults(true);
        handleSearchMovies(savedQuery);
      }
    }
  }, [location.search, handleSearchMovies, setSearchQuery]);

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

  const handleFetchRecommendations = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        await fetchRecommendations({
          setLoading,
          setError,
          setRecommendations,
          position,
          userProfile: { genres, mood, gender, age },
          seenMovies,
          likedMovies,
          dislikedMovies
        });
      }, (err) => {
        setError('Error getting geolocation data');
        setLoading(false);
      });
    } else {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
    }
  };

  const setLastContext = (str) => {
    localStorage.setItem('lastContext', str);
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

  return (
    <div>
      <button className="profile-btn" onClick={() => setShowInputs(!showInputs)}>
        {showInputs ? 'Hide profile' : 'Show profile'}
      </button>
      {showInputs && (
        <ProfileForm
          genres={genres} setGenres={setGenres}
          mood={mood} setMood={setMood}
          gender={gender} setGender={setGender}
          age={age} setAge={setAge}
          selectedServices={selectedServices} setSelectedServices={setSelectedServices}
        />
      )}
      <div className="suggestions-results relative">
        <div className='flex-between'>
          {showSearchResults ? (
            <>
              <button className='secondary-btn' onClick={() => { setShowRecommendations(true); setShowSearchResults(false); setLastContext('recommendations'); }}>
                Go to suggestions
              </button>
              <div>
                <input
                  className='search-input'
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a movie..."
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearchMovies(e.target.value); }}
                />
                <button disabled={loading} className='main-btn' onClick={() => handleSearchMovies(searchQuery)}>Search{loading ? 'ing...' : ''}</button>
              </div>
              <div></div>
            </>
          ) : (
            <>
              <button className='secondary-btn' onClick={() => { setShowSearchResults(true); setShowRecommendations(false); setLastContext('search');}}>
                Go to search
              </button>
              <button disabled={loading} className='main-btn' onClick={handleFetchRecommendations}>{!loading ? 'What should we watch, MovieGuru?' : 'Thinking...'}</button>
              {recommendations.length > 0 && <button className='main-btn' onClick={markAllAsSeen}>None of these</button>}
            </>
          )}
        </div>
        {error && <p>{error}</p>}
        {showRecommendations && recommendations.length > 0 && (
          <div>
            <div className="flex-2">
              <div className="flex-col">
                <h2 className="no-vert-m text-center">{loading ? 'Personalizing' : 'Personalized'} movie recommendations for you{loading ? '...' : null}</h2>
              </div>
            </div>
            <RecommendationsList
              recommendations={recommendations}
              activeBackdropIndex={activeBackdropIndex}
              likedMovies={likedMovies}
              likeMovie={likeMovie}
              dislikedMovies={dislikedMovies}
              dislikeMovie={dislikeMovie}
              seenMovies={seenMovies}
              markAsSeen={markAsSeen}
              selectedServices={selectedServices}
            />
          </div>
        )}
        {showSearchResults && searchResults.length > 0 && (
          <div>
            <h2 className='text-center no-vert-m'>Search Results {searchQuery && `for "${searchQuery}"`}</h2>
            <SearchResults
              results={searchResults}
              likedMovies={likedMovies}
              likeMovie={likeMovie}
              dislikedMovies={dislikedMovies}
              dislikeMovie={dislikeMovie}
              seenMovies={seenMovies}
              markAsSeen={markAsSeen}
              selectedServices={selectedServices}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieRecommendations;
