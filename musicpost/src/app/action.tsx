"use server";
import { RowDataPacket } from "mysql2";
import { MappedTrack } from "@/types/mappedTrack";
import { db } from "../lib/db";
import { RedirectType } from "next/navigation";
import { cookies } from 'next/headers'

// mysql2ライブラリとの型の互換性を保証
export interface Post extends RowDataPacket {
    user_id: number;
    music_id: string;
    user_name: string;
    content: string;
}

interface RawMusicData extends RowDataPacket {
    id: string;
    name: string;
    album_art_url: string;
    music_url: string;
    artist: string;
    artist_url: string;
    preview_url: string | undefined;
}

export const getLatestPost = async () => {
    try {
        const [posts] = await db.query<Post[]>(`
            select user_id, music_id, content ,user_name
            from Posts 
            order by id desc
            limit 20
        `);

        const musicIds = posts.map((post) => post.music_id);

        const [musicInfoRaw] = await db.query<RawMusicData[]>(
            `
            select id, name, album_art_url, music_url, artist, artist_url, preview_url 
            from Music
            where id in (?)
            `,
            [musicIds]
        );

        const musicInfo: MappedTrack[] = musicInfoRaw.map(music => ({
            id: music.id,
            name: music.name,
            albumArt: music.album_art_url,
            musicUrl: music.music_url,
            artist: music.artist,
            artistUrl: music.artist_url,
            preview_url: music.preview_url
        }));

        return { posts, musicInfo };
    } catch (err) {
        console.error("Error Fetching latest posts", err);
        throw new Error("Failed to fetch latest posts");
    }
};

export const logOutUser = (): boolean => {
    try {
        cookies().set({
            name: 'jwt',
            value: '',
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0)
        });
        return (true);
    } catch (err) {
        console.error(err);
        return (false);
    }
}