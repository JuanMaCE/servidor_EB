import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AudioLines, 
  Plus, 
  Trash2, 
  Edit3, 
  ScrollText, 
  X, 
  Check, 
} from 'lucide-react';
import '../../styles/LyricsManager.css';

interface LyricEntry {
  id: number;
  songTitle: string;
  artist: string;
  content: string;
}

export default function LyricsManager() {
  const [lyricsList, setLyricsList] = useState<LyricEntry[]>([
    { 
      id: 1, 
      songTitle: "Blue Moonlight", 
      artist: "Deep Sky", 
      content: "Bajo la luna azul... (Letra completa aquí)" 
    }
  ]);

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', artist: '', content: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    if (isEditing !== null) {
      setLyricsList(lyricsList.map(l => l.id === isEditing ? { ...l, songTitle: formData.title, artist: formData.artist, content: formData.content } : l));
      setIsEditing(null);
    } else {
      const newEntry = {
        id: Date.now(),
        songTitle: formData.title,
        artist: formData.artist,
        content: formData.content
      };
      setLyricsList([newEntry, ...lyricsList]);
    }
    setFormData({ title: '', artist: '', content: '' });
  };

  const startEdit = (lyric: LyricEntry) => {
    setIsEditing(lyric.id);
    setFormData({ title: lyric.songTitle, artist: lyric.artist, content: lyric.content });
  };

  const deleteLyric = (id: number) => {
    setLyricsList(lyricsList.filter(l => l.id !== id));
  };

  return (
    <div className="lyrics-manager">
      {/* Luces de fondo */}
      <div className="glow-effect glow-top" />
      <div className="glow-effect glow-bottom" />

      <div className="manager-content">
        <header className="lyrics-header">
          <div className="logo-section">
            <AudioLines className="accent-blue" size={35} />
            <h1>Lyrics <span>Vault</span></h1>
          </div>
        </header>

        <main className="lyrics-grid">
          {/* Panel de Entrada (Izquierda) */}
          <section className="entry-panel">
            <div className="glass-panel">
              <h2 className="panel-title">
                {isEditing ? 'Editar Letra' : 'Subir Letra'}
              </h2>
              <form onSubmit={handleSubmit} className="lyrics-form">
                <input 
                  type="text" 
                  placeholder="Título de la canción" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="lyric-input"
                />
                <input 
                  type="text" 
                  placeholder="Artista" 
                  value={formData.artist}
                  onChange={(e) => setFormData({...formData, artist: e.target.value})}
                  className="lyric-input"
                />
                <textarea 
                  placeholder="Pega la letra aquí..." 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="lyric-textarea"
                />
                <div className="form-actions">
                  <button type="submit" className="btn-primary-action">
                    {isEditing ? <Check size={20} /> : <Plus size={20} />}
                    {isEditing ? 'Actualizar' : 'Guardar Letra'}
                  </button>
                  {isEditing && (
                    <button type="button" className="btn-cancel-action" onClick={() => {setIsEditing(null); setFormData({title:'', artist:'', content:''})}}>
                      <X size={20} /> Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* Panel de Lista (Derecha) */}
          <section className="display-panel">
            <div className="display-header">
              <h3>Letras Guardadas <span>({lyricsList.length})</span></h3>
            </div>

            <div className="lyrics-scroll">
              <AnimatePresence>
                {lyricsList.map((lyric) => (
                  <motion.div 
                    key={lyric.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="lyric-card"
                  >
                    <div className="lyric-info">
                      <div className="lyric-icon">
                        <ScrollText size={20} />
                      </div>
                      <div className="lyric-text">
                        <h4>{lyric.songTitle}</h4>
                        <p>{lyric.artist}</p>
                        <small>{lyric.content.substring(0, 40)}...</small>
                      </div>
                    </div>
                    
                    <div className="lyric-btns">
                      <button onClick={() => startEdit(lyric)} className="lyric-btn-edit">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => deleteLyric(lyric.id)} className="lyric-btn-delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}