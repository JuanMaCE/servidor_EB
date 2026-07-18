import { useEffect, useState } from 'react';
import { getSongs } from '../services/songs';
import type { Song } from '../types/song';

export function useSongLibrary() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getSongs(controller.signal)
      .then(setSongs)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar la biblioteca');
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const reload = () => {
    setIsLoading(true);
    setError('');
    setReloadKey((key) => key + 1);
  };

  return {
    songs,
    isLoading,
    error,
    reload,
  };
}
