import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './components/Search';
import MovieDetail from './components/MovieDetail';
import { RecommendationsProvider } from './contexts/RecommendationsContext';
import { SearchProvider } from './contexts/SearchContext';

function App() {
  return (
    <RecommendationsProvider>
      <SearchProvider>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<Search />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/recommendations" element={<Search />} />
            </Routes>
          </div>
        </Router>
      </SearchProvider>
    </RecommendationsProvider>
  );
}

export default App;
