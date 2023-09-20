import { Injectable } from '@nestjs/common';
import { BinaryToTextEncoding, createHash } from 'crypto';
import { GeneratedHashDto } from '../dto/generated-hash.dto';

@Injectable()
export class HashingService {
  generateHash(): string {
    const hashStringLength: number = 6;
    const input: string = Math.random().toString();
    return btoa(input).slice(0, hashStringLength);
  } 

  generatePasswordHash(password: string, salt?: string | undefined): GeneratedHashDto {
    salt = salt || this.generateHash();
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

  generateRefreshTokenHash(token: string): string {
    const algorithm: string = 'sha256';
    const outputEncoding: BinaryToTextEncoding = 'hex';
    return createHash(algorithm)
      .update(token)
      .update(process.env.JWT_REFRESH_SECRET)
      .digest(outputEncoding);
  }
}