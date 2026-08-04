import { useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Edit3, FileMusic, Trash2 } from 'lucide-react';
import { AppShell } from '../../components/AppShell';
import { FileDropzone } from '../../components/FileDropzone';
import { FormActions } from '../../components/FormActions';
import { IconButton } from '../../components/IconButton';
import { StatusNotice } from '../../components/StatusNotice';
import { useSongLibrary } from '../../hooks/useSongLibrary';
import { createSong, deleteSequence, getSequenceDownloadUrl, updateSong, uploadSequence } from '../../services/songs';
import type { Song } from '../../types/song';

interface SequenceForm {
  name: string;
  artist: string;
  currentSequence: string;
  file: File | null;
}

const EMPTY_FORM: SequenceForm = { name: '', artist: '', currentSequence: '', file: null };
const MAX_SEQUENCE_SIZE = 20 * 1024 * 1024;
const SEQUENCE_EXTENSIONS = /\.(mid|midi|mp3|wav)$/i;

export default function SongManager() {
  const { songs, isLoading, error: loadError, reload } = useSongLibrary();
  const sequenceSongs = songs.filter((song) => song.sequence);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState('');

  const resetForm = () => {
    setEditingSong(null);
    setForm(EMPTY_FORM);
    setActionError('');
  };

  const startEdit = (song: Song) => {
    setEditingSong(song);
    setForm({ name: song.name, artist: song.artist, currentSequence: song.sequence ?? '', file: null });
    setActionError('');
  };

  const selectSequence = (file: File) => {
    if (!SEQUENCE_EXTENSIONS.test(file.name)) {
      setActionError('El archivo debe ser .mid, .midi, .mp3 o .wav.');
      return;
    }
    if (file.size > MAX_SEQUENCE_SIZE) {
      setActionError('El archivo no puede superar 20 MB.');
      return;
    }
    setForm((current) => ({ ...current, file }));
    setActionError('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const name = form.name.trim();
    const artist = form.artist.trim();
    if (!name || !artist || (!form.file && !form.currentSequence)) {
      setActionError('Completa el título, el artista y selecciona una secuencia.');
      return;
    }

    setIsSaving(true);
    setActionError('');
    try {
      const uploaded = form.file ? await uploadSequence(form.file) : null;
      const input = {
        name,
        artist,
        sequence: uploaded?.file_seq ?? form.currentSequence,
        lyrics: editingSong?.lyrics ?? null,
      };
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
    const detail = song.lyrics ? 'La letra se conservará.' : 'También se eliminará la canción porque no contiene una letra.';
    if (!window.confirm(`¿Eliminar la secuencia de "${song.name}"? ${detail}`)) return;
    setDeletingId(song.id);
    setActionError('');
    try {
      await deleteSequence(song);
      if (editingSong?.id === song.id) resetForm();
      reload();
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar la secuencia');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell>
      <main className="manager-layout">
        <section className="glass-panel form-panel">
          <p className="eyebrow">Biblioteca</p>
          <h1>{editingSong ? 'Editar secuencia' : 'Nueva secuencia'}</h1>
          <p className="panel-description">Sube el archivo que el servidor conservará para compartirlo con la biblioteca.</p>
          <form className="entity-form" onSubmit={handleSubmit}>
            <label>
              Título
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength={150} />
            </label>
            <label>
              Artista
              <input value={form.artist} onChange={(event) => setForm({ ...form, artist: event.target.value })} required maxLength={150} />
            </label>
            {form.currentSequence && !form.file && (
              <p className="current-file">La secuencia actual se conservará si no seleccionas otra.</p>
            )}
            <FileDropzone
              accept=".mid,.midi,.mp3,.wav"
              label={editingSong ? 'Seleccionar un archivo para reemplazarlo' : 'Seleccionar o arrastrar una secuencia'}
              hint=".mid, .midi, .mp3 o .wav; máximo 20 MB"
              selectedName={form.file?.name}
              onSelect={selectSequence}
              onClear={() => setForm((current) => ({ ...current, file: null }))}
            />
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
                    <a className="icon-button icon-button-download" href={getSequenceDownloadUrl(song.sequence ?? '')} aria-label={`Descargar ${song.name}`} title={`Descargar ${song.name}`} download><Download size={18} /></a>
                    <IconButton label={`Editar ${song.name}`} onClick={() => startEdit(song)}><Edit3 size={18} /></IconButton>
                    <IconButton label={`Eliminar ${song.name}`} tone="danger" disabled={deletingId === song.id} onClick={() => handleDelete(song)}><Trash2 size={18} /></IconButton>
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
