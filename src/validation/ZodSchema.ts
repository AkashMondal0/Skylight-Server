import { z } from 'zod';

export const LoginUserSchema = z.object({
    email: z.string({ required_error: "Email is required" }).email({ message: "Invalid email" }),
    password: z.string({ required_error: "Password is required" }).min(6, { message: "Password must be at least 6 characters long" })
})

export const RegisterUserSchema = z.object({
    // username -->
    username: z.string({ required_error: "Name is required" })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(20, { message: "Name must be at most 20 characters long" }),
    // email -->
    email: z.string({ required_error: "Email is required" }).email({ message: "Invalid email" }),
    // password -->
    password: z.string({ required_error: "Password is required" }).min(6, { message: "Password must be at least 6 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" }),
    // profilePicture -->
    name: z.string({ required_error: "Name is required" }).min(3, { message: "Name must be at least 3 characters long" }).max(20, { message: "Name must be at most 20 characters long" }).optional(),
    profilePicture: z.string({ required_error: "Profile picture is required" }).optional(),
    // coverPicture -->
    coverPicture: z.string({ required_error: "Cover picture is required" }).optional(),
    // bio -->
    bio: z.string({ required_error: "Bio is required" }).max(50, { message: "Bio must be at most 50 characters long" }).optional(),
    // city -->
    city: z.string({ required_error: "City is required" }).max(50, { message: "City must be at most 50 characters long" }).optional(),
    // from -->
    from: z.string({ required_error: "From is required" }).max(50, { message: "From must be at most 50 characters long" }).optional(),
})

export type LoginUserPayload = z.infer<typeof LoginUserSchema>;
export type RegisterUserPayload = z.infer<typeof RegisterUserSchema>;