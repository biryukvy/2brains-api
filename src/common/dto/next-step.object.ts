import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class NextStep {
  @Field(type => String)
  hint: string;
}
