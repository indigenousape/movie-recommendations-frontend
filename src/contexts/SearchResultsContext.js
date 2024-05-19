import React, { createContext, useState } from 'react';

export const SearchResultsContext = createContext();

export const SearchResultsProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  return (
    <SearchResultsContext.Provider value={{ searchResults, setSearchResults, searchQuery, setSearchQuery, selectedServices, setSelectedServices }}>
      {children}
    </SearchResultsContext.Provider>
  );
};
