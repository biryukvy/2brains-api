import { Injectable } from '@nestjs/common';
import { BinaryToTextEncoding, createHash } from 'crypto';
import { GeneratedHashDto } from './dto/generated-hash.dto';

@Injectable()
export class HashingSevice {
  generateSalt(): string {
    const confirmationCodeLength: number = 20;
    const randomNumberAsString: string = Math.random().toString();
    return btoa(randomNumberAsString).slice(0, confirmationCodeLength);
  }

  generatePasswordHash(password: string, salt?: string | undefined): GeneratedHashDto {
    salt = salt || this.generateSalt();
    const algorithm: string = 'sha256';
    const outputEncoding: BinaryToTextEncoding = 'hex';
    const generatedHash: string = createHash(algorithm)
      .update(password)
      .update(salt)
      .digest(outputEncoding);

    return {
      generatedHash,
      saltUsed: salt,
    };
  }
}