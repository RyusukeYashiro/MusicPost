import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { MappedTrack } from "../../../types/mappedTrack";
import authenticateToken from "../login/auth";

interface postType {
    ms: MappedTrack;
    postContent: string;
}

export interface DecodedUser {
    id: string;
    username: string;
}
export async function POST(request: NextRequest) {
    try {
        //JWT認証をする関数
        const user = authenticateToken(request) as DecodedUser | null;
        if (!user) {
            console.error('認証に失敗したのでログインし直してください')
            return NextResponse.json({ error: "認証に失敗しました。再度ログインしてください。" }, { status: 401 });
        }

        const { ms, postContent }: postType = await request.json();

        //重複チェックする処理
        const existingMusic = await db.query("select * from music where id = $1 limit 1", [ms.id]);

        if (!existingMusic.rows || existingMusic.rows.length === 0) {
            const resultInsert = await db.query(
                "insert into music (id , name , album_art_url , music_url, artist , artist_url , preview_url) values ($1,$2,$3,$4,$5,$6,$7)",
                [
                    ms.id,
                    ms.name,
                    ms.albumArt,
                    ms.musicUrl,
                    ms.artist,
                    ms.artistUrl,
                    ms.preview_url
                ],
            );

            const musicResult = resultInsert.rows;

            if (!musicResult && !("affectedRows" in musicResult)) {
                return NextResponse.json({ message: "failed creating music db!" }, { status: 500 });
            }
        }

        const postMusic = await db.query("insert into posts (content , user_id , user_name , music_id) values($1 , $2 , $3 , $4)", [
            postContent,
            user.id,
            user.username,
            ms.id,
        ]);

        if (!postMusic.rows && !("affectedRows" in postMusic.rows)) {
            return NextResponse.json({ message: "failed creating post db!" }, { status: 500 });
        }

        return NextResponse.json({ message: "scusess! insert!" }, { status: 200 });
    } catch (err) {
        console.error("Error searching", err);
        return NextResponse.json({ err: "failed to insert db" }, { status: 500 });
    }
}
