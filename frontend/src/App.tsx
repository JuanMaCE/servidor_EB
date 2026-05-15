import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import SongManager from './pages/Song/SongManager';
import LyricsManager from './pages/Lyrics/LyricsManager';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/songs" element={<SongManager />} />
        <Route path="/lyrics" element={<LyricsManager />} />
      </Routes>
      
    </Router>
  );
}

export default App;