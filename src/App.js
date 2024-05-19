import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecommendationsProvider } from './contexts/RecommendationsContext';
import { SearchResultsProvider } from './contexts/SearchResultsContext';
import MovieRecommendations from './components/MovieRecommendations';
import MovieDetail from './components/MovieDetail';

function App() {
  return (
    <Router>
      <RecommendationsProvider>
        <SearchResultsProvider>
          <Routes>
            <Route path="/" element={<MovieRecommendations />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </SearchResultsProvider>
      </RecommendationsProvider>
    </Router>
  );
}

export default App;
