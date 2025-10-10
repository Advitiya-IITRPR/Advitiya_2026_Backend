import { getPublicIdFromUrl } from "@/helper/getPublicIdFromURL";
import prisma from "@/lib/prisma";
import { v2 as cloudinary} from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export async function DELETE(req: NextRequest,{params}:{params: {eventId: string}}){
    try {
        const urlParams = await params
        const eventId = urlParams.eventId

        if(!eventId){
            return NextResponse.json({
                success: false,
                message: "Event Id is required",
            },{status:404})
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

        const publicId = getPublicIdFromUrl(isEventExist.eventImage)
        await cloudinary.uploader.destroy(publicId as string)

        await prisma.event.delete({
            where: {
                id: eventId
            }
        })
        
        return NextResponse.json({
            success: true,
            message: "Event Deleted Successfully"
        },{status: 200})
    } catch (error:any) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Server error while deleting event."
        },{status:500})
        
    }
}