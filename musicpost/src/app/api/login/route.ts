import { formSchema } from "@/validations/schema";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from 'bcrypt';
import { RowDataPacket } from "mysql2";
import { error } from "console";

interface User extends RowDataPacket {
    id: number;
    username: string;
    password: string;
    // 他の必要なフィールドを追加
}

export async function POST(request : NextRequest){
    try {
        const body = await request.json();
        console.log("リクエストをオブジェクトとする" , body);

        const [isRegistered] = await db.query<User[]>(
            'select * from users where name = ? limit 1',
            [body.username]
        );

        if(Array.isArray(isRegistered) && isRegistered.length === 0) {
            return NextResponse.json(
                {error : 'ユーザー名かパスワードが正しくありません'},
                {status : 401}
            )
        }

        const user = isRegistered[0] as User;
        console.log(user);
        console.log("this is pass" , body.password);
        const isPass = await bcrypt.compare(body.password , user.password);
        console.log(isPass);
        if(isPass){
            return NextResponse.json(
                {message : 'ユーザーが正しく作成されました'},
                {status : 200}
            );
        } else {
            return NextResponse.json(
                {error : "ユーザー名かパスワードが正しくありません"},
                {status : 404}
            );
        }
    } catch(err) {
        if(err instanceof SyntaxError) {
            return NextResponse.json(
                {error : 'Invalid json error'},
                {status : 400}
            )
        } else {
            console.error('Unexpected error' , err);
            return NextResponse.json(
                {error : 'Unexpected error'},
                {status : 500}
            )
        } 
    }
}