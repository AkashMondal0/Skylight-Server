import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { DrizzleModule } from 'src/db/drizzle/drizzle.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [DrizzleModule],
  providers: [NotificationResolver, NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule { }
