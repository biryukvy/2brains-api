import { ForbiddenException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ObjId } from 'src/common/types/obj-id.type';
import { SessionDocument } from 'src/sessions/schemas/sessions.schema';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { AuthGuard } from './auth.guard';

@Injectable()
export class RenewTokensGuard extends AuthGuard { 
  async validateToken(refreshToken: string): Promise<JwtPayloadDto> {
    const jwtPayload: JwtPayloadDto = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const userIdAsObject: ObjId = new Types.ObjectId(jwtPayload.sub);
    const foundSession: SessionDocument = await this.sessionsService.findOneByUserId(userIdAsObject);
    const tokenHash: string = await this.jwtUtilService.generateRefreshToken(jwtPayload);
    if (tokenHash !== foundSession?.refreshTokenHash) {
      const errorMessage: string = 'Refresh token has been invalidated!';
      throw new ForbiddenException(errorMessage);
    }
    return jwtPayload;
  }
}