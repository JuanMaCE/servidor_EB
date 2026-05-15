import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music2, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Play, 
  X,
  Check
} from 'lucide-react';
import '../../styles/MusicManager.css';

interface Song {
  id: number;
  title: string;
  artist: string;
}

export default function MusicManager() {
  const [songs, setSongs] = useState<Song[]>([
    { id: 1, title: "Blue Moonlight", artist: "Deep Sky" },
    { id: 2, title: "Ocean Waves", artist: "Azure Echo" }
  ]);
  
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newArtist) return;

    if (isEditing !== null) {
      setSongs(songs.map(s => s.id === isEditing ? { ...s, title: newTitle, artist: newArtist } : s));
      setIsEditing(null);
    } else {
      const newSong = {
        id: Date.now(),
        title: newTitle,
        artist: newArtist
      };
      setSongs([newSong, ...songs]);
    }
    setNewTitle('');
    setNewArtist('');
  };

  const startEdit = (song: Song) => {
    setIsEditing(song.id);
    setNewTitle(song.title);
    setNewArtist(song.artist);
  };

  const deleteSong = (id: number) => {
    setSongs(songs.filter(s => s.id !== id));
  };

  return (
    <div className="manager-container">
      {/* Background Glows */}
      <div className="bg-glow glow-1" />
      <div className="bg-glow glow-2" />

      <div className="content-wrapper">
        <header className="manager-header">
          <div className="brand">
            <Music2 className="icon-blue" size={32} />
            <h1>EB Music <span>Studio</span></h1>
          </div>
        </header>

        <main className="manager-main">
          {/* Formulario de Subida/Edición */}
          <section className="form-section">
            <div className="glass-card form-card">
              <h2>{isEditing ? 'Editar Canción' : 'Subir Nueva Canción'}</h2>
              <form onSubmit={handleAddOrUpdate} className="music-form">
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Título de la canción" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Artista" 
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-action">
                  {isEditing ? <Check size={20} /> : <Plus size={20} />}
                  {isEditing ? 'Guardar Cambios' : 'Subir Canción'}
                </button>
                {isEditing && (
                  <button type="button" className="btn-cancel" onClick={() => {setIsEditing(null); setNewTitle(''); setNewArtist('');}}>
                    <X size={20} /> Cancelar
                  </button>
                )}
              </form>
            </div>
          </section>

          {/* Lista de Canciones */}
          <section className="list-section">
            <div className="list-header">
              <h3>Tu Biblioteca <span>({songs.length})</span></h3>
            </div>
            
            <div className="songs-grid">
              <AnimatePresence>
                {songs.map((song) => (
                  <motion.div 
                    key={song.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-card song-item"
                  >
                    <div className="song-info">
                      <div className="play-icon">
                        <Play size={18} fill="currentColor" />
                      </div>
                      <div>
                        <h4>{song.title}</h4>
                        <p>{song.artist}</p>
                      </div>
                    </div>
                    
                    <div className="song-actions">
                      <button onClick={() => startEdit(song)} className="btn-icon edit">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => deleteSong(song.id)} className="btn-icon delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {songs.length === 0 && (
                <p className="empty-state">No hay canciones. ¡Sube tu primera pista!</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}