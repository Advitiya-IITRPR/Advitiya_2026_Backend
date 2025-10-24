import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadStream } from "cloudinary"


cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CloudinaryUploadResult {
    public_id: string,
    secure_url: string

    [key: string]: any
}



export async function UploadEventImage(avatarFile: File) {
    try {
        if (!avatarFile) {
            return NextResponse.json({
                success: false,
                message: "Avatar File not found"
            }, { status: 404 })
        }

        const bytes = await avatarFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "Event_Images" },
                    (error: any, result: any) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResult)
                    }
                )
                uploadStream.end(buffer)
            }
        )
        return result.secure_url
    } catch (error: any) {
        throw new Error(error)
    }

}



export async function UploadEventRuleBook(ruleBook: File) {
    try {
        if (!ruleBook) {
            return NextResponse.json({
                success: false,
                message: "RuleBook File not found"
            }, { status: 404 })
        }

        const bytes = await ruleBook.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "Event_RuleBook",
                        format: "pdf"
                    },
                    (error: any, result: any) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResult)
                    }
                )
                uploadStream.end(buffer)
            }
        )
        return result.secure_url
    } catch (error: any) {
        throw new Error(error)
    }
}