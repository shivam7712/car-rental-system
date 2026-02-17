import { z } from 'zod';

export const signupSchema = z.object({
    name: z.string().min(2, "Name is requried"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars")
})

export const signinSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars")
})