import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsStrongPassword } from 'class-validator';

@ArgsType()
export class SignUpInput {
  @IsEmail()
  @Field(type => String)
  email: string;

  @Field(type => String)
  name: string;

  @IsStrongPassword()
  @Field(type => String)
  password: string;
}
