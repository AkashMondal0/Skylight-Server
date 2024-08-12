import { Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/create-notification.input';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { Author } from 'src/users/entities/author.entity';
import { Notification } from './entities/notification.entity';
import { NotificationSchema } from 'src/db/drizzle/drizzle.schema';
import { and, eq } from 'drizzle-orm';

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

  async findAll(user: Author): Promise<Notification[]> {
    const data = await this.drizzleProvider.db.select()
      .from(NotificationSchema)
      .where(eq(NotificationSchema.recipientId, user.id))
    return data as Notification[]
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
