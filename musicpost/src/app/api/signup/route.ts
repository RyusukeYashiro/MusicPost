import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import  { formSchema } from '../../../validations/schema';
import { ZodError } from "zod";
import bcrypt from 'bcrypt';
import { db } from '../../../lib/db';

export async function POST(request : NextRequest){
    try {
        //jsのオブジェクト形式にする処理
        const body = await request.json();
        console.log("リクエストをオブジェクト変換したもの" , body);
        //validationをここでチェック
        const validation = formSchema.parse(body);

        //重複しているユーザーがいないかチェックする処理
        //検索を早めるためにlimit 1をつける
        const [exitUser]  = await db.query(
            'SELECT * FROM users WHERE name = ? limit 1',
            [validation.username]
        );

        if(Array.isArray(exitUser) && exitUser.length > 0){
            return NextResponse.json(
                {error : 'ユーザーはすでに存在しています'},
                {status : 409}
            )
        }

        //パスワードのハッシュ
        const hashedPassword = await bcrypt.hash(validation.password , 10);
        console.log('hash化したパス' , hashedPassword);

        const [result] = await db.query(
            'insert into users (name , password , email) value (? , ? ,?)',
            [validation.username , hashedPassword , validation.email]
        );
        if(result && 'affectedRows' in result && result.affectedRows > 0){
            return NextResponse.json(
                {message : 'ユーザーが正しく作成されました'},
                {status : 200}
            );
            
        } else {
            return NextResponse.json(
                { error: 'ユーザーの作成に失敗しました' },
                { status: 500 }
            );
        }
    } catch (error) {
        //validation checkが通らなかった時にここに入る。zodはエラーになるとzodErrorインスタンスを返す
        if(error instanceof ZodError){
            //NextResponseでjsonの型を持つレスポンスを作成
            // zodのerrorsバリデーションエラーの配列.path,messageなどが入っている
            return NextResponse.json({
                error : 'validation error',
                errors : error.errors.map(err => ({
                    path : err.path,
                    message : err.message
                }))
                },
                {status : 400}
            )
        } else if(error instanceof SyntaxError){
            return NextResponse.json(
                {error : 'InValid json error'},
                {status : 400}
            )
        } else {
            console.error('Unexpected error' , error);
            return NextResponse.json(
                {error : 'Unexpected error'},
                {status : 500}
            )
        }
    }
}
