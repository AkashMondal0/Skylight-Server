import { InputType, Field } from '@nestjs/graphql';
import { InputAssets } from 'src/post/dto/create-post.input';
import { PostStatus } from 'src/post/entities/post.entity';

@InputType()
export class CreateStoryInput{

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => String)
  authorId?: string;

  @Field(() => String, { nullable: true })
  status?: PostStatus;
  //
  @Field(() => [InputAssets], { nullable: true })
  fileUrl?: InputAssets[];

  @Field(() => [String], { nullable: true })
  song?: any[];

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  id?: string;
}

@InputType()
export class createHighlightInput {

  @Field(() => String)
  content: string;

  @Field(() => String)
  authorId?: string;

  @Field(() => String, { nullable: true })
  status: PostStatus;

  @Field(() => [CreateStoryInput], { nullable: true })
  stories?: CreateStoryInput[];

  @Field(() => Number, { nullable: true })
  coverImageIndex?: number;
}