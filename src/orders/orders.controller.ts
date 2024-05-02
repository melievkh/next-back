import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard, RolesGuard } from 'src/auth/guards';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetStoreOrdersQuery } from './types/order.types';
import { GetMe, Roles } from 'src/auth/decorators';
import { OrdersService } from './orders.service';
import { Role } from 'src/user/types/user.types';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.STORE, Role.ADMIN)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@GetMe() order_by_id: string, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(order_by_id, createOrderDto);
  }

  @Get()
  getStoreOrders(
    @GetMe() store_id: string,
    @Query() query: GetStoreOrdersQuery,
  ) {
    return this.ordersService.getStoreOrders(store_id, query);
  }

  @Patch('/accept/:id')
  acceptOrder(@Param('id') order_id: string, @GetMe() store_id: string) {
    return this.ordersService.acceptOrder(order_id, store_id);
  }

  @Patch('/complete/:id')
  completeOrder(@Param('id') order_id: string, @GetMe() store_id: string) {
    return this.ordersService.completeOrder(order_id, store_id);
  }

  @Patch('/cancel/:id')
  cancelOrder(@Param('id') order_id: string, @GetMe() store_id: string) {
    return this.ordersService.cancelOrder(order_id, store_id);
  }
}
