import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification, UnReadNotification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Author } from 'src/users/entities/author.entity';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Notification, { name: 'createNotification' })
  createNotification(@SessionUserGraphQl() user: Author, @Args('createNotificationInput') createNotificationInput: CreateNotificationInput) {
    return this.notificationService.create(user, createNotificationInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Notification], { name: 'findAllNotifications' })
  findAll(@SessionUserGraphQl() user: Author) {
    return this.notificationService.findAll(user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UnReadNotification, { name: 'unseenNotifications' })
  unseenNotifications(@SessionUserGraphQl() user: Author) {
    return this.notificationService.UnseenNotifications(user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Notification, { name: 'destroyNotification' })
  removeNotification(@SessionUserGraphQl() user: Author, @Args('destroyNotificationInput') destroyNotificationInput: CreateNotificationInput) {
    return this.notificationService.remove(user, destroyNotificationInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { name: 'markAsSeenNotification' })
  markAsSeenNotification(@SessionUserGraphQl() user: Author) {
    return this.notificationService.markAsSeen(user);
  }
  
}