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
    name: z.string({ required_error: "Name is required" }).min(3, { message: "Name must be at least 3 characters long" }).max(20, { message: "Name must be at most 20 characters long" }),
    profilePicture: z.string({ required_error: "Profile picture is required" }).url({ message: "Invalid URL" }).optional(),
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


// post 

export const CreatePostSchema = z.object({
    caption: z.string({ required_error: "Caption is required" }).min(1, { message: "Caption must be at least 3 characters long" }).max(100, { message: "Caption must be at most 100 characters long" }).optional(),
    fileUrl: z.array(z.string().url({ message: "Invalid URL" })).nonempty({ message: "File URL must not be empty" }),
    authorId: z.string({ required_error: "Author ID is required" }).uuid({ message: "Invalid UUID" })
})

export const UpdatePostSchema = z.object({
    caption: z.string({ required_error: "Caption is required" }).min(1, { message: "Caption must be at least 3 characters long" }).max(100, { message: "Caption must be at most 100 characters long" }),
    fileUrl: z.array(z.string().url({ message: "Invalid URL" })).nonempty({ message: "File URL must not be empty" }),
    authorId: z.string({ required_error: "Author ID is required" }).uuid({ message: "Invalid UUID" }),
    id: z.string({ required_error: "Post ID is required" }).uuid({ message: "Invalid UUID" })
})

export const DeletePostSchema = z.object({
    authorId: z.string({ required_error: "Author ID is required" }),
    id: z.string({ required_error: "Post ID is required" }).uuid({ message: "Invalid UUID" })
})

export type CreatePostPayload = z.infer<typeof CreatePostSchema>;
export type UpdatePostPayload = z.infer<typeof UpdatePostSchema>;
export type DeletePostPayload = z.infer<typeof DeletePostSchema>;

// comment

export const CreateCommentSchema = z.object({
    content: z.string({ required_error: "Content is required" }).min(3, { message: "Content must be at least 3 characters long" }).max(100, { message: "Content must be at most 100 characters long" }),
    authorId: z.string({ required_error: "Author ID is required" }),
    postId: z.string({ required_error: "Post ID is required" }).uuid({ message: "Invalid UUID" })
})

export const UpdateCommentSchema = z.object({
    content: z.string({ required_error: "Content is required" }).min(3, { message: "Content must be at least 3 characters long" }).max(100, { message: "Content must be at most 100 characters long" }),
    authorId: z.string({ required_error: "Author ID is required" }),
    postId: z.string({ required_error: "Post ID is required" }).uuid({ message: "Invalid UUID" }),
    id: z.string({ required_error: "Comment ID is required" }).uuid({ message: "Invalid UUID" })
})

export const DeleteCommentSchema = z.object({
    authorId: z.string({ required_error: "Author ID is required" }),
    postId: z.string({ required_error: "Post ID is required" }).uuid({ message: "Invalid UUID" }),
    id: z.string({ required_error: "Comment ID is required" }).uuid({ message: "Invalid UUID" })
})

export type CreateCommentPayload = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentPayload = z.infer<typeof UpdateCommentSchema>;
export type DeleteCommentPayload = z.infer<typeof DeleteCommentSchema>;

// like

export const CreateLikeSchema = z.object({
    authorId: z.string({ required_error: "Author ID is required" }),
    postId: z.string({ required_error: "Post ID is required" }).uuid({ message: "Invalid UUID" }),
})

export const DeleteLikeSchema = z.object({
    authorId: z.string({ required_error: "Author ID is required" }),
    postId: z.string({ required_error: "Post ID is required" }).uuid({ message: "Invalid UUID" }),
    id: z.string({ required_error: "Like ID is required" }).uuid({ message: "Invalid UUID" })
})

export type CreateLikePayload = z.infer<typeof CreateLikeSchema>;
export type DeleteLikePayload = z.infer<typeof DeleteLikeSchema>;