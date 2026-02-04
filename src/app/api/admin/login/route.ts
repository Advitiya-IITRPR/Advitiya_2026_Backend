import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"


export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()
        // Check email or password provided or not, if provided then check it is correct or not. 
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "Email and Password are required"
            }, { status: 404 })
        }
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({
                success: false,
                message: "Email or password is INCORRECT."
            }, { status: 400 })
        }

        // Generating the token and set it into cookies.
        const token = jwt.sign(
            {
                email: process.env.ADMIN_EMAIL,
                role: "ADMIN"
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '4d'
            }
        )

        const res = NextResponse.json(
            { success: true, message: "Admin Logged In Successfully" },
            { status: 200 }
        );

        // Set CORS headers
        res.headers.set("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:3000");
        res.headers.set("Access-Control-Allow-Credentials", "true");

        // Set cookie
        res.cookies.set("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/admin",
            maxAge: 3600*24*4
        });

        return res;

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })

    }
}