import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import MovieRecommendations from './MovieRecommendations';
import { SearchContext } from '../contexts/SearchContext';


function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { searchResults, setSearchResults } = useContext(SearchContext);
  const [recommendations, setRecommendations] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const searchTerm = searchParams.get('q');
    if (searchTerm) {
      setQuery(searchTerm);
      searchTitles(searchTerm);
    }
  }, [searchParams]);

  const searchTitles = async (searchTerm) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/search?q=${searchTerm}`);
      console.log('Search results:', response.data);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

function getCurrentTimePeriod() {
    const now = new Date();
    const hours = now.getHours();
  
    if (hours > 12) {
      return hours + 'pm';
    } else {
      return hours + 'am';
    }

  }
  

  const handleSearch = () => {
    searchTitles(query);
  };

  // const getRecommendations = async () => {
  //   const currentTimePeriod = getCurrentTimePeriod();
  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_API_URL}/recommendations`, { currentTime: currentTimePeriod });
  //     setRecommendations(response.data);
  //   } catch (error) {
  //     console.error('Error fetching recommendations:', error);
  //   }
  // };

  const filterSearchResults = (results) => {
    return results.filter(result => result.poster_path && result.overview);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a title..."
      />
      <button onClick={handleSearch}>Search</button>
      
      <MovieRecommendations />

      <div className="flex">
        {filterSearchResults(results).map(title => (
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
      </div>
    </div>
  );
}

export default Search;
