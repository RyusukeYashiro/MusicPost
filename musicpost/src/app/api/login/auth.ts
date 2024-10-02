//tokenを複合してあっているのかを確認する

import jwt from 'jsonwebtoken';
import {Config} from './config';
import { NextRequest, NextResponse } from 'next/server';
//トークンを確認するための関数
const authenticateToken = (req : NextRequest) => {
    try {
        //認証用トークンの設定
        const token = req.cookies.get('jwt')?.value

        if (!token) {
            return NextResponse.json({ message: 'トークンが見つかりません' }, { status: 401 });
        }
        //tokenが見つからない時の設定
        const decoded = jwt.verify(token , Config.jwt.secret);
        console.log(decoded);
        return NextResponse.next();
    } catch (err) {
        return NextResponse.json(
            {meg : '認証できませんでした'},
            {status : 401}
        )
    }

}
export  default authenticateToken;