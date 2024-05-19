import React from 'react';
import { Link } from 'react-router-dom';

function SearchResults({ results, searchQuery }) {
  return (
    <div>
      <h3>Search Results: {searchQuery}</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {results.map((movie, index) => (
          <div key={index} style={{ margin: '10px', textAlign: 'center' }}>
            <Link to={`/movie/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '200px', height: 'auto' }}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
