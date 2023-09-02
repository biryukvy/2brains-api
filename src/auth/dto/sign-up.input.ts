import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class SignUpInput {
  @IsEmail()
  @Field(type => String)
  email: string;

  @Field(type => String)
  name: string;

  @Field(type => String)
  password: string;
}
