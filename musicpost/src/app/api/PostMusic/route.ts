import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { MappedTrack } from "../../../types/mappedTrack";
import { cookies } from "next/headers";
import authenticateToken from "../login/auth";

interface postType {
  ms: MappedTrack;
  postContent: string;
}

interface DecodedUser {
  id: string;
}
export async function POST(request: NextRequest) {
  try {
    //JWT認証をする関数
    const user = authenticateToken(request) as DecodedUser | null;
    if (!user) {
      return NextResponse.json({ error: "認証に失敗しました。再度ログインしてください。" }, { status: 401 });
    }

    const { ms, postContent }: postType = await request.json();

    //重複チェックする処理
    const [existingMusic] = await db.query("select * from Music where id = ? limit 1", [ms.id]);

    if (!existingMusic) {
      const [musicResult] = await db.query(
        "insert into Music (id , name , albumArt , musicUrl, artist , artistUrl , preview_url) value (?,?,?,?,?,?,?)",
        [ms.id, ms.name, ms.albumArt, ms.musicUrl, ms.artist, ms.artistUrl, ms.preview_url],
      );

      if (!musicResult && !("affectedRows" in musicResult)) {
        return NextResponse.json({ message: "failed creating music db!" }, { status: 500 });
      }
    }

    const [postMusic] = await db.query("insert into Posts (content , user_id , music_id) value (? , ? , ?)", [
      postContent,
      user.id,
      ms.id,
    ]);

    if (!postMusic && !("affectedRows" in postMusic)) {
      return NextResponse.json({ message: "failed creating post db!" }, { status: 500 });
    }

    return NextResponse.json({ message: "scusess! insert!" }, { status: 200 });
  } catch (err) {
    console.error("Error searching", err);
    return NextResponse.json({ err: "failed to insert db" }, { status: 500 });
  }
}
