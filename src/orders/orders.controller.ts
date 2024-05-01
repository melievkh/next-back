import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard, RolesGuard } from 'src/auth/guards';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetAllOrdersQuery } from './types/order.types';
import { GetMe, Roles } from 'src/auth/decorators';
import { OrdersService } from './orders.service';
import { Role } from 'src/user/types/user.types';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.STORE)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@GetMe() order_by_id: string, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(order_by_id, createOrderDto);
  }

  @Get()
  getAll(@Query() query: GetAllOrdersQuery) {}

  @Patch('/confirm/:id')
  confirmOrder(@Param('id') order_id: string, @GetMe() store_id: string) {}

  @Patch('/complete/:id')
  completeOrder(@Param('id') order_id: string) {}

  @Patch('/cancel/:id')
  cancelOrder(@Param('id') order_id: string) {}

  @Delete('/:id')
  delete(@Param('id') id: string) {}
}
