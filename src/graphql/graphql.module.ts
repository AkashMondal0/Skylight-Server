import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { BooksResolver } from './resolver/books.resolver';
import { BooksService } from './service/books.service';

@Module({
  providers: [BooksResolver, BooksService],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './schema.gql',  
      playground: false, 
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
})
export class _GraphQLModule {}