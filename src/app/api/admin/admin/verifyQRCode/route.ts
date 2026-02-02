import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"



export async function POST(req: NextRequest){
    try {
        const {QRCodeData} = await req.json()

        if(!QRCodeData){
            return NextResponse.json({
                success: false,
                message: "QR Code Data is required"
            },{status: 404})
        }

        const decodedValues = await jwt.verify(QRCodeData,process.env.JWT_SECRET!)

        return NextResponse.json({
            success: true,
            message: "QR Code Data fetched successfully",
            data: decodedValues
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Error while verifying QR Code"
        },{status: 500})
        
    }
}