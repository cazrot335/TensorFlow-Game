import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';
import RockImage from './assets/images/rock.png';
import PaperImage from './assets/images/paper.png';  
import ScissorsImage from './assets/images/scissors.png';
import * as fp from 'fingerpose';
import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose';

// import { victoryDescription }  from './assets/models/scissor';
// import {Rock} from './assets/models/rock';
// import {PaperGesture} from './assets/models/paper';




// Rock gesture
const rockGesture = new fp.GestureDescription('rock');

// Thumb
rockGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
rockGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 1.0);
rockGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 0.9);
rockGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 0.9);

// All fingers
for(let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    rockGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    rockGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
}

// Index
rockGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 1.0);
rockGesture.addDirection(fp.Finger.Index, fp.FingerDirection.HorizontalLeft, 1.0);
rockGesture.addDirection(fp.Finger.Index, fp.FingerDirection.HorizontalRight, 1.0);
rockGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpRight, 1.0);





// Paper gesture
const paperGesture = new fp.GestureDescription('paper');

// All fingers
for (let finger of [
    fp.Finger.Thumb,
    fp.Finger.Index,
    fp.Finger.Middle,
    fp.Finger.Ring,
    fp.Finger.Pinky
]) {
    paperGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
}

// Index, Middle, Ring, Pinky
for (let finger of [
    fp.Finger.Index,
    fp.Finger.Middle,
    fp.Finger.Ring,
    fp.Finger.Pinky
]) {
    paperGesture.addDirection(finger, fp.FingerDirection.HorizontalLeft, 0.95);
    paperGesture.addDirection(finger, fp.FingerDirection.HorizontalRight, 0.95);
}

// Thumb
paperGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight, 0.5);
paperGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 0.5);






// Scissors gesture
const scissorsGesture = new fp.GestureDescription('scissors');

// Thumb
scissorsGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 0.5);

// Index
scissorsGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
scissorsGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);

// Middle
scissorsGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
scissorsGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0);

// Ring
scissorsGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);

// Pinky
scissorsGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);










function Singleplayer() {
 
  const location = useLocation();
  const { selectedAvatar = '', username = '' } = location.state || {};
  const choices = ['rock', 'paper', 'scissors'];
  const choiceImages = { rock: RockImage, paper: PaperImage, scissors: ScissorsImage };
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [net, setNet] = useState(null);
  const [detecting, setDetecting] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runHandpose = async () => {
      await tf.setBackend('webgl');
      const net = await handpose.load();
      setInterval(() => {
        detect(net);
      }, 100);
    };

    runHandpose();
  }, []);

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      setDetecting(true);
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
  
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
  
      const hand = await net.estimateHands(video);
      if (hand.length > 0) {
        const gestures = [rockGesture, paperGesture, scissorsGesture];
        const GE = new fp.GestureEstimator(gestures);
  
        const gesture = await GE.estimate(hand[0].landmarks, 2.0); // Lower confidenceThreshold
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const maxConfidence = gesture.gestures.reduce((maxIndex, currentGesture, index, array) => {
            return currentGesture.confidence > array[maxIndex].confidence ? index : maxIndex;
          }, 0);
          const name = gesture.gestures[maxConfidence].name;
          console.log(`Detected gesture: ${name}`);
          handleUserChoice(name);
        }
      }
      setDetecting(false);
    }
  };

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

  const restartGame = () => {
    setUserScore(0);
    setBotScore(0);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px' }}>
        <div>
          <h1>{username}</h1>
          <img src={selectedAvatar} alt="Selected avatar" />
          {userChoice && <img src={choiceImages[userChoice]} alt={userChoice} />}
        </div>
        <div>
        <h1>Score: {userScore} - {botScore}</h1>
          <div>
          <button onClick={restartGame}>Restart</button>
        {net && !detecting && <button onClick={detect}>Next Round</button>}
      </div>
        </div>
        <div>
          <h1>Bot</h1>
          <img src="https://api.dicebear.com/8.x/bottts/svg?backgroundType=gradientLinear,solid" alt="Bot avatar" />
          {botChoice && <img src={choiceImages[botChoice]} alt={botChoice} />}
        </div>
      </div>
      <div>
        <Webcam ref={webcamRef} style={{ marginTop: '20px', width: 320, height: 240 }} />
        <canvas ref={canvasRef} style={{ position: 'absolute', marginLeft: 'auto', marginRight: 'auto', left: 0, right: 0, textAlign: 'center', zindex: 9, width: 320, height: 240 }} />
      </div>
    </div>
  );

}

export default Singleplayer;