"use server";
import { MappedTrack } from "@/types/mappedTrack";
import { db } from "../lib/db";
import { cookies } from 'next/headers'
import { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken'
import { Config } from "./api/login/config";
import { Post } from '../types/serverType';
import { PostContent } from './userSet/[username]/page'
// mysql2ライブラリとの型の互換性を保証

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
//メモリに保存する。
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

const getToken = async () => {
    const currentTime = Date.now();

    //現在の時間が、期限時間より大きかったら、まだ時間があり
    if (cachedToken && currentTime > tokenExpiry) {
        console.log("this no need to create token");
        return cachedToken;
    }
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (!response.ok) {
        throw new Error(`spotifyToken Error ${response.status}`);
    } else {
        console.log("success getting access token", response);
        const data = await response.json();
        //トークン情報を保持
        cachedToken = data.access_token;
        //トークンの時間を更新。今回トークンは１時間（3600）なので1000をかけて分に換算
        tokenExpiry = currentTime + data.expires_in * 1000;
        return cachedToken;
    }
};

export default getToken;

export const getLatestPost = async () => {
    try {
        const posts = await db.query<Post>(`
            select user_id, music_id, content ,user_name
            from posts 
            order by id desc
            limit 20
        `);

        const musicIds = posts.rows.map((post) => post.music_id);

        const musicInfoRaw = await db.query(
            `
            select id, name, album_art_url, music_url, artist, artist_url, preview_url 
            from music
            where id = any($1::varchar[])
            `,
            [musicIds]
        );

        const musicInfo: MappedTrack[] = musicInfoRaw.rows.map(music => ({
            id: music.id,
            name: music.name,
            albumArt: music.album_art_url,
            musicUrl: music.music_url,
            artist: music.artist,
            artistUrl: music.artist_url,
            preview_url: music.preview_url
        }));

        return { posts: posts.rows, musicInfo };
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

export const getUserInfo = async (): Promise<string | JwtPayload | undefined> => {
    const cookieStore = cookies(); // cookiesを取得
    console.log("all cookie", cookieStore);
    const token = cookieStore.get('jwt')?.value;
    if (!token) return undefined;
    const decoded = jwt.verify(token, Config.jwt.secret);
    if (decoded) {
        return (decoded);
    }
    return undefined;
}

export const getUserData = async (holdName: string) => {

    console.log('確認', holdName);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/userSetProf`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: holdName })
    });

    if (!response.ok) {
        console.error('Request URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/userSetProf`);
        console.error('Request body:', holdName);
        throw new Error(`fetch Error : ${response.status}`);
    }

    const data = await response.json();
    console.log('dataの確認', data);
    return (data);
}

//mysqlのdelete用の型定義を行

export const deltePost = async (selectContent: (PostContent | null)) => {
    try {
        if (!selectContent?.id) {
            throw new Error("投稿IDが選択されていません");
        }

        const result = await db.query(
            'DELETE FROM posts WHERE id = $1',
            [selectContent.id]
        );

        if ('affectedRows' in result.rows && result.rows.affectedRows === 0) {
            return { success: false, message: "削除対象の投稿が見つかりませんでした" };
        }

        return { success: true, message: `ID ${selectContent.id} の投稿が正常に削除されました` };
    } catch (err) {
        console.error('削除操作中にエラーが発生しました:', err);
        return {
            success: false,
            message: err instanceof Error ? err.message : '不明なエラーが発生しました'
        };
    }
}
