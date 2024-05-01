import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { OutfitsService } from './outfits.service';
import { OutfitsController } from './outfits.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreService } from 'src/stores/store.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [OutfitsController],
  providers: [OutfitsService, JwtService, PrismaService, StoreService],
  exports: [OutfitsService],
})
export class OutfitsModule {}
