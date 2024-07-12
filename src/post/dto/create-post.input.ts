import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {

  @Field(() => String)
  content: string;

  @Field(() => [String], { nullable: true })
  fileUrl: string[];

  @Field(() => String)
  authorId: string;

  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String)
  status: PostStatus;
}

enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}