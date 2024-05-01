import { Module } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { OutfitsService } from 'src/outfits/outfits.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreService } from 'src/stores/store.service';

@Module({
  imports: [UserModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    JwtService,
    OutfitsService,
    PrismaService,
    StoreService,
  ],
})
export class OrdersModule {}
