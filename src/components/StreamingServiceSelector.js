import React, { useEffect } from 'react';

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

const StreamingServiceSelector = ({ selectedServices, setSelectedServices }) => {
  useEffect(() => {
    const storedServices = JSON.parse(localStorage.getItem('selectedServices'));
    if (storedServices && storedServices.length) {
      setSelectedServices(storedServices);
    } else {
      // Initialize with all streaming services checked by default
      const defaultServices = streamingServices.map(service => service.id);
      setSelectedServices(defaultServices);
      localStorage.setItem('selectedServices', JSON.stringify(defaultServices));
    }
  }, [setSelectedServices]);

  useEffect(() => {
    localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
  }, [selectedServices]);

  const handleServiceChange = (id) => {
    setSelectedServices(prevServices =>
      prevServices.includes(id)
        ? prevServices.filter(serviceId => serviceId !== id)
        : [...prevServices, id]
    );
  };

  const handleCheckAll = () => {
    const allServices = streamingServices.map(service => service.id);
    setSelectedServices(allServices);
  };

  const handleClearAll = () => {
    setSelectedServices([]);
  };

  return (
    <div className="flex gtc-1">
      <h3 className='no-vert-m'>Streaming Services</h3>
      <div className="checkboxes">
        {streamingServices.map(service => (
          <label key={service.id}>
            <input
              type="checkbox"
              checked={selectedServices.includes(service.id)}
              onChange={() => handleServiceChange(service.id)}
            />
            {service.name}
          </label>
        ))}
      </div>
      <div>
        <button onClick={handleCheckAll}>Check All</button>
        <button onClick={handleClearAll}>Clear All</button>
      </div>
    </div>
  );
};

export default StreamingServiceSelector;
