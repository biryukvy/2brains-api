import { Global, Module, Provider } from '@nestjs/common';
import { HashingService } from './services/hashing.service';

const sharedProviders: Provider[] = [
  HashingService,
];

@Global()
@Module({
  providers: [
    ...sharedProviders,
  ],
  exports: [
    ...sharedProviders,
  ],
})
export class CommonModule {}
