import { AuthorData } from "./response.type";

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
    salt?: string;
}

enum FriendshipStatus {
    // 'pending', 'accepted', 'rejected', 'blocked', 'deleted'
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
    Blocked = 'blocked',
    Deleted = 'deleted',
}
type Friendship = {
    id?: string;
    followingUsername?: string;
    authorUsername?: string;
    followingUserId?: string;
    authorUserId?: string;
    createdAt?: Date | string | unknown;
    updatedAt?: Date | string | unknown;
    status?: FriendshipStatus|string;
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

enum PostStatus {
    Draft = 'draft',
    Published = 'published',
    Archived = 'archived',
    // 'draft', 'published', 'archived'
}
type PostType = {
    id: string | null
    content: string | null
    fileUrl: string[] | null
    createdAt: Date | unknown | string | null
    updatedAt?: Date | unknown | string | null
    authorId?: string
    username?: string
    status?: PostStatus | string
}


type CommentType = {
    id?: string;
    content: string;
    authorId: string;
    postId: string;
    createdAt?: Date | unknown;
    updatedAt?: Date | unknown;
}

type LikeType = {
    id: string;
    authorId: string;
    postId: string;
    createdAt?: Date;
    updatedAt?: Date;
    user: AuthorData[]
}

export {
    User,
    Role,
    Message,
    Conversation,
    PostType,
    CommentType,
    LikeType,
    Friendship
}