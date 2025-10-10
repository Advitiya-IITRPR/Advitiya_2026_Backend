import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){
    try {

        const eventsList= await prisma.event.findMany()
        
        return NextResponse.json({
            success: true,
            data: eventsList,
            message: "Event List send successfully"
        },{status: 200})
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Server error while getting the event list"
        },{status: 500})
        
    }
}