import { apiRequest, toApiUrl } from './api';
import type { ArtistDto, SaveSongInput, Song, SongArtistDto, SongDto } from '../types/song';

const PAGE_LIMIT = 100;

interface UploadedFileDto {
  filename: string;
  file_seq: string;
}

export function getSequenceDownloadUrl(fileSequence: string): string {
  const path = fileSequence.split('/').map(encodeURIComponent).join('/');
  return toApiUrl(`/files/sequences/${path}`);
}

function toSong(song: SongDto, artists: ArtistDto[], relations: SongArtistDto[]): Song {
  const songRelations = relations.filter((relation) => relation.song_id === song.id);
  const artistNames = songRelations
    .map((relation) => artists.find((artist) => artist.id === relation.artist_id)?.name)
    .filter((name): name is string => Boolean(name));

  return {
    id: song.id,
    name: song.name,
    artist: artistNames.join(', ') || 'Artista no disponible',
    artistIds: songRelations.map((relation) => relation.artist_id),
    relationIds: songRelations.map((relation) => relation.id),
    sequence: song.file_seq,
    lyrics: song.file_lyric,
  };
}

export async function getSongs(signal?: AbortSignal): Promise<Song[]> {
  const options = signal ? { signal } : {};
  const [songs, artists, relations] = await Promise.all([
    apiRequest<SongDto[]>(`/songs/?limit=${PAGE_LIMIT}`, options),
    apiRequest<ArtistDto[]>(`/artists/?limit=${PAGE_LIMIT}`, options),
    apiRequest<SongArtistDto[]>(`/song-artists/?limit=${PAGE_LIMIT}`, options),
  ]);

  return songs.map((song) => toSong(song, artists, relations));
}

export async function createSong(input: SaveSongInput): Promise<void> {
  await apiRequest<SongDto>('/songs/', {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      file_seq: input.sequence,
      file_lyric: input.lyrics ?? '',
      artist_ids: [],
      new_artists: [{ name: input.artist }],
    }),
  });
}

export async function uploadSequence(file: File): Promise<UploadedFileDto> {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest<UploadedFileDto>('/files/sequences/', {
    method: 'POST',
    body: formData,
  });
}

export async function updateSong(song: Song, input: SaveSongInput): Promise<void> {
  await apiRequest<SongDto>(`/songs/${song.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: input.name,
      file_seq: input.sequence,
      file_lyric: input.lyrics ?? '',
      artist_ids: song.artistIds,
      new_artists: [],
    }),
  });

  if (input.artist !== song.artist) {
    const artist = await apiRequest<ArtistDto>('/artists/', {
      method: 'POST',
      body: JSON.stringify({ name: input.artist }),
    });
    await Promise.all(song.relationIds.map((id) => apiRequest<void>(`/song-artists/${id}`, { method: 'DELETE' })));
    await apiRequest<SongArtistDto>('/song-artists/', {
      method: 'POST',
      body: JSON.stringify({ song_id: song.id, artist_id: artist.id }),
    });
  }
}

export async function deleteSong(song: Song): Promise<void> {
  await Promise.all(song.relationIds.map((id) => apiRequest<void>(`/song-artists/${id}`, { method: 'DELETE' })));
  await apiRequest<void>(`/songs/${song.id}`, { method: 'DELETE' });
}

export async function deleteSequence(song: Song): Promise<void> {
  if (!song.lyrics) {
    await deleteSong(song);
    return;
  }

  await updateSong(song, {
    name: song.name,
    artist: song.artist,
    sequence: null,
    lyrics: song.lyrics,
  });
}

export async function deleteLyrics(song: Song): Promise<void> {
  if (!song.sequence) {
    await deleteSong(song);
    return;
  }

  await updateSong(song, {
    name: song.name,
    artist: song.artist,
    sequence: song.sequence,
    lyrics: null,
  });
}
