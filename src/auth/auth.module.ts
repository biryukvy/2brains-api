import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfirmationsModule } from 'src/confirmations/confirmations.module';
import { SessionsModule } from 'src/sessions/sessions.module';
import { UsersModule } from 'src/users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtUtilService } from './services/jwt-util.service';

@Module({
  imports: [
    UsersModule,
    JwtModule,
    ConfirmationsModule,
    SessionsModule,
  ],
  providers: [
    AuthResolver, 
    AuthService,
    JwtUtilService,
  ]
})
export class AuthModule {}
