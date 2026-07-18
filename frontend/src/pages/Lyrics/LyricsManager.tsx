import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, FormEvent, KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit3, FileText, ScrollText, Trash2, Upload, X } from 'lucide-react';
import { AppShell } from '../../components/AppShell';
import { FormActions } from '../../components/FormActions';
import { IconButton } from '../../components/IconButton';
import { StatusNotice } from '../../components/StatusNotice';
import { useSongLibrary } from '../../hooks/useSongLibrary';
import { createSong, deleteSong, updateSong } from '../../services/songs';
import type { Song } from '../../types/song';

const EMPTY_FORM = { name: '', artist: '', lyrics: '', fileName: '' };
const MAX_FILE_SIZE = 1024 * 1024;

export default function LyricsManager() {
  const { songs, isLoading, error: loadError, reload } = useSongLibrary();
  const lyricSongs = songs.filter((song) => song.lyrics);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setEditingSong(null);
    setForm(EMPTY_FORM);
    setActionError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const readFile = (file: File) => {
    if (!/\.(txt|lrc)$/i.test(file.name)) {
      setActionError('Selecciona un archivo .txt o .lrc.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setActionError('El archivo no puede superar 1 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      setForm((current) => ({
        ...current,
        lyrics: reader.result as string,
        fileName: file.name,
        name: current.name || file.name.replace(/\.(txt|lrc)$/i, ''),
      }));
      setActionError('');
    };
    reader.onerror = () => setActionError('No se pudo leer el archivo.');
    reader.readAsText(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) readFile(file);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) readFile(file);
  };

  const handleDropKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const startEdit = (song: Song) => {
    setEditingSong(song);
    setForm({ name: song.name, artist: song.artist, lyrics: song.lyrics ?? '', fileName: 'Letra guardada' });
    setActionError('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const input = {
      name: form.name.trim(),
      artist: form.artist.trim(),
      sequence: editingSong?.sequence ?? null,
      lyrics: form.lyrics.trim() || null,
    };
    if (!input.name || !input.artist || !input.lyrics) {
      setActionError('Completa el título, el artista y la letra.');
      return;
    }
    setIsSaving(true);
    setActionError('');
    try {
      if (editingSong) await updateSong(editingSong, input);
      else await createSong(input);
      resetForm();
      reload();
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : 'No se pudo guardar la letra');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (song: Song) => {
    if (!window.confirm(`¿Eliminar "${song.name}"? Esta acción no se puede deshacer.`)) return;
    setActionError('');
    try {
      await deleteSong(song);
      if (editingSong?.id === song.id) resetForm();
      reload();
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar la letra');
    }
  };

  return (
    <AppShell>
      <main className="manager-layout">
        <section className="glass-panel form-panel">
          <p className="eyebrow">Archivo de letra</p>
          <h1>{editingSong ? 'Editar letra' : 'Nueva letra'}</h1>
          <p className="panel-description">Importa un archivo o edita directamente su contenido.</p>
          <form className="entity-form" onSubmit={handleSubmit}>
            <label>Título<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength={150} /></label>
            <label>Artista<input value={form.artist} onChange={(event) => setForm({ ...form, artist: event.target.value })} required maxLength={150} /></label>
            {!form.lyrics ? (
              <div className={`drop-zone ${isDragging ? 'is-dragging' : ''}`} role="button" tabIndex={0} onKeyDown={handleDropKey} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept=".txt,.lrc" onChange={handleFileChange} hidden />
                <Upload size={26} /><strong>Selecciona o arrastra un archivo</strong><span>.txt o .lrc, máximo 1 MB</span>
              </div>
            ) : (
              <div className="file-pill"><FileText size={17} /><span>{form.fileName || 'Contenido escrito'}</span><button type="button" aria-label="Quitar letra" onClick={() => setForm({ ...form, lyrics: '', fileName: '' })}><X size={15} /></button></div>
            )}
            <label>Contenido<textarea value={form.lyrics} onChange={(event) => setForm({ ...form, lyrics: event.target.value, fileName: form.fileName || 'Contenido escrito' })} rows={9} placeholder="Escribe o importa la letra..." /></label>
            {actionError && <p className="form-error" role="alert">{actionError}</p>}
            <FormActions isEditing={editingSong !== null} isSaving={isSaving} createLabel="Guardar letra" onCancel={resetForm} />
          </form>
        </section>

        <section className="library-panel">
          <div className="section-heading"><div><p className="eyebrow">Colección</p><h2>Letras <span>{lyricSongs.length}</span></h2></div><button type="button" className="button button-quiet" onClick={reload} disabled={isLoading}>Actualizar</button></div>
          <StatusNotice loading={isLoading} error={loadError} empty={!lyricSongs.length} emptyMessage="Aún no hay letras guardadas." onRetry={reload} />
          <div className="entity-list">
            <AnimatePresence>
              {lyricSongs.map((song) => (
                <motion.article key={song.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="entity-card">
                  <div className="entity-main"><span className="entity-icon"><ScrollText size={20} /></span><div className="entity-copy"><h3>{song.name}</h3><p>{song.artist}</p><small>Letra disponible</small></div></div>
                  <div className="entity-actions"><IconButton label={`Editar ${song.name}`} onClick={() => startEdit(song)}><Edit3 size={18} /></IconButton><IconButton label={`Eliminar ${song.name}`} tone="danger" onClick={() => handleDelete(song)}><Trash2 size={18} /></IconButton></div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
