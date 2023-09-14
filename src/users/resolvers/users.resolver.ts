import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Context } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from '../dto/user.object';
import { IRequest } from 'src/common/interfaces/request.interface';
import { UserDocument } from '../schemas/user.schema';

@Resolver()
export class UsersResolver {
  @UseGuards(AuthGuard)
  @Query(returns => User)
  async getCurrentUser(
    @Context('req') req: IRequest,
  ): Promise<UserDocument> {
    return req.user;
  }
}
