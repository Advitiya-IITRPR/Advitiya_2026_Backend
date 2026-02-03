import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET(req: Request){
    try {
        const gateEntries = await prisma.gateEntry.findMany({
            include:{
                accomodationDetails: true
            }
        })

        return NextResponse.json({
            success: true,
            message: "Gate Entries fetched successfully",
            data: gateEntries
        })
        
    } catch (error:any) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: error.message
        },{status: 500})
        
    }
}