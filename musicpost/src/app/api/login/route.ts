import { formSchema } from "@/validations/schema";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import { Config } from "./config";

interface User extends RowDataPacket {
    id: number;
    name: string;
    password: string;
    // 他の必要なフィールドを追加
}

interface JwtType {
    secret: string;
    options: {
        algorithm: jwt.Algorithm;
        expiresIn: string;
    };
}

const jwtConfig: JwtType = Config.jwt;

export async function POST(request: NextRequest, res: NextResponse) {
    try {
        const body = await request.json();
        console.log("リクエストをオブジェクトとする", body);

        const [isRegistered] = await db.query<User[]>("select * from users where name = ? limit 1", [body.username]);

        if (Array.isArray(isRegistered) && isRegistered.length === 0) {
            return NextResponse.json({ error: "ユーザー名かパスワードが正しくありません" }, { status: 401 });
        }

        const user = isRegistered[0] as User;
        console.log(user);
        console.log("this is pass", body.password);
        const isPass = await bcrypt.compare(body.password, user.password);
        console.log(isPass);

        //サーバーサイドへのresponseにcookieをセットして紐付ける。
        if (!isPass) {
            return NextResponse.json({ error: "ユーザー名かパスワードが正しくありません" }, { status: 401 });
        }

        //暗号化する中身
        const payload = {
            username: user.name,
            id: user.id,
        };

        const token = jwt.sign(payload, jwtConfig.secret, jwtConfig.options);

        const response = NextResponse.json({ message: "ログインに成功しました" }, { status: 200 });
        //next.jsではsetを使用。
        // そしてこれをクライアントサイドにクッキーとして情報を渡している。
        response.cookies.set("jwt", token, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 3600,
        });

        return response;
    } catch (err) {
        if (err instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid json error" }, { status: 400 });
        } else {
            console.error("Unexpected error", err);
            return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
        }
    }
}
