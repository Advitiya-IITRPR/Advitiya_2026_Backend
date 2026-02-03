import prisma from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest){
    try {
        const {userName, email, mobileNo, gender ,collegeName, paymentVerified, paymentMade, mealsLeft} = await req.json()

        if(!userName || !email || !mobileNo || !gender || !collegeName || !paymentVerified || !paymentMade || !mealsLeft){
            return NextResponse.json({
                success: false,
                message: "All Fields are required"
            },{status: 404})
        }

        // Check that the user already exist with this email id or not.
        const isUserExist = await prisma.accomodationDetails.findFirst({
            where:{
                email: email
            }
        })

        if(isUserExist){
            return NextResponse.json({
                success: false,
                message: "User already exist with this email id"
            },{status: 400})
        }

        if(gender!=="Male" && gender!=="Female"){
            return NextResponse.json({
                success: false,
                message: "Gender is not selected correctly"
            },{status: 400})
        }

        let paymentStatus = false;
        
        if(paymentVerified==="True")    paymentStatus=  true;

        const accomodationCreated = await prisma.accomodationDetails.create({
            data:{
                userName, email, mobileNo, gender, collegeName, 
                paymentMade: parseInt(paymentMade),
                paymentVerified: paymentStatus,
                mealTaken: parseInt(mealsLeft)
            }
        })

        return NextResponse.json({
            success: true,
            message: "Accomodation Registered successfully",
            data: accomodationCreated
        })
        
    } catch (error:any) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: error.message
        },{status:500})
        
    }
}