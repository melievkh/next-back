import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateOrderDto } from './dto/create-order.dto';
import { GetAllOrdersQuery } from './types/order.types';
import { Order, OrderDocument, OrderStatus } from 'src/schemas';
import { UserService } from 'src/user/user.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly userService: UserService,
    private readonly productService: ProductsService,
  ) {}

  async createOrder(createOrderValues: CreateOrderDto) {
    try {
      const { order_by, product } = createOrderValues;
      const user = await this.userService.findUserById(order_by);
      if (!user) throw new NotFoundException('User not found');
      const foundProduct = await this.productService.findProductById(product);
      if (!foundProduct) throw new NotFoundException('Product not found');

      const createdOrder = new this.orderModel(createOrderValues);
      await createdOrder.save();

      return { message: 'order successfully created', success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Failed to create order: ${error.message}`, 500);
    }
  }

  async getAll(query: GetAllOrdersQuery) {
    try {
      const limit = +query.limit || 20;
      const page = +query.page || 1;
      const skip = (page - 1) * limit;

      const totalItems = await this.orderModel.countDocuments(query);
      const orders = await this.orderModel
        .find(query)
        .limit(limit)
        .skip(skip)
        .populate({
          path: 'order_by',
          select: 'phone_number',
        })
        .populate({
          path: 'product',
          select: 'code price',
        })
        .populate({
          path: 'deliver',
          select: 'phone_number',
        })
        .exec();

      return { result: orders, count: totalItems };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Failed to get orders: ${error.message}`, 500);
    }
  }

  async confirmOrder(order_id: string, deliver: Types.ObjectId) {
    try {
      const isDeliverExist = await this.userService.findUserById(deliver);
      if (!isDeliverExist && !deliver)
        throw new NotFoundException('Deliver not found');

      const order = await this.orderModel.findByIdAndUpdate(
        order_id,
        { deliver, status: OrderStatus.CONFIRMED },
        { new: true },
      );
      if (!order) throw new NotFoundException('Order not found');

      return { success: true, message: 'order successfully confirmed' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Failed to confirm order: ${error.message}`, 500);
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
      throw new HttpException(
        `Failed to complete order: ${error.message}`,
        500,
      );
    }
  }

  async cancelOrder(order_id: string) {
    try {
      const order = await this.orderModel.findByIdAndUpdate(
        order_id,
        { status: OrderStatus.CANCELLED },
        { new: true },
      );

      if (!order) throw new NotFoundException('Order not found');
      return { success: true, message: 'order cancelled' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Failed to cancel order: ${error.message}`, 500);
    }
  }

  async delete(order_id: string) {
    try {
      const order = await this.orderModel.findByIdAndDelete(order_id);
      if (!order) throw new NotFoundException('Order not found');

      return { success: true, message: 'order deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Failed to delete order: ${error.message}`, 500);
    }
  }
}
