import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsStrongPassword } from 'class-validator';

@ArgsType()
export class SignInInput {
  @IsEmail()
  @Field(type => String)
  email: string;

  @IsStrongPassword()
  @Field(type => String)
  password: string;
}
