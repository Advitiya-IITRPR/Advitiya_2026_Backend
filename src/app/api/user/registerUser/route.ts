import { sendEmail } from "@/helper/sendEmail";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    try {
        // Taking the Data from request.
        const userData = await req.json()
        const userName = userData.userName as string
        const email = userData.email as string
        const mobileNo= userData.mobileNo as string
        const password = userData.password as string


        if(!userName || !email || !mobileNo || !password){
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            },{status: 404})
        }

        // Check User already exists or not.
        const checkUserExists = await prisma.user.findFirst({
            where:{
                email: email
            }
        })

        if(checkUserExists){
            return NextResponse.json({
                success: false,
                message: "User with this email id already exists."
            },{status:400})
        }   

        const hashedPassword = await bcrypt.hash(password,10);

        const createUser = await prisma.user.create({
            data:{
                userName,
                email,
                mobileNo,
                password: hashedPassword
            }
        })

        const emailResponse = await sendEmail({email: createUser.email, emailType: "VERIFY",userId: createUser.id})

        if(emailResponse.status!==200){
            return NextResponse.json({
                success: false,
                message: "Error while sending the email"
            },{status: 500})
        }


        if(!emailResponse || emailResponse.status!==200){
            return NextResponse.json({
                success: false,
                message: "Error while sending email user"
            })
        }


        return NextResponse.json({
            success: true,
            data: createUser,
            message: "User Created Successfully."
        },{status: 200})



        
    } catch (error:any) {
        return NextResponse.json({
            success: false,
            message: error.message
        },{status:500})
        
    }
}