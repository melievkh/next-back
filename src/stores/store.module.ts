import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';

@Module({
  imports: [],
  controllers: [StoreController],
  providers: [StoreService, PrismaService],
})
export class StoreModule {}
