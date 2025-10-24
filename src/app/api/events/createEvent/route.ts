import { parseDateAndTime } from "@/helper/parseDateAndTime";
import { UploadEventImage, UploadEventRuleBook } from "@/helper/uploadImageOnCloudinary";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {

        // Check that the user is admin or not.


        // Extracting information from the request
        // Expecting Date in format: DD/MM/YYYY
        // Expecting Time in format: HH:MM:SS
        const eventInfo = await req.formData()
        const eventName = eventInfo.get("eventName") as string
        const eventDate = eventInfo.get("eventDate") as string
        const eventTime = eventInfo.get("eventTime") as string
        const fees = eventInfo.get("eventFees") as string
        const minSize = eventInfo.get("minSize") as string
        const maxSize = eventInfo.get("maxSize") as string
        const eventFees = parseFloat(fees)
        const minSizeOfTeam = parseInt(minSize)
        const maxSizeOfTeam = parseInt(maxSize)
        const eventImage= eventInfo.get("eventImage") as File
        const eventRuleBook= eventInfo.get("eventRuleBook") as File
        const description = eventInfo.get("description") as string
        const isRegistrationOpen = eventInfo.get("isRegistrationOpen") as string
        const webPageLink = eventInfo.get("webPageLink") as string

        if (!eventName || !eventDate || !eventTime || !eventFees || !minSizeOfTeam || !maxSizeOfTeam) {
            return NextResponse.json({
                success: false,
                message: "All Fields are required"
            }, { status: 404 })
        }

        // Check Event Already exists or not.
        const isEventExist = await prisma.event.findFirst({
            where: {
                eventName: eventName
            }
        })

        if (isEventExist) {
            return NextResponse.json({
                success: false,
                message: "Event Already Exists"
            }, { status: 400 })
        }

        const dateAndTime = parseDateAndTime(eventDate, eventTime) as Date


        if (dateAndTime <= new Date(Date.now())) {
            return NextResponse.json({
                success: false,
                message: "Invalid Date"
            }, { status: 400 })
        }

        // URL Cloudinary 
        let ruleBook
        const imageName = await UploadEventImage(eventImage) as string

        if(eventRuleBook){
            ruleBook = await UploadEventRuleBook(eventRuleBook) as string
        }

        const createdEvent = await prisma.event.create({
            data: {
                eventName,
                eventDateAndTime: dateAndTime,
                eventFees,
                minSize: minSizeOfTeam,
                maxSize: maxSizeOfTeam,
                eventImage: imageName ,
                description: description,
                isRegistrationOpen: isRegistrationOpen? true: false,
                webPageLink: webPageLink,
                eventRuleBook: ruleBook
            }
        })

        return NextResponse.json({
            success: true,
            message: "Event created Successfully",
            data: createdEvent
        }, { status: 200 })


    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })

    }
}