import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from 'src/auth/decorators';
import { GetAllOrdersQuery } from './types/order.types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @GetUser('sub') user_id: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user_id, createOrderDto);
  }

  @Get()
  async getAll(@Query() query: GetAllOrdersQuery) {
    return this.ordersService.getAll(query);
  }
}
