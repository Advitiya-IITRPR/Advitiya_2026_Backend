import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest,{params}: {params: {accomodationId: string}}){
    try {
        const urlParams = await params

        const accomodationId = urlParams.accomodationId

        if(!accomodationId){
            return NextResponse.json({
                success: false,
                message: "Accomodation Id is required"
            },{status: 404})
        }

        const isAccomodationExist = await prisma.accomodationDetails.findFirst({
            where:{
                id: accomodationId
            }
        })

        if(!isAccomodationExist){
            return NextResponse.json({
                success: false,
                message: "Accomodation does not exist with this id"
            },{status: 400})
        }


        return NextResponse.json({
            success: true,
            message: "Accomodation details fetched successfully",
            data: isAccomodationExist
        })
        
    } catch (error:any) {
        return NextResponse.json({
            success: false,
            message: error.message 
        },{status: 500})
        
    }
}