import { NextResponse } from "next/server";

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
    return NextResponse.json({ error: "アクセストークンの取得に失敗しました" }, { status: 500 });
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
