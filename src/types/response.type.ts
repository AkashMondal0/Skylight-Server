import { Post } from ".";

interface PostTimeline extends Post {
    commentCount: number,
    likeCount: number,
    alreadyLiked: boolean | unknown,
    user: {
        id: string
        username: string
        email: string
        profilePicture: string
    }
}

export {
    PostTimeline
}