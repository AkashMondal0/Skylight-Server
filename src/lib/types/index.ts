import { NotificationType } from "src/notification/entities/notification.entity"
import { Author } from "src/users/entities/author.entity"

export enum Role {
    User = 'user',
    Admin = 'admin',
    Public = "public"
}


export type PostActionsProps = {
    authorId: string,
    postId: string,
    type: NotificationType,
    recipientId: string,
}