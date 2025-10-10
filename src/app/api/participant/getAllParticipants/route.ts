import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){
    try {
        const participants = await prisma.participant.findMany({
            include:{
                EventParticipated: true,
                participants: true
            }
        })

        return NextResponse.json({
            success: true,
            data: participants,
            message: "Participants fetched successfully"
        },{status: 200})
        
    } catch (error:any) {
        return NextResponse.json({
            success: false,
            message: error.message
        },{status:500})
        
    }
}