import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Mode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedAvatar, username } = location.state;

  const handleSinglePlayerClick = () => {
    navigate('/mode/singleplayer');
  };

  const handleMultiplayerClick = () => {
    navigate('/mode/multiplayer');
  };

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <img src={selectedAvatar} style={{ width: '100px', height: '100px', borderRadius: '50%' }} alt="Selected avatar" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button style={{ marginRight: '10px' }} onClick={handleSinglePlayerClick}>Single Player Match</button>
        <button onClick={handleMultiplayerClick}>Multiplayer Match</button>
      </div>
    </div>
  );
}

export default Mode;
