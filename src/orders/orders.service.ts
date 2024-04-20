import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderDocument } from 'src/schemas';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetAllOrdersQuery } from './types/order.types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(user_id: string, orderValues: CreateOrderDto) {
    const orderToCreate = new this.orderModel({
      user_id,
      ...orderValues,
    });
    const createdOrder = await orderToCreate.save();

    return { result: createdOrder, status: 'success' };
  }

  async getAll(
    query: GetAllOrdersQuery,
  ): Promise<{ result: Order[]; count: number }> {
    try {
      const limit = query?.limit || 10;
      const page = query?.page || 1;
      const filter = query?.filter || {};

      const totalItems = await this.orderModel.countDocuments(filter);

      const orders = await this.orderModel
        .find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();

      if (orders.length === 0 && page !== 1) {
        throw new NotFoundException('No orders found on this page');
      }

      return { result: orders, count: totalItems };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to get orders', 500);
    }
  }
}
