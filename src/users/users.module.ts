import { Global, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './schemas/user.schema';
import { usersCollectionName } from './users.contants';
import { UsersService } from './users.service';

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
  ],
  exports: [
    ...sharedProviders,
  ],
})
export class UsersModule {}
