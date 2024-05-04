import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OutfitsService } from 'src/outfits/outfits.service';
import { GetStoreOrdersQuery, OrderStatus } from './types/order.types';

@Injectable()
export class OrdersService {
  constructor(
    private readonly outfitService: OutfitsService,
    private readonly prismaService: PrismaService,
  ) {}

  async createOrder(order_by_id: string, createOrderDto: CreateOrderDto) {
    try {
      const { product_code, store_id, quantity = 1, ...rest } = createOrderDto;
      const product = await this.outfitService.getOutfitByCode(
        product_code,
        store_id,
      );
      if (!product) throw new NotFoundException('product not found');
      const total_price = product.price * quantity;

      await this.prismaService.order.create({
        data: {
          order_by_id: '7c523637-48cc-4802-bbc8-daf4bae06886',
          order_item_id: product.id,
          quantity,
          total_price,
          store_id,
          ...rest,
        },
      });

      return { message: 'Order created successfully', success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to create order', 500);
    }
  }

  async getStoreOrders(store_id: string, query: GetStoreOrdersQuery) {
    try {
      const { limit = 10, page = 1, status, order_number } = query;

      const orderLimit = +limit;
      const orderSkip = (+page - 1) * orderLimit;

      let where: any = { store: { id: store_id }, status };
      if (order_number) {
        where = { ...where, order_number: { equals: +order_number } };
      }

      const totalItems = await this.prismaService.order.count({ where });

      const orders = await this.prismaService.order.findMany({
        where,
        take: orderLimit,
        skip: orderSkip,
        include: { store: true, order_by: true, order_item: true },
      });

      return { result: orders, count: totalItems };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to get orders', 500);
    }
  }

  async getOrderById(order_id: string, store_id: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id: order_id, store_id },
      include: { store: true, order_by: true },
    });
    return order;
  }

  async acceptOrder(order_id: string, store_id: string) {
    try {
      const order = await this.getOrderById(order_id, store_id);
      if (!order) throw new NotFoundException('Order not found');
      if (order.status !== OrderStatus.PENDING)
        throw new NotFoundException(
          "Can't accept an order that is not pending",
        );

      await this.prismaService.order.update({
        where: { id: order_id, store_id },
        data: { status: OrderStatus.ACCEPTED },
      });

      return { message: 'Order accepted successfully', success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to confirm order', 500);
    }
  }

  async completeOrder(order_id: string, store_id: string) {
    try {
      const order = await this.getOrderById(order_id, store_id);
      if (!order) throw new NotFoundException('Order not found');
      if (order.status !== OrderStatus.ACCEPTED)
        throw new NotFoundException(
          "Can't complete an order that is not accepted",
        );

      await this.prismaService.order.update({
        where: { id: order_id, store_id },
        data: { status: OrderStatus.COMPLETED },
      });

      return { message: 'Order completed successfully', success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to complete order', 500);
    }
  }

  async cancelOrder(order_id: string, store_id: string) {
    try {
      const order = await this.getOrderById(order_id, store_id);
      if (!order) throw new NotFoundException('Order not found');

      await this.prismaService.order.update({
        where: { id: order_id, store_id },
        data: { status: OrderStatus.CANCELLED },
      });

      return { message: 'Order canceled successfully', success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to cancel order', 500);
    }
  }
}
