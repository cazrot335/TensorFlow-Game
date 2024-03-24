import {BrowserRouter ,Route, Routes} from 'react-router-dom';
import './App.css';
import Start from './pages/start';
function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Start/>} />
   </Routes>
   </BrowserRouter>
  );
}

export default App;
