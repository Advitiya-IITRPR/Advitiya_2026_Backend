import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"


export async function POST(req: NextRequest, res: NextResponse){
    try {
        const {userName,email,id, isVerified,mobileNo,collegeName,mealPending,paymentStatus} =await  req.json()

        const encodedString = jwt.sign(
            {
                id,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '5d'
            }
        )

        return NextResponse.json({
            success: true,
            message: "QR code generated successfully",
            data: encodedString
        },{status: 200})



        
    } catch (error) {
        console.log(error)
        return NextResponse
        .json({
            success: false,
            message: "Server error while sending QR Code."
        },{status: 500})
        
    }
}