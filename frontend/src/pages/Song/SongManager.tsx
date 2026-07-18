import { useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit3, FileMusic, Trash2 } from 'lucide-react';
import { AppShell } from '../../components/AppShell';
import { FormActions } from '../../components/FormActions';
import { IconButton } from '../../components/IconButton';
import { StatusNotice } from '../../components/StatusNotice';
import { useSongLibrary } from '../../hooks/useSongLibrary';
import { createSong, deleteSong, updateSong } from '../../services/songs';
import type { Song } from '../../types/song';

const EMPTY_FORM = { name: '', artist: '', sequence: '' };

export default function SongManager() {
  const { songs, isLoading, error: loadError, reload } = useSongLibrary();
  const sequenceSongs = songs.filter((song) => song.sequence);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const resetForm = () => {
    setEditingSong(null);
    setForm(EMPTY_FORM);
    setActionError('');
  };

  const startEdit = (song: Song) => {
    setEditingSong(song);
    setForm({ name: song.name, artist: song.artist, sequence: song.sequence ?? '' });
    setActionError('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const input = {
      name: form.name.trim(),
      artist: form.artist.trim(),
      sequence: form.sequence.trim() || null,
      lyrics: editingSong?.lyrics ?? null,
    };
    if (!input.name || !input.artist || !input.sequence) {
      setActionError('Completa el título, el artista y la referencia de la secuencia.');
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
      setActionError(requestError instanceof Error ? requestError.message : 'No se pudo guardar la secuencia');
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
      setActionError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar la secuencia');
    }
  };

  return (
    <AppShell>
      <main className="manager-layout">
        <section className="glass-panel form-panel">
          <p className="eyebrow">Biblioteca</p>
          <h1>{editingSong ? 'Editar secuencia' : 'Nueva secuencia'}</h1>
          <p className="panel-description">Guarda la referencia que utiliza el servidor para localizar el archivo.</p>
          <form className="entity-form" onSubmit={handleSubmit}>
            <label>
              Título
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength={150} />
            </label>
            <label>
              Artista
              <input value={form.artist} onChange={(event) => setForm({ ...form, artist: event.target.value })} required maxLength={150} />
            </label>
            <label>
              Referencia de la secuencia
              <input value={form.sequence} onChange={(event) => setForm({ ...form, sequence: event.target.value })} placeholder="secuencias/cancion.mid" required />
            </label>
            {actionError && <p className="form-error" role="alert">{actionError}</p>}
            <FormActions isEditing={editingSong !== null} isSaving={isSaving} createLabel="Guardar secuencia" onCancel={resetForm} />
          </form>
        </section>

        <section className="library-panel">
          <div className="section-heading">
            <div><p className="eyebrow">Colección</p><h2>Secuencias <span>{sequenceSongs.length}</span></h2></div>
            <button type="button" className="button button-quiet" onClick={reload} disabled={isLoading}>Actualizar</button>
          </div>
          <StatusNotice loading={isLoading} error={loadError} empty={!sequenceSongs.length} emptyMessage="Aún no hay secuencias guardadas." onRetry={reload} />
          <div className="entity-list">
            <AnimatePresence>
              {sequenceSongs.map((song) => (
                <motion.article key={song.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="entity-card">
                  <div className="entity-main">
                    <span className="entity-icon"><FileMusic size={20} /></span>
                    <div className="entity-copy"><h3>{song.name}</h3><p>{song.artist}</p><small>{song.sequence}</small></div>
                  </div>
                  <div className="entity-actions">
                    <IconButton label={`Editar ${song.name}`} onClick={() => startEdit(song)}><Edit3 size={18} /></IconButton>
                    <IconButton label={`Eliminar ${song.name}`} tone="danger" onClick={() => handleDelete(song)}><Trash2 size={18} /></IconButton>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
