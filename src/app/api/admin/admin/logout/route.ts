import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    try {
        // const cookieStore = await cookies();
        // const token = cookieStore.get('token')?.value;
        const res = NextResponse.json({
            success: true,
            message: "Admin logout from account."
        },{status: 200})
        
        res.cookies.set('token', '', {
            path: '/admin',
            expires: new Date(0),
        });
        return res;


    } catch (error) {
        return NextResponse.json({
            sucess: false,
            message: "Error while logout from account"
        },{status:500})
        
    }
}