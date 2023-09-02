import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/sign-up.input';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(returns => String)
  async signUp(
    @Args() signUpInput: SignUpInput,
  ) {
    const result = await this.authService.signUp(signUpInput);
    return result.email;
  }
}
