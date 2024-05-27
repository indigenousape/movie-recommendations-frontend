import React, { createContext, useState, useEffect } from 'react';

export const RecommendationsContext = createContext();

const streamingServices = [
  { id: 'netflix', name: 'Netflix' },
  { id: 'hulu', name: 'Hulu' },
  { id: 'disney', name: 'Disney+' },
  { id: 'prime', name: 'Prime Video' },
  { id: 'hbo', name: 'Max' },
  { id: 'apple', name: 'Apple' },
  { id: 'paramount', name: 'Paramount+' },
  { id: 'peacock', name: 'Peacock' },
  { id: 'starz', name: 'Starz' },
  { id: 'cbs', name: 'CBS All Access' },
  { id: 'showtime', name: 'Showtime' },
  { id: 'tubi', name: 'Tubi' },
  { id: 'crackle', name: 'Crackle' },
  { id: 'imdb', name: 'IMDb TV' },
  { id: 'roku', name: 'Roku Channel' }
];

export const RecommendationsProvider = ({ children }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [seenMovies, setSeenMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState(() => {
    const savedLikedMovies = localStorage.getItem('likedMovies');
    return savedLikedMovies ? JSON.parse(savedLikedMovies) : [];
  });
  const [dislikedMovies, setDislikedMovies] = useState(() => {
    const savedDislikedMovies = localStorage.getItem('dislikedMovies');
    return savedDislikedMovies ? JSON.parse(savedDislikedMovies) : [];
  });

  const [selectedServices, setSelectedServices] = useState(() => {
    const savedServices = localStorage.getItem('selectedServices');
    return savedServices ? JSON.parse(savedServices) : streamingServices.map(service => service.id);
  });

  useEffect(() => {
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
  }, [likedMovies]);

  useEffect(() => {
    localStorage.setItem('dislikedMovies', JSON.stringify(dislikedMovies));
  }, [dislikedMovies]);

  useEffect(() => {
    localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
  }, [selectedServices]);

  return (
    <RecommendationsContext.Provider value={{
      recommendations,
      setRecommendations,
      seenMovies,
      setSeenMovies,
      likedMovies,
      setLikedMovies,
      dislikedMovies,
      setDislikedMovies,
      selectedServices,
      setSelectedServices,
    }}>
      {children}
    </RecommendationsContext.Provider>
  );
};
