import { Global, Module, Provider } from '@nestjs/common';
import { HashingSevice } from './hashing.service';

const sharedProviders: Provider[] = [
  HashingSevice,
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
