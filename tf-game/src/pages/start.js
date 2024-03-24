import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 20px;
`;

const Avatar = styled.img`
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  ${(props) => props.styles}
`;

const UsernameInput = styled.input`
  margin-top: 20px;
`;

function Start() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const avatars = [
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Molly',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Annie',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Oliver',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Bailey',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Boots',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Cuddles'
  ];

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSelectClick = () => {
  
    navigate('/mode', { state: { selectedAvatar, username } });
  };
  return (
    <Container>
      <h1>Select an avatar:</h1>
      <AvatarContainer>
        {avatars.map((avatar, index) => {
          const angle = (360 / avatars.length) * index;
          const styles = {
            transform: `rotate(${angle}deg) translate(150px) rotate(-${angle}deg)`
          };
          return (
            <Avatar key={index} src={avatar} onClick={() => handleAvatarClick(avatar)} styles={styles} />
          );
        })}
      </AvatarContainer>
      {selectedAvatar && <h2>You selected:</h2>}
      {selectedAvatar && <img src={selectedAvatar} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />}
      <UsernameInput type="text" value={username} onChange={handleUsernameChange} placeholder="Enter username" />
      <button onClick={handleSelectClick}>Select</button>
    </Container>
  );
}

export default Start;