import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"



export async function POST(req: NextRequest) {
    try {
        const { fullName, email, subject, message } = await req.json()

        if (!fullName || !email || !subject || !message) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 404 })
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: Number(process.env.MAILTRAP_PORT),
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        });

        const emailContent = `
                <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <title>${subject}</title>
                        <style>
                        body {
                            font-family: Arial, Helvetica, sans-serif;
                            background-color: #f6f9fc;
                            margin: 0;
                            padding: 0;
                        }

                        .email-container {
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            padding: 30px;
                        }

                        h2 {
                            text-align: center;
                            color: #333333;
                        }

                        .info {
                            margin-bottom: 20px;
                        }

                        .info p {
                            margin: 8px 0;
                            font-size: 15px;
                            color: #555555;
                        }

                        .info strong {
                            color: #222222;
                        }

                        .message-box {
                            background-color: #f3f4f6;
                            padding: 15px;
                            border-left: 4px solid #007bff;
                            border-radius: 4px;
                            font-size: 15px;
                            color: #333333;
                            white-space: pre-line;
                        }

                        .footer {
                            margin-top: 25px;
                            text-align: center;
                            font-size: 13px;
                            color: #777777;
                        }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                        <h2>${subject}</h2>

                        <div class="info">
                            <p><strong>Full Name:</strong> ${fullName}</p>
                            <p><strong>Email:</strong> ${email}</p>
                        </div>

                        <div class="message-box">
                            ${message}
                        </div>

                        <div class="footer">
                            <p>&copy; 2025 E-Cell IIT Ropar. All rights reserved.</p>
                        </div>
                        </div>
                    </body>
                </html>
        `




        const mailOption = {
            from: process.env.EMAIL_SENDING_DOMAIN,
            to: process.env.EMAIL_SENDING_DOMAIN,
            subject: subject,
            html: emailContent
        }

        const mailResponse = await transporter.sendMail(mailOption)

        return NextResponse.json({
            success: true,
            message: "Message send successfully"
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Error while sending your feedback"
        }, { status: 500 })

    }

}
