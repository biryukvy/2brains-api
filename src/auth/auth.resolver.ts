import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInSuccess } from './dto/sign-in-success.object';
import { SignInInput } from './dto/sign-in.input';
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

  @Mutation(returns => SignInSuccess)
  async signIn(
    @Args() signInInput: SignInInput,
  ): Promise<SignInSuccess> {
    return this.authService.signIn(signInInput);
  }
}
