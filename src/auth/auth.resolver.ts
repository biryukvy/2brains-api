import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { NextStep } from 'src/common/dto/next-step.object';
import { AuthService } from './auth.service';
import { EmailConfirmationInput } from './dto/email-confirmation.input';
import { SignInSuccess } from './dto/sign-in-success.object';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { RenewTokensGuard } from './guards/renew-tokens.guard';
import { UseGuards } from '@nestjs/common';
import { RenewTokensSuccess } from './dto/renew-tokens-success.object';
import { IRequest } from 'src/common/interfaces/request.interface';

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

  @UseGuards(RenewTokensGuard)
  @Mutation(returns => RenewTokensSuccess)
  async renewTokens(
    @Context('req') req: IRequest,
  ): Promise<RenewTokensSuccess> {
    return this.authService.renewTokens(req.user);
  }
}
