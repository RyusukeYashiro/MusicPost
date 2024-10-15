// ユーザー情報をとってくる処理
// ここではユーザーの投稿内容を一覧で表示させる
import { db } from '../../../lib/db';
import { NextRequest, NextResponse } from "next/server";
import { Post } from '../../../types/serverType';
import { MappedTrack } from '@/types/mappedTrack';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('リクエストの中身を確認 in POST', body);

        const UserPosts = await db.query<Post>(`
            select id , user_id , music_id , content , user_name 
            from posts
            where user_name = $1
            order by id desc
            `,
            [String(body.username)]
        );

        const musicIds = UserPosts.rows.map((post) => post.music_id);

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

        return NextResponse.json({ UserPosts, musicInfo });
    } catch (err) {
        console.error('Error fetching UserPosts', err);
        return NextResponse.json({ error: 'failed to UserPost' }, { status: 500 });
    }
}