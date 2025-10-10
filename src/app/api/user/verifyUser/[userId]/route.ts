import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest,{params}: {params: {userId: string}}){
    try {
        // Extracting the userId from params
        const urlParams = await params
        const id = urlParams.userId as string

        const {verificationCode} = await req.json()

        if(!id){
            return NextResponse.json({
                success: false,
                message: "User is required"
            },{status: 404})
        }

        // Check user exist or not.
        const isUserExists = await prisma.user.findFirst({
            where:{
                id: id
            }
        })

        if(!isUserExists){
            return NextResponse.json({
                success: false,
                message :"User does not exist"
            })
        }

        // Checking Verification Code is expired or not. 
        if(!isUserExists.verificationCode || !isUserExists.verificationCodeExpiry || isUserExists.verificationCodeExpiry<new Date(Date.now())){
            return NextResponse.json({
                success: false,
                message: "Verification Code is Expired, Please generate new expiry code"
            },{status: 400})
        }

        // Check user is already or not.
        if(isUserExists.isVerified){
            return NextResponse.json({
                success: true,
                message: "User is already verified"
            },{status: 400})
        }

        if(isUserExists.verificationCode !== verificationCode){
            return NextResponse.json({
                success: false,
                message: "Invalid Verification Code"
            },{status: 400})
        }


        // Updating as user is verified.
        const updatedUser = await prisma.user.update({
            where: {
                id: id
            },
            data:{
                isVerified: true,
                verificationCode: null,
                verificationCodeExpiry: null
            }
        })

        return NextResponse.json({
            success: true,
            data: updatedUser,
            message: "User Verified Successfully"
        },{status: 200})

        
    } catch (error:any) {
        return NextResponse.json({
            success: false,
            message: error.message
        },{status: 500})
    }
}