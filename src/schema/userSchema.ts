import z from "zod";



export const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(5,"Password must be atleast of 5 characters")
})