import { CommentType, LikeType, PostType } from "."

interface AuthorData {
    id: string
    username: string
    email: string
    name: string
    profilePicture?: string | null
    isFollowing?: boolean,
}
interface PostResponse extends PostType {
    commentCount: number,
    likeCount: number,
    comments?: CommentType[] | [],
    likes?: LikeType[] | []
    alreadyLiked: boolean | unknown,
    user: AuthorData | null
}

export {
    PostResponse,
    AuthorData
}