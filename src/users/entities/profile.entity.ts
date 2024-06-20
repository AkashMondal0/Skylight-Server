import { ObjectType, Field, ID} from '@nestjs/graphql';
import { Post } from 'src/post/entities/post.entity';
import { AuthorData, FriendshipType, PostResponse } from 'src/types/response.type';
import { Author } from './author.entity';
import { ProfileFriendship } from './friendship.entity';


@ObjectType()
export class ProfileView {
    @Field(() => ID)
    id: string;
  
    @Field(() => String, { nullable: true })
    username: string;
  
    @Field(() => String, { nullable: true })
    email: string;
  
    @Field(() => String, { nullable: true })
    name: string;
  
    @Field(() => String, { nullable: true })
    profilePicture: string;
  
    // @Field(() => [Post], { nullable: true })
    // posts?: PostResponse[];
  
    // @Field(() => [Author], { nullable: true })
    // followers?: AuthorData[];
  
    // @Field(() => [Author], { nullable: true })
    // following?: AuthorData[];
  
    @Field(() => Number, { nullable: true })
    postCount: number;
  
    @Field(() => Number, { nullable: true })
    followerCount: number;
  
    @Field(() => Number, { nullable: true })
    followingCount: number;
  
    @Field(() => ProfileFriendship, { nullable: true })
    friendship: FriendshipType;

    @Field(() => [Author], { nullable: true })
    top_followers?: AuthorData[];
  }