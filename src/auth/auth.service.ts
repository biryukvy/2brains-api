import { ConflictException, Injectable } from '@nestjs/common';
import { GeneratedHashDto } from 'src/common/dto/generated-hash.dto';
import { HashingSevice } from 'src/common/hashing.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { SignUpInput } from './dto/sign-up.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingSevice,
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
}
