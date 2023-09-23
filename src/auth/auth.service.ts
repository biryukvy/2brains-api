import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { GeneratedHashDto } from 'src/common/dto/generated-hash.dto';
import { HashingService } from 'src/common/services/hashing.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { GeneratedAuthTokensDto } from './dto/generated-auth-tokens.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { SignInSuccess } from './dto/sign-in-success.object';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { JwtUtilService } from './services/jwt-util.service';
import { ConfirmationsService } from 'src/confirmations/services/confirmations.service';
import { ConfirmationType } from 'src/confirmations/confirmation-type.enum';
import { ConfirmationDocument } from 'src/confirmations/schemas/confirmation.schema';
import { SessionsService } from 'src/sessions/services/sessions.service';
import { RenewTokensSuccess } from './dto/renew-tokens-success.object';
import { ObjId } from 'src/common/types/obj-id.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtUtilService: JwtUtilService,
    private readonly confirmationService: ConfirmationsService,
    private readonly sessionsService: SessionsService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<void> {
    const foundUser: UserDocument = await this.usersService.findOneByEmail(signUpInput.email);
    if (foundUser) {
      const errorMessage: string = 'User with email ' + signUpInput.email + ' already exists!';
      throw new ConflictException(errorMessage);
    }
    const { saltUsed, generatedHash }: GeneratedHashDto = this.hashingService.generatePasswordHash(signUpInput.password);
  
    const createdUser: UserDocument = await this.usersService.createOne({
      email: signUpInput.email,
      name: signUpInput.name,
      passwordHash: generatedHash,
      passwordSalt: saltUsed,
    });

    const confirmationCode: string = this.hashingService.generateHash();
    await this.confirmationService.createOne({
      userId: createdUser._id,
      token: confirmationCode,
      type: ConfirmationType.Email,
      value: signUpInput.email,
    })
  }

  async signIn(signInInput: SignInInput): Promise<SignInSuccess> {
    const foundUser: UserDocument = await this.usersService.findOneByEmailOrFail(signInInput.email);
    if (!foundUser.isEmailConfirmed) {
      const errorMessage: string = 'To signIn, your email ' + signInInput.email + 'must be confirmed first!';
      throw new BadRequestException(errorMessage);
    }
    
    const { generatedHash }: GeneratedHashDto = this.hashingService.generatePasswordHash(signInInput.password, foundUser.passwordSalt);
    if (foundUser.passwordHash !== generatedHash) {
      throw new BadRequestException();
    }
    const authJwtPayload: JwtPayloadDto = { sub: foundUser.id, email: foundUser.email };
    const authTokens: GeneratedAuthTokensDto = await this.jwtUtilService.generateAuthTokens(authJwtPayload);

    await this.sessionsService.upsertRefreshTokenForUser(foundUser._id, authTokens.refreshToken);

    return {
      accessToken: authTokens.accessToken,
      refreshToken: authTokens.refreshToken,
      user: foundUser,
    };
  }

  async confirmEmail(confirmationToken: string): Promise<void> {
    const confirmation: ConfirmationDocument = await this.confirmationService.findOneOrFail({
      token: confirmationToken,
    });
    await this.usersService.updateOneById(confirmation.userId, {
      isEmailConfirmed: true,
    });
    await this.confirmationService.deleteOneById(confirmation._id);
  }

  async renewTokens(user: UserDocument): Promise<RenewTokensSuccess> {
    const payload: JwtPayloadDto = { sub: user.id, email: user.email };
    const tokens: GeneratedAuthTokensDto = await this.jwtUtilService.generateAuthTokens(payload);
    const refreshTokenHash: string = this.hashingService.generateRefreshTokenHash(tokens.refreshToken);
    await this.sessionsService.upsertRefreshTokenForUser(user._id, refreshTokenHash); 
    return {
      accessToken: tokens.accessToken, 
      refreshToken: tokens.refreshToken,
    };
  }

  async logoutUser(userId: ObjId): Promise<void> {
    await this.sessionsService.deleteAllForUser(userId);
  }
}
