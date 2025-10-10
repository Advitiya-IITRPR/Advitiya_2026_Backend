import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest, NextResponse } from "next/server";


type userData = {
    userName: string,
    email: string,
    mobileNo: string
}



export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession()
        
        if(!session){
            return NextResponse.json({
                success: false,
                message: "Login Required before registration"
            },{status: 400})
        }


        // Taking the user id
        const participationData = await req.formData()
        const teamName = participationData.get("teamName") as string
        const eventId = participationData.get("eventId") as string
        const rawUserData = participationData.getAll("userData") as string[];

        console.log(participationData)
        // Parse each entry to your typed object
        const userData: userData[] = rawUserData.map((entry) => JSON.parse(entry));

        const event = await prisma.event.findFirst({
            where: {
                id: eventId
            }
        })

        // Checking information is provided or not. 
        if (!event) {
            return NextResponse.json({
                sucess: false,
                message: "Event Does not exists."
            }, { status: 400 })
        }
        if (userData.length <= 0) {
            return NextResponse.json({
                success: false,
                message: "User ids are required."
            }, { status: 400 })
        }
        else if (userData.length > 1 && !teamName) {
            return NextResponse.json({
                success: false,
                message: "Team Name is required"
            }, { status: 404 })
        }

        if (event.isRegistrationOpen === false) {
            return NextResponse.json({
                success: false,
                message: "Registration is Closed for this event."
            }, { status: 400 })
        }

        if (userData.length < event.minSize || userData.length > event.maxSize) {
            return NextResponse.json({
                success: false,
                message: "Users must be in range"
            }, { status: 400 })
        }

        let participantsArrayIds: string[]=[];

        for (let i = 0; i < userData.length; i++) {
            const user = await prisma.user.findFirst({
                where: {
                    email: userData[i].email,
                    mobileNo: userData[i].mobileNo,
                    userName: userData[i].userName
                },
                include: {
                    participation: true
                }
            })

            if (!user || !user.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: `User ${userData[i].userName} does not exist or is not verified.`
                }, { status: 400 })
            }
            if (user.participation.some((participant) => participant.eventId === eventId)) {
                return NextResponse.json({
                    success: false,
                    message: `User ${user.userName} already registered for this event.`
                }, { status: 400 })
            }
            participantsArrayIds.push(user.id)
        }

        // Fees Payment Logic
        let feesPaid = false
        if (event.eventFees === 0) {
            feesPaid = true
        }
        else {

            feesPaid = true
        }


        const participation = await prisma.participant.create({
            data: {
                TeamName: teamName,
                eventId: eventId,
                participants: { connect: participantsArrayIds.map(id => ({ id })) },
                feesPaid: feesPaid
            }
        })

        return NextResponse.json({
            success: true,
            message: "Participation is created successfully"
        }, { status: 200 })

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })

    }
}