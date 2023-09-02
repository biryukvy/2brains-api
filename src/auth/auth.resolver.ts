import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NextStep } from 'src/common/dto/next-step.object';
import { AuthService } from './auth.service';
import { EmailConfirmationInput } from './dto/email-confirmation.input';
import { SignInSuccess } from './dto/sign-in-success.object';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(returns => NextStep)
  async signUp(
    @Args() signUpInput: SignUpInput,
  ): Promise<NextStep> {
    await this.authService.signUp(signUpInput);
    const hint: string = 'Check email for verification code and then use confirmEmail-mutation.';
    return {
      hint,
    };
  }

  @Mutation(returns => SignInSuccess)
  async signIn(
    @Args() signInInput: SignInInput,
  ): Promise<SignInSuccess> {
    return this.authService.signIn(signInInput);
  }

  @Mutation(returns => NextStep)
  async confirmEmail(
    @Args() { confirmationToken }: EmailConfirmationInput,
  ): Promise<NextStep> {
    await this.authService.confirmEmail(confirmationToken);
    const hint: string = 'You can now signIn now using signIn-mutation.';
    return {
      hint,
    };
  }
}
