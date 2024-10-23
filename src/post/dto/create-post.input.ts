import { InputType, Field } from '@nestjs/graphql';
import { PostStatus } from '../entities/post.entity';
@InputType()
export class _AssetUrls {
  @Field(() => String, { nullable: true })
  low?: string | null;

  @Field(() => String, { nullable: true })
  medium?: string | null;

  @Field(() => String, { nullable: true })
  high?: string | null;

  @Field(() => String, { nullable: true })
  blur?: string | null;

  @Field(() => String, { nullable: true })
  thumbnail?: string | null;
}
@InputType()
export class InputAssets {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => _AssetUrls, { nullable: true })
  urls?: _AssetUrls;

  @Field(() => String, { nullable: true })
  type?: 'photo' | 'video' | 'audio' | 'text';

  @Field(() => String, { nullable: true })
  caption?: string;
}
@InputType()
export class CreatePostInput {

  @Field(() => String)
  content: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String)
  status: PostStatus;
  //
  @Field(() => [InputAssets], { nullable: true })
  fileUrl?: InputAssets[];

  @Field(() => [String], { nullable: true })
  song?: any[];

  @Field(() => [String], { nullable: true })
  tags: any[];

  @Field(() => [String], { nullable: true })
  locations: any[];

  @Field(() => String, { nullable: true })
  country?: any;

  @Field(() => String, { nullable: true })
  city?: any;
}