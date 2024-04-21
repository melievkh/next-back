import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateOrderDto } from './dto/create-order.dto';
import { GetAllOrdersQuery } from './types/order.types';
import { Order, OrderDocument, OrderStatus } from 'src/schemas';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly userService: UserService,
  ) {}

  async createOrder(createOrderValues: CreateOrderDto) {
    try {
      const createdOrder = new this.orderModel(createOrderValues);
      await createdOrder.save();

      return { message: 'order successfully created', success: true };
    } catch (error) {
      throw new HttpException('Failed to create order', 500);
    }
  }

  async confirmOrder(order_id: string, deliver_id: string) {
    try {
      const isDeliverExist = await this.userService.findUserById(deliver_id);
      if (!isDeliverExist && !deliver_id)
        throw new NotFoundException('Deliver not found');

      const order = await this.orderModel.findByIdAndUpdate(
        order_id,
        { deliver_id, status: OrderStatus.CONFIRMED },
        { new: true },
      );
      if (!order) throw new NotFoundException('Order not found');

      return { success: true, message: 'order successfully confirmed' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to confirm order', 500);
    }
  }

  async completeOrder(order_id: string) {
    try {
      const order = await this.orderModel.findByIdAndUpdate(
        order_id,
        { status: OrderStatus.COMPLETED },
        { new: true },
      );

      if (!order) throw new NotFoundException('Order not found');

      return { success: true, message: 'order successfully completed' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to complete order', 500);
    }
  }

  async getAll(query: GetAllOrdersQuery) {
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
