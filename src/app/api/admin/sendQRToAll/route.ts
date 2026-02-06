import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import QRCode from "qrcode";
import nodemailer from "nodemailer"


export async function POST(req: NextRequest) {
    try {
        const allParticipants = await prisma.accomodationDetails.findMany({
        })


        allParticipants.map(async (acoomodationDetail) => {
            const encodedString = jwt.sign(
                {
                    id: acoomodationDetail.id,
                },
                process.env.JWT_SECRET!,
                {
                    expiresIn: '5d'
                }
            )
            const qrBuffer = await QRCode.toBuffer(String(encodedString), {
                        type: "png",
                        width: 260,
                        errorCorrectionLevel: "H",
                    });
            
                    var transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                          user: process.env.GMAIL_USER,
                          pass: process.env.GMAIL_APP_PASSWORD,
                        },
                    });
            
                    const verificationMailContent = `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <title>Your Verification QR Code</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body, p, h2 {
                margin: 0;
                padding: 0;
              }
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f7fafc;
                color: #1a202c;
              }
              .container {
                max-width: 500px;
                background-color: #ffffff;
                margin: 40px auto;
                border-radius: 12px;
                padding: 40px 30px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                text-align: center;
              }
              h2 {
                font-weight: 700;
                margin-bottom: 8px;
              }
              p {
                font-size: 16px;
                color: #4a5568;
                margin-bottom: 20px;
              }
              .note {
                font-size: 15px;
                color: #2b6cb0;
                font-weight: 600;
                margin: 24px 0;
              }
              .small-text {
                font-size: 14px;
                color: #718096;
                margin-bottom: 16px;
              }
              hr {
                border: none;
                border-top: 1px solid #e2e8f0;
                margin: 32px 0;
              }
              .footer {
                font-size: 12px;
                color: #a0aec0;
              }
            </style>
            </head>
            
            <body>
              <div class="container">
                <h2>Hello, ${acoomodationDetail.userName}</h2>
            
                <p>
                  Your verification QR code for
                  <strong>Advitiya 2026</strong>
                  is attached with this email.
                </p>
            
                <p class="note">
                  Please download and keep this QR code handy for:
                  <br />• Entry / Exit
                  <br />• Mess access
                </p>
            
                <p class="small-text">
                  This QR code is personal to you. Do not share it with anyone. Please bring your aadhar card photo copy also.
                </p>
            
                <p class="small-text">
                  If you didn’t request this, please ignore this email.
                </p>
            
                <hr />
            
                <p class="footer">
                  &copy; 2026 Advitiya IIT Ropar. All rights reserved.
                </p>
              </div>
            </body>
            </html>`;
            
            
            
            
                    await transporter.sendMail({
                        from: `"Advitiya 2026" <${process.env.EMAIL_USER}>`,
                        to: acoomodationDetail.email,
                        subject: "Your Advitiya 2026 Verification QR Code",
                        html: verificationMailContent,
                        attachments: [
                            {
                                filename: "advitiya-verification-qr.png",
                                content: qrBuffer,
                                contentType: "image/png",
                            },
                        ],
                    });
        })

        return NextResponse.json({
            success: true,
            message: "QR Code Send successfully",
        },{status: 200})


    } catch (error: any) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Server error while sending the QR Code."
        }, { status: 500 })

    }
}