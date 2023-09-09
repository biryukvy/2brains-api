import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModel, SessionSchema } from './schemas/sessions.schema';
import { SessionsService } from './services/sessions.service';
import { sessionsCollectionName } from './sessions.constants';

const sharedProviders: Provider[] = [
  SessionsService,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: SessionModel.name, 
        schema: SessionSchema,
        collection: sessionsCollectionName,
      }
    ]),
  ],
  providers: [
    ...sharedProviders,
  ],
  exports: [
    ...sharedProviders,
  ]
})
export class SessionsModule {}
