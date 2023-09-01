import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';

@Resolver()
export class TestResolver {
  @Query(returns => Boolean)
  async test() {
    return true;
  }
}
