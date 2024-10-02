import { Algorithm } from 'jsonwebtoken';

//JWTの構造を定義
export const Config = {
    jwt : {
        secret : process.env.JWT_SECRET || 'fallback_secret_key',
        options : {
            algorithm : 'HS256' as Algorithm,
            expiresIn : '1h',
        },
    },
};

