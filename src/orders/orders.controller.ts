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

import { CreateOrderDto } from './dto/create-order.dto';
import { GetAllOrdersQuery } from './types/order.types';
import { OrdersService } from './orders.service';
import { AccessTokenGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators';
import { UserRole } from 'src/auth/dto/register-admin.dto';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Patch('/confirm/:id')
  confirmOrder(
    @Param('id') order_id: string,
    @Body() body: { deliver_id: string },
  ) {
    return this.ordersService.confirmOrder(order_id, body.deliver_id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  getAll(@Query() query: GetAllOrdersQuery) {
    return this.ordersService.getAll(query);
  }
}
