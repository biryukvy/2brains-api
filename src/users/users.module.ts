import { Global, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './schemas/user.schema';
import { usersCollectionName } from './users.contants';
import { UsersService } from './users.service';
import { UsersResolver } from './resolvers/users.resolver';

const sharedProviders: Provider[] = [
  UsersService,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: UserModel.name, 
        schema: UserSchema,
        collection: usersCollectionName,
      }
    ]),
  ],
  providers: [
    ...sharedProviders,
    UsersResolver,
  ],
  exports: [
    ...sharedProviders,
  ],
})
export class UsersModule {}
