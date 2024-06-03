interface FeedPost {
    id: string
    caption: string
    fileUrl: string[]
    commentCount: number
    likeCount: number
    createdAt: Date | string
    alreadyLiked: boolean | null
    authorData: AuthorData
    comments: Comment[]
    likes: AuthorData[]
    isDummy?: boolean
}

interface AuthorData {
    id: string
    username: string
    email: string
    name: string
    profilePicture?: string
    isFollowing?: boolean,
}

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string | null;
    bio: string | null;
    createdAt: Date;
    updatedAt: Date;
    followers: User[]
    following: User[]
    isVerified: false,
    isPrivate: false,
    postCount: number,
    followersCount: number,
    followingCount: number,
    posts: FeedPost[]
    isFollowing: boolean,
    removeFollower: boolean,
    name: string
}

interface Message {
    id: string;
    content: string;
    fileUrl: Assets[];
    authorId: string;
    deleted: boolean;
    seenBy: string[];
    conversationId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Conversation {
    id: string;
    members: string[];
    isGroup: boolean;
    groupName: string | null;
    groupImage: string | null;
    groupDescription: string | null;
    authorId: string;
    createdAt: Date;
    updatedAt: Date | string;
    messages: Message[];
    membersData: AuthorData[]
    lastMessageContent: string
}

interface Post {
    id: string;
    caption: string;
    fileUrl: string[];
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Comment {
    id: string;
    comment: string;
    authorId: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
    authorData: AuthorData
}

interface Like {
    id: string;
    authorId: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
    authorData: AuthorData
}

interface Follower {
    id: string;
    followerUserId: string;
    followingUserId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Notification {
    id: string;
    content: string;
    authorId: string;
    receiverId: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
}
interface Story {
    id: string;
    fileUrl: string[];
    caption: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface StoryView {
    id: string;
    viewerId: string;
    storyId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface StoryReply {
    id: string;
    content: string;
    authorId: string;
    storyId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface StoryLike {
    id: string;
    authorId: string;
    storyId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface SavedPost {
    id: string;
    postId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface PayloadData {
    payload: {
        code: number,
        message: string,
        data: {
            email: string,
            username: string,
            id: string,
            profilePicture: string,
            token: string,
            name: string
        }
    }
}

interface RestApiPayload<T> {
    code: number,
    message: string,
    data: T,
    status_code: number
}

type networkImage_status = "error" | "loading" | "success"

type Assets = {
    id?: string,
    url?: string,
    type?: 'image' | 'video' | 'audio' | "text"
    caption?: string;
}
export type {
    User,
    Message,
    Conversation,
    Post,
    Comment,
    Like,
    Follower,
    Notification,
    Story,
    StoryView,
    StoryReply,
    StoryLike,
    SavedPost,
    PayloadData,
    FeedPost,
    AuthorData,
    networkImage_status,
    Assets,
    RestApiPayload
}