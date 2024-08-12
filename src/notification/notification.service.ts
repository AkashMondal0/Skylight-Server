import { Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/create-notification.input';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { Author } from 'src/users/entities/author.entity';
import { Notification } from './entities/notification.entity';
import { NotificationSchema, PostSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { and, desc, eq } from 'drizzle-orm';

@Injectable()
export class NotificationService {
  constructor(private readonly drizzleProvider: DrizzleProvider) { }

  async create(user: Author, createNotificationInput: CreateNotificationInput): Promise<Notification> {
    const data = await this.drizzleProvider.db.insert(NotificationSchema)
      .values({
        authorId: user.id,
        postId: createNotificationInput.postId,
        type: createNotificationInput.type,
        recipientId: createNotificationInput.recipientId,
      })
      .returning()

    return data[0] as Notification;
  }

  async findAll(user: Author): Promise<Notification[] | any[]> {
    const data = await this.drizzleProvider.db.select({
      id: NotificationSchema.id,
      type: NotificationSchema.type,
      authorId: NotificationSchema.authorId,
      recipientId: NotificationSchema.recipientId,
      postId: NotificationSchema.postId,
      commentId: NotificationSchema.commentId,
      storyId: NotificationSchema.storyId,
      reelId: NotificationSchema.reelId,
      createdAt: NotificationSchema.createdAt,
      seen: NotificationSchema.authorId,
      author: {
        username: UserSchema.username,
        profilePicture: UserSchema.profilePicture,
      },
      post: {
        id: PostSchema.id,
        fileUrl: PostSchema.fileUrl,
      }
    })
      .from(NotificationSchema)
      .where(eq(NotificationSchema.recipientId, user.id))
      .leftJoin(UserSchema, eq(NotificationSchema.authorId, UserSchema.id))
      .leftJoin(PostSchema, eq(NotificationSchema.postId, PostSchema.id))
      .orderBy(desc(NotificationSchema.createdAt))
      .offset(0)
      .limit(10)

    if (data.length <= 0 || !data) {
      return []
    }

    return data
  }

  async remove(user: Author, destroyNotificationInput: CreateNotificationInput): Promise<any> {
    await this.drizzleProvider.db.delete(NotificationSchema)
      .where(
        and(
          eq(NotificationSchema.authorId, user.id),
          eq(NotificationSchema.postId, destroyNotificationInput.postId),
          eq(NotificationSchema.type, destroyNotificationInput.type),
          eq(NotificationSchema.recipientId, destroyNotificationInput.recipientId)
        )
      )
    return true
  }
}
