import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OutfitsService } from 'src/outfits/outfits.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly outfitService: OutfitsService,
    private readonly prismaService: PrismaService,
  ) {}

  async createOrder(order_by_id: string, createOrderDto: CreateOrderDto) {
    try {
      const { product_code, store_id, ...rest } = createOrderDto;
      const product = await this.outfitService.getOutfitByCode(
        product_code,
        store_id,
      );
      console.log(product);
      if (!product) throw new NotFoundException('product not found');

      await this.prismaService.order.create({
        data: {
          order_by_id,
          order_item_id: product.id,
          store_id,
          ...rest,
        },
      });

      return { message: 'Order created successfully', success: true };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to create order', 500);
    }
  }
}
