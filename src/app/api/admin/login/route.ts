import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"


export async function POST(req: NextRequest){
    try {
        const {email,password}= await req.json()
        // Check email or password provided or not, if provided then check it is correct or not. 
        if(!email || !password){
            return NextResponse.json({
                success: false,
                message: "Email and Password are required"
            },{status: 404})
        }
        if(email !== process.env.ADMIN_EMAIL || password !==process.env.ADMIN_PASSWORD){
            return NextResponse.json({
                success: false,
                message: "Email or password is INCORRECT."
            },{status: 400})
        }

        // Generating the token and set it into cookies.
        const token = jwt.sign(
            {
                email:process.env.ADMIN_EMAIL,
                role: "ADMIN"
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '1h'
            }
        )

        const response = NextResponse.json({success: true,message: "Admin Logged In Successfully"},{status: 200})

        response.cookies.set('token',token,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/admin'
        })

        return response

    } catch (error:any) {
        return NextResponse.json({
            success: false,
            message: error.message
        },{status:500})
        
    }
}