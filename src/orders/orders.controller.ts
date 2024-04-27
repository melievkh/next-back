import { Types } from 'mongoose';
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
import { Roles } from 'src/auth/decorators';
import { OrdersService } from './orders.service';
import { UserRole } from 'src/schemas';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch('/confirm/:id')
  confirmOrder(
    @Param('id') order_id: string,
    @Body() body: { deliver: Types.ObjectId },
  ) {
    return this.ordersService.confirmOrder(order_id, body.deliver);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch('/complete/:id')
  completeOrder(@Param('id') order_id: string) {
    return this.ordersService.completeOrder(order_id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  getAll(@Query() query: GetAllOrdersQuery) {
    return this.ordersService.getAll(query);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch('/cancel/:id')
  cancelOrder(@Param('id') order_id: string) {
    return this.ordersService.cancelOrder(order_id);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}
