import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthTokens {
  @Field(type => String)
  accessToken: string;

  @Field(type => String)
  refreshToken: string;
}
