import { ObjectType, Field, ID} from '@nestjs/graphql';
import { Post } from 'src/post/entities/post.entity';
import { AuthorData, PostResponse } from 'src/types/response.type';

@ObjectType()
export class Author {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  profilePicture?: string;

  @Field(() => Boolean, { nullable: true })
  followed_by?: boolean;

  @Field(() => Boolean, { nullable: true })
  following?: boolean;
}


