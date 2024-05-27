import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { delay, filterStreamingProviders } from '../utilities/utils';

const cache = {};  // Define cache outside the component

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loaded, setLoaded] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');
  const [lastView, setLastView] = useState('recommendations');

  useEffect(() => {
    const fetchMovieDetails = async (movieId) => {
      if (cache[movieId]) {
        setMovie(cache[movieId]);  // Set state from cache
        await delay(200);
        setLoaded(true);
        console.log('Fetched movie details from cache:', movieId);
        return;
      }

      try {
        console.log(`Fetching details for movie ID: ${movieId}`);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/movie/${movieId}`);
        cache[movieId] = response.data;
        console.log('Fetched movie details:', response.data);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        await delay(200);
        setLoaded(true);
      }
    };
    fetchMovieDetails(id);  // Pass the movieId to the function

    // Get last view from local storage or default to 'recommendations'
    const savedLastView = localStorage.getItem('lastView') || 'recommendations';
    setLastView(savedLastView);
  }, [id]);

  const simpleNumberFormat = new Intl.NumberFormat('en-US', { notation: 'compact' });
  const pluralize = (count, noun) => count === 1 ? noun : noun + 's';

  const runtimeFormat = (runtime) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    const pluralizeHours = pluralize(hours, 'hr');
    return hours > 0 ? `${hours}${pluralizeHours} ${minutes}mins` : `${minutes}mins`;
  };

  const getMPAARating = (movie) => {
    if (!movie.release_dates) {
      return 'Not Rated';
    }

    const ratings = movie.release_dates.results;
    const usRating = ratings.find(country => country.iso_3166_1 === 'US');
    const rating = usRating ? usRating.release_dates.find(release => release.certification !== '') : null;
    return rating ? rating.certification : 'Not Rated';
  }

  const handleBack = () => {
    const lastContext = localStorage.getItem('lastContext');
    const path = lastContext === 'search' ? `/?q=${query || ''}` : '/';
    navigate(path);
  };

  return (
    <div>
      {movie ? (
        <div>
          {movie.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
              alt={movie.title}
              className='backdrop-image active'
            />
          )}
          <div className="detail-container">
            <button className="back-btn" onClick={handleBack}>Back</button>
            <div className='flex flex-50 align-center movie-detail-columns'>
              <div>{movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                  alt={movie.title}
                  className={`movie-detail-img ${loaded ? 'active' : ''}`}
                />
              )}
              </div>
              <div className={`relative ${loaded ? 'active' : ''}`}>
                <div className='opacity-layer'></div>
                <div className="flex-2-col">
                  <h1 className="no-vert-m">{movie.title}</h1>
                  <div>
                    <p className="text-center no-vert-m">IMDB <strong>{movie.vote_average.toFixed(1)}</strong>/10 <small className="block">({simpleNumberFormat.format(movie.vote_count)} votes)</small></p>
                  </div>
                </div>
                <p>{movie.tagline}</p>
                <p>{getMPAARating(movie)} | {movie.release_date.substring(0, 4)} | {runtimeFormat(movie.runtime)} | {movie.genres.map(genre => genre.name + '. ')}</p>
                {movie.streamingProviders && (
                  <div>
                    {Object.entries(movie.streamingProviders).map(([country, providers]) => (
                      <div key={country}>
                        {filterStreamingProviders(providers).length > 0 && <h3 className="no-btm-m">Watch now</h3>}
                        {filterStreamingProviders(providers).map((provider, index) => (
                          <a className="streaming-link" key={index} href={provider.link} target="_blank" rel="noopener noreferrer">
                            <img
                              src={provider.service.imageSet.lightThemeImage}
                              alt={provider.service.name}
                              style={{ width: '100px', height: 'auto' }}
                            />
                          </a> 
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                <p>{movie.overview}</p>
                <div className="flex-2">
                {movie.cast && movie.cast.length > 0 && <div>
                    <h3>Cast:</h3>
                    <ul>
                      {movie.cast.slice(0, 5).map((actor, index) => ( // Display only the first 5 actors  
                        <li key={index}>{actor}</li>
                      ))}
                    </ul>
                  </div>}
                  {movie.directors && movie.directors.length > 0 && <div> 
                    <h3>Director{movie.directors.length === 1 ? '' : 's'}:</h3>
                    <ul>
                      {movie.directors.map((director, index) => (
                        <li key={index}>{director}</li>
                      ))}
                    </ul>
                  </div>}
                </div>
                {movie.revenue > 0 && movie.budget > 0 && <div><h3>Box Office:</h3>
                <ul>
                  <li>Box office: ${simpleNumberFormat.format(movie.revenue)}</li>
                  <li>Budget: ${simpleNumberFormat.format(movie.budget)}</li>
                </ul>
                </div>
                }
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default MovieDetail;
