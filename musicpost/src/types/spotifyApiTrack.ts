export interface SpotifyApiTrack {
    id: string;
    name: string;
    album?: {
        images: Array<{ url: string }>;
    };
    external_urls?: {
        spotify: string;
    };
    artists?: Array<{
        name: string;
        external_urls?: {
            spotify: string;
        };
    }>;
    preview_url: string | null;
}
