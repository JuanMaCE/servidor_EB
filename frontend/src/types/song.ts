export interface SongDto {
  id: number;
  name: string;
  file_seq: string | null;
  file_lyric: string | null;
}

export interface ArtistDto {
  id: number;
  name: string;
}

export interface SongArtistDto {
  id: number;
  song_id: number;
  artist_id: number;
}

export interface Song {
  id: number;
  name: string;
  artist: string;
  artistIds: number[];
  relationIds: number[];
  sequence: string | null;
  lyrics: string | null;
}

export interface SaveSongInput {
  name: string;
  artist: string;
  sequence: string | null;
  lyrics: string | null;
}
