import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Start from './pages/start';
import Mode from './pages/mode';
import Singleplayer from './pages/singleplayer';
import Multiplayer from './pages/multiplayer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/mode" element={<Mode />} />
        <Route path="/singleplayer" element={<Singleplayer />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
