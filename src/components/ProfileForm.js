// ProfileForm.js

import React from 'react';
import StreamingServiceSelector from './StreamingServiceSelector';

const ProfileForm = ({
  genres, setGenres,
  mood, setMood,
  gender, setGender,
  age, setAge,
  selectedServices, setSelectedServices
}) => (
  <div className="profile-container active">
    <h2>Your Profile</h2>
    <div className="flex-cols">
      <label>
        <span>Favorite Genres:</span>
        <input type="text" value={genres} onChange={(e) => setGenres(e.target.value)} placeholder="e.g., action, comedy" />
      </label>
      <label>
        <span>Mood:</span>
        <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} placeholder="e.g., relaxing, adventurous" />
      </label>
      <label>
        <span>Gender:</span>
        <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="e.g., male, female" />
      </label>
      <label>
        <span>Age:</span>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 25" />
      </label>
    </div>
    <StreamingServiceSelector selectedServices={selectedServices} setSelectedServices={setSelectedServices} />
  </div>
);

export default ProfileForm;
