import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){
    try {
        const accomodationList = await prisma.accomodationDetails.findMany({
        })

        return NextResponse.json({
            success: true,
            message: "Accomodation List fetched successfully",
            data: accomodationList
        },{status: 200})
        
    } catch (error:any) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: error.message
        },{status: 500})
        
    }
}