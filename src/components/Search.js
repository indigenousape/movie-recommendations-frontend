import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SearchContext } from '../contexts/SearchContext';
import MovieRecommendations from './MovieRecommendations';

function Search() {
  const [query, setQuery] = useState('');
  const { searchResults, setSearchResults } = useContext(SearchContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/search`, { params: { q: query } });
      console.log(response);
      setSearchResults(response.data);
    } catch (error) {
      setError('Error fetching search results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search for Movies</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button type="submit">Search</button>
      </form>
      <MovieRecommendations />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul className="flex">
        {searchResults.map(title => (
          <div key={title.id}>
            <Link to={`/movie/${title.id}?q=${query}`}>{title.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/original/${title.poster_path}`}
                alt={title.title}
                style={{ width: '200px', height: 'auto' }}
              />
            )}</Link>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Search;
