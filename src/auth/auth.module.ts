import { StoreModule } from './../stores/store.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreService } from 'src/stores/store.service';

@Module({
  imports: [StoreModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, AccessTokenStrategy, StoreService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
