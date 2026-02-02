import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { JWTPayload } from "jose"
import prisma from "@/lib/prisma"



export async function POST(req: NextRequest){
    try {
        const {QRCodeData} = await req.json()

        if(!QRCodeData){
            return NextResponse.json({
                success: false,
                message: "QR Code Data is required"
            },{status: 404})
        }

        const decodedValues = await jwt.verify(QRCodeData,process.env.JWT_SECRET!) as JWTPayload

        if(!decodedValues.id){
            return NextResponse.json({
                success: false,
                message: "Invalid QR Code"
            },{status: 400})
        }

        // Check that the accomodation details exist or not. 
        const accomodationDetails = await prisma.accomodationDetails.findFirst({
            where:{
                id: decodedValues.id
            }
        })

        if(!accomodationDetails){
            return NextResponse.json({
                success: false,
                message: "Accomodation Details does not exist with this account"
            },{status: 400})
        }

        return NextResponse.json({
            success: true,
            message: "QR Code Data fetched successfully",
            data: accomodationDetails
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Error while verifying QR Code"
        },{status: 500})
        
    }
}