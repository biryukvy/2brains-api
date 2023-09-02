import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(type => String)
  id: string;

  @Field(type => String)
  name: string;

  @Field(type => String)
  email: string;
}
