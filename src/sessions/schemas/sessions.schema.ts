import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Application } from 'src/common/application.enum';

export type SessionDocument = HydratedDocument<SessionModel>;

@Schema()
export class SessionModel {
  @Prop({
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
  })
  refreshTokenHash: string;

  @Prop({
    default: Application.Web,
    enum: Object.values(Application),
  })
  application: string;

  @Prop({
    default: new Date(),
  })
  expiresAt: Date;

  @Prop({
    default: new Date(),
  })
  createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(SessionModel);

SessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);