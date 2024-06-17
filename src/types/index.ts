enum Role {
    User = 'user',
    Admin = 'admin',
}
type User = {
    id: string;
    username: string;
    name: string;
    email: string;
    password?: string; // Password might not be returned
    profilePicture: string | null;
    bio: string | null;
    createdAt?: Date | string | null | unknown;
    updatedAt?: Date | string | null | unknown;
    isVerified?: boolean | false | null;
    isPrivate?: boolean | false | null;
    accessToken?: string | null | unknown;
    refreshToken?: string | null | unknown;
    loggedDevice?: any[] | unknown;
    roles?: Role[] | string[];
}

type Follow = {
    id: string;
    followerUserId: string;
    followingUserId: string;
    followerUsername: string;
    followingUsername: string;
    createdAt?: Date;
    updatedAt?: Date;
}

type Conversation = {
    id: string;
    members: string[];
    isGroup: boolean;
    groupName?: string | null;
    groupImage?: string | null;
    groupDescription?: string | null;
    authorId: string;
    lastMessageContent: string
    createdAt?: Date;
    updatedAt?: Date | string;
}
type Message = {
    id: string;
    content: string;
    fileUrl: string[];
    authorId: string;
    deleted: boolean;
    seenBy: string[];
    conversationId: string;
    createdAt: Date;
    updatedAt: Date;
}

type PostType = {
    id: string | null
    caption: string | null
    fileUrl: string[] | null
    createdAt: Date | unknown | string | null
    updatedAt?: Date | unknown | string | null
    authorId?: string
}


type CommentType = {
    id: string;
    comment: string;
    authorId: string;
    postId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

type LikeType = {
    id: string;
    authorId: string;
    postId: string;
    createdAt?: Date;
    updatedAt?: Date;
    user: User[]
}

export {
    User,
    Role,
    Message,
    Conversation,
    PostType,
    CommentType,
    LikeType,
    Follow  
}