import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LyricsManager from './pages/Lyrics/LyricsManager';
import SongManager from './pages/Song/SongManager';

function NotFound() {
  return (
    <main className="not-found">
      <div>
        <h1>404</h1>
        <p>La página que buscas no existe.</p>
        <Link className="button button-primary" to="/">Volver al inicio</Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/songs" element={<SongManager />} />
        <Route path="/lyrics" element={<LyricsManager />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
