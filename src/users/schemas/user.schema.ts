import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema()
export class UserModel {
  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
    default: false,
  })
  isEmailConfirmed: boolean;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  passwordHash: string;

  @Prop({
    required: true,
  })
  passwordSalt: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
