import { CommentType, Friendship, LikeType, PostType } from "."

interface AuthorData {
    id: string | unknown
    username: string | unknown
    email: string | unknown
    name: string | unknown
    profilePicture: string | null
    followed_by?: boolean | unknown
    following?: boolean | unknown
}
interface PostResponse extends PostType {
    commentCount: number,
    likeCount: number,
    comments?: CommentType[] | [],
    likes?: LikeType[] | []
    is_Liked: boolean | unknown,
    user: AuthorData | null
}

interface FriendshipType extends Friendship {
    following: boolean;
    followed_by: boolean;
    status?: string;
    isFeedFavorite?: boolean;
    isCloseFriends?: boolean;
    blocking?: boolean;
    isRestricted?: boolean;
    notificationPost?: boolean;
    notificationStory?: boolean;
    isNotificationReel?: boolean;
    isMutingNotification?: boolean;
    isMutingPost?: boolean;
    isMutingStory?: boolean;
    isMutingReel?: boolean;
    outgoingRequest?: boolean;
    incomingRequest?: boolean;
}

interface ProfileView extends AuthorData {
    isVerified: boolean
    isPrivate: boolean
    posts?: PostResponse[] | []
    followers?: AuthorData[] | []
    following?: AuthorData[] | []
    postCount: number
    followerCount: number
    followingCount: number
    friendship: {
        followed_by: number | boolean | unknown,
        following: number | boolean | unknown,
    }
    top_followers?: AuthorData[] | unknown[]
}

export {
    PostResponse,
    AuthorData,
    FriendshipType,
    ProfileView
}