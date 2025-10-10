import { sendEmail } from "@/helper/sendEmail";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest,{params}: {params: {userId: string}}){
    try {
        const urlParams = await params
        const userId = urlParams.userId
        // TYPE Must be: VERIFY OR RESET
        const {type} = await req.json()

        if(!userId){
            return NextResponse.json({
                success: false,
                message: "User id is required."
            },{status: 404})
        }

        const user = await prisma.user.findFirst({
            where:{
                id: userId
            }
        })

        if(!user){
            return NextResponse.json({
                success: false,
                message: "User does not exists"
            },{status: 400})
        }

        const emailResponse = await sendEmail({email: user.email, emailType: type,userId: user.id})

        if(emailResponse.status!==200){
            return NextResponse.json({
                success: false,
                message: "Error while sending the email"
            },{status: 500})
        }


        return NextResponse.json({
            success: true,
            message: "otp email send successfully",
            emailResponse: emailResponse
        },{status: 200})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Server Error while sending reset password."
        },{status: 500})
        
    }
}