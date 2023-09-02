import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TestResolver } from './test.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { ConfirmationsModule } from './confirmations/confirmations.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false, // turn off built-in playground in favour of Apollo's playground
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    MongooseModule.forRoot(process.env.DB_CONNECT_URL, {
      dbName: process.env.DB_NAME
    }),
    AuthModule,
    CommonModule,
    UsersModule,
    ConfirmationsModule,
  ],
  controllers: [],
  providers: [
    TestResolver,
  ],
})
export class AppModule {}
