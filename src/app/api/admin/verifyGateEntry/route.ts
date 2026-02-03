import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"
import prisma from "@/lib/prisma";


export async function POST(req: NextRequest){
    try {
        const {QRCodeData, entryType} = await req.json()

        if(!QRCodeData || !entryType){
            return NextResponse.json({
                success: false,
                message: "QR Code Data is required"
            },{status: 404})
        }

        const decodedValues = await jwt.verify(QRCodeData,process.env.JWT_SECRET!) as JwtPayload

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
                message: "Accomodation Details does not exist with this QR Code"
            },{status: 400})
        }

        // Check that entry type is correct
        if(entryType!=="Entry" && entryType!=="Exit"){
            return NextResponse.json({
                success: false,
                message: "entry type is incorrect."
            },{status: 400})
        }


        // Now create Entry
        const createdGateEntry = await prisma.gateEntry.create({
            data:{
                accomodationDetailsId: accomodationDetails.id,
                entryType: entryType
            },
            include:{
                accomodationDetails: true
            }
        })

        return NextResponse.json({
            success: true,
            message: "Gate Entry created successfully",
            data: createdGateEntry
        })

    } catch (error:any) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: error.message
        },{status: 500})
        
    }
}