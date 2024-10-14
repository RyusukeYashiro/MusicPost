import getToken from '../../../action';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();
        const token = await getToken();
        if (!token) {
            return NextResponse.json({ error: "Failed to get token" }, { status: 401 });
        }
        console.log("Doing confirm token ", token);
        //URLで使用するためにエンコードする処理。
        const changequery = encodeURIComponent(query);
        const response = await fetch(`https://api.spotify.com/v1/search?q=${changequery}&type=track&limit=40`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "failed to search spotify" }, { status: response.status });
        }

        const data = await response.json();
        console.log("this is scusecc!", data);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error searching", error);
        return NextResponse.json({ error: "failed tp search spotify " }, { status: 500 });
    }
}
