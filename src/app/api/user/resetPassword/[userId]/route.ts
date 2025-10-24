import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest,{params}:{params: {userId: string}}){
    try {
        const {newPassword,resetPasswordCode} = await req.json()

        const urlParams = await params
        const userId = urlParams.userId


        if(!userId){
            return NextResponse.json({
                success: false,
                message: "User id is required"
            },{status: 404})
        }

        if(!newPassword || !resetPasswordCode){
            return NextResponse.json({
                success: false,
                message: "New Password and Reset Password is required"
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
                message: "User does not exist with this user id"
            },{status: 400})
        }
        if(!user.resetPasswordCode){
            return NextResponse.json({
                success: false,
                message: "Reset Password code is expired, please generate new one."
            },{status: 400})
        }
        else if(resetPasswordCode!==user.resetPasswordCode){
            return NextResponse.json({
                success: false,
                message: "OTP Code is incorrect"
            },{status: 400})
        }


        if(!user.resetPasswordCodeExpiry || (user.resetPasswordCodeExpiry &&  new Date(Date.now())>user.resetPasswordCodeExpiry)){
            return NextResponse.json({
                success: false,
                message: "OTP Code is expired, please generate new one. "
            },{status: 400})
        }

        const newHashedPassword = await bcrypt.hash(newPassword,10)

        const updatedUser = await prisma.user.update({
            where:{
                id: userId
            },
            data:{
                password: newHashedPassword,
                resetPasswordCode: null,
                resetPasswordCodeExpiry: null
            }
        })

        return NextResponse.json({
            success: true,
            message: "Password Changed successfully"
        },{status: 200})


    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Server error while reseting password."
        },{status: 500})
        
    }
}