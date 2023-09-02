import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/dto/user.object";
import { UserDocument } from "src/users/schemas/user.schema";

@ObjectType()
export class SignInSuccess {
  @Field(type => String)
  accessToken: string;

  @Field(type => String)
  refreshToken: string;

  @Field(type => User)
  user: UserDocument;
}
