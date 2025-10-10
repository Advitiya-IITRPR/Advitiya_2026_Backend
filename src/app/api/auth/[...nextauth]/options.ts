import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { NextResponse } from "next/server";



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, req): Promise<any> {
                try {
                    const email = credentials?.email
                    const password = credentials?.password as string

                    // check User exist or not.
                    const isUserExist = await prisma.user.findFirst({
                        where: {
                            email: email
                        }
                    })

                    if (!isUserExist) {
                        throw new Error("User is not registered with this email.")

                    }

                    // Checking if password is correct.
                    const isPasswordCorrect = await bcrypt.compare(password, isUserExist.password);
                    
                    if (!isPasswordCorrect) {
                        throw new Error("Password is incorrect")
                    }

                    if (!isUserExist.isVerified) {
                        throw new Error("User is not verified.")
                    }

                    return isUserExist


                } catch (error: any) {
                    console.error("Auth error:", error)
                    throw new Error(error.message || "Internal Server Error")

                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id,
                    token.email = user.email
                token.isVerified = user.isVerified
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.email = token.email
                session.user.isVerified = token.isVerified
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}