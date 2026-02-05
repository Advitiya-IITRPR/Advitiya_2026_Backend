import prisma from "@/lib/prisma";
import QRCode from "qrcode";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken"



export async function POST(req: NextRequest) {
    try {
        const { userName, email, mobileNo, gender, collegeName, paymentVerified, paymentMade, mealsLeft } = await req.json()

        if (!userName || !email || !mobileNo || !gender || !collegeName || !paymentVerified || !paymentMade || !mealsLeft) {
            return NextResponse.json({
                success: false,
                message: "All Fields are required"
            }, { status: 404 })
        }

        // Check that the user already exist with this email id or not.
        const isUserExist = await prisma.accomodationDetails.findFirst({
            where: {
                email: email
            }
        })

        if (isUserExist) {
            return NextResponse.json({
                success: false,
                message: "User already exist with this email id"
            }, { status: 400 })
        }

        if (gender !== "Male" && gender !== "Female") {
            return NextResponse.json({
                success: false,
                message: "Gender is not selected correctly"
            }, { status: 400 })
        }

        let paymentStatus = false;

        if (paymentVerified === "True") paymentStatus = true;

        const accomodationCreated = await prisma.accomodationDetails.create({
            data: {
                userName, email, mobileNo, gender, collegeName,
                paymentMade: parseInt(paymentMade),
                paymentVerified: paymentStatus,
                mealTaken: parseInt(mealsLeft)
            }
        })

        const encodedString = jwt.sign(
                    {
                        id: accomodationCreated.id,
                    },
                    process.env.JWT_SECRET!,
                    {
                        expiresIn: '1h'
                    }
                )

        const qrBuffer = await QRCode.toBuffer(String(encodedString), {
            type: "png",
            width: 260,
            errorCorrectionLevel: "H",
        });

        console.log(qrBuffer)

        var transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: Number(process.env.MAILTRAP_PORT),
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
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
    <h2>Hello, ${accomodationCreated.userName}</h2>

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
      This QR code is personal to you. Do not share it with anyone.
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
            to: accomodationCreated.email,
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




        return NextResponse.json({
            success: true,
            message: "Accomodation Registered successfully",
            data: accomodationCreated
        })

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })

    }
}