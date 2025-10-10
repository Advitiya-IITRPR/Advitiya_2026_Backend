import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse, userAgentFromString } from "next/server";


export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        // Checking user is logged in or not.
        const session = await getServerSession()
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "User is not logged in"
            }, { status: 400 })
        }


        const { userName, email, mobileNo } = await req.json()
        const urlParams = await params

        const userId = urlParams.userId

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User id is required"
            }, { status: 404 })
        }

        if (!userName && !email && !mobileNo) {
            return NextResponse.json({
                success: false,
                message: "Field is required to update."
            }, { status: 404 })
        }

        const isUserExists = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })

        if (!isUserExists) {
            return NextResponse.json({
                success: false,
                message: "User does not exists."
            }, { status: 400 })
        }

        const dataToUpdate: any = {};

        if (userName !== undefined) {
            dataToUpdate.userName = userName;
        }

        if (email !== undefined) {
            dataToUpdate.email = email;
        }

        if (mobileNo !== undefined) {
            dataToUpdate.mobileNo = mobileNo;
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: dataToUpdate,
        });


        return NextResponse.json({
            success: true,
            message: "User details updated successfully"
        },{status: 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Server error while updating details"
        }, { status: 500 })

    }
}