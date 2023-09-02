import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GeneratedTokensDto } from '../dto/generated-tokens.dto';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtUtilService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async generateTokens(payload: JwtPayloadDto): Promise<GeneratedTokensDto> {
    const accessToken: string = await this.generateAccessToken(payload);
    const refreshToken: string = await this.generateRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(payload: JwtPayloadDto): Promise<string> {
    return this.jwtService.signAsync(
      payload,
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      },
    );
  }

  async generateRefreshToken(payload: JwtPayloadDto): Promise<string> {
    return this.jwtService.signAsync(
      payload,
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      },
    );
  }
}

