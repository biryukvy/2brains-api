import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class SignInInput {
  @IsEmail()
  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;
}
