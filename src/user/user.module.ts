import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';
import { StoreService } from 'src/stores/store.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [],
  providers: [UserService, PrismaService, JwtService, StoreService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
