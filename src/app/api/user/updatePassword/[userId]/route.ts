import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest,{params}:{params: {userId: string}}){
    try {
        const {currentPassword, newPassword,confirmPassword} = await req.json()
        const session = await getServerSession()

        const urlParams = await params
        const userId = urlParams.userId

        if(!session){
            return NextResponse.json({
                success: false,
                message: "User must be logged in to change password"
            },{status: 400})
        }

        if(!currentPassword || !newPassword || !confirmPassword){
            return NextResponse.json({
                success: false,
                message: "New Password and Old Password is required"
            },{status: 404})
        }
        
        if(newPassword!==confirmPassword){
            return NextResponse.json({
                success: false,
                message: "New Password and confirm Password does not match"
            },{status: 400})
        }
        const user = await prisma.user.findFirst({
            where:{
                id: userId
            }
        })


        if(!user){
            return NextResponse.json({
                success: false,
                message: "User does not exists with this user id"
            },{status: 400})
        }

        
        const isPasswordCorrect = await bcrypt.compare(currentPassword,user.password)

        if(!isPasswordCorrect){
            return NextResponse.json({
                success: false,
                message: "Current Password is not correct."
            },{status: 400})
        }

        const newHashedPassword = await bcrypt.hash(newPassword,10)

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data:{
                password: newHashedPassword
            }
        })

        return NextResponse.json({
            success: true,
            message: "Password updated successfully"
        },{status: 200})
        
    } catch (error:any) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: error.message
        },{status: 500})
        
    }
}