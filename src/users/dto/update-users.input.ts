import { InputType, Field} from '@nestjs/graphql';

@InputType()
export class UpdateUsersInput {
  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  profilePicture: string | null

  @Field(() => String, { nullable: true })
  bio: string | null

  @Field(() => String, { nullable: true })
  website: string[] | any[]
}
