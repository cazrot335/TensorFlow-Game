import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import Rock from './assets/images/rock.png';
import Paper from './assets/images/paper.png';  
import Scissors from './assets/images/scissors.png';
async function createModel() {
  await tf.ready(); // Make sure the TensorFlow.js is ready
  const model = await handpose.load();
  return model;
}

const model = createModel();

function Singleplayer() {
 
  const location = useLocation();
  const { selectedAvatar = '', username = '' } = location.state || {};
  const choices = ['rock', 'paper', 'scissors'];
  const choiceImages = { rock: Rock, paper: Paper, scissors: Scissors };
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);


  const handleUserChoice = (choice) => {
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(choice);
    setBotChoice(botChoice);

    if ((choice === 'rock' && botChoice === 'scissors') ||
        (choice === 'scissors' && botChoice === 'paper') ||
        (choice === 'paper' && botChoice === 'rock')) {
      setUserScore(userScore + 1);
    } else if (choice !== botChoice) {
      setBotScore(botScore + 1);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <h1>{username}</h1>
        <img src={selectedAvatar} alt="Selected avatar" />
        {userChoice && <img src={choiceImages[userChoice]} alt={userChoice} />}
      </div>
      <div>
        <h1>Score: {userScore} - {botScore}</h1>
        <div>
          <button onClick={() => handleUserChoice('rock')}>Rock</button>
          <button onClick={() => handleUserChoice('paper')}>Paper</button>
          <button onClick={() => handleUserChoice('scissors')}>Scissors</button>
        </div>
      </div>
      <div>
        <h1>Bot</h1>
        <img src="https://api.dicebear.com/8.x/bottts/svg?backgroundType=gradientLinear,solid" alt="Bot avatar" />
        {botChoice && <img src={choiceImages[botChoice]} alt={botChoice} />}
      </div>
    </div>
  );
}

export default Singleplayer;