export interface Post {
    id: number;
    user_id: number;
    music_id: string;
    user_name: string;
    content: string;
}


export interface RawMusicData {
    id: string;
    name: string;
    album_art_url: string;
    music_url: string;
    artist: string;
    artist_url: string;
    preview_url: string | undefined;
}
