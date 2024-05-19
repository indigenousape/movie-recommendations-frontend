import React from 'react';

const streamingServices = [
  { id: 'netflix', name: 'Netflix' },
  { id: 'hulu', name: 'Hulu' },
  { id: 'disney', name: 'Disney+' },
  { id: 'prime', name: 'Prime Video' },
  { id: 'hbo', name: 'Max' },
  { id: 'apple', name: 'Apple' },
  { id: 'paramount', name: 'Paramount' },
  { id: 'peacock', name: 'Peacock' },
  { id: 'starz', name: 'Starz' },
  { id: 'cbs', name: 'CBS All Access' },
  { id: 'showtime', name: 'Showtime' },
  { id: 'tubi', name: 'Tubi' },
  { id: 'crackle', name: 'Crackle' },
  { id: 'pluto', name: 'Pluto TV' },
  { id: 'imdb', name: 'IMDb TV' },
  { id: 'roku', name: 'Roku Channel' }
];

function StreamingServiceSelector({ selectedServices, setSelectedServices }) {
  const handleCheckboxChange = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((service) => service !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <h4>Select your streaming services:</h4>
      {streamingServices.map((service) => (
        <div key={service.id}>
          <label>
            <input
              type="checkbox"
              checked={selectedServices.includes(service.id)}
              onChange={() => handleCheckboxChange(service.id)}
            />
            {service.name}
          </label>
        </div>
      ))}
    </div>
  );
}

export default StreamingServiceSelector;
