import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DrizzleModule } from './db/drizzle/drizzle.module';
import configuration from './configs/configuration';
import { RedisModule } from './db/redisio/redis.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ExploreModule } from './explore/explore.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { FriendshipModule } from './friendship/friendship.module';

@Module({
  imports: [
    DrizzleModule,
    RedisModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    AuthModule,
    UsersModule,
    PostModule,
    CommentModule,
    LikeModule,
    ExploreModule,
    ConversationModule,
    MessageModule,
    FriendshipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }