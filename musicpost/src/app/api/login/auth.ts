//tokenを複合してあっているのかを確認する

import jwt from "jsonwebtoken";
import { Config } from "./config";
import { NextRequest, NextResponse } from "next/server";
//トークンを確認するための関数
const authenticateToken = (req: NextRequest) => {
    try {
        //認証用トークンの設定
        const token = req.cookies.get("jwt")?.value;
        //tokenが見つからないとき
        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, Config.jwt.secret);
        console.log(decoded);
        return decoded;
    } catch (err) {
        console.error("this is error in authToken");
        return null;
    }
};
export default authenticateToken;
