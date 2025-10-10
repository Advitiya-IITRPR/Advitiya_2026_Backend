import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";



export async function POST(req: NextRequest, {params}:{params: {eventId: string}}){
    try {
        const urlParams = await params
        const eventId = params.eventId

        if(!eventId){
            return NextResponse.json({
                success: false,
                message: "Event id is required"
            },{status: 404})
        }

        const isEventExist = await prisma.event.findFirst({
            where:{
                id: eventId
            }
        })

        if(!isEventExist){
            return NextResponse.json({
                success: false,
                message: "Event does not exist"
            },{status: 400})
        }

        const changedEvent = await prisma.event.update({
            where:{
                id: eventId
            },
            data:{
                isRegistrationOpen: !isEventExist.isRegistrationOpen
            }
        })

        return NextResponse.json({
            success: true,
            message: "Registration Status changed successfully"
        },{status: 200})
        
    } catch (error:any) {
        return NextResponse.json({
            success: false,
            message: error.message
        },{status: 500})
        
    }
}