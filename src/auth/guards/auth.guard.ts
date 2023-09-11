import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { IRequest } from 'src/common/interfaces/request.interface';
import { ObjId } from 'src/common/types/obj-id.type';
import { SessionsService } from 'src/sessions/services/sessions.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { JwtUtilService } from '../services/jwt-util.service';
import { HashingService } from 'src/common/services/hashing.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected hashingService: HashingService,
    protected sessionsService: SessionsService,
    protected jwtUtilService: JwtUtilService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: IRequest = this.getRequestFromContext(context);
    const token: string = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const jwtPayload: JwtPayloadDto = await this.validateToken(token);
      const userId: ObjId = new Types.ObjectId(jwtPayload.sub);
      const user: UserDocument = await this.usersService.findOneById(userId);
      request.user = user;
    } catch {
      throw new UnauthorizedException();
    } 
    return true;
  }

  private getRequestFromContext(context: ExecutionContext): IRequest {
    return (context as any).args[2].req;
  }

  private extractTokenFromRequest(request: IRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async validateToken(accessToken: string): Promise<JwtPayloadDto> { 
    return this.jwtService.verifyAsync(accessToken, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }
}
