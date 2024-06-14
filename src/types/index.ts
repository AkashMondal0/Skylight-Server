enum Role {
    User = 'user',
    Admin = 'admin',
}
interface User {
    id: string;
    username: string;
    email: string;
    name: string
    profilePicture: string | null;
    password?: string;
    bio?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    roles?: Role[] | any
    isVerified?: boolean,
    isPrivate?: boolean,
    // accessToken?: string,
    // refreshToken?: string,
    // loggedDevice?: string[],
}
interface Follow {
    id: string;
    followerUserId: string;
    followingUserId: string;
    followerUsername: string;
    followingUsername: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface Conversation {
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
interface Message {
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

interface Post {
    id: string
    caption: string
    fileUrl: string[]
    createdAt: Date | string
    updatedAt: Date | string
    authorId: string
    postId: string
}


interface Comment {
    id: string;
    comment: string;
    authorId: string;
    postId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface Like {
    id: string;
    authorId: string;
    postId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export {
    User,
    Role,
    Message,
    Conversation,
    Post,
    Comment,
    Like,
    Follow,
}