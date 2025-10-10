import 'next-auth'

import { DefaultSession } from 'next-auth'

declare module 'next-auth'{
    interface User{
        id?: string,
        isVerified?: Boolean,
        email?: string,
    }
    interface Session{
        user: {
            id?: string,
            isVerified?: Boolean,
            email?: string,
        } & DefaultSession ['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string,
        email?: string,
        isVerified?: Boolean,
    }
}