import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GeneratedAuthTokensDto } from '../dto/generated-auth-tokens.dto';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtUtilService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async generateAuthTokens(payload: JwtPayloadDto): Promise<GeneratedAuthTokensDto> {
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

