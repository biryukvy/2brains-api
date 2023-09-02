import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class EmailConfirmationInput {
  @Field(type => String)
  confirmationToken: string;
}
