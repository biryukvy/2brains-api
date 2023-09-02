import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ConfirmationType } from '../confirmation-type.enum';
import { confirmationDocumentLifeMs } from '../confirmations.constants';

export type ConfirmationDocument = HydratedDocument<ConfirmationModel>;

@Schema()
export class ConfirmationModel {
  @Prop({
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
  })
  token: string;

  @Prop({
    required: true,
    enum: Object.values(ConfirmationType),
  })
  type: string;

  @Prop({
    required: true,
  })
  value: string;

  @Prop({
    default: new Date(),
  })
  createdAt: Date;
}

export const ConfirmationSchema = SchemaFactory.createForClass(ConfirmationModel);

ConfirmationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: confirmationDocumentLifeMs },
);