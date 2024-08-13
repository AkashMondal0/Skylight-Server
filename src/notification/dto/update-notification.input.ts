import { CreateNotificationInput } from './create-notification.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNotificationInput extends PartialType(CreateNotificationInput) {
  
}