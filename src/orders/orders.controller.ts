import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { GetAllOrdersQuery } from './types/order.types';
import { OrdersService } from './orders.service';

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

  @Get()
  getAll(@Query() query: GetAllOrdersQuery) {
    return this.ordersService.getAll(query);
  }
}
