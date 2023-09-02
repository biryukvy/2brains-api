import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { GeneratedHashDto } from 'src/common/dto/generated-hash.dto';
import { HashingSevice } from 'src/common/hashing.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { GeneratedTokensDto } from './dto/generated-tokens.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { SignInSuccess } from './dto/sign-in-success.object';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { JwtUtilService } from './services/jwt-util.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingSevice,
    private readonly jwtUtilService: JwtUtilService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<UserDocument> {
    const foundUser: UserDocument = await this.usersService.findOneByEmail(signUpInput.email);
    if (foundUser) {
      const errorMessage: string = 'User with email ' + signUpInput.email + ' already exists!';
      throw new ConflictException(errorMessage);
    }
    const { saltUsed, generatedHash }: GeneratedHashDto = this.hashingService.generatePasswordHash(signUpInput.password);
    return this.usersService.createOne({
      email: signUpInput.email,
      name: signUpInput.name,
      passwordHash: generatedHash,
      passwordSalt: saltUsed,
    });
  }

  async signIn(signInInput: SignInInput): Promise<SignInSuccess> {
    const foundUser: UserDocument = await this.usersService.findOneByEmailOrFail(signInInput.email);
    const { generatedHash }: GeneratedHashDto = this.hashingService.generatePasswordHash(signInInput.password, foundUser.passwordSalt);
    if (foundUser.passwordHash !== generatedHash) {
      throw new BadRequestException();
    }
    const jwtPayload: JwtPayloadDto = { sub: foundUser.id, email: foundUser.email };
    const generatedTokens: GeneratedTokensDto = await this.jwtUtilService.generateTokens(jwtPayload);
    return {
      accessToken: generatedTokens.accessToken,
      refreshToken: generatedTokens.refreshToken,
      user: foundUser,
    };
  }
}
