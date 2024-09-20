import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import mysql from 'mysql2';


const db = mysql.createPool({
    host : process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export async function POST(request : NextRequest){
    try {
        const body = request.json();
    } catch {
        
    }
}

