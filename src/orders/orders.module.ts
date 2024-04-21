import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Order, OrderSchema } from 'src/schemas';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    UserModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtService],
})
export class OrdersModule {}
