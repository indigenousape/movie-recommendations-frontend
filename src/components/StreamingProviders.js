import React from 'react';
import { filterStreamingProviders } from '../utilities/utils';

const StreamingProviders = ({ providers, selectedServices }) => (
  <div>
    {Object.entries(providers).map(([country, providers]) => (
      <div key={country}>
        {filterStreamingProviders(providers, selectedServices).length > 0 ? <h3 className='no-btm-m'>Watch now</h3> : null}
        {filterStreamingProviders(providers, selectedServices).map((provider, index) => (
          <p key={index} className='no-vert-m'>
            <a href={provider.link} target="_blank" rel="noopener noreferrer">
              <img
                src={provider.service.imageSet.lightThemeImage}
                alt={provider.service.name}
                style={{ width: '100px', height: 'auto' }}
              />
            </a>
          </p>
        ))}
      </div>
    ))}
  </div>
);

export default StreamingProviders;
