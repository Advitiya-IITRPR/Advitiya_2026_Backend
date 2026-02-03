import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest){
    try {
        const messEntries = await prisma.messEntry.findMany({
            include:{
                accomodationDetails: true
            }
        })

        return NextResponse.json({
            success: true,
            message: "Mess Entries Fetched successfully",
            data: messEntries,
        })
        
    } catch (error:any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, {status: 500})
        
    }
}