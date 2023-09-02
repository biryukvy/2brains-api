import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { confirmationsCollectionName } from './confirmations.constants';
import { ConfirmationModel, ConfirmationSchema } from './schemas/confirmation.schema';
import { ConfirmationsService } from './services/confirmations.service';

const sharedProviders: Provider[] = [
  ConfirmationsService,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: ConfirmationModel.name, 
        schema: ConfirmationSchema,
        collection: confirmationsCollectionName,
      }
    ]),
  ],
  providers: [
    ...sharedProviders,
  ],
  exports: [
    ...sharedProviders,
  ],
})
export class ConfirmationsModule {}
