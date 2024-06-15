import { Post,Comment, Like } from ".";
interface AuthorData {
    id: string
    username: string
    email: string
    name: string
    profilePicture?: string
    isFollowing?: boolean,
}
interface PostResponse extends Post {
    commentCount: number,
    likeCount: number,
    comments: Comment[]
    likes?: AuthorData[]
    alreadyLiked: boolean | unknown,
    user: AuthorData
}

export {
    PostResponse
}