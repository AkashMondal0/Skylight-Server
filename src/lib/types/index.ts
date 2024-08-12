import { Author } from "src/users/entities/author.entity"

export enum Role {
    User = 'user',
    Admin = 'admin',
    Public = "public"
}


export type PostActionsProps = {
    post_id: string
    user: Author
    post_owner: Author
    action: "create" | "destroy"
}