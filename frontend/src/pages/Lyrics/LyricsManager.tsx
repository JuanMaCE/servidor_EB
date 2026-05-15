import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AudioLines, 
  Plus, 
  Trash2, 
  Edit3, 
  ScrollText, 
  X, 
  Check,
  Upload,
  FileText,
} from 'lucide-react';
import '../../styles/LyricsManager.css';

interface LyricEntry {
  id: number;
  songTitle: string;
  artist: string;
  content: string;
  fileName: string;
}

export default function LyricsManager() {
  const [lyricsList, setLyricsList] = useState<LyricEntry[]>([
    { 
      id: 1, 
      songTitle: "Blue Moonlight", 
      artist: "Deep Sky", 
      content: "Bajo la luna azul... (Letra completa aquí)",
      fileName: "blue_moonlight.txt"
    }
  ]);

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', artist: '', content: '', fileName: '' });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.lrc')) return;
    if (file.size > 1048576) return; // 1 MB límite

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const nameWithoutExt = file.name.replace(/\.(txt|lrc)$/i, '');
      setFormData(prev => ({
        ...prev,
        content,
        fileName: file.name,
        title: prev.title || nameWithoutExt,
      }));
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  };

  const clearFile = () => {
    setFormData(prev => ({ ...prev, content: '', fileName: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    if (isEditing !== null) {
      setLyricsList(lyricsList.map(l => l.id === isEditing
        ? { ...l, songTitle: formData.title, artist: formData.artist, content: formData.content, fileName: formData.fileName }
        : l
      ));
      setIsEditing(null);
    } else {
      setLyricsList([{
        id: Date.now(),
        songTitle: formData.title,
        artist: formData.artist,
        content: formData.content,
        fileName: formData.fileName,
      }, ...lyricsList]);
    }
    setFormData({ title: '', artist: '', content: '', fileName: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (lyric: LyricEntry) => {
    setIsEditing(lyric.id);
    setFormData({ title: lyric.songTitle, artist: lyric.artist, content: lyric.content, fileName: lyric.fileName });
  };

  const deleteLyric = (id: number) => {
    setLyricsList(lyricsList.filter(l => l.id !== id));
  };

  return (
    <div className="lyrics-manager">
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
          {/* Panel de Entrada */}
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

                {/* Drop Zone */}
                {!formData.content ? (
                  <div
                    className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.lrc"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Upload size={28} className="dz-icon" />
                    <span className="dz-label">Arrastrá tu archivo o hacé clic</span>
                    <span className="dz-sub">.txt o .lrc · máx 1 MB</span>
                  </div>
                ) : (
                  <div className="file-pill">
                    <FileText size={16} />
                    <span className="file-pill-name">{formData.fileName}</span>
                    <button type="button" className="file-pill-remove" onClick={clearFile}>
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn-primary-action">
                    {isEditing ? <Check size={20} /> : <Plus size={20} />}
                    {isEditing ? 'Actualizar' : 'Guardar Letra'}
                  </button>
                  {isEditing && (
                    <button type="button" className="btn-cancel-action" onClick={() => {
                      setIsEditing(null);
                      setFormData({ title: '', artist: '', content: '', fileName: '' });
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}>
                      <X size={20} /> Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* Panel de Lista */}
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
                        <small>{lyric.fileName}</small>
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